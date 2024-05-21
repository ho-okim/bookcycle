import styles from '../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useHref, useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import UserReviewTag from '../components/user/UserReviewTag.js';
import UserProduct from '../components/user/UserProduct.js';
import TargetUserContext from '../contexts/TargetUserContext.js';
import UserInfo from '../components/user/UserInfo.js';
import { useAuth } from '../contexts/LoginUserContext.js';
import UserReviewList from '../components/user/UserReviewList.js';
import { getReportedOrNot } from '../api/report.js';
import { getUserInfo } from '../api/user.js';

function User() {
    const currentUrl = useHref(); // 현재 경로
    const { id } = useParams(); // url에서 가져온 params
    const { user } = useAuth(); // 현재 로그인 한 사용자
    const [targetUserId, setTargetUserId] = useState(id); // 대상 사용자 id
    const [userInfo, setUserInfo] = useState({}); // 사용자 정보
    const [isReported, setIsReported] = useState(true); // 내가 해당 사용자를 신고한 여부

    useEffect(()=>{ // 요청 id가 바뀔때마다 사용자 정보 새로 가져옴
        async function getTargetUser() { // 대상 사용자 정보 가져오기
            const res = await getUserInfo(targetUserId);
            if (res == 'error') {
                //navigate("/error/400");
            }
            setUserInfo(res);
        }

        getTargetUser();
    }, [targetUserId]);

    useEffect(()=>{ // 로그인 한 사용자가 신고 했었는지 확인
        async function getReported() { // 신고 여부 확인
            const res = await getReportedOrNot('user', targetUserId);
            setIsReported((isReported)=>((res === 0) ? false : true));
        }

        if (user) { // 로그인을 했을 때만 호출
            getReported();
        }
    }, [user]);

    if (user && user.id === parseInt(id)) { // 로그인 한 사용자는 내 페이지로 이동시킴
        return(<Navigate to={'/mypage/buyList'}/>)
    }

    // 하위 url인지 확인
    let subUrl = currentUrl.includes("product") || currentUrl.includes("review") || currentUrl.includes("sellerReviewWrite") || currentUrl.includes("buyerReviewWrite") || currentUrl.includes("sellerReviewEdit") || currentUrl.includes("buyerReviewEdit");

    return (
        <TargetUserContext.Provider 
        value={{targetUserId, setTargetUserId, userInfo, isReported}}>
            <Container className={`d-flex justify-content-center ${styles.undrag}`}>
                <section className={styles.user_content}>
                    {
                        (userInfo.blocked === 0) ?
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