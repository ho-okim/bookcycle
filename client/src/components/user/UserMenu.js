import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container.js';
import { Link } from 'react-router-dom';

function UserMenu() {

    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div className={styles.box}>
                    <p className={styles.username}>
                        <Link to="/mypage">&lt;사용자이름&gt;님</Link>
                    </p>
                    <div className={styles.menu_hr}/>
                    <ul className={styles.menu}>
                        <li><Link to="/mypage/#">판매도서</Link></li>
                        <li><Link to="/mypage/buyReview">구매후기</Link></li>
                    </ul>
                </div>
            </div>
        </Container>
    )
}

export default UserMenu;