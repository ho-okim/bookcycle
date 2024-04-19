import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { email_check, join } from '../api/join.js';

function Join() {

    const [form, setForm] = useState({
        email: '' , 
        passoword: '',
        username: '',
        nickname: '',
        phone_number: '',
        profile_image: '',
        verification: 0
    });

    const [dupleCheck, setDupleCheck] = useState(0);

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    async function check() {
        const email = form.email;
        const password = form.password;
        const username = form.username;
        const nickname = form.nickname;
        const phone_number = form.phone_number;
        const profile_image = form.profile_image;
        const verification = form.verification;

        if (!email || email == '') {
            setErrorMessage('이메일을 입력해주세요');
            return;
        }
        if (!password || password == '') {
            setErrorMessage("비밀번호를 입력해주세요");
            return;
        }
        if (!username || username == '') {
            setErrorMessage('사용자 이름을 입력해주세요');
            return;
        }
        if (!nickname || nickname == '') {
            setErrorMessage("닉네임을 입력해주세요");
            return;
        }
        if (!phone_number || phone_number == '') {
            setErrorMessage("전화번호를 입력해주세요");
            return;
        }

        const res = await join({
            email, 
            password, 
            username, 
            nickname, 
            phone_number, 
            profile_image, 
            verification
        });

        if (res) {
            setErrorMessage("회원가입 완료");
        }
    }

    function handleEmail(value) {
        setForm({...form, email: value});
        setDupleCheck(0);
    }

    // 이메일 중복 체크
    async function handleDuplication() {
        const email = form.email;
        
        if (!email || email == '') {
            setErrorMessage('이메일을 입력해주세요');
            return;
        }

        const res = await email_check(form.email);
        
        if (res == 1) {
            setErrorMessage("이미 등록된 이메일입니다");
            return;
        } else {
            setErrorMessage("사용 가능한 이메일입니다");
            setDupleCheck(1);
        }
    }

    return (
        <section className="sec">
            <h2>회원가입</h2>
            <form className="form-box" onSubmit={(e)=>{e.preventDefault()}}>
                <input name="email" 
                    placeholder="이메일" 
                    onChange={(e)=>{handleEmail(e.target.value)}}/>
                <button onClick={handleDuplication}>중복체크</button>
                <input name="password" 
                    placeholder="비밀번호" 
                    type="password" 
                    onChange={(e)=>{setForm({...form, password: e.target.value})}}/>
                <input name="username" 
                    placeholder="이름" 
                    onChange={(e)=>{setForm({...form, username: e.target.value})}}/>
                <input name="nickname" 
                    placeholder="닉네임" 
                    onChange={(e)=>{setForm({...form, nickname: e.target.value})}}/>    
                <input name="phone_number" 
                    type="tel" 
                    placeholder="전화번호" 
                    onChange={(e)=>{setForm({...form, phone_number: e.target.value})}}/>
                <input name="profile_image" 
                    type="image"
                    onChange={(e)=>{setForm({...form, profile_image: e.target.value})}}/>
                
                <button className="confirm" type="submit" onClick={()=>{check()}}>확인</button>

                <div className="error-box">{errorMessage}</div>
            </form>
        </section>
    )
}

export default Join;