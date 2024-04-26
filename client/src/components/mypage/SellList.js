import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sellList } from '../../api/mypage';  // axios 인스턴스 import

import Table from 'react-bootstrap/Table';
import styles from '../../styles/mypage.module.css';

function SellList() {

  const { id } = useParams();

  async function getItems(){
    const data = await sellList(id)
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

  console.log("TableList : " , sellItems)

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
            <td>{item.soldDate}</td>
            <td>{item.product_name}</td>
            <td>₩{parseInt(item.price).toLocaleString()}</td>
            <td>{item.buyer_id}</td>
            <td>{item.seller_id}</td>

          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default SellList;