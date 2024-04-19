import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { buyList } from '../../api/mypage';  // axios 인스턴스 import

function TableList() {

  async function getItems(){
    const data = await buyList()
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

  console.log("TableList : " , buyItems)

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>거래일</th>
          <th>상품명</th>
          <th>거래금액</th>
          <th>구매자</th>
          <th>판매자</th>
          <th>리뷰</th>
          {/* MyBuyList에만 나타나게.. */}
        </tr>
      </thead>
      <tbody>
        {buyItems.map((item, index) => (
          <tr key={index}>
            <td>{item.soldDate}</td>
            <td>{item.product_name}</td>
            <td>₩{parseInt(item.price).toLocaleString()}</td>
            <td>{item.buyer_id}</td>
            <td>{item.seller_id}</td>
            <td><button>리뷰 작성</button></td>
            {/* MyBuyList에만 나타나게.. */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableList;