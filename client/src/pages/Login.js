import styles from '../styles/login.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { useAuth } from '../contexts/LoginUserContext.js';
import REGEX from '../lib/regex.js';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

function Login() {

  const { user, handleLogin } = useAuth();

  const [form, setForm] = useState({ email: '' , passoword: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [pwdVisible, setPwdVisible] = useState(false); // password 보이기 여부

  const navigate = useNavigate();

  useEffect(()=>{ // 로그인 한 유저가 접근 시도 시 메인으로 보냄
    if (user) {
      navigate("/");
    }
  }, [user]);

  function handleEmail(value) { // 전송할 이메일 설정
    setForm({...form, email: value});
  }

  function handlePassword(value) { // 전송할 비밀번호 설정
    setForm({...form, password: value});
  }


  async function check() {
    const email = form.email;
    const password = form.password;

    if (!email) { // 빈 값 확인
      setErrorMessage('이메일을 입력해주세요');
      return;
    }

    // 잘못 넘어온 값 처리
    // if (!REGEX.EMAIL_REG.test(email)) { // 유효성 검사
    //   setErrorMessage('이메일 형식이 맞지 않습니다');
    //   return;
    // }

    if (!password) { // 빈 값 확인
      setErrorMessage('비밀번호를 입력해주세요');
      return;
    }

    // 잘못 넘어온 값 처리
    // if (REGEX.PASSWORD_REG.test(password)) { // 유효성 검사
    //   setErrorMessage('비밀번호 형식이 맞지 않습니다');
    //   return;
    // }

    // 로그인 진행
    const res = await handleLogin(email, password);

    if (res == 'success') {
      navigate("/");
      return;
    } else if (res == 'not verified') { // 인증 링크 만료됨
      setErrorMessage('인증이 완료되지 않았습니다. 인증 이메일을 확인해주세요');
      return;
    } else { // 사용자 정보 없음
      setErrorMessage('이메일이나 비밀번호를 다시 확인해주세요');
      return;
    }
  }

  function handlePasswordVisible() { // 비밀번호 보임 처리
    setPwdVisible((pwdVisible)=>(!pwdVisible));
  }

  return (
    <Container className={styles.login_box}>
      <div className='inner text-center'>
        <h2 className={styles.title}>로그인</h2>
        <form className={styles.form_box} onSubmit={(e)=>{e.preventDefault()}}>
          <div className={styles.input_box}>
            <input name="email" placeholder="email / 이메일"
            className={styles.input_form}
            onChange={(e)=>{handleEmail(e.target.value)}} 
            maxLength={50}
            autoFocus/>
            <div className={styles.password_box}>
              <input name="password" placeholder="password / 비밀번호"
              className={styles.input_form}
              type={(pwdVisible) ? "text" : "password"}
              onChange={(e)=>{handlePassword(e.target.value)}}
              maxLength={13}/>
              <span className={styles.password_eye} 
              onClick={handlePasswordVisible}>
                {
                  (pwdVisible) ? 
                  <EyeSlash/>:<Eye/>
                }
              </span>
            </div>
          </div>
          {
            errorMessage ?
            <div className={styles.error_box}>{errorMessage}</div>
            : null
          }
          <div>
            <button className={styles.login_btn} type="submit" onClick={()=>{check()}}>확인</button>
            <Button className={styles.back_btn} variant='outline-secondary' type="button" onClick={()=>{navigate("/")}}>취소</Button>
          </div>
          <div className={styles.more_info}>
            <div>
              <span className={styles.join_info}>BookCycle에 처음이신가요?</span>
              <Link to="/join">회원가입</Link>
            </div>
            <div>
              <Link to="/password/find" className={styles.find_info}>비밀번호 찾기</Link>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Login;