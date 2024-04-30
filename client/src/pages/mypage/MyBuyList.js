import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import BuyList from "../../components/mypage/BuyList";
import styles from "../../styles/mypage.module.css";

function MyBuyList() {

  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <div className={styles.content}>
            <p> &gt; 전체 구매 내역</p>
            <BuyList />
            <span>1 2 3 4 5 &gt;</span>
          </div>
        </div>
      </Container>
    </>
  );
}

export default MyBuyList;
