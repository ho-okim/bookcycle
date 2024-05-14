import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import SellGiveReviewList from "../../components/mypage/SellGiveReviewList";

import styles from "../../styles/mypage.module.css";

function MySellGiveReviewList() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <SellGiveReviewList />
        </div>
      </Container>
    </>
  );
}

export default MySellGiveReviewList;
