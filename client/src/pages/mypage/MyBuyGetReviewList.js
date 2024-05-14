import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import BuyGetReviewList from "../../components/mypage/BuyGetReviewList";

import styles from "../../styles/mypage.module.css";

function MyBuyGiveReview() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <BuyGetReviewList />
        </div>
      </Container>
    </>
  );
}

export default MyBuyGiveReview;
