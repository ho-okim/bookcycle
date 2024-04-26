import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import SellList from "../../components/mypage/SellList";

import styles from "../../styles/mypage.module.css";

function MySellList() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <div className={styles.content}>
            <p> &gt; 전체 판매 내역</p>
            <SellList />
            <span>1 2 3 4 5 &gt;</span>
          </div>
        </div>
      </Container>
    </>
  );
}

export default MySellList;
