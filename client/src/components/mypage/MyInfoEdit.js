import styles from "../../styles/mypage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mypageEdit } from "../../api/mypage";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/LoginUserContext.js";
import REGEX from "../../lib/regex.js";

function MyInfoEdit({ password }) {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            "이름은 2글자 이상, 특수문자는 제외해야 합니다." : 
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
  console.log("formData :", formData)

  // 확인 버튼 누를 시 수정
  async function handleSubmit() {

    let editPass = Object.entries(formState).filter(([key, value]) => !value).map(([key]) => key);

    if (editPass.length > 0) {
      console.log("다음 항목에서 통과하지 못했습니다:", editPass);
      return;
    }

    const res = await mypageEdit(formData);
    navigate(`/mypage/buyList`);

    if (res) {
      alert("수정되었습니다");
    }
  }

  // input 렌더링
  function renderInput(value) {
    // value는 formData에 들어있는 객체의 property(Object.keys(formData)로 배열화된 element)
    // 기타 input 요소 처리

    const defaultValue = formData[value]
    return (
      <>
        <div className={styles.value}>
          {
            value === "username" ? "이름"
              : value === "nickname" ? "닉네임"
              : value === "password" ? "비밀번호"
              : "전화번호"
          }
        </div>
        <input
          name={value}
          defaultValue={defaultValue}
          className={styles.input_form}
          type={
            value === "phone_number" ? "tel" : "text"
          }
          onChange={handleInputChange}
        />
      </>
    );
  }

  return (
    <div className={`inner ${styles.content} ${styles.editPage}`}>
      <form
        className={styles.form_box}
        onSubmit={(e) => { e.preventDefault(); }}
      >
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
        <div className={styles.input_box}>
          <div className={styles.value}>email</div>
          <input defaultValue={user.email} readOnly/>
        </div>
        <div className={styles.btnWrap}>
          <Button className={styles.edit} variant="primary" type="submit" onClick={handleSubmit}>수정</Button>
          <Button className={styles.cancel} variant="secondary" type="button" onClick={() => {navigate(`/mypage/buyList`);}}>취소</Button>
        </div>
      </form>
    </div>
  );
}

export default MyInfoEdit;