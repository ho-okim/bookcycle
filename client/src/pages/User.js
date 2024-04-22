import styles from '../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, useParams } from 'react-router-dom';
import Report from '../components/Report.js';
import UserMenu from '../components/user/UserMenu.js';
import UserReviewTag from '../components/user/UserReviewTag.js';
import UserReviewList from '../components/user/UserReviewList.js';
import UserProduct from '../components/user/UserProduct.js';
import TargetUserContext from '../contexts/TargetUserContext.js';
import { getUserInfo } from '../api/user.js';

function User() {

    // url에서 가져온 params
    let {id} = useParams();

    const [targetUserId, setTargetUserId] = useState(id); // 대상 id
    const [userInfo, setUserInfo] = useState({});
    const [modalShow, setModalShow] = useState(false); // modal 표시 여부

    // 이동용 navigate
    const navigate = useNavigate();

    const handleClose = () => { // modal 닫기/숨기기 처리
        if (modalShow) setModalShow(false);
    };

    const handleOpen = () => { // modal 열기 처리
        if (!modalShow) setModalShow(true);
    };

    useEffect(()=>{ // 요청 id가 바뀔때마다 사용자 정보 새로 가져옴
        async function getUser() {
            const res = await getUserInfo(targetUserId);
            setUserInfo(res);
        }
        getUser();

    }, [targetUserId]);

    return(
        <TargetUserContext.Provider value={targetUserId}>
            <Container className='d-flex justify-content-center'>
                <section className={styles.user_menu}>
                    {/* 사용자 메뉴 */}
                    <UserMenu/>
                </section>

                <section className={styles.other_user}>

                    {/* 다른 사용자 정보 */}
                    <Container className={styles.section_sub_box}>
                        <div className='inner'>
                            <Report show={modalShow} handleClose={handleClose}/>
                            <div className={
                                `${styles.user_box} ${styles.box} d-flex justify-content-center align-items-center`
                            }>
                                <div className={styles.image_box}>
                                    <img className={styles.profile_image} src='' alt='프로필'/>
                                </div>
                                <div className={
                                    `${styles.info_box} row justify-content-end align-items-center flex-wrap`
                                }>
                                    <p className={`${styles.user_info} col-4`}>{userInfo.manner_score}☆☆☆☆☆</p>
                                    <Button className={`${styles.user_info} ${styles.report_btn} col-4`} 
                                        variant='outline-danger' onClick={handleOpen}
                                    >🚨신고하기</Button>
                                    <p className={`${styles.user_info} col-4`}>{userInfo.nickname}</p>
                                    <Button className={`${styles.user_info} ${styles.chat_btn} col-4`} 
                                        variant='outline-warning' onClick={()=>{navigate("#")}}
                                    >💬채팅하기</Button>
                                </div>
                            </div>
                        </div>
                    </Container>

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