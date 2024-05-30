import React, { useEffect, useState } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import LeftNav from '../components/mypage/LeftNav';
import styles from "../styles/mypage.module.css";

import MyBuyList from "../components/mypage/MyBuyList";
import MyBuyGiveReviewList from "../components/mypage/MyBuyGiveReviewList";
import MyBuyGetReviewList from "../components/mypage/MyBuyGetReviewList";
import MyHeartList from "../components/mypage/MyHeartList";
import MySellList from "../components/mypage/MySellList";
import MySellGiveReviewList from "../components/mypage/MySellGiveReviewList";
import MySellGetReviewList from "../components/mypage/MySellGetReviewList";
import MyProductPostList from "../components/mypage/MyProductPostList";
import MyBoardPostList from "../components/mypage/MyBoardPostList";
import MyReportList from "../components/mypage/MyReportList";
import ConfirmPassword from '../components/mypage/ConfirmPassword';
import MyInfoEdit from '../components/mypage/MyInfoEdit';
import MyNotifications from '../components/mypage/MyNotifications';
import { useAuth } from '../contexts/LoginUserContext';

function MyPage() {

  const {user} = useAuth(); // 로그인 한 사용자
  const url = useHref();
  const navigate = useNavigate();

  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [password, setPassword] = useState(null);

  // ConfirmPassword 컴포넌트에서 response.message가 success이면 isPasswordConfirmed 상태가 true로 변경
  const handlePasswordConfirmed = (inputPwd) => {
    setIsPasswordConfirmed(true);
    setPassword(inputPwd);
  };

  if (!user) {
    navigate('/login')
    return null; // navigate 후에는 컴포넌트를 렌더링하지 않음  
  }

  return (
    <>
      <Container>
        <div className={`${styles.inner} inner`}>
          <LeftNav />
          {url.includes('buyList') ? (<MyBuyList/>) : 
            url.includes('buyGiveReviewList') ? (<MyBuyGiveReviewList/>) :
            url.includes('buyGetReviewList') ? (<MyBuyGetReviewList/>) :
            url.includes('heartList') ? (<MyHeartList/>) :
            url.includes('sellList') ? (<MySellList/>) :
            url.includes('sellGiveReviewList') ? (<MySellGiveReviewList/>) :
            url.includes('sellGetReviewList') ? (<MySellGetReviewList/>) :
            url.includes('productPostList') ? (<MyProductPostList/>) :
            url.includes('boardPostList') ? (<MyBoardPostList/>) :
            url.includes('notifications') ? (<MyNotifications/>) :
            url.includes('reportList') ? (<MyReportList/>) :
            url.includes('edit') ? (
              isPasswordConfirmed ? <MyInfoEdit password={password}/> : 
              <ConfirmPassword onConfirm={handlePasswordConfirmed} />) : 
              <></>
          }
        </div>
      </Container>
    </>
  );
}

export default MyPage;
