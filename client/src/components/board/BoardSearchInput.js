import styles from "../../styles/board.module.css";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function BoardSearchInput({searchKeyword, setSearchKeyword}) {

    const [optionName, setOptionName] = useState('작성자');

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
        navigate(`/board?search=${searchKeyword.keyword}&stype=${searchKeyword.type}`);
    }

    function handleEnter(e) { // 검색하고 엔터 눌러도 검색되도록 설정
        if (e.keyCode == 13) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return(
        <InputGroup className={styles.input_group}>
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle
                className={styles.search_option_btn}
                id="board_search">
                    {optionName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item id='writer' eventKey='작성자'>작성자</Dropdown.Item>
                    <Dropdown.Item id='titleContent' eventKey='제목내용'>제목 + 내용</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Form.Control type="search" id='searchKeyword'
                className={styles.searchKeyword}
                maxLength={50} onChange={(e)=>{handleKeyword(e)}} 
                onKeyDown={(e)=>{handleEnter(e)}}
                autoFocus/>
            <Button onClick={handleSubmit} className={styles.search_confirm_btn}><Search/></Button>
        </InputGroup>
    )
}

export default BoardSearchInput;