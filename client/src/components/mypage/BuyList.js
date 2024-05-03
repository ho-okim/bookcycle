import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buyList } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';

import Table from 'react-bootstrap/Table';
import styles from '../../styles/mypage.module.css';

function BuyList() {

  async function getItems(){
    const data = await buyList();
    return data
  }

  const [buyItems, setBuyItems] = useState([]);

  useEffect(() => {
    // Axios 인스턴스를 이용하여 서버로부터 데이터 가져오기
    let items
    const test = async() => {
      items = await getItems()
      setBuyItems(items)
    }
    test()
  }, []);


  return (
    <Table responsive>
      <thead className={styles.buyList}>
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
            <td>{item.seller_nickname}</td>
            <td>
              <Link 
                to={{ 
                  pathname: `/user/${item.seller_id}/reviewWrite`,
                  search: `?productId=${item.id}` 
                }}
                className={styles.reviewBtn}
              >
                리뷰 작성
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default BuyList;