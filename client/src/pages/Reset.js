import styles from '../styles/login.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../contexts/LoginUserContext.js';
import REGEX from '../lib/regex.js';
import { resetpwd } from '../api/login.js';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

function Reset() {
    const { user } = useAuth();

    const { email } = useParams();

    const [formData, setFormData] = useState({
        email,
        password : '', 
        confirm_password : '', 
        is_confirmed : false
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [pwdVisible, setPwdVisible] = useState(false); // password 보이기 여부
    const defaultError = '비밀번호를 8~13자로 입력해주세요';

    const navigate = useNavigate();

    useEffect(()=>{ // 타이틀 설정
        document.title = "비밀번호 초기화";
    }, []);

    useEffect(()=>{ // 로그인 한 유저가 접근 시도 시 메인으로 보냄
    if (user) {
        alert("비밀번호 초기화를 요청하지 않았거나 이미 로그인 중입니다!");
        navigate("/");
    }
    if (!email) {
        navigate("/");
    }
    }, [user, email]);

    // 입력 input 필드 제어 및 에러 처리
    function handleInputChange(e) { 
        const { id, value } = e.currentTarget;

        if (id == 'new-password') {
            setFormData((formData) => ({
                ...formData, 
                password : (value && REGEX.PASSWORD_REG.test(value)) ? 
                    value : ''
            }));
    
            setErrorMessage(
                (value && REGEX.PASSWORD_REG.test(value)) ? '' :
                (value && !REGEX.PASSWORD_REG.test(value)) ? 
                '공백없이 영문 소문자, 대문자, 특수문자, 숫자를 1개 이상 포함한 8~13글자로 입력해주세요'  
                : defaultError
            );
        }
        
        if (id == 'confirm-password') {
            setFormData((formData) => ({
                ...formData, 
                confirm_password : (value && REGEX.PASSWORD_REG.test(value)) ? 
                    value : '',
                is_confirmed : (value && REGEX.PASSWORD_REG.test(value)) ? true : false
            }));
    
            setErrorMessage(
                (value === formData.password) ? '' :
                '비밀번호가 일치하지 않습니다'  
            );
        }
    }

    async function check() {
        if (!formData.password) { // 빈 값 확인
            setErrorMessage('비밀번호을 입력해주세요');
            return;
        }

        // 잘못 넘어온 값 처리
        if (!REGEX.PASSWORD_REG.test(formData.password)) { // 유효성 검사
            setErrorMessage('비밀번호 형식이 맞지 않습니다');
            return;
        }

        if (!formData.confirm_password) { // 빈 값 확인
            setErrorMessage('비밀번호를 다시 입력해주세요');
            return;
        }

        // 잘못 넘어온 값 처리
        if (!REGEX.PASSWORD_REG.test(formData.confirm_password)) { // 유효성 검사
            setErrorMessage('확인용 비밀번호의 형식이 맞지 않습니다');
            return;
        }

        if (!formData.is_confirmed) {
            setErrorMessage('비밀번호가 일치하지 않습니다');
            return;
        }

        // 비밀번호 초기화
        const res = await resetpwd(formData);
        
        if (res === 'success') {
            alert('비밀번호가 성공적으로 수정되었습니다!');
            navigate("/login");
        } else if (res === 'same password') {
            alert('기존 비밀번호와 동일합니다! 다른 비밀번호로 변경해주세요');
            return;
        } else {
            alert('비밀번호 수정을 실패했습니다. 다시 시도해주세요');
            return;
        }
    }
    
    function handlePasswordVisible() { // 비밀번호 보임 처리
        setPwdVisible((pwdVisible)=>(!pwdVisible));
    }

    return(
        <Container>
            <div className='inner text-center d-flex justify-content-center'>
                <div className={styles.reset_box}>
                    <h2 className={styles.title}>비밀번호 초기화</h2>
                    <div className={styles.form_box}>
                        <div className={styles.input_box}>
                            <label htmlFor='new-password'>새 비밀번호</label>
                            <div className={styles.password_box}>
                                <input type={(pwdVisible) ? "text" : "password"} 
                                id="new-password"
                                className={styles.input_form}
                                onChange={(e)=>{handleInputChange(e)}} 
                                maxLength={50}
                                autoFocus/>
                                <span className={styles.password_eye} 
                                onClick={handlePasswordVisible}>
                                {
                                    (pwdVisible) ? 
                                    <EyeSlash/>:<Eye/>
                                }
                                </span>
                            </div>
                            <label htmlFor='confirm-password'>비밀번호 확인</label>
                            <input type="password" id="confirm-password"
                            className={styles.input_form}
                            onChange={(e)=>{handleInputChange(e)}} 
                            maxLength={50}/>
                        </div>
                        {
                            errorMessage ?
                            <div className={styles.error_box}>{errorMessage}</div>
                            : null
                        }
                        <div>
                            <Button className={`${styles.login_btn} confirm`} type="submit" onClick={()=>{check()}}>확인</Button>
                            <Button className={styles.back_btn} variant='outline-secondary' type="button" onClick={()=>{navigate("/login")}}>취소</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Reset;