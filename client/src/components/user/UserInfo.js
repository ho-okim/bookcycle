import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/esm/Button';
import Report from '../../components/Report.js';
import { getUserInfo } from '../../api/user.js';
import TargetUserContext from '../../contexts/TargetUserContext.js';

function UserInfo() {

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

    const targetUserId = useContext(TargetUserContext);

    useEffect(()=>{ // 요청 id가 바뀔때마다 사용자 정보 새로 가져옴
        async function getUser() {
            const res = await getUserInfo(targetUserId);
            setUserInfo(res);
        }
        getUser();

    }, [targetUserId]);

    return(
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
                            variant='outline-info' onClick={()=>{navigate("#")}}
                        >💬채팅하기</Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default UserInfo;