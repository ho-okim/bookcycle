import styles from '../../styles/verify.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useOutletContext} from 'react-router-dom';

function VerifyNotFound() {

    const count = useOutletContext();

    return(
        <>
            <div className={styles.title_box}>
                <h2 className={styles.title}>인증 메일 오류</h2>
            </div>
            <div className='d-flex justify-content-center'>
                <div className={styles.content_box}>
                    <p>현재 접근 요청한 인증 메일은 <span className={styles.message_highlight}>이미 인증을 완료했거나 존재하지 않는 인증</span>입니다.</p>
                    <p>다시 요청을 진행해주시기 바랍니다.</p>
                    <p><Link className={styles.home_link} to="http://localhost:3000/">홈으로 이동</Link></p>
                    <p>{count}초 후 자동으로 홈으로 이동합니다.</p>
                </div>
            </div>
        </>
    )
}

export default VerifyNotFound;