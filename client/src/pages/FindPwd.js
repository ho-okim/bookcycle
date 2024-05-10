import styles from '../styles/login.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../contexts/LoginUserContext.js';
import REGEX from '../lib/regex.js';
import { findpwd } from '../api/login.js';

function FindPwd() {

  const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(()=>{ // 로그인 한 유저가 접근 시도 시 메인으로 보냄
    if (user) {
      navigate("/");
    }
  }, [user]);

  function handleEmail(value) { // 전송할 이메일 설정
    setEmail(value);
  }

  async function check() {

    if (!email) { // 빈 값 확인
      setErrorMessage('이메일을 입력해주세요');
      return;
    }

    // 잘못 넘어온 값 처리
    //if (!REGEX.EMAIL_REG.test(email)) { // 유효성 검사
    //  setErrorMessage('이메일 형식이 맞지 않습니다');
    //  return;
    //}

    // 이메일 조회 및 메일 발송
    const res = await findpwd(email);
    
    if (res === 'send') {
      alert('성공적으로 메일을 보냈습니다');
      navigate("/login");
    } else {
      alert('이메일을 다시 조회해주세요');
      return;
    }
  }

  return (
    <Container>
      <div className='inner text-center'>
        <h2 className={styles.title}>비밀번호 찾기</h2>
        <form className={styles.form_box} onSubmit={(e)=>{e.preventDefault()}}>
          <div className={styles.input_box}>
            <input name="email" placeholder="email / 이메일"
            className={styles.input_form}
            onChange={(e)=>{handleEmail(e.target.value)}} 
            maxLength={50}
            autoFocus/>
          </div>
          {
            errorMessage ?
            <div className={styles.error_box}>{errorMessage}</div>
            : null
          }
          <div>
            <Button className={`${styles.login_btn} confirm`} type="submit" onClick={()=>{check()}}>확인</Button>
            <Button className={styles.back_btn} variant='secondary' type="button" onClick={()=>{navigate("/login")}}>취소</Button>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default FindPwd;