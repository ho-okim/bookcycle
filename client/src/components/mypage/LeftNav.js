import { Link, useParams } from 'react-router-dom';
import styles from '../../styles/mypage.module.css';


function LeftNav() {

  return (
    <>
      <div className={'col ${styles.leftNav}'}>
        <h5 className={'py-3 ${styles.navTitle}'}>마이페이지</h5>
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