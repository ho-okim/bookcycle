import styles from "../../styles/verify.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useOutletContext } from "react-router-dom";

function VerifyConfirmed() {
  const count = useOutletContext();

  return (
    <Container>
      <div className={`inner ${styles.error_box}`}>
        <h2 className={styles.title}>인증 완료</h2>
          <div className={styles.content_box}>
            <p className={styles.error_alert}>이메일 인증이 완료되었습니다!</p>
            <Button className={styles.verify_goHome}>
              <Link
                className={styles.goHome}
                to="http://localhost:3000/login"
                >
                로그인하러 가기
              </Link>
            </Button>
            <p>{count}초 후 자동으로 로그인 화면으로 이동합니다.</p>
          </div>
      </div>
    </Container>
  );
}

export default VerifyConfirmed;
