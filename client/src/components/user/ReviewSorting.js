import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Clock, Star } from 'react-bootstrap-icons';
import { useUserReview } from '../../contexts/UserReviewContext';
import { useTargetUser } from '../../contexts/TargetUserContext';
import { useNavigate } from 'react-router-dom';

function ReviewSorting({ sortType, typeAscend }) {
    
    const {targetUserId} = useTargetUser(); // 대상 id

    const {order, setOrder } = useUserReview();

    const navigate = useNavigate();

    function handleSort(e) { // 정렬 처리
        let order_id = e.currentTarget.id;
        setOrder((order)=>({...order, name : order_id, ascend : !typeAscend}));
        navigate(`/user/${targetUserId}/review?order=${order_id}&ascend=${!typeAscend}`);
    }
    
    return(
        <OverlayTrigger
        placement='top'
        overlay={
            <Tooltip>{sortType === 'score' ? '평점' : '작성일'} {typeAscend ? '내림차순 보기' : '오름차순 보기'}</Tooltip>
        }
        >
            <span className={styles.sort_box} id={sortType} onClick={(e)=>{handleSort(e)}}>
                {typeAscend ? <ArrowDown/> : <ArrowUp/>}
                {sortType === 'score' ? <Star/> : <Clock/>}
            </span>
        </OverlayTrigger>
    )
}

export default ReviewSorting;