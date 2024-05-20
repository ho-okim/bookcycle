import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellList } from '../../api/mypage';  // axios 인스턴스 import
import dateProcessing from '../../lib/dateProcessing.js';
import Pagination from './Pagination.js';

import Table from 'react-bootstrap/Table';
import styles from '../../styles/mypage.module.css';

function MySellList() {

  const [sellItems, setSellItems] = useState([]);
  console.log(sellItems)

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
      <p className={styles.conTitle}> &gt; 전체 판매 내역</p>
      {sellItems.length === 0 ? (
        <div className={styles.empty}>판매내역이 없습니다.</div>
        ) : (
          <>
            <Table responsive>
              <thead className={styles.tradeList}>
                <tr>
                  <th>거래일</th>
                  <th>상품명</th>
                  <th>거래금액</th>
                  <th>구매자</th>
                  <th>리뷰</th>
                </tr>
              </thead>
              <tbody>
                {sellItems.slice(offset, offset + limit).map((item, index) => (
                  <tr key={index}>
                    <td>{dateProcessing(item.soldDate)}</td>
                    <td>{item.product_name}</td>
                    <td>₩{parseInt(item.price).toLocaleString()}</td>
                    <td>
                      <Link to={`/user/${item.buyer_id}`}>{item.buyer_nickname}</Link>
                    </td>
                    <td>
                      {(item.seller_id === item.writer_id) ? (
                          <div className={`${styles.reviewBtn} ${styles.complete}`}>작성완료</div>
                        ) : (
                          <Link
                          to={{
                            pathname: `/user/${item.buyer_id}/buyerReviewWrite`,
                            search: `?productId=${item.product_id}`,
                          }}
                          className={styles.reviewBtn}
                        >
                          작성하기
                        </Link>
                      )}
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

export default MySellList;