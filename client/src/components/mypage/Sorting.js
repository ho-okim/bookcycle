import React, { useState } from 'react';
import styles from '../../styles/mypage.module.css';
import { Dropdown } from "react-bootstrap";

function Sorting({ optionName, handleChange, options }) {

  return (
    <Dropdown onSelect={handleChange} className={styles.select}>
      <Dropdown.Toggle>
        {optionName}
      </Dropdown.Toggle>
      <Dropdown.Menu>
      {options.map((option) => (
        <Dropdown.Item key={option.value} id={option.label} eventKey={option.value}>{option.label}</Dropdown.Item>
      ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Sorting;