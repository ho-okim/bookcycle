import styles from "../styles/error.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import errorType from "../lib/errorType";
import { useEffect, useState } from "react";

function Error() {
  const { errorCode } = useParams();

  const [errorInfo, setErrorInfo] = useState(errorType[0]);

  useEffect(()=>{ // 타이틀 설정
    document.title = "에러";
  }, []);

  useEffect(() => {
    for (let i = 0; i < errorType.length; i++) {
      if (!errorCode) {
        setErrorInfo(errorType[3]);
        break;
      }
      if (errorType[i].type === parseInt(errorCode)) {
        setErrorInfo(errorType[i]);
      }
    }
  }, [errorCode]);

  return (
    <Container>
      <div className="inner">
        <div className={`${styles.error_box} d-flex flex-column`}>
          <div className={styles.title_box}>
            <h2 className={styles.title}>{errorInfo.type}</h2>
          </div>
          <div className={styles.content_box}>
            {errorInfo.message.split("\n").map((message, index) => (
              <p key={index} className={styles.error_message}>{message}</p>
            ))}
            <Button className={`${styles.error_goHome} regular`}>
              <Link to="/" className={styles.goHome}>
                홈으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Error;
