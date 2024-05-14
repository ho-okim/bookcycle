import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext.js';

import styles from '../../styles/mypage.module.css';
import { StarFill } from "react-bootstrap-icons";


function LeftNav() {
  const { user } = useAuth();

  // 로그인 하지 않은 경우 login 페이지로 이동
  // 근데 지금은 로그인 해도 못들어가게 됨.. 왜지
  if (!user) {
    return <div>Loading...</div>
    // return <Navigate to="/login" />;
  }

  return (
    <>
      <div className={styles.leftNav}>
        <div className={`py-2 ${styles.navProfile}`}>
          <img src="" style={{width:'20px', height:'20px', backgroundColor:'#ddd',  borderRadius:'100%'}}/>
          <div>{user.nickname}</div>
          <div><StarFill style={{color: '#FFC100'}}/>{user.manner_score.toFixed(1)}</div>
        </div>
        <ul className="p-0">
          <li className="border-bottom">
            구매
            <ul className="ps-3">
              <li><Link to={'/mypage/buyList'}>내역</Link></li>
              <li><Link to={'/mypage/buyGiveReviewList'}>남긴후기</Link></li>
              <li><Link to={'/mypage/buyGetReviewList'}>받은후기</Link></li>
              <li><Link to={'/mypage/heartList'}>찜한책</Link></li>
            </ul>
          </li>
          <li className="border-bottom">
            판매
            <ul className="ps-3">
              <li><Link to={'/mypage/sellList'}>내역</Link></li>
              <li><Link to={'/mypage/sellGiveReviewList'}>남긴후기</Link></li>
              <li><Link to={'/mypage/sellGetReviewList'}>받은후기</Link></li>
            </ul>
          </li>
          <li><Link to={'/mypage/reportList'}>신고 내역</Link></li>
          <li><Link to={'/mypage/edit'}>회원 정보 관리</Link></li>
        </ul>
      </div>
    </>
  )
}

export default LeftNav;