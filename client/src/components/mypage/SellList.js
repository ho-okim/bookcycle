import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sellList } from '../../api/mypage';  // axios 인스턴스 import
import dateProcessing from '../../lib/dateProcessing.js';

import Table from 'react-bootstrap/Table';
import styles from '../../styles/mypage.module.css';

function SellList() {

  async function getItems(){
    const data = await sellList();
    return data
  }

  const [sellItems, setSellItems] = useState([]);

  useEffect(() => {
    // Axios 인스턴스를 이용하여 서버로부터 데이터 가져오기
    let items
    const test = async() => {
      items = await getItems()
      setSellItems(items)
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
        </tr>
      </thead>
      <tbody>
        {sellItems.map((item, index) => (
          <tr key={index}>
            <td>{dateProcessing(item.soldDate)}</td>
            <td>{item.product_name}</td>
            <td>₩{parseInt(item.price).toLocaleString()}</td>
            <td>{item.buyer_nickname}</td>
            <td>{item.seller_nickname}</td>

          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default SellList;