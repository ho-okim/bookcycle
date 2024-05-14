import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import BuyList from "../../components/mypage/BuyList";
import styles from "../../styles/mypage.module.css";

function MyBuyList() {

  return (
    <>
      <Container>
        <div className={styles.inner}>
          <LeftNav />
          <BuyList />
        </div>
      </Container>
    </>
  );
}

export default MyBuyList;
