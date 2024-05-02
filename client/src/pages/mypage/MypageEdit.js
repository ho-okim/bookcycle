import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mypage, mypageEdit } from '../../api/mypage';

import Container from 'react-bootstrap/Container';
import LeftNav from '../../components/mypage/LeftNav';

import styles from '../../styles/mypage.module.css';


function MypageEdit() {

  const navigate = useNavigate();
  const { id } = useParams();

  async function getUser() {
    const data = await mypage(id);
    return data;
  }

  const [user, setUser] = useState([]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModified, setIsModified] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      const items = await getUser();
      setUser(items);
    };
    fetchUser();
  }, [id])

  // user 객체가 비어있는 경우 렌더링하지 않음
  if (!user || Object.keys(user).length === 0) {
    return <div>Loading...</div>;
  }


  const handleNameChange = (e) => {
    setNickname(e.target.value);
    setIsModified(true);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setIsModified(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsModified(true);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsModified(true);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setIsModified(true);
  };

  // const handleSubmit = async () => {
  //   try {
  //     if (password !== confirmPassword) {
  //       alert('비밀번호가 일치하지 않습니다.');
  //       return;
  //     }

  //     await mypageEdit(id, nickname, phoneNumber);
  //     navigate(`/mypage/${id}/edit`);

  //   } catch(error) {
  //     console.error('수정 실패: ', error.message)
  //   }
  // }

  console.log(user[0])

  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav/>
          <div className={styles.content}>
            <p> &gt; 회원 정보 관리 </p>
            
            <div className={styles.userInfo}>
              <div className={styles.infoItem}>
                <p>이름</p>
                <input defaultValue={user[0].username} onChange={handleNameChange} />
              </div>
              <div className={styles.infoItem}>
                <p>닉네임</p>
                <input defaultValue={user[0].nickname} onChange={handleNicknameChange}/>
              </div>
              <div className={styles.infoItem}>
                <p>비밀번호</p>
                <input type="password" defaultValue={password} onChange={handlePasswordChange}/>
              </div>
              <div className={styles.infoItem}>
                <p>비밀번호 확인</p>
                <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
              </div>
              <div className={styles.infoItem}>
                <p>휴대폰 번호</p>
                <input defaultValue={user[0].phone_number} onChange={handlePhoneNumberChange} />
              </div>
              <div className={styles.infoItem}>
                <p>이메일</p>
                <input value={user[0].email} readOnly/>
              </div>
            </div>

            <div className={styles.btnWrap}>
              <button type="reset" className={styles.cancel} onClick={() => setIsModified(false)}>취소</button>
              {/* <button  className={styles.edit} onClick={handleSubmit} disabled={!isModified || password === '' || password !== confirmPassword}>수정</button> */}
            </div>
          </div>
        </div>
      </Container>
    </>
  )

}

export default MypageEdit;