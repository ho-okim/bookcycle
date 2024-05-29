import styles from "../../styles/verify.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useOutletContext } from "react-router-dom";

function VerifyError() {
  const count = useOutletContext();

  return (
    <Container>
      <div className={`inner ${styles.error_box}`}>
        <h2 className={styles.title}>인증 에러 발생</h2>
        <div className={styles.content_box}>
            <p className={styles.error_alert}>
              인증 과정에서 에러가 발생했습니다
            </p>
            <p>다시 요청을 진행해주시기 바랍니다</p>
            <Button className={styles.verify_goHome}>
              <Link className={styles.goHome} to="/">
                홈으로 돌아가기
              </Link>
            </Button>
            <p>{count}초 후 자동으로 홈으로 이동합니다</p>
        </div>
      </div>
    </Container>
  );
}

export default VerifyError;
