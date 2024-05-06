import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Clock, CurrencyDollar } from 'react-bootstrap-icons';

// 정렬 버튼
function ProductSorting({sortType, ascend, handleOrder}) {

    let tooltipName;
    let sortIcon;
    switch (sortType) {
        case 'createdAt' :
            tooltipName = '등록날짜';
            sortIcon = <span className={styles.sortType_name}>가</span>;
            break;
        case 'price' :
            tooltipName = '가격';
            sortIcon = <CurrencyDollar/>;
            break;
        case 'product_name' :
            tooltipName = '이름';
            sortIcon = <Clock/>;
            break;
    }

    return(
        <OverlayTrigger
        placement='top'
        overlay={
            <Tooltip>{tooltipName} {ascend ? '오름차순' : '내림차순'}</Tooltip>
        }
        >
            <span className={styles.sort_box} id={sortType} onClick={(e)=>{handleOrder(e)}}>
                {ascend ? <ArrowUp/> : <ArrowDown/>}
                {sortIcon}
            </span>
        </OverlayTrigger>
    )
}

export default ProductSorting;