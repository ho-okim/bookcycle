import styles from '../../styles/verify.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useOutletContext} from 'react-router-dom';

function VerifyError() {

    const count = useOutletContext();

    return(
        <>
            <div className={styles.title_box}>
                <h2 className={styles.title}>인증 에러 발생</h2>
            </div>
            <div className='d-flex justify-content-center'>
                <div className={styles.content_box}>
                    <p className={styles.error_alert}>인증 과정에서 에러가 발생했습니다.</p>
                    <p>다시 요청을 진행해주시기 바랍니다.</p>
                    <p><Link className={styles.home_link} to="http://localhost:3000/">
                        홈으로 돌아가기
                    </Link></p>
                    <p>{count}초 후 자동으로 홈으로 이동합니다.</p>
                </div>
            </div>
        </>
    )
}

export default VerifyError;