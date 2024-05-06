import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { FunnelFill } from 'react-bootstrap-icons';

// 필터링 버튼과 오버레이
function Filtering({
    category,
    filter,
    handleFilter,
    currentCategory,
    handleChange}) {

    return(
        <>
            <OverlayTrigger trigger='click'
            placement='top'
            overlay={
                <Popover className={styles.filter_box}>
                    <input type='checkbox' id='sold'
                    onChange={(e)=>{handleChange(e, null, null)}}
                    checked={filter.sold}/>
                    <label htmlFor='sold' className={styles.filter_label}>판매된 상품 제외</label>
                    <div className={styles.bar}/>
                    <label htmlFor='category_box'>카테고리</label>
                    <div className={styles.filter_input_box} id='category_box'>
                        {
                            category.map((el, i)=>{
                                return(
                                    <span key={el.id}>
                                        <input type='checkbox' id={el.id} 
                                        onChange={(e)=>{handleChange(e, i, el.id)}}
                                        checked={currentCategory===i}/>
                                        <label htmlFor={el.id} className={styles.filter_label}>{el.category_name}</label>
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className='d-flex justify-content-end'>
                        <Button variant='success' id='reset_filter' 
                        onClick={(e)=>{handleFilter(e.currentTarget.id)}}>초기화</Button>
                        <Button variant='secondary' id='apply_filter' 
                        onClick={(e)=>{handleFilter(e.currentTarget.id)}}>적용</Button>
                    </div>
                </Popover>
            }>
                <FunnelFill className={styles.filter_btn}/>
            </OverlayTrigger>
        </>
    )
}

export default Filtering;