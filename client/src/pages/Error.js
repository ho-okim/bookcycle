import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/error.module.css';
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import errorType from '../lib/errorType';
import { useEffect, useState } from 'react';

function Error() {

    const {errorCode} = useParams();
    
    const [errorInfo, setErrorInfo] = useState(errorType[0]);

    useEffect(()=>{
        for(let i = 0; i < errorType.length; i++) {
            if (errorType[i].type === parseInt(errorCode)) {
                setErrorInfo((errorInfo)=>(errorType[i]));
            }
        }
    }, [errorCode]);

    return(
        <Container>
            <div className='inner'>
                <div className={styles.box}>
                    <div className={styles.title_box}>
                        <h2 className={styles.title}>{errorInfo.type} 에러</h2>
                    </div>
                    <div className={styles.content_box}>
                        <p className={styles.error_message}>{errorInfo.message}</p>
                        <p className={styles.error_goHome}><Link to="/">홈으로 돌아가기</Link></p>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Error;