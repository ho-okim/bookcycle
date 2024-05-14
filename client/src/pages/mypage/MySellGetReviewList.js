import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import SellGetReviewList from "../../components/mypage/SellGetReviewList";

import styles from "../../styles/mypage.module.css";

function MySellReview() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <SellGetReviewList />
        </div>
      </Container>
    </>
  );
}

export default MySellReview;
