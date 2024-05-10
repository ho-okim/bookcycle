import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import HeartList from "../../components/mypage/HeartList";

import styles from "../../styles/mypage.module.css";

function MypageEdit() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <HeartList />
        </div>
      </Container>
    </>
  );
}

export default MypageEdit;
