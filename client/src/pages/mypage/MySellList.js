import Container from "react-bootstrap/Container";

import styles from "../../styles/mypage.module.css";

import TableList from "../../components/mypage/TableList";
import LeftNav from "../../components/mypage/LeftNav";

function MyBuyList() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />

          <div className={styles.content}>
            <p> &gt; 전체 판매 내역</p>
            <TableList />
            <span>1 2 3 4 5 &gt;</span>
          </div>
        </div>
      </Container>
    </>
  );
}

export default MyBuyList;
