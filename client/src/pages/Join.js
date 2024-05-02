import styles from '../styles/join.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useHistory } from 'react-router-dom';
import { email_check, join } from '../api/join.js';
import { Button, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/LoginUserContext.js';
import { Camera, XCircleFill } from 'react-bootstrap-icons';
import REGEX from '../lib/regex.js';

function Join() {

    const { user } = useAuth(); // 현재 로그인한 사용자

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
    });

    const defaultError = {
        email : '이메일을 입력해주세요',
        password : '비밀번호를 입력해주세요',
        username : '사용자 이름을 입력해주세요',
        nickname : '닉네임을 입력해주세요',
        phone_number : '전화번호를 입력해주세요',
    }

    const [errorMessage, setErrorMessage] = useState({ // 오류 메시지
        email : defaultError.email,
        password : defaultError.password,
        username : defaultError.username,
        nickname : defaultError.nickname,
        phone_number : defaultError.phone_number,
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
    });

    // 입력 input 필드 제어 및 에러 처리
    function handleInputChange(e) { 
        const { name, value } = e.target;
        setFormData((formData)=>({...formData, [name]: value}));

        if (name == 'email') {
            setFormState((formState)=>({
                ...formState, 
                [name]: { ...formState[name],
                    regexCheck : (value && REGEX.EMAIL_REG.test(value)),
                    dupleCheck : false
                }
            }));

            setErrorMessage((errorMessage)=>({
                ...errorMessage, 
                [name] : (!value) ? defaultError[name]
                : (!REGEX.EMAIL_REG.test(value)) ?
                '이메일 형식이 유효하지 않습니다'
                : '이메일 중복 검사를 진행해주세요'
            }));
        }

        if (name == 'password') {
            setFormState((formState)=>({
                ...formState, 
                [name]: (value && REGEX.PASSWORD_REG.test(value)) ? 
                    true : false
            }));

            setErrorMessage((errorMessage)=>({
                ...errorMessage, 
                [name] : (value && REGEX.PASSWORD_REG.test(value)) ? '' :
                (value && !REGEX.PASSWORD_REG.test(value)) ? 
                '영문 소문자, 대문자, 특수문자, 숫자를 1개 이상 포함한 8~13글자로 입력해주세요' 
                : defaultError[name]
            }));
        }

        if (name == 'username' || name == 'nickname') {
            setFormState((formState)=>({
                ...formState, 
                [name]: (value && REGEX.NAME_REG.test(value)) ? 
                    true : false
            }));

            setErrorMessage((errorMessage)=>({
                ...errorMessage, 
                [name] : (value && REGEX.NAME_REG.test(value)) ? '' :
                (value && !REGEX.NAME_REG.test(value)) ? 
                '이름은 2글자 이상, 특수문자는 제외해야 합니다.' 
                : defaultError[name]
            }));
        }

        if (name == 'phone_number') {
            setFormState((formState)=>({
                ...formState, 
                [name]: (value && REGEX.PHONE_REG.test(value)) ? 
                    true : false
            }));

            setErrorMessage((errorMessage)=>({
                ...errorMessage, 
                [name] : (value && REGEX.PHONE_REG.test(value)) ? '' :
                (value && !REGEX.PHONE_REG.test(value)) ? 
                '휴대전화 번호 형식이 올바르지 않습니다.' 
                : defaultError[name]
            }));
        }
    }

    // 이메일 중복 체크
    async function handleDuplication() {
        // 입력값이 없거나 유효성 검사 통과 못하면 차단
        if (!formData.email || !REGEX.EMAIL_REG.test(formData.email)) {
            return;
        }

        // 이메일 중복 체크
        const res = await email_check(formData.email);

        if (res == 1) {
            setErrorMessage((errorMessage)=>({...errorMessage, email : '이미 등록된 이메일입니다.'}));
            return;
        } else {
            setErrorMessage((errorMessage)=>({...errorMessage, email : '사용 가능한 이메일입니다.'}));
            setFormState((formState)=>({...formState, email : { ...formState['email'], dupleCheck : true } }));
            return;
        }
    }

    // 확인 버튼 누를 시 회원가입 진행
    async function check() {
        // 각 항목 통과 여부가 모두 true일 때만 가능하도록 설정
        let joinPass = Object.values(formState).every(state=>state) 
        && Object.values(formState.email).every(state=>state);

        if (!joinPass) { // 유효성 검사 통과 못하면 차단
            return;
        }

        if (joinPass) {
            // 회원가입
            const res = await join(formData);

            if (res) {
                alert('입력하신 이메일로 전송된 메일을 확인해주세요!');
                navigate("/login");
            }
        }
    }

    // input 렌더링
    function renderInput(value) { 
        // value는 formData에 들어있는 객체의 property(Object.keys(formData)로 배열화된 element)
        // 기타 input 요소 처리
        return( 
            <>
                <input name={value} 
                placeholder={value} 
                className={styles.input_form}
                type={value === 'password' ? 'password' 
                    : value === 'phone_number' ? 'tel' : 'text'} 
                onChange={handleInputChange}
                autoFocus={value === "email"}
                />
                {
                    value === "email" &&
                    <Button className={styles.duple_btn} onClick={handleDuplication}>중복체크</Button>
                }
            </>
        )
    }

    return (
        <Container className={styles.container_box}>
        <div className="inner text-center">
            <h2 className={styles.title}>회원가입</h2>
            <form className={styles.form_box} onSubmit={(e)=>{e.preventDefault()}}>
                {
                    Object.keys(formData).map((el, i) => {
                        return (
                            <div key={i} className={styles.input_box}>
                                {
                                    renderInput(el)
                                }
                                <div className={`${styles.error_box} 
                                ${el === 'email' && formState.email.dupleCheck ? styles.duple_ok : ''}
                                `}>
                                    {errorMessage[el]}
                                </div>
                            </div>
                            
                        )
                    })
                }
                <div>
                    <Button className={`${styles.confirm_btn}`} variant='primary' type="submit" onClick={()=>{check()}}>확인</Button>
                    <Button className={styles.back_btn} variant='secondary' type="button" onClick={()=>{navigate(-1)}}>취소</Button>
                </div>
            </form>
        </div>
        </Container>
    )
}

export default Join;