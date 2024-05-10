import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import SellRevList from "../../components/mypage/SellRevList";

import styles from "../../styles/mypage.module.css";

function MySellReview() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <SellRevList />
        </div>
      </Container>
    </>
  );
}

export default MySellReview;
