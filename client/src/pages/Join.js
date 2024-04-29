import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { email_check, join } from '../api/join.js';
import { Button, Container } from 'react-bootstrap';
import { LoginUserContext } from '../contexts/LoginUserContext.js';

function Join() {

    const { user } = useContext(LoginUserContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ // 회원 가입 시 전송할 데이터
        email: '' , 
        passoword: '',
        username: '',
        nickname: '',
        phone_number: '',
        profile_image: '',
        verification: 0
    });

    const [errorMessage, setErrorMessage] = useState({ // 오류 메시지
        email : '이메일을 입력해주세요',
        passoword : '비밀번호를 입력해주세요',
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
        passoword : false,
        username : false,
        nickname : false,
        phone_number : false,
        profile_image : false // 용량 제한
    });

    useEffect(()=>{ // 로그인 한 유저가 접근 시도 시 메인으로 보냄
        if (user) {
          navigate("/");
        }
      }, [user]);

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

    return (
        <Container>
        <div className="inner">
            <h2>회원가입</h2>
            <form className="form-box" onSubmit={(e)=>{e.preventDefault()}}>
                    {
                        Object.keys(formData).map((el, i) => {
                            return (
                                <div key={i}>
                                    <input name={el} 
                                    placeholder={el === 'profile_image' ? '' : el} 
                                    type={el === 'password' ? 'password' 
                                        : el === 'phone_number' ? 'tel' 
                                        : el === 'profile_image' ? 'image' : 'text'} 
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    />
                                    { el === 'email' &&
                                        <Button onClick={handleDuplication}>중복체크</Button>
                                    }
                                    <div className="error-box">{errorMessage[el]}</div>
                                </div>
                                
                            )
                        })
                    }
                <div>
                    <Button className="confirm" type="submit" onClick={()=>{check()}}>확인</Button>
                </div>
            </form>
        </div>
        </Container>
    )
}

export default Join;