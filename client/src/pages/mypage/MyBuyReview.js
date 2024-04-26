import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import BuyRevList from "../../components/mypage/BuyRevList";

import styles from "../../styles/mypage.module.css";

function MyBuyReview() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <div className={styles.content}>
            <p>총 _개의 구매후기</p>
            <BuyRevList />
            <span>1 2 3 4 5 &gt;</span>
          </div>
        </div>
      </Container>
    </>
  );
}

export default MyBuyReview;
