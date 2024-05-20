import styles from '../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Navigate, Outlet, useHref, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import UserReviewTag from '../components/user/UserReviewTag.js';
import UserProduct from '../components/user/UserProduct.js';
import TargetUserContext from '../contexts/TargetUserContext.js';
import UserInfo from '../components/user/UserInfo.js';
import { useAuth } from '../contexts/LoginUserContext.js';
import UserReviewList from '../components/user/UserReviewList.js';

function User() {
    const currentUrl = useHref(); // 현재 경로
    const { id } = useParams(); // url에서 가져온 params
    const { user } = useAuth(); // 현재 로그인 한 사용자
    const [targetUserId, setTargetUserId] = useState(id); // 대상 id
    const [targetUsername, setTargetUsername] = useState(''); // 대상 닉네임
    const [isBlocked, setIsBlocked] = useState(false);

    if (user && user.id == id) { // 로그인 한 사용자는 내 페이지로 이동시킴
        return(
            <Navigate to={'/mypage/buyList'}/>
        )
    }

    // 하위 url인지 확인
    let subUrl = currentUrl.includes("product") || currentUrl.includes("review") || currentUrl.includes("sellerReviewWrite") || currentUrl.includes("buyerReviewWrite") || currentUrl.includes("sellerReviewEdit") || currentUrl.includes("buyerReviewEdit");

    return (
        <TargetUserContext.Provider 
        value={{targetUserId, setTargetUserId, targetUsername, setTargetUsername, isBlocked, setIsBlocked}}>
            <Container className={`d-flex justify-content-center ${styles.undrag}`}>
                <section className={styles.user_content}>
                    {
                        (!isBlocked) ?
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
                        : <UserInfo/>
                    }
                </section>
            </Container>
        </TargetUserContext.Provider>
    )
}

export default User;