import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext';

function UserMenu() {

    const { user } = useAuth();

    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div className={styles.box}>
                    <p className={styles.username}>
                        {user?.nickname} 님
                    </p>
                    <div className={styles.menu_hr}/>
                        <ul className={styles.menu}>
                            <li><Link to={'/mypage/sellList'}>판매도서</Link></li>
                            <li><Link to={'/mypage/buyReviewList'}>구매후기</Link></li>
                        </ul>
                </div>
            </div>
        </Container>
    )
}

export default UserMenu;