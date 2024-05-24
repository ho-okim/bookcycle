import styles from "../../styles/productList.module.css";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { useProductOption } from "../../contexts/ProductOptionContext";
import { useState } from "react";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/LoginUserContext.js';

function ProductSearchInput() {

    const { user } = useAuth(); // 로그인 한 사용자

    const {searchKeyword, setSearchKeyword} = useProductOption();
    const [optionName, setOptionName] = useState('제목');

    const navigate = useNavigate();

    function handleSelect(eventKey, event) { // 검색 옵션 설정
        event.persist();
        let newType = event.currentTarget.id;
        setSearchKeyword((searchKeyword)=>({...searchKeyword, type : newType}));
        setOptionName(eventKey);
    }

    function handleKeyword(e) { // 검색어 설정
        const newKeyword = e.target.value;
        setSearchKeyword((searchKeyword)=>({...searchKeyword, keyword : newKeyword}));
    }

    function handleSubmit() { // 검색
        navigate(`/product?search=${searchKeyword.keyword}&stype=${searchKeyword.type}`);
    }

    function handleEnter(e) { // 검색하고 엔터 눌러도 검색되도록 설정
        if (e.keyCode == 13) {
            e.preventDefault();
            handleSubmit();
        }
    }

    function handleClick() { // 상품 작성 페이지 이동
        navigate("/product/write");
    }

    return(
        <InputGroup>
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle
                className={styles.search_option_btn}
                id="product_search">
                    {optionName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item id='product_name' eventKey='제목'>제목</Dropdown.Item>
                    <Dropdown.Item id='writer' eventKey='저자'>저자</Dropdown.Item>
                    <Dropdown.Item id='publisher' eventKey='출판사'>출판사</Dropdown.Item>
                    <Dropdown.Item id='nickname' eventKey='등록인'>등록인</Dropdown.Item>
                    <Dropdown.Item id='isbn' eventKey='isbn'>isbn</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Form.Control type="search" id='searchKeyword'
            className={styles.searchKeyword}
            maxLength={50} onChange={(e)=>{handleKeyword(e)}} 
            onKeyDown={(e)=>{handleEnter(e)}}
            autoFocus
            value={searchKeyword.keyword}/>
            <Button onClick={handleSubmit} className={styles.search_confirm_btn}><Search/>검색</Button>
            {
                (user && user.blocked === 0) ?
                <div className="ms-1 ms-sm-2 my-0">
                    <Button className={`${styles.add_btn} h-100`}
                    onClick={handleClick}>책 등록하기</Button>
                </div>
                : null
            }
        </InputGroup>
    )
}

export default ProductSearchInput;