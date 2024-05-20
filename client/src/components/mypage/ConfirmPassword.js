import React, { useState } from 'react';
import { useAuth } from '../../contexts/LoginUserContext.js';

import { confirmPassword } from '../../api/mypage';
import styles from '../../styles/mypage.module.css';


function ConfirmPassword({ onConfirm }) {

  const { user } = useAuth();

  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmPassword = async () => {
    try {
      if (!user) {
        setErrorMessage("사용자 정보를 불러올 수 없습니다.");
        return;
      }

      const res = await confirmPassword(password);

      if (res.message === "success") {
        onConfirm(password);
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      if(error.message === "not allowed") {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      } else {
        console.error(error);
        setErrorMessage("뭔가.. 오류");
      }
    }
  };

  return (
    <div className={`${styles.content} ${styles.confirm}`}>
      <div>본인확인이 필요한 서비스입니다. <br/>비밀번호를 입력해주세요.</div>
      <div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleConfirmPassword}>확인</button>
        {errorMessage && <p style={{color:'red'}}>{errorMessage}</p>}
      </div>
    </div>
  )

}

export default ConfirmPassword;