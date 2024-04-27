import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/Button';
import { LoginUserContext } from '../contexts/LoginUserContext.js';

function Login() {

  const { user, handleLogin } = useContext(LoginUserContext);

  const [form, setForm] = useState({ email: '' , passoword: '' });
  const [errorMessage, setErrorMessage] = useState({
    email : '',
    password : '',
    login : ''
  });

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
      setErrorMessage({
        email : '이메일을 입력해주세요',
        password : '', login : ''
      });
      return;
    }
    if (!password) { // 빈 값 확인
      setErrorMessage({
        email : '',
        password : '비밀번호를 입력해주세요',
        login : ''
      });
      return;
    }

    // 로그인 진행
    const res = await handleLogin(email, password);

    if (res == 'success') {
      navigate("/");
      return;
    } else if (res == 'expired') { // 인증 링크 만료됨
      setErrorMessage({ 
        email : '', password : '',
        login : '인증 링크가 만료되었습니다. 회원가입부터 다시 진행해주세요.'
      });
      return;
    } else if (res == 'sent') { // 인증 필요
      setErrorMessage({
        email : '', password : '',
        login : '인증 링크가 발송되었습니다. 메일을 확인해주세요.'
      });
      return;
    } else { // 사용자 정보 없음
      setErrorMessage({
        login : '', password : '',
        login : '이메일이나 비밀번호를 다시 확인해주세요'
      });
      return;
    }
  }

  return (
    <Container>
      <div className='inner'>
        <h2>로그인</h2>
        <form className="form-box" onSubmit={(e)=>{e.preventDefault()}}>
          <div>
            <input name="email" placeholder="email"
            onChange={(e)=>{handleEmail(e.target.value)}}/>
            <div className="email-error-box">{errorMessage.email}</div>
          </div>
          <div>
            <input name="password" placeholder="password"
            type="password" onChange={(e)=>{handlePassword(e.target.value)}}/>
            <div className="pwd-error-box">{errorMessage.password}</div>
          </div>
          <div className="error-box">{errorMessage.login}</div>
          <div>
            <Button className="confirm" type="submit" onClick={()=>{check()}}>확인</Button>
          </div>
          <div>
            <div><Link to="/join">회원가입</Link></div>
            <div>
              <Link to="#">이메일 찾기</Link>
              <Link to="#">비밀번호 찾기</Link>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Login;