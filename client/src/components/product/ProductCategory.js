import React from 'react';
import {Link, useParams} from 'react-router-dom';
import style from "../../styles/productList.module.css";


export const productcate=[
    {id : 0, text: '전체보기', name : '/'},
    {id : 1, text: '문학', name : 'literature'},
    {id : 2, text: '철학', name : 'philosophy'},
    {id : 3, text: '종교', name : 'religion'},
    {id : 4, text: '사회과학', name : 'social'},
    {id : 5, text: '자연과학', name : 'natural'},
    {id : 6, text: '기술과학', name : 'technology'},
    {id : 7, text: '예술', name : 'art'},
    {id : 8, text: '언어', name : 'language'},
    {id : 9, text: '역사', name : 'history'},
    {id : 10, text: '인문/교양', name : 'culture'},
    {id : 11, text: '컴퓨터/모바일', name : 'computer'},
];



function ProductCategory(props) {

    <div className='column'>
    <div className={`${style.category}`}>
        <div className={`${style.box}`}>
           <ul className='nav-bar'>
                {['전체보기', '문학', '철학', '종교', '사회과학', '자연과학', '기술과학', '예술', '언어', '역사', '인문/교양', '컴퓨터/모바일'].map(cate=>{
                    return(
                        <li key={cate} className={ProductCategory === cate ? 'productLinkOn': 'productLink'}>
                            <Link to ={`/productList/${cate}`}>{cate}</Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>
</div>

    
}

export default ProductCategory;