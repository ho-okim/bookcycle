import { useEffect, useState } from 'react';
import { mypage } from '../../api/mypage';  // axios 인스턴스 import

import Container from 'react-bootstrap/Container';
import '../../styles/mypage.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LeftNav from '../../components/mypage/LeftNav';


function MypageEdit() {

  async function getUser(){
    const data = await mypage()
    return data
  }

  const [user, setUser] = useState([]);


  useEffect(() => {
    const fetchUser = async () => {
      const items = await getUser();
      // 배열 데이터의 첫 번째 항목
      setUser(items[0]);
    };
    fetchUser();
  }, []);

  console.log("User : " , user)

  return (
    <>
      <Container>
        <div className="inner d-flex">
          <LeftNav/>
          <div className="content">
            <p> &gt; 회원 정보 관리</p>

            
            <div className="userInfo">
              <div className="info-item">
                <p>이름</p>
                <input value={user.username}/>
              </div>
              <div className="info-item">
                <p>닉네임</p>
                <input value={user.nickname}/>
              </div>
              <div className="info-item">
                <p>비밀번호</p>
                <input type="password" />
              </div>
              <div className="info-item">
                <p>비밀번호 확인</p>
                <input type="password" />
              </div>
              <div className="info-item">
                <p>휴대폰 번호</p>
                <input value={user.phone_number} />
              </div>
              <div className="info-item">
                <p>이메일</p>
                <input value={user.email} />
              </div>
            </div>

            <div className="btn-wrap">
              <button type="reset" className="cancel">취소</button>
              <button  className="edit">수정</button>
            </div>
          </div>
        </div>
      </Container>
    </>
  )

}

export default MypageEdit;