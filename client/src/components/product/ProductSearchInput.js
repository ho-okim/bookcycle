import styles from "../../styles/productList.module.css";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { useProductOption } from "../../contexts/ProductOptionContext";
import { useState } from "react";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function ProductSearchInput() {

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

    function handleSubmit() {
        navigate(`/productList?search=${searchKeyword.keyword}&stype=${searchKeyword.type}`);
    }

    return(
        <InputGroup className="mb-3">
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
                </Dropdown.Menu>
            </Dropdown>
            <Form.Control id='searchKeyword' maxLength={50} onChange={(e)=>{handleKeyword(e)}}/>
            <Button onClick={handleSubmit} className={styles.search_confirm_btn}><Search/>검색</Button>
        </InputGroup>
    )
}

export default ProductSearchInput;