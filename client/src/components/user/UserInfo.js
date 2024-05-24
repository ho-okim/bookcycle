import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MegaphoneFill, PersonCircle, StarFill } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/esm/Button';
import Report from '../../components/Report.js';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import { useAuth } from '../../contexts/LoginUserContext.js';
import UserReviewTag from './UserReviewTag.js';
import { Container } from 'react-bootstrap';

function UserInfo() {

    const { user } = useAuth();

    const {targetUserId, userInfo, isReported} = useTargetUser(); // 대상 id
    const [modalShow, setModalShow] = useState(false); // modal 표시 여부

    // 이동용 navigate
    const navigate = useNavigate();

    const handleClose = () => { // modal 닫기/숨기기 처리
        if (modalShow) setModalShow(false);
    };

    const handleOpen = () => { // modal 열기 처리
        if (!modalShow) setModalShow(true);
    };

    function profileImageBox() { // 프로필 이미지 처리
        if (userInfo.profile_image) {
            if (userInfo.profile_image.length != 0) {
                return (<img className={styles.profile_image} src={`${process.env.PUBLIC_URL}/img/profile/${userInfo.profile_image}`} alt='프로필'/>);
            }
        } 
        return(<PersonCircle className={styles.profile_default}/>);
    }

    // 신고 버튼, 모달, 신고 여부 렌더링
    function renderReport() {
        if (userInfo) {
            if (userInfo.blocked === 1) {
                return(
                <div className={styles.blocked_box}>
                    <span className={styles.blocked}>신고로 인해 사이트에서 정지된 사용자입니다</span>
                </div>)
            }
    
            if(user && user.blocked === 0) {
                if (!isReported) {
                    return(
                        <div className={styles.report_box}>
                            <Button className={`${styles.user_info} ${styles.report_btn} col-4`} 
                            variant='outline-danger' onClick={()=>{handleOpen()}}
                            ><MegaphoneFill/> 신고</Button>
                            <Report show={modalShow} handleClose={handleClose} targetId={targetUserId} category={'user'}/>
                        </div>
                    )
                } else {
                    return(
                        <div className={styles.report_box}>
                            <span className={styles.alread_reported}>신고했어요</span>
                        </div>
                    )
                } 
            }
        }
        return null;
    }

    return(
        <section className={styles.section_box}>
            <Container>
                <div className={`${styles.user_box} d-flex justify-content-center align-items-start flex-wrap`}>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className={
                            `${styles.info_box} row justify-content-center align-items-center flex-wrap`
                        }>
                            <div className={styles.image_box}>
                                {
                                    profileImageBox()
                                }
                            </div>
                            <div className={styles.score_box}>
                                <p className={styles.manner_score}>
                                {
                                    (userInfo.manner_score) ?
                                    (userInfo.manner_score).toFixed(1)
                                    : '-'
                                }
                                </p>
                                <StarFill className={styles.manner_score_star}/>
                            </div>
                            <p className={styles.user_info}>{userInfo.nickname}</p>
                            <div className='text-center'>
                                <span className={styles.sell_count}>판매 : {(userInfo.sell_count)} 권</span>
                                <span>구매 : {(userInfo.buy_count)} 권</span>
                            </div>
                        </div>
                    </div>

                    {
                        (userInfo.blocked === 0) ?
                        <UserReviewTag/>
                        : null
                    }
                    {
                        renderReport()
                    }
                </div>
            </Container>
        </section>
    )
}

export default UserInfo;