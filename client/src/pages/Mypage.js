import React, { useState } from 'react';
import { useHref } from 'react-router-dom';
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

function MyPage() {

  const url = useHref();

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
          <LeftNav />
          {url.includes('buyList') ? (<MyBuyList/>) : 
            url.includes('buyGiveReviewList') ? (<MyBuyGiveReviewList/>) :
            url.includes('buyGetReviewList') ? (<MyBuyGetReviewList/>) :
            url.includes('heartList') ? (<MyHeartList/>) :
            url.includes('sellList') ? (<MySellList/>) :
            url.includes('sellGiveReviewList') ? (<MySellGiveReviewList/>) :
            url.includes('sellGetReviewList') ? (<MySellGetReviewList/>) :
            url.includes('postList') ? (
              <div className={styles.content}>
                <MyProductPostList/>
                <MyBoardPostList/>
              </div>
            ):
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
