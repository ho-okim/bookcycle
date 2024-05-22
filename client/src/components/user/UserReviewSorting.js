import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Clock, Star } from 'react-bootstrap-icons';

function UserReviewSorting({ sortType, typeAscend, order, setOrder }) {

    function handleSort(e) { // 정렬 처리
        let order_id = e.currentTarget.id;
        setOrder((order)=>({...order, name : order_id, ascend : !typeAscend}));
        
        // setOrder만으로도 잘 작동한다면 제거해도 됨
        //navigate(url);
    }
    
    return(
        <OverlayTrigger
        placement='top'
        overlay={
            <Tooltip>{sortType === 'score' ? '평점' : '작성일'} {typeAscend ? '내림차순 보기' : '오름차순 보기'}</Tooltip>
        }
        >
            <div className={styles.sort_box} id={sortType} onClick={(e)=>{handleSort(e)}}>
                {typeAscend ? <ArrowDown/> : <ArrowUp/>}
                {sortType === 'score' ? <Star/> : <Clock/>}
            </div>
        </OverlayTrigger>
    )
}

export default UserReviewSorting;