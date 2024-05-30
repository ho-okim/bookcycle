import styles from '../../styles/mypage.module.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellList } from '../../api/mypage';
import { useAuth } from '../../contexts/LoginUserContext.js';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import Pagination from './Pagination.js';
import ClampText from './ClampText.js';
import { PersonFill } from 'react-bootstrap-icons';

function MySellList() {
  const {user} = useAuth(); // 로그인 한 사용자

  const [sellItems, setSellItems] = useState([]);

  let total = sellItems.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getItems(){
      try {
        const data = await sellList();
        setSellItems(data[0]);
      } catch (error) {
        console.error('sellList 데이터를 가져오는 중 에러 발생: ', error);
        setSellItems([]);
      }
    }
    getItems();
  }, []);

  return (
    <div className={styles.content}>
      <p className={styles.contentHeader}> &gt; 전체 판매 내역</p>
      <div className={styles.tradeList}>
        {sellItems.length === 0 ? (
          <div className={styles.empty}>판매내역이 없습니다.</div>
          ) : (
            sellItems.slice(offset, offset + limit).map((item, index) => (
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
                  <p className={`${styles.tradePrice} regular`}>{parseInt(item.price).toLocaleString()}원</p>
                  <p className={`${styles.date} regular`}>{dateProcessingDash(item.soldDate)}</p>
                </div>
                <div className={styles.dealmaker}>
                  <div className={styles.tradeNickname}>
                    <PersonFill className={styles.person} />
                    <p><ClampText text={item.buyer_nickname} maxCharacters={5}/></p>
                  </div>
                  <div className={`ms-auto`}>
                    {(item.seller_id === item.writer_id) ? (
                      <div className={`${styles.reviewBtn} ${styles.complete} medium`}>작성완료</div>
                    ) : (user.blocked === 0) ?
                    (
                      <Link
                        to={{ pathname: `/user/${item.buyer_id}/buyerReviewWrite`,
                              search: `?productId=${item.product_id}` }}
                        className={`${styles.reviewBtn} medium`}
                      >
                        작성하기
                      </Link>
                    ) : <div className={`${styles.reviewBtn} ${styles.block}`}>작성불가</div>}
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

export default MySellList;