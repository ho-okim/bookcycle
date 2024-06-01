import styles from "../../styles/mypage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mypageEdit, profileupload } from "../../api/mypage";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/LoginUserContext.js";
import REGEX from "../../lib/regex.js";
import { Person } from "react-bootstrap-icons";

function MyInfoEdit({ password }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 실제로 전송할 파일 변수
  const [profileImg, setProfileImg] = useState(null)
  // 파일의 URL 정보 담는 useState
  const [profile, setProfile] = useState(null)

  const [formData, setFormData] = useState({
    username: user.username,
    nickname: user.nickname,
    password: password,
    phone_number: user.phone_number,
  });

  const [errorMessage, setErrorMessage] = useState({
    // 오류 메시지
    email: "",
    password: "",
    username: "",
    nickname: "",
    phone_number: "",
  });

  const [formState, setFormState] = useState({
    // 각 항목 통과 여부
    username: true,
    nickname: true,
    password: true,
    phone_number: true,
  });

  // 이미지 미리보기 함수
  const onchangeImageUpload = (event) => {
    let img = event.target.files[0]
    if(img){
      setProfileImg(img)
      setProfile(URL.createObjectURL(img))
    }
  };

  // 입력 input 필드 제어 및 에러 처리
  function handleInputChange(e) {
    const { name, value } = e.target;
    
    // 입력값이 비어있는 경우 기존 사용자의 데이터로
    const updatedValue = value || (name === 'password' ? password : user[name]);
    
    setFormData((formData) => ({ ...formData, [name]: updatedValue }));

    if (name == "username" || name == "nickname") {
      setFormState((formState) => ({
        ...formState,
        [name] : updatedValue && REGEX.NAME_REG.test(updatedValue) ? 
        true : false
      }));

      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        [name] : updatedValue && REGEX.NAME_REG.test(updatedValue) ? "" : 
          updatedValue && !REGEX.NAME_REG.test(updatedValue) ? 
            "이름은 2글자~13글자, 특수문자는 제외해야 합니다." : 
            setErrorMessage[name],
      }));
    }

    if (name == "password") {
      setFormState((formState) => ({
        ...formState,
        [name] : updatedValue && REGEX.PASSWORD_REG.test(updatedValue) ? 
        true : false
      }));

      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        [name] : updatedValue && REGEX.PASSWORD_REG.test(updatedValue) ? "" : 
          updatedValue && !REGEX.PASSWORD_REG.test(updatedValue) ? 
          "영문 소문자, 대문자, 특수문자, 숫자를 1개 이상 포함한 8~13글자로 입력해주세요" : 
          setErrorMessage[name],
      }));
    }

    if (name == "phone_number") {
      setFormState((formState) => ({
        ...formState,
        [name] : updatedValue && REGEX.PHONE_REG.test(updatedValue) ? 
        true : false
      }));

      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        [name] : updatedValue && REGEX.PHONE_REG.test(updatedValue) ? "" : 
          updatedValue && !REGEX.PHONE_REG.test(updatedValue) ? 
          "휴대전화 번호 형식이 올바르지 않습니다." : 
          setErrorMessage[name],
      }));
    }
  }

  // 취소 버튼 클릭
  async function handleCancel() {
    navigate('/mypage/buyList');
    navigate(0);
  }

  // 확인 버튼 클릭 시 수정
  async function handleSubmit() {

    let editPass = Object.entries(formState).filter(([key, value]) => !value).map(([key]) => key);

    if(profileImg) {
      const fileFormData = new FormData()
      fileFormData.append('files', profileImg)
      if(user.profile_image){
        fileFormData.append('delProfile', user.profile_image)
      }
      const fileRes = await profileupload(fileFormData)
      if(fileRes !== "OK") {
        console.error("프로필 이미지 업로드 실패")
        return;
      }
    }

    if (editPass.length > 0) {
      console.log("다음 항목에서 통과하지 못했습니다:", editPass);
      return;
    }

    const res = await mypageEdit(formData);
    navigate(`/mypage/buyList`);

    if (res) {
      alert("수정되었습니다");
      navigate(0);
    }
  }

  // input 렌더링
  function renderInput(value) {
    // value는 formData에 들어있는 객체의 property(Object.keys(formData)로 배열화된 element)
    // 기타 input 요소 처리

    const defaultValue = formData[value]
    return (
      <>
        <div className={`${styles.value} d-flex align-items-center`}>
          <p>
            {
              value === "username" ? "이름"
                : value === "nickname" ? "닉네임"
                : value === "password" ? "비밀번호"
                : "전화번호"
            }
          </p>
        </div>
        <input
          name={value}
          defaultValue={defaultValue}
          placeholder={defaultValue}
          className={styles.input_form}
          type={
            value === "phone_number" ? "tel" : "text"
          }
          maxLength={13}
          onChange={handleInputChange}
        />
      </>
    );
  }

  return (
    <div className={`inner ${styles.content} ${styles.editPage}`}>
      <form className={`${styles.form_box}`} onSubmit={(e) => {e.preventDefault();}}>
        <div className={`${styles.infoWrap} d-flex`}>
          <div className={`d-flex flex-column justify-content-center align-items-center`}>
            <div className={`${styles.imageUploadBtn}`}>
              {/* 이미지 업로드 버튼 */}
              <label htmlFor="file" className={`${styles.fileBtn}`}>
                <div className={`${styles.profileImgWrap} d-flex justify-content-center align-items-center`}>
                  {
                    profile ?
                    <img className={`${styles.profileImg}`} alt='preview' src={profile}/>
                    : user.profile_image ?
                      <img src={process.env.PUBLIC_URL + `/img/profile/${user.profile_image}`} className={`${styles.profileImg}`}/> : 
                      <Person className={`${styles.profileIcon}`}/>
                  }
                </div>
              </label>
              <input type="file" multiple name='profileImg' id='file' accept="image/*" onChange={onchangeImageUpload}/>
            </div>
          </div>
          <div className={`medium ${styles.inputWrap}`}>
            <div className={styles.input_box}>
              <div className={styles.value}>email</div>
              <p className={styles.email}>{user.email}</p>
            </div>
            {Object.keys(formData).map((el, i) => {
              return (
                <div key={i} >
                  <div className={styles.input_box}>
                    { renderInput(el) }
                  </div>
                  <div className={styles.error_box}>
                    {errorMessage[el]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
          <div className={styles.btnWrap}>
            <Button className={styles.edit} variant="primary" type="submit" onClick={handleSubmit}>수정</Button>
            <Button className={styles.cancel} variant="outline-secondary" type="button" onClick={handleCancel}>취소</Button>
          </div>
      </form>
    </div>
  );
}

export default MyInfoEdit;