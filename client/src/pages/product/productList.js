import { Button, Navbar, Container, Nav, useNavigate } from "react-bootstrap";
import { useState, useEffect, Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/font.css";
import style from "../styles/productList.module.css";
import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import ProductDetail from "./ProductDetail.js";


function List(){
    return(
        <Container>
            <div className='inner'>
                <Link to='/productDetail'>
                    <div className='${style.book}'>
                        <div clasName='book-pic-box'>
                            <img className='book-pic-box' src='' alt='사진'/>
                        </div>
                        <div className='book'>
                            <div clasName='booktitle'>
                                제목
                            </div>
                            <div clasName='bookauthor'>
                                저자/출판사/출간일
                            </div>
                            <div clasName='bookprice'>
                                가격
                            </div>
                        </div>
                        <div clasName='booknicname'>
                            닉네임
                        </div>
                    </div>
                </Link>
            </div>
        </Container>
    )
}

function ProductList() {

    /* 페이징 구현 중
        const { id } = useParams();

        const [page, setPage] = useState(1); //페이지
        const limit = 5; // posts가 보일 최대한의 갯수
        const offset = (page-1)*limit; // 시작점과 끝점을 구하는 offset

        const postsData = (posts) => {
        if(posts){
            let result = posts.slice(offset, offset + limit);
            return result;
        }
    }
    */

    return(
        <Container>
            <div className='inner'>
                <div className='column'>
                    <div className='category'>
                        <div className={`${style.box}`}>
                            <ul className='nav-bar'>
                                <li><Link to=''>전체보기</Link></li>
                                <li><Link to='novel'>소설</Link></li>
                                <li><Link to='literature'>문학/인문</Link></li>
                                <li><Link to='history'>역사/철학/심리/교육</Link></li>
                                <li><Link to='development'>자기계발</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
    <div>
        <List/>
    </div>
    </Container>

    )
}

export default ProductList;