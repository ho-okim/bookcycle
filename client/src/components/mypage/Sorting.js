import React from 'react';
import styles from '../../styles/mypage.module.css';

function Sorting({ sortOption, handleChange, options }) {
  return (
    <select className={styles.select} value={sortOption} onChange={handleChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Sorting;