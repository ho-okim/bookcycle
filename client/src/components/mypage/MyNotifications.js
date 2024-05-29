import styles from '../../styles/mypage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { dateTimeProcessing } from '../../lib/dateProcessing';
import {Book, Clipboard2Fill, MegaphoneFill, Pencil, PersonFill} from 'react-bootstrap-icons';
import { Table } from 'react-bootstrap';
import { getNotification, readNotification } from '../../api/alert';
import { useAuth } from '../../contexts/LoginUserContext';
import Pagination from './Pagination';

function MyNotifications() {

    const {user} = useAuth();

    const [notification, setNotification] = useState([]); // 내 전체 알림
    const [notReadAlerts, setNotReadAlerts] = useState(0); // 안 읽은 알림 수
    let [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const notificationTotal = notification.length; // 전체 알림 수
    let limit = 10; // 페이지 당 알림 수
    let offset = (currentPage - 1) * limit; // 페이지 시작점

    const navigate = useNavigate();
    const location = useLocation(); // location 객체

    // 내 알림 전체 가져오기
    const getNotificationList = useCallback(async ()=>{
        const res = await getNotification();
        setNotification(res.result);

        // 안 읽은 알림 수 표시
        setNotReadAlerts(res.unread);
    });

    // 알림 클릭시 이동할 link 생성
    function generateRoute(alert) {
        const {id, keyword_id, keyword, target_type, target_id, createdAt, read_or_not} = alert;
        const alertDate = dateTimeProcessing(createdAt);
        let url = '';

        // 키워드별 라우트 설정
        if (keyword_id === 2 || keyword_id === 3 || keyword_id === 6 || keyword_id === 8) {
            url = `/product/detail/${target_id}`;
        } else if (keyword_id === 10) {
            url = `/user/${target_id}`;
        } else if (keyword_id === 4 || keyword_id === 7 || keyword_id === 9 || keyword_id === 11) {
            url = `/board/${target_id}`;
        } else if (keyword_id === 1) {
            url = '/chat';
        } else if (keyword_id === 5) {
            if (alert.seller_id !== alert.writer_id) {
                url = '/mypage/sellGetReviewList';
            } else if (alert.buyer_id !== alert.writer_id) {
                url = '/mypage/buyGetReviewList';
            }
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

        let contentClassName = (read_or_not === 1) ? 
        `${styles.notification_content} ${styles.notification_read}` : `${styles.notification_content}`;

        return(<td 
            className={contentClassName}
            onClick={()=>changeNotifyRead(id, read_or_not, url)}
            >
                <p>{icon} {keyword}</p>
                <p>{alertDate}</p>
            </td>);
    }

    async function changeNotifyRead(id, read_or_not, url) { // 알림 읽음 처리
        if (read_or_not === 0) { // 안 읽었을 때만 호출
            await readNotification(id);
            getNotificationList(); // 알림 다시 가져오기
        }
        navigate(url); // 대상 페이지 이동
    }

    useEffect(()=>{ // 사용자 변경 시 알림 목록 다시 설정
        getNotificationList();
    }, [user]);

    return(
        <div className={styles.content}>
            <Table responsive className={styles.table}>
                <tbody>
                <tr className={styles.notification_info}>
                    <td>
                        <span className={styles.notifications}>전체 알림 : {notification?.length ?? 0}</span>
                        <span className={styles.notifications}>안 읽은 알림 :  {notReadAlerts}</span>
                    </td>
                </tr>
                {
                    (!notification || notification.length === 0) ? 
                    <tr><td><div className={styles.empty}>알림이 없습니다</div></td></tr>
                    :
                    notification.slice(offset, offset+limit).map((el, i)=>{
                        return(
                            <tr key={i}>
                                {
                                    generateRoute(el)
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            <Pagination offset={offset} limit={limit} page={currentPage} total={notificationTotal} setPage={setCurrentPage}/>
        </div>
    )
}

export default MyNotifications;