import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import BuyGiveReviewList from "../../components/mypage/BuyGiveReviewList";

import styles from "../../styles/mypage.module.css";

function MyBuyGiveReview() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <BuyGiveReviewList />
        </div>
      </Container>
    </>
  );
}

export default MyBuyGiveReview;
