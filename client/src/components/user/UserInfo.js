import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MegaphoneFill, PersonCircle, StarFill } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/esm/Button';
import Report from '../../components/Report.js';
import { getUserInfo } from '../../api/user.js';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import { getReportedOrNot } from '../../api/report.js';
import { useAuth } from '../../contexts/LoginUserContext.js';

function UserInfo() {

    const { user } = useAuth();

    const {targetUserId, setTargetUsername} = useTargetUser(); // 대상 id
    const [userInfo, setUserInfo] = useState({}); // 사용자 정보
    const [modalShow, setModalShow] = useState(false); // modal 표시 여부
    const [isReported, setIsReported] = useState(true); // 신고 여부

    // 이동용 navigate
    const navigate = useNavigate();

    const handleClose = () => { // modal 닫기/숨기기 처리
        if (modalShow) setModalShow(false);
    };

    const handleOpen = () => { // modal 열기 처리
        if (!modalShow) setModalShow(true);
    };

    async function getUser() { // 대상 사용자 정보 가져오기
        const res = await getUserInfo(targetUserId);
        if (res == 'error') {
            //navigate("/error/400");
        }
        setUserInfo(res);
        setTargetUsername(res.nickname);
    }

    async function getReported() { // 신고 여부 확인
        const res = await getReportedOrNot('user', targetUserId);
        console.log(res)
        setIsReported((isReported)=>((res === 0) ? false : true));
    }

    useEffect(()=>{ // 요청 id가 바뀔때마다 사용자 정보 새로 가져옴
        getUser();
    }, [targetUserId]);

    useEffect(()=>{ // 로그인 한 사용자가 신고 했었는지 확인
        if (user) { // 로그인을 했을 때만 호출
            getReported();
        }
    }, [user]);

    function profileImageBox() { // 프로필 이미지 처리
        if (userInfo.profile_image) {
            if (userInfo.profile_image.length != 0) {
                return (<img className={styles.profile_image} src={`${process.env.PUBLIC_URL}/img/profile/${userInfo.profile_image}`} alt='프로필'/>);
            }
        } 
        return(<PersonCircle className={styles.profile_default}/>);
    }

    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div className={
                    `${styles.user_box} ${styles.box} d-flex justify-content-center align-items-center`
                }>
                    <div className={styles.image_box}>
                        {
                            profileImageBox()
                        }
                    </div>
                    <div className={
                        `${styles.info_box} row justify-content-center align-items-center flex-wrap`
                    }>
                        <div className={`${styles.score_box} col-2`}>
                            <p className={styles.manner_score}>
                            {
                                (userInfo.manner_score) ?
                                (userInfo.manner_score).toFixed(1)
                                : '-'
                            }
                            </p>
                            <StarFill className={styles.manner_score_star}/>
                        </div>
                        <p className={`${styles.user_info} col-4`}>{userInfo.nickname}</p>
                    </div>
                    <div className={styles.report_box}>
                        {
                            (!isReported) ?
                            <>
                                <Button className={`${styles.user_info} ${styles.report_btn} col-4`} 
                                variant='outline-danger' onClick={()=>{handleOpen()}}
                                ><MegaphoneFill/> 신고</Button>
                                <Report show={modalShow} handleClose={handleClose} targetId={targetUserId} category={'user'}/>
                            </>
                            : null
                        }
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default UserInfo;