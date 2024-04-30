import styles from '../styles/join.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { email_check, join } from '../api/join.js';
import { Button, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/LoginUserContext.js';
import { Camera, XCircleFill } from 'react-bootstrap-icons';

function Join() {

    const { user } = useAuth();

    const navigate = useNavigate();

    useEffect(()=>{ // 로그인 한 유저가 접근 시도 시 메인으로 보냄
        if (user) {
            navigate("/");
        }
    }, [user]);

    const [formData, setFormData] = useState({ // 회원 가입 시 전송할 데이터
        email: '' , 
        password: '',
        username: '',
        nickname: '',
        phone_number: '',
        profile_image: '',
        verification: 0
    });

    const [errorMessage, setErrorMessage] = useState({ // 오류 메시지
        email : '이메일을 입력해주세요',
        password : '비밀번호를 입력해주세요',
        username : '사용자 이름을 입력해주세요',
        nickname : '닉네임을 입력해주세요',
        phone_number : '전화번호를 입력해주세요',
        profile_image : '',
    });

    const [formState, setFormState] = useState({ // 각 항목 통과 여부
        email : {
            dupleCheck : false, // 이메일 중복 체크
            regexCheck : false // 정규 표현식
        }, // 나머지는 정규 표현식 적용
        password : false,
        username : false,
        nickname : false,
        phone_number : false,
        profile_image : false
    });

    // 파일의 실제 정보 담는 useState
    const [uploadImg, setUploadImg] = useState("")

    // 이미지 미리보기 URL 담는 useState
    const [uploadImgUrl, setUploadImgUrl] = useState("");

    // 이미지 미리보기 함수
    function onchangeImageUpload(event) {
        const newImage = event.target.files[0];
        const fileType = event.target.files[0]?.type;
        
        if (fileType.includes('image')) {
            // 미리보기 이미지 url
            setUploadImgUrl(URL.createObjectURL(newImage));
            // 이미지 파일
            setUploadImg(newImage);
            setFormState((formState)=>({...formState, profile_image : true}));
        } else {
            alert("이미지 파일만 업로드할 수 있습니다!");
            setFormState((formState)=>({...formState, profile_image : false}));
            return;
        }
        
    }

    // X 버튼 클릭 시 이미지 파일 삭제
    function handleDeleteImage () {
        setUploadImgUrl('');
        setUploadImg('');
    }

    // 에러박스 처리용 input change handler
    function handleInputChange(e) { 
        const { name, value } = e.target;
        setFormData((formData)=>({...formData, [name]: value}));
        // 빈 값일 때 메시지 갱신 잘 안됨
        setErrorMessage((errorMessage)=>({...errorMessage, [name] : value ? '' : errorMessage[name]}));

        if (name == 'email') {
            setFormState((formState)=>({...formState, email : {dupleCheck : false} }));
        }
    }

    // 에러박스 처리용 input blur handler
    function handleInputBlur(e) { 
        const { name, value } = e.target;
        setFormData((formData)=>({...formData, [name]: value}));
        // 빈 값일 때 메시지 갱신 잘 안됨
        setErrorMessage((errorMessage)=>({...errorMessage, [name] : value ? '' : errorMessage[name]}));
    }

    async function check() {
        // 각 항목 통과 여부가 모두 true일 때만 가능하도록 설정
        let joinPass = Object.values(formState).every(state=>state);

        if (!formState.email.dupleCheck) { // 이메일 중복 체크가 안되었다면 회원 가입 차단
            setErrorMessage((errorMessage)=>({...errorMessage, email : '이메일 중복체크가 필요합니다.'}));
            return;
        }

        if (joinPass) {
            // 회원가입
            const res = await join(formData);
            //const fileRes = await fileupload(formData) // 파일 업로드

            if (res) {
                alert('입력하신 이메일로 전송된 메일을 확인해주세요!');
                navigate("/login");
            }
        }
    }

    // 이메일 중복 체크
    async function handleDuplication() {
        if (!formData.email) { // form이 비어있으면 중복 체크 차단
            setErrorMessage((errorMessage)=>({...errorMessage, email : '이메일을 입력해주세요'}));
            return;
        }

        // 이메일 중복 체크
        const res = await email_check(formData.email);

        if (res == 1) {
            setErrorMessage((errorMessage)=>({...errorMessage, email : '이미 등록된 이메일입니다.'}));
            return;
        } else {
            setErrorMessage((errorMessage)=>({...errorMessage, email : '사용 가능한 이메일입니다.'}));
            setFormState((formState)=>({...formState, email : { dupleCheck : true } }));
        }
    }

    function renderInput(value) { // input 렌더링
        // value는 formData에 들어있는 객체의 property(Object.keys(formData)로 배열화된 element)
        if (value === 'verification') { // 인증은 input 없음
            return null;
        } else if (value === 'profile_image') { // 이미지파일 input
            return(
            <>
                <div className={styles.imageUploadBtn}>
                    <Camera className={styles.previewDefaultImg}/>
                    <label htmlFor="file" className={styles.fileBtn}/>
                    <input type="file" name='postImg' id='file' accept="image/*" onChange={onchangeImageUpload}/>
                </div>
                { // uploadImgUrl이 존재할 때 요소 생성
                uploadImgUrl &&
                <div className={styles.previewImgBox}>
                    <img className={styles.previewImg} alt='preview' src={uploadImgUrl}/>
                    <button className={styles.previewImgDelBtn} type='button' onClick={handleDeleteImage}><XCircleFill/></button>
                </div>
                }
            </>
            )
        }

        // 기타 input 요소 처리
        return( 
            <>
                <input name={value} 
                placeholder={value === 'profile_image' ? null : value} 
                className={styles.input_form}
                type={value === 'password' ? 'password' 
                    : value === 'phone_number' ? 'tel' 
                    : value === 'profile_image' ? 'file' : 'text'} 
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                autoFocus={value === "email"}
                />
                {
                    value === "email" &&
                    <Button className={styles.duple_btn} onClick={handleDuplication}>중복체크</Button>
                }
            </>
        )
    }

    const inputBoxStyle = (value) => {
        return value === "profile_image"
        ? `${styles.imgBox} ${styles.row} row p-0 g-3 gy-3`
        : styles.input_box;
    }

    return (
        <Container className={styles.container_box}>
        <div className="inner text-center">
            <h2 className={styles.title}>회원가입</h2>
            <form className={styles.form_box} onSubmit={(e)=>{e.preventDefault()}}>
                {
                    Object.keys(formData).map((el, i) => {
                        return (
                            <div key={i} className={inputBoxStyle(el)}>
                                {
                                    renderInput(el)
                                }
                                <div className={styles.error_box}>{errorMessage[el]}</div>
                            </div>
                            
                        )
                    })
                }
                <div>
                    <Button className={`${styles.confirm_btn}`} variant='primary' type="submit" onClick={()=>{check()}}>확인</Button>
                    <Button className={styles.back_btn} variant='secondary' type="button" onClick={()=>{navigate("/")}}>취소</Button>
                </div>
            </form>
        </div>
        </Container>
    )
}

export default Join;