import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Clock, CurrencyDollar } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useUserProduct } from '../../contexts/UserProductContext';
import { useTargetUser } from '../../contexts/TargetUserContext';

// 정렬 버튼
function ProductSorting({ sortType, typeAscend }) {

    const {targetUserId} = useTargetUser(); // 대상 id

    const navigate = useNavigate();

    const {order, filter, setOrder} = useUserProduct();

    let tooltipName;
    let sortIcon;
    switch (sortType) {
        case 'product_name' :
            tooltipName = '이름';
            sortIcon = <span className={styles.sortType_name}>가</span>;
            break;
        case 'price' :
            tooltipName = '가격';
            sortIcon = <CurrencyDollar/>;
            break;
        case 'createdAt' :
            tooltipName = '등록날짜';
            sortIcon = <Clock/>;
            break;
    }

    function handleSort(e) { // 정렬 처리
        let order_id = e.currentTarget.id;
        setOrder((order)=>({...order, name : order_id, ascend : !typeAscend}));
        
        navigate(`/user/${targetUserId}/product?sold=${filter.sold}&category_id=${filter.category_id}&order=${order_id}&ascend=${!typeAscend}`);
    }
    
    return(
        <OverlayTrigger
        placement='top'
        overlay={
            <Tooltip>{tooltipName} {typeAscend ? '내림차순 보기' : '오름차순 보기'}</Tooltip>
        }
        >
            <div className={styles.sort_box} id={sortType} onClick={(e)=>{handleSort(e);}}>
                {typeAscend ? <ArrowDown/> : <ArrowUp/>}
                {sortIcon}
            </div>
        </OverlayTrigger>
    )
}

export default ProductSorting;