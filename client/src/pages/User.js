import styles from '../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import UserMenu from '../components/user/UserMenu.js';
import UserReviewTag from '../components/user/UserReviewTag.js';
import UserReviewList from '../components/user/UserReviewList.js';
import UserProduct from '../components/user/UserProduct.js';
import TargetUserContext from '../contexts/TargetUserContext.js';
import UserInfo from '../components/user/UserInfo.js';

function User() {

    let currentUrl = window.location.href; // 현재 url

    // url에서 가져온 params
    let {id} = useParams();

    const [targetUserId, setTargetUserId] = useState(id); // 대상 id

    if (currentUrl.includes("product") || currentUrl.includes("review")) {
        return (
            <TargetUserContext.Provider value={targetUserId}>
                <Container className='d-flex justify-content-center'>
                    <section className={styles.user_menu}>
                        {/* 사용자 메뉴 */}
                        <UserMenu/>
                    </section>

                    <section className={styles.other_user}>
                        {/* 다른 사용자 정보 */}
                        <UserInfo/>
                        {/* 구매후기 혹은 판매목록 */}
                        <Outlet/>
                    </section>
                </Container>
            </TargetUserContext.Provider>
        )
    }

    return(
        <TargetUserContext.Provider value={targetUserId}>
            <Container className='d-flex justify-content-center'>
                <section className={styles.user_menu}>
                    {/* 사용자 메뉴 */}
                    <UserMenu/>
                </section>

                <section className={styles.other_user}>
                    {/* 다른 사용자 정보 */}
                    <UserInfo/>
                    {/* "이런 점이 좋았어요" 항목 */}
                    <UserReviewTag/>
                    {/* "구매후기" 항목 */}
                    <UserReviewList/>
                    {/* "판매목록" 항목 */}
                    <UserProduct/>
                </section>
            </Container>
        </TargetUserContext.Provider>
    )
}

export default User;