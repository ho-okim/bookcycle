import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Clock, Star } from 'react-bootstrap-icons';

function ReviewSorting({sortType, ascend, handleOrder}) {
    return(
        <OverlayTrigger
        placement='top'
        overlay={
            <Tooltip>{sortType === 'score' ? '평점' : '작성일'} {ascend ? '오름차순' : '내림차순'}</Tooltip>
        }
        >
            <span className={`${styles.sort_box}`} id={sortType} onClick={(e)=>{handleOrder(e)}}>
                {ascend ? <ArrowUp/> : <ArrowDown/>}
                {sortType === 'score' ? <Star/> : <Clock/>}
            </span>
        </OverlayTrigger>
    )
}

export default ReviewSorting;