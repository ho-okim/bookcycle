import React, { useState } from 'react';
import styles from '../../styles/mypage.module.css';
import { Dropdown } from "react-bootstrap";

function Sorting({ optionName, handleChange, options }) {

  return (
    <Dropdown className={styles.sorting} onSelect={handleChange}>
      <Dropdown.Toggle className={styles.sortingHeader}>
        {optionName}
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.sortingBody}>
        {options.map((option) => (
          <Dropdown.Item 
            key={option.value} id={option.label} eventKey={option.value} className={styles.sortingItem}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Sorting;