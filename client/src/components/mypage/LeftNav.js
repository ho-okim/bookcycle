import { Link, useNavigate, } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext.js';

import styles from '../../styles/mypage.module.css';
import { PersonCircle, StarFill } from "react-bootstrap-icons";
import { useEffect, useState } from 'react';


function LeftNav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('unknown');
  const [mannerScore, setMannerScore] = useState(0);

  useEffect(()=>{
    if (user) {
      setNickname(user.nickname);
      setMannerScore(user.manner_score);
    }
  }, [user]);

  if (!user) {
    navigate('/login')
    return null; // navigate 후에는 컴포넌트를 렌더링하지 않음  
  }

  return (
    <>
      <div className={styles.leftNav}>
        <div className={`py-2 ${styles.navProfile}`}>
          <div className={styles.navProfileImgWrap}>
            {user.profile_image && user.profile_image.length != 0 ? (
              <img className={styles.navProfileImg} src={`${process.env.PUBLIC_URL}/img/profile/${user.profile_image}`} alt='프로필'/>
            ) : (<PersonCircle className={styles.profile_default}/>)}
          </div>
          <div className={styles.navProfileOverlay}>
            <div className={styles.score}>
              <StarFill className={styles.starIcon} />
              <span className={styles.mannerScore}>{mannerScore.toFixed(1)}</span>
            </div>
            <div className={styles.nickname}>{nickname}</div>
          </div>
        </div>
        <ul className="p-0">
          <li className="border-bottom py-2">
            구매
            <ul className="ps-3">
              <li><Link to={'/mypage/buyList'}>내역</Link></li>
              <li><Link to={'/mypage/buyGiveReviewList'}>남긴후기</Link></li>
              <li><Link to={'/mypage/buyGetReviewList'}>받은후기</Link></li>
              <li><Link to={'/mypage/heartList'}>찜한책</Link></li>
            </ul>
          </li>
          <li className="border-bottom py-2">
            판매
            <ul className="ps-3">
              <li><Link to={'/mypage/sellList'}>내역</Link></li>
              <li><Link to={'/mypage/sellGiveReviewList'}>남긴후기</Link></li>
              <li><Link to={'/mypage/sellGetReviewList'}>받은후기</Link></li>
            </ul>
          </li>
          <li className="pt-2"><Link to={'/mypage/postList'}>게시글 목록</Link></li>
          <li><Link to={'/mypage/notifications'}>알림 목록</Link></li>
          <li><Link to={'/mypage/reportList'}>신고 내역</Link></li>
          <li>
            <Link to={'/mypage/edit'}>회원 정보 관리</Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default LeftNav;