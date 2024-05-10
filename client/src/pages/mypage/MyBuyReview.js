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
          <BuyRevList />
        </div>
      </Container>
    </>
  );
}

export default MyBuyReview;
