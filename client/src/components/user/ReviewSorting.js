import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Clock, Star } from 'react-bootstrap-icons';
import { useUserReview } from '../../contexts/UserReviewContext';

function ReviewSorting({sortType, typeAscend, handleOptionClick}) {
    
    const {order, setOrder} = useUserReview();

    function handleSort(e) { // 정렬 처리
        let order_id = e.currentTarget.id;
        setOrder((order)=>({...order, name : order_id, ascend : !typeAscend}));
        // 문제 -- url이 이전 state로 생성되어 현재 state와 차이가 있음
        handleOptionClick();
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