import {Toast, ToastContainer, Badge} from 'react-bootstrap';
import { useAuth } from "../contexts/LoginUserContext";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import timeCalculator from '../lib/timeCalculator';
import { dateTimeProcessing } from '../lib/dateProcessing';
import {Book, Clipboard2Fill, MegaphoneFill, Pencil, PersonBadge, PersonFill} from 'react-bootstrap-icons';

function Notification({showToast, toggleToast}) {

    const { notification } = useAuth(); // 알림 목록

    const [notifyList, setNotifyList] = useState([]); // 알림 목록 10개 버전
    const [recentNotifiedTime, setRecentNotifiedTime] = useState(''); // 현재 시간과 최근 알림 시간차
    const [notReadAlerts, setNotReadAlerts] = useState(0); // 안 읽은 알림 수

    const navigate = useNavigate();

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

    // 알림 목록 10개만 가져오기
    function getShorterNotifyList() {
        if (notification && notification.length > 0) { // 알림이 있을 때만 동작
            setNotifyList(notification.slice(0, 10));
        }
    }

    function handleClick() { // 더보기 이동
        navigate("/mypage");
    }

    // 알림 클릭시 이동할 link 생성
    function generateRoute(keyword_id, keyword, target, id, alertDate) {
        let url = '';

        if (keyword_id === 2 || keyword_id === 3 || keyword_id === 6 || keyword_id === 8) {
            url = `/product/detail/${id}`;
        } else if (keyword_id === 5 || keyword_id === 10) {
            url = `/user/${id}`;
        } else if (keyword_id === 4 || keyword_id === 7 || keyword_id === 9 || keyword_id === 11) {
            url = `/board/${id}`;
        } else if (keyword_id === 1) {
            url = '/chat';
        }

        let icon;

        if (target === 'product') {
            icon = <Book/>
        } else if (target === 'board') {
            icon = <Clipboard2Fill/>
        } else if (target === 'reply') {
            icon = <Pencil/>
        } else if (target === 'user') {
            icon = <PersonFill/>
        } else if (target === 'report') {
            icon = <MegaphoneFill/>
        }

        return(<Link to={url}>
                <p>{icon} {keyword}</p>
                <p>{alertDate}</p>
                </Link>
        );
    }

    useEffect(()=>{ // 알림에 따라 최근 알림, 안 읽은 알림 설정
        getRecentAlertTime();
        getNotReadAlerts();
    }, [notification]);

    return(
        <ToastContainer className='toast_wrap'>
            <Toast show={showToast} onClose={toggleToast}>
                <Toast.Header>
                    <strong className="me-auto">새 알림 <Badge bg="danger" className='font-size-18px'>{notReadAlerts}</Badge></strong>
                    <small>{recentNotifiedTime}</small>
                    <small><button className="notify_more_btn" onClick={handleClick}>더보기</button></small>
                </Toast.Header>
                <Toast.Body>
                    <div className='notification_box'>
                        {
                            notification.map((el, i)=>{
                                const keyword_id = el.keyword_id;
                                const keyword = el.keyword;
                                const target = el.target_type;
                                const id = el.target_id;
                                const alertDate = dateTimeProcessing(el.createdAt);
                                return(
                                    <div key={i} className='notification_content'>
                                        {
                                            generateRoute(keyword_id, keyword, target, id, alertDate)
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