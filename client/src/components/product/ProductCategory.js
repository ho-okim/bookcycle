import { useEffect, useState } from 'react';
import styles from "../../styles/productList.module.css";
import { getCategory } from '../../api/product';
import { useProductOption } from '../../contexts/ProductOptionContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

function ProductCategory() {

    const location = useLocation(); // location 객체
    const [searchParams, setSearchParams] = useSearchParams(); // 현재 page
    const {order, filter, setFilter} = useProductOption();
    const [category, setCategory] = useState([]); // 카테고리

    const navigate = useNavigate();

    useEffect(()=>{
        async function getCategoryData() {
            const res = await getCategory(); // 카테고리 가져오기
            setCategory(res);
        }
        getCategoryData();
    }, []);

    function handleFilter(e) { // 필터의 카테고리 id 변경
        const id = e.currentTarget.id;
        setFilter((filter)=>({...filter, category_id : parseInt(id)}));

        let newUrl = '/productList';
        if (location.search && !searchParams.get("page")) {
            newUrl += location.search;
        }
        
        navigate(newUrl,  { state : {filter : {category_id : parseInt(id)}} });
    }

    return(
        <div className={styles.category_box}>
            <ul className={styles.category_list}>
                <li className={styles.category}>
                    <button id={0} 
                    className={styles.category_btn} 
                    onClick={(e)=>{handleFilter(e)}}
                    disabled={filter.category_id === 0}>
                        전체보기
                    </button>
                </li>
                {
                    category.map((el) => {
                        return(
                            <li key={el.id} className={styles.category}>
                                <button className={styles.category_btn} 
                                id={el.id} 
                                onClick={(e)=>{handleFilter(e)}}
                                disabled={filter.category_id === el.id}>
                                    {el.category_name}
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default ProductCategory;