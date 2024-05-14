import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import SellList from "../../components/mypage/SellList";

import styles from "../../styles/mypage.module.css";

function MySellList() {
  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <SellList />
        </div>
      </Container>
    </>
  );
}

export default MySellList;
