import styles from '../../styles/mypage.module.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buyList } from '../../api/mypage';
import { useAuth } from '../../contexts/LoginUserContext.js';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import Pagination from './Pagination.js';
import ClampText from './ClampText.js';
import { PersonFill, Person } from "react-bootstrap-icons";


function MyBuyList() {
  const {user} = useAuth(); // 로그인 한 사용자

  const [buyItems, setBuyItems] = useState([]);

  let total = buyItems.length; // 전체 게시물 수
  let limit = 5; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getItems(){
      try {
        const data = await buyList();
        setBuyItems(data[0]);
      } catch (error) {
        console.error('buyList 데이터를 가져오는 중 에러 발생: ', error);
        setBuyItems([]); // 에러 발생 시 빈 배열 저장
      } 
    }
    getItems();
  }, []);

  return (
    <div className={styles.content}>
      <p className={styles.contentHeader}> &gt; 전체 구매 내역</p>
      <div className={styles.tradeList}>
        {buyItems.length === 0 ? (
          <div className={styles.empty}>구매내역이 없습니다.</div>
          ) : (
            buyItems.slice(offset, offset + limit).map((item, index) => (
              <Link to={`/product/detail/${item.product_id}`} key={index} className={styles.tradeWrap}>
                <div className={styles.tradeImgWrap}>
                  {
                    item.filename ? 
                      <img src={process.env.PUBLIC_URL + `/img/product/${item.filename}`} alt="" className={styles.tradeImg}/> :
                      <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} alt="" className={styles.tradeImg}/>
                  }
                </div>
                <div className={styles.tradeInfo}>
                  <p className={styles.tradeTitle}>{item.product_name}</p>
                  <p className={`${styles.tradePrice} regular`}>{parseInt(item.price).toLocaleString()} 원</p>
                  <p className={`${styles.date} regular`}>{dateProcessingDash(item.soldDate)}</p>
                </div>
                <div className={styles.dealmaker}>
                  <div className={styles.tradeNickname}>
                    <Person className={styles.person} />
                    <p><ClampText text={item.seller_nickname} maxCharacters={5}/></p>
                  </div>
                  <div className={`ms-auto ${styles}`}>
                    {(item.buyer_id === item.writer_id) ? (
                      <div className={`${styles.reviewBtn} ${styles.complete} medium`}>작성완료</div>
                    ) : (user.blocked === 1 || item.seller_blocked === 1) ? (
                      <div className={`${styles.reviewBtn} ${styles.block}`}>작성불가</div>
                    ) : (
                      <Link
                        to={{ pathname: `/user/${item.seller_id}/sellerReviewWrite`,
                              search: `?productId=${item.product_id}` }}
                        className={`${styles.reviewBtn} medium`}
                      >
                        작성하기
                      </Link>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
      </div>
      <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
    </div>
  );
}

export default MyBuyList;