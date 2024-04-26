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
          <div className={styles.content}>
            <span>1 2 3 4 5 &gt;</span>
            <select>
              <option>최근담은순</option>
              <option>상품명순</option>
              <option>낮은가격순</option>
              <option>높은가격순</option>
              <option>출간일순</option>
            </select>
            <HeartList />
          </div>
        </div>
      </Container>
    </>
  );
}

export default MypageEdit;
