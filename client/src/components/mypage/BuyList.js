import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buyList } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';

import Table from 'react-bootstrap/Table';
import styles from '../../styles/mypage.module.css';

function BuyList() {
  const [buyItems, setBuyItems] = useState([]);

  useEffect(() => {
    async function getItems(){
      try {
        const data = await buyList();
        setBuyItems(data);
      } catch (error) {
        console.error('buyList 데이터를 가져오는 중 에러 발생: ', error);
        setBuyItems([]); // 에러 발생 시 빈 배열 저장
      }
    }
    getItems();
  }, []);

  console.log(buyItems)


  return (
    <Table responsive>
      <thead className={styles.tradeList}>
        <tr>
          <th>거래일</th>
          <th>상품명</th>
          <th>거래금액</th>
          <th>구매자</th>
          <th>판매자</th>
          <th>리뷰</th>
        </tr>
      </thead>
      <tbody>
        {buyItems.map((item, index) => (
          <tr key={index}>
            <td>{dateProcessing(item.soldDate)}</td>
            <td>{item.product_name}</td>
            <td>₩{parseInt(item.price).toLocaleString()}</td>
            <td>{item.buyer_nickname}</td>
            <td>
              <Link to={`/user/${item.seller_id}`}>{item.seller_nickname}</Link>
            </td>
            <td>
              {(item.content !== null) ? (
                <div className={`${styles.reviewBtn} ${styles.complete}`}>작성완료</div>
              ) : (
                <Link
                to={{
                  pathname: `/user/${item.seller_id}/reviewWrite`,
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
  );
}

export default BuyList;