import styles from '../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import UserMenu from '../components/user/UserMenu.js';
import UserReviewTag from '../components/user/UserReviewTag.js';
import UserReviewList from '../components/user/UserReviewList.js';
import UserProduct from '../components/user/UserProduct.js';
import TargetUserContext from '../contexts/TargetUserContext.js';
import UserInfo from '../components/user/UserInfo.js';
import { useAuth } from '../contexts/LoginUserContext.js';

function User() {

    const currentUrl = window.location.href; // 현재 url
    const { id } = useParams(); // url에서 가져온 params
    const { user } = useAuth(); // 현재 로그인 한 사용자
    const [targetUserId, setTargetUserId] = useState(id); // 대상 id

    if (user && user.id == id) {
        return(
            <Navigate to={`/mypage/${user.id}/buyList`}/>
        )
    }

    let subUrl = currentUrl.includes("product") || currentUrl.includes("review");

    let boxStyle = subUrl ? 'd-flex justify-content-center' : 'd-flex justify-content-between';

        return (
            <TargetUserContext.Provider value={targetUserId}>
                <Container className={boxStyle}>
                    <section className={styles.user_menu}>
                        {/* 사용자 메뉴 */}
                        <UserMenu/>
                    </section>
                    <section className={styles.other_user}>
                        {
                            (subUrl) ?
                            <>
                                <UserInfo/>
                                <Outlet/>
                            </>
                            :
                            <>
                                <UserInfo/>
                                <UserReviewTag/>
                                <UserReviewList/>
                                <UserProduct/>
                            </>
                        }
                    </section>
                </Container>
            </TargetUserContext.Provider>
        )
}

export default User;