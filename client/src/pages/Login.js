import styles from '../styles/login.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../contexts/LoginUserContext.js';
import REGEX from '../lib/regex.js';

function Login() {

  const { user, handleLogin } = useAuth();

  const [form, setForm] = useState({ email: '' , passoword: '' });
  const [errorMessage, setErrorMessage] = useState('');

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
    } else if (res == 'expired') { // 인증 링크 만료됨
      setErrorMessage('인증 링크가 만료되었습니다. 회원가입부터 다시 진행해주세요.');
      return;
    } else if (res == 'sent') { // 인증 필요
      setErrorMessage('인증 링크가 발송되었습니다. 메일을 확인해주세요.');
      return;
    } else { // 사용자 정보 없음
      setErrorMessage('이메일이나 비밀번호를 다시 확인해주세요');
      return;
    }
  }

  return (
    <Container>
      <div className='inner text-center'>
        <h2 className={styles.title}>로그인</h2>
        <form className={styles.form_box} onSubmit={(e)=>{e.preventDefault()}}>
          <div className={styles.input_box}>
            <input name="email" placeholder="email / 이메일"
            className={styles.input_form}
            onChange={(e)=>{handleEmail(e.target.value)}} 
            maxLength={50}
            autoFocus/>
            <input name="password" placeholder="password / 비밀번호"
            className={styles.input_form}
            type="password" 
            onChange={(e)=>{handlePassword(e.target.value)}}
            maxLength={13}/>
          </div>
          {
            errorMessage ?
            <div className={styles.error_box}>{errorMessage}</div>
            : null
          }
          <div>
            <Button className={`${styles.login_btn} confirm`} type="submit" onClick={()=>{check()}}>확인</Button>
            <Button className={styles.back_btn} variant='secondary' type="button" onClick={()=>{navigate("/")}}>취소</Button>
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