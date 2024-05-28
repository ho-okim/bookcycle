import styles from "../../styles/board.module.css";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { useProductOption } from "../../contexts/ProductOptionContext";
import { useState } from "react";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/LoginUserContext.js';

function BoardSearchInput() {

  const { user } = useAuth(); 

  const {searchKeyword, setSearchKeyword} = useState('');
  const [optionName, setOptionName] = useState('작성자');

  function handleSelect(){}

  function handleKeyword(){}

  function handleEnter(){}

  function handleSubmit(){}

  return(
    <InputGroup>
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