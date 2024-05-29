import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buyList } from '../../api/mypage';
import Pagination from './Pagination.js';
import { dateProcessingDash } from '../../lib/dateProcessing.js';

import { Table } from 'react-bootstrap';
import styles from '../../styles/mypage.module.css';
import { useAuth } from '../../contexts/LoginUserContext.js';


function MyBuyList() {
  const {user} = useAuth(); // 로그인 한 사용자

  const [buyItems, setBuyItems] = useState([]);

  let total = buyItems.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
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
      {buyItems.length === 0 ? (
        <div className={styles.empty}>구매내역이 없습니다.</div>
        ) : (
          <>
            <Table responsive className={styles.table}>
              <thead className={styles.tradeList}>
                <tr>
                  <th>거래일</th>
                  <th>상품명</th>
                  <th>거래금액</th>
                  <th>판매자</th>
                  <th>리뷰</th>
                </tr>
              </thead>
              <tbody>
                {buyItems.slice(offset, offset + limit).map((item, index) => (
                  <tr key={index}>
                    <td>{dateProcessingDash(item.soldDate)}</td>
                    <td>{item.product_name}</td>
                    <td>₩{parseInt(item.price).toLocaleString()}</td>
                    <td><Link to={`/user/${item.seller_id}`}  className={styles.buy_seller}>{item.seller_nickname}</Link></td>
                    <td>
                      {(item.buyer_id === item.writer_id) ? (
                        <div className={`${styles.reviewBtn} ${styles.complete}`}>작성완료</div>
                      ) : (user.blocked=== 0) ?
                      (
                        <Link
                          to={{ pathname: `/user/${item.seller_id}/sellerReviewWrite`,
                                search: `?productId=${item.product_id}` }}
                          className={styles.reviewBtn}
                        >
                          작성하기
                        </Link>
                      ) : <div className={`${styles.reviewBtn} ${styles.complete}`}>작성불가</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
          </>
        )}
    </div>
  );
}

export default MyBuyList;