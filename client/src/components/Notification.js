import styles from '../styles/notification.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Toast, ToastContainer, Badge} from 'react-bootstrap';
import { useAuth } from "../contexts/LoginUserContext";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import timeCalculator from '../lib/timeCalculator';
import { dateTimeProcessing } from '../lib/dateProcessing';
import {Book, Clipboard2Fill, MegaphoneFill, Pencil, PersonFill} from 'react-bootstrap-icons';
import { readNotification } from '../api/alert';

function Notification({showToast, setShowToast, toggleToast}) {

    const { getUserNotification, notification } = useAuth(); // 알림 목록

    const [recentNotifiedTime, setRecentNotifiedTime] = useState('없음'); // 현재 시간과 최근 알림 시간차
    const [notReadAlerts, setNotReadAlerts] = useState(0); // 안 읽은 알림 수

    const navigate = useNavigate();
    const location = useLocation(); // location 객체

    // 최근 메시지 시간 설정
    function getRecentAlertTime() {
        if (notification && notification.length > 0) { // 알림이 있을 때만 동작
            const recentAlert = new Date(notification[0].createdAt); // 가장 최근 알림
            const timeAgo = timeCalculator(recentAlert); // 현재 시간과 최근 알림 시간차 계산
            setRecentNotifiedTime(timeAgo);
        }
    }

    // 안 읽은 알림 수 표시
    function getNotReadAlerts() {
        if (notification && notification.length > 0) { // 알림이 있을 때만 동작
            let count = 0;
            for(let i = 0; i < notification.length; i++) {
                if (notification[i].read_or_not === 0) {
                    count++;
                }
            }
            setNotReadAlerts(count);
        }
    }

    function handleClick() { // 더보기 이동
        navigate("/mypage/notifications");
    }

    // 알림 클릭시 이동할 link 생성
    function generateRoute(alert) {
        const {id, keyword_id, keyword, target_type, target_id, createdAt, read_or_not} = alert;
        const alertDate = dateTimeProcessing(createdAt);
        let url = '';

        // 키워드별 라우트 설정
        if (keyword_id === 2 || keyword_id === 3 || keyword_id === 6 || keyword_id === 8) {
            url = `/product/detail/${target_id}`;
        } else if (keyword_id === 5 || keyword_id === 10) {
            url = `/user/${target_id}`;
        } else if (keyword_id === 4 || keyword_id === 7 || keyword_id === 9 || keyword_id === 11) {
            url = `/board/${target_id}`;
        } else if (keyword_id === 1) {
            url = '/chat';
        }

        let icon; // 아이콘

        // 타겟 별 아이콘 설정
        if (target_type === 'product') {
            icon = <Book/>
        } else if (target_type === 'board') {
            icon = <Clipboard2Fill/>
        } else if (target_type === 'reply') {
            icon = <Pencil/>
        } else if (target_type === 'user') {
            icon = <PersonFill/>
        } else if (target_type === 'report') {
            icon = <MegaphoneFill/>
        }

        return(<div className={(read_or_not === 1) ? `${styles.notification_read}` : null}
                onClick={()=>changeNotifyRead(id, read_or_not, url)}>
                <p>{icon} {keyword}</p>
                <p>{alertDate}</p>
                </div>
        );
    }

    async function changeNotifyRead(id, read_or_not, url) { // 알림 읽음 처리
        if (read_or_not === 0) { // 안 읽었을 때만 호출
            await readNotification(id);
            await getUserNotification();
        }
        navigate(url); // 대상 페이지 이동
    }
    
    useEffect(()=>{ // 알림에 따라 최근 알림, 안 읽은 알림 설정
        getRecentAlertTime();
        getNotReadAlerts();
    }, [notification]);

    useEffect(()=>{ // 창 이동때마다 알림 닫기
        setShowToast(false);
    }, [location]);    

    return(
        <ToastContainer className={styles.toast_wrap}>
            <Toast show={showToast} onClose={toggleToast} className={styles.toast}>
                <Toast.Header>
                    <strong className="me-auto">새 알림 <Badge bg="danger">{notReadAlerts}</Badge></strong>
                    <small>최근 알림 : {recentNotifiedTime}</small>
                    <small><button className={styles.notify_more_btn} onClick={handleClick}>더보기</button></small>
                </Toast.Header>
                <Toast.Body>
                    <div className={styles.notification_box}>
                        {
                            notification.map((el, i)=>{
                                return(
                                    <div key={i} className={styles.notification_content}>
                                        {
                                            generateRoute(el)
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}
export default Notification;