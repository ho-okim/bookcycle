import Container from "react-bootstrap/Container";
import styles from "../../styles/mypage.module.css";

import LeftNav from "../../components/mypage/LeftNav";
import RevList from "../../components/mypage/RevList";

function MyBuyReview() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />

          <div className={styles.content}>
            <p>총 _개의 판매후기</p>
            <RevList />
            <span>1 2 3 4 5 &gt;</span>
          </div>
        </div>
      </Container>
    </>
  );
}

export default MyBuyReview;
