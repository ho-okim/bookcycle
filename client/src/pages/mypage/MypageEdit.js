import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mypage } from '../../api/mypage';

import Container from 'react-bootstrap/Container';
import LeftNav from '../../components/mypage/LeftNav';

import styles from '../../styles/mypage.module.css';


function MypageEdit() {

  const { id } = useParams();

  async function getUser() {
    const data = await mypage(id);
    return data;
  }
  const [user, setUser] = useState([]);

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

  console.log(user[0])

  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav/>
          <div className={styles.content}>
            <p> &gt; 회원 정보 관리</p>
            
            <div className={styles.userInfo}>
              <div className={styles.infoItem}>
                <p>이름</p>
                <input value={user[0].username}/>
              </div>
              <div className={styles.infoItem}>
                <p>닉네임</p>
                <input value={user[0].nickname}/>
              </div>
              <div className={styles.infoItem}>
                <p>비밀번호</p>
                <input type="password" />
              </div>
              <div className={styles.infoItem}>
                <p>비밀번호 확인</p>
                <input type="password" />
              </div>
              <div className={styles.infoItem}>
                <p>휴대폰 번호</p>
                <input value={user[0].phone_number} />
              </div>
              <div className={styles.infoItem}>
                <p>이메일</p>
                <input value={user[0].email} readOnly/>
              </div>
            </div>

            <div className={styles.btnWrap}>
              <button type="reset" className={styles.cancel}>취소</button>
              <button  className={styles.edit}>수정</button>
            </div>
          </div>
        </div>
      </Container>
    </>
  )

}

export default MypageEdit;