import styles from "../../styles/verify.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useOutletContext } from "react-router-dom";

function VerifyExpired() {
  const count = useOutletContext();

  return (
    <Container>
      <div className={`inner ${styles.error_box}`}>
        <h2 className={styles.title}>인증 메일 만료</h2>
        <div className={styles.content_box}>
          <div>
            현재 접근 요청한 인증 메일은{" "}
            <span className={styles.message_highlight}>
              기간이 만료된 이메일
            </span>
            입니다.
            <p>다시 요청을 진행해주시기 바랍니다.</p>
          </div>
          <Button className={styles.verify_goHome}>
            <Link className={styles.goHome} to="/">
              홈으로 돌아가기
            </Link>
          </Button>
          <p>{count}초 후 자동으로 홈으로 이동합니다.</p>
        </div>
      </div>
    </Container>
  );
}

export default VerifyExpired;
