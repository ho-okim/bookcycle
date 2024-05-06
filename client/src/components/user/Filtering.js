import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { FunnelFill } from 'react-bootstrap-icons';

// 필터링 버튼과 오버레이
function Filtering({
    category,
    filter, setFilter,
    handleFilter,
    searchParams
    }) {

    const [currentCategory, setCurrentCategory] = useState(searchParams.get("category_id")-1); // 현재 선택된 카테고리

    function handleFilterBtn(targetIdName) {
        if (targetIdName === 'reset_filter') {
            setFilter((filter)=>({...filter, sold : null, category_id : 0}));
            setCurrentCategory(-1);
            return;
        }
        handleFilter(); // 이동처리
    }

    function handleSoldChange(event) { // 판매여부 선택 수정
        const isSold = event.currentTarget.id === 'sold' ? true : false;

        if (event.target.checked) {
            setFilter((filter)=>({...filter, sold : isSold}));
        }
    }

    function handleCategoryChange(event, index, category_id) { // 카테고리 선택 수정
        if (!index && !category_id) {
            setFilter((filter)=>({...filter, sold : filter.sold}));
        } else {
            if (event.target.checked) {
                setFilter((filter)=>({...filter, category_id : category_id}));
                setCurrentCategory(index);
            }
        }
    }

    return(
        <>
            <OverlayTrigger trigger='click'
            placement='top'
            overlay={
                <Popover className={styles.filter_box}>
                    <input type='checkbox' id='not_sold'
                    onChange={(e)=>{handleSoldChange(e)}}
                    checked={filter.sold === false ? true : false}/>
                    <label htmlFor='not_sold' className={styles.filter_label}>판매된 상품 제외</label>
                    <input type='checkbox' id='sold'
                    onChange={(e)=>{handleSoldChange(e)}}
                    checked={filter.sold ? true : false}/>
                    <label htmlFor='sold' className={styles.filter_label}>판매된 상품만</label>

                    <div className={styles.bar}/>

                    <label htmlFor='category_box'>카테고리</label>
                    <div className={styles.filter_input_box} id='category_box'>
                        {
                            category.map((el, i)=>{
                                return(
                                    <span key={el.id}>
                                        <input type='checkbox' id={el.id} 
                                        onChange={(e)=>{handleCategoryChange(e, i, el.id)}}
                                        checked={(currentCategory)===i}/>
                                        <label htmlFor={el.id} className={styles.filter_label}>{el.category_name}</label>
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className='d-flex justify-content-end'>
                        {
                            !(filter.sold === null && parseInt(filter.category_id) === 0) ?
                            <Button variant='success' id='reset_filter' 
                            onClick={(e)=>{handleFilterBtn(e.currentTarget.id)}}>초기화</Button>
                            : null
                        }
                        
                        <Button variant='secondary' id='apply_filter' 
                        onClick={(e)=>{handleFilterBtn(e.currentTarget.id)}}>적용</Button>
                    </div>
                </Popover>
            }>
                <div className={styles.filter_icon}><FunnelFill className={styles.filter_btn}/></div>
            </OverlayTrigger>
        </>
    )
}

export default Filtering;