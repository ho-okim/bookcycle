import { useEffect, useState } from 'react';
import { Link, useHref, useNavigate, } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext.js';

import { PersonCircle, StarFill } from "react-bootstrap-icons";
import styles from '../../styles/mypage.module.css';

function clampText(text, maxCharacters) {
  if (text.length > maxCharacters) {
    return text.substring(0, maxCharacters) + '...';
  }
  return text;
}

function LeftNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('unknown');
  const [mannerScore, setMannerScore] = useState(0);

  const url = useHref();

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

  let buyUrl = url.includes("buyList") || url.includes("buyGiveReviewList") || url.includes("buyGetReviewList") || url.includes("heartList")
  let sellUrl = url.includes("sellList") || url.includes("sellGiveReviewList") || url.includes("sellGetReviewList")
  let postUrl = url.includes("productPostList") || url.includes("boardPostList")
  let etcUrl = url.includes("notifications") || url.includes("reportList")
  let userUrl = url.includes("edit")

  return (
    <>
      <div className={styles.leftNav}>
        <div className={`py-2 ${styles.navProfile}`}>
          <div className={styles.navProfileImgWrap}>
            {user.profile_image && user.profile_image.length !== 0 ? (
              <img className={styles.navProfileImg} src={`${process.env.PUBLIC_URL}/img/profile/${user.profile_image}`} alt='프로필'/>
            ) : (<PersonCircle className={styles.profile_default}/>)}
          </div>
          <div className={styles.navProfileOverlay}>
            <div className={styles.score}>
              <StarFill className={styles.starIcon} />
              <span className={`${styles.mannerScore} regular`}>{mannerScore.toFixed(1)}</span>
            </div>
            <div className={`${styles.nickname} regular`}>{clampText(nickname, 5)}</div>
          </div>
        </div>
        <ul className="p-0">
          <li className="border-bottom py-2">구매
            <ul className="ps-3">
              <li><Link to={'/mypage/buyList'}>내역</Link></li>
              <li><Link to={'/mypage/buyGiveReviewList'}>남긴후기</Link></li>
              <li><Link to={'/mypage/buyGetReviewList'}>받은후기</Link></li>
              <li><Link to={'/mypage/heartList'}>찜한책</Link></li>
            </ul>
          </li>
          <li className="border-bottom py-2">판매
            <ul className="ps-3">
              <li><Link to={'/mypage/sellList'}>내역</Link></li>
              <li><Link to={'/mypage/sellGiveReviewList'}>남긴후기</Link></li>
              <li><Link to={'/mypage/sellGetReviewList'}>받은후기</Link></li>
            </ul>
          </li>
          <li className="pt-2"><Link to={'/mypage/productPostList'}>상품 등록 내역</Link></li>
          <li><Link to={'/mypage/boardPostList'}>게시글 작성 내역</Link></li>
          <li><Link to={'/mypage/notifications'}>알림 목록</Link></li>
          <li><Link to={'/mypage/reportList'}>신고 내역</Link></li>
          <li><Link to={'/mypage/edit'}>회원 정보 수정</Link></li>
        </ul>
      </div>

      {/* max-width: 992px */}
      <div className={styles.leftNav_mobile}>
        <div className={styles.dropdown}>
          <div className={styles.navItem}>
            <div 
              className={styles.accordion_header} 
              style={{
                backgroundColor: buyUrl ? "#4D91B6" : null, 
                color: buyUrl ? "#fff" : undefined
              }}
            >
              구매
            </div>
            <div className={styles.accordion_body}>
              <Link to={'/mypage/buyList'}>내역</Link>
              <Link to={'/mypage/buyGiveReviewList'}>남긴후기</Link>
              <Link to={'/mypage/buyGetReviewList'}>받은후기</Link>
              <Link to={'/mypage/heartList'}>찜한책</Link>
            </div>
          </div>
          <div className={styles.navItem}>
          <div 
              className={styles.accordion_header} 
              style={{
                backgroundColor: sellUrl ? "#4D91B6" : null, 
                color: sellUrl ? "#fff" : undefined
              }}
            >
              판매
            </div>
            <div className={styles.accordion_body}>
              <Link to={'/mypage/sellList'}>내역</Link>
              <Link to={'/mypage/sellGiveReviewList'}>남긴후기</Link>
              <Link to={'/mypage/sellGetReviewList'}>받은후기</Link>
            </div>
          </div>
          <div className={styles.navItem}>
            <div 
              className={styles.accordion_header} 
              style={{
                backgroundColor: postUrl ? "#4D91B6" : null, 
                color: postUrl ? "#fff" : undefined
              }}
            >
              게시글
            </div>
            <div className={styles.accordion_body}>
              <Link to={'/mypage/productPostList'}>상품 등록 내역</Link>
              <Link to={'/mypage/boardPostList'}>게시글 작성 내역</Link>
            </div>
          </div>
          <div className={styles.navItem}>
            <div 
              className={styles.accordion_header} 
              style={{
                backgroundColor: etcUrl ? "#4D91B6" : null, 
                color: etcUrl ? "#fff" : undefined
              }}
            >
              기타
            </div>
            <div className={styles.accordion_body}>
              <Link to={'/mypage/notifications'}>알림 목록</Link>
              <Link to={'/mypage/reportList'}>신고 내역</Link>
            </div>
          </div>
          <div className={styles.navItem}>
            <div 
              className={styles.accordion_header} 
              style={{
                backgroundColor: userUrl ? "#4D91B6" : null, 
                color: userUrl ? "#fff" : undefined
              }}
            >
              회원정보관리
            </div>
            <div className={styles.accordion_body}>
              <Link to={'/mypage/edit'}>회원 정보 수정</Link>
              <Link>회원 탈퇴</Link>
            </div>
          </div>
        </div>
        <div className={`py-2 ${styles.navProfile}`}>
          <div className={styles.navProfileImgWrap}>
            {user.profile_image && user.profile_image.length !== 0 ? (
              <img className={styles.navProfileImg} src={`${process.env.PUBLIC_URL}/img/profile/${user.profile_image}`} alt='프로필'/>
            ) : (<PersonCircle className={styles.profile_default}/>)}
          </div>
          <div className={styles.navProfileInfo}>
            <div className={styles.score}>
              <StarFill className={styles.starIcon} />
              <span className={styles.mannerScore}>{mannerScore.toFixed(1)}</span>
            </div>
            <div className={styles.nickname}>{clampText(nickname, 5)}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeftNav;