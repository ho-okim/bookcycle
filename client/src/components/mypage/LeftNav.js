import { Link } from 'react-router-dom';

import styles from '../../styles/mypage.module.css';
import { StarFill } from "react-bootstrap-icons";
import { useAuth } from '../../contexts/LoginUserContext.js';


function LeftNav() {

  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.leftNav}>
        <div className={`py-2 ${styles.navProfile}`}>
          <img src="" style={{width:'20px', height:'20px', backgroundColor:'#ddd',  borderRadius:'100%'}}/>
          <div>{user.nickname}</div>
          <div><StarFill style={{color: '#FFC100'}}/> {user.manner_score.toFixed(1)}</div>
        </div>
        <ul className="p-0">
          <li className="border-bottom">
            구매
            <ul className="ps-3">
              <li><Link to={'/mypage/buyList'}>구매내역</Link></li>
              <li><Link to={'/mypage/buyReviewList'}>구매후기</Link></li>
              <li><Link to={'/mypage/heartList'}>찜한책</Link></li>
            </ul>
          </li>
          <li className="border-bottom">
            판매
            <ul className="ps-3">
              <li><Link to={'/mypage/sellList'}>판매내역</Link></li>
              <li><Link to={'/mypage/sellReviewList'}>판매후기</Link></li>
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