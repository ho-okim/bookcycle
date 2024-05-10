import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import LeftNav from '../../components/mypage/LeftNav';
import ConfirmPassword from '../../components/mypage/ConfirmPassword';
import MyInfoEdit from '../../components/mypage/MyInfoEdit';

import styles from '../../styles/mypage.module.css';


function MypageEdit() {

  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [password, setPassword] = useState(null);

  // ConfirmPassword 컴포넌트에서 response.message가 success이면 isPasswordConfirmed 상태가 true로 변경
  const handlePasswordConfirmed = (inputPwd) => {
    setIsPasswordConfirmed(true);
    setPassword(inputPwd);
  };

  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav/>
          {/* isPasswordConfirmed 상태에 따라 조건부 렌더링 */}
          {isPasswordConfirmed ? <MyInfoEdit password={password}/> : <ConfirmPassword onConfirm={handlePasswordConfirmed} />}
        </div>
      </Container>
    </>
  )

}

export default MypageEdit;