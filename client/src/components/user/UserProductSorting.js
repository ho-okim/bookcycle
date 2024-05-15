import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Clock, CurrencyDollar } from 'react-bootstrap-icons';
import { useHref, useNavigate } from 'react-router-dom';
import { useUserProduct } from '../../contexts/UserProductContext';

// 정렬 버튼
function UserProductSorting({ sortType, typeAscend }) {

    const url = useHref();
    const navigate = useNavigate();

    const {order, setOrder} = useUserProduct();

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
        
        // setOrder만으로도 잘 작동한다면 제거해도 됨
        //navigate(url, { state : {order : order} });
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

export default UserProductSorting;