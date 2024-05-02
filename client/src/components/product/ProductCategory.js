import React from 'react';
import {Link, useParams} from 'react-router-dom';


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
                <Link to={''} style={{ textDecoration: "none", color: "black"}}>전체보기<br></br></Link>
                <Link to={'/novel'} style={{ textDecoration: "none", color: "black"}}>소설<br></br></Link>
                <Link to={'/literature'} style={{ textDecoration: "none", color: "black"}}>문학/인문<br></br></Link>
                <Link to={'/history'} style={{ textDecoration: "none", color: "black"}}>역사/철학/심리/교육<br></br></Link>
                <Link to={'/develop'} style={{ textDecoration: "none", color: "black"}}>자기계발</Link>
            </ul>
        </div>
    </div>
</div>

    
}

export default ProductCategory;