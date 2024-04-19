import { useEffect, useState } from 'react';
import login from '../api/login.js';
import { Link, Navigate, useNavigate } from 'react-router-dom';

function Login() {

  const [form, setForm] = useState({email: '' , passoword: ''});
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  function handleEmail(value) {
    setForm({...form, email: value});
  }

  function handlePassword(value) {
    setForm({...form, password: value});
  }

  async function check() {
    const email = form.email;
    const password = form.password;

    if (!email || email == '') {
      setErrorMessage('이메일을 입력해주세요');
      return;
    }
    if (!password || password == '') {
      setErrorMessage("비밀번호를 입력해주세요");
      return;
    }

    const res = await login(email, password);

    if (res.message == 'success') {
      navigate("/");
      return;
    } else {
      setErrorMessage('이메일이나 비밀번호를 다시 확인해주세요');
      return;
    }

  }

  return (
      <section className="sec">
          <h2>로그인</h2>
          <form className="form-box" onSubmit={(e)=>{e.preventDefault()}}>
            <input name="email" placeholder="email" 
            value={form.email} onChange={(e)=>{handleEmail(e.target.value)}}/>
            <input name="password" placeholder="password" 
            value={form.password} type="password" onChange={(e)=>{handlePassword(e.target.value)}}/>
            <button className="confirm" type="submit" onClick={()=>{check()}}>확인</button>
            <div className="error-box">{errorMessage}</div>
          </form>
          <div>
          </div>
      </section>
  )
}

export default Login;