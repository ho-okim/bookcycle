import styles from '../../styles/board.module.css';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { ChevronLeft } from 'react-bootstrap-icons';
import { ChevronRight } from 'react-bootstrap-icons';
import { useState } from 'react';

function Pagination({ total, limit, page, setPage }) {
  let [ariaCurrentPage, setAriaCurrentPage] = useState(1)
  let numPages = Math.ceil(total / limit);

  // aria-current가 "page"(현재 페이지 번호)일 경우
  // 색깔 주기 위한 클래스 명 추가 구현
  // aria가 i + 1과 같을 경우 클래스 명 추가, 다를 경우 클래스 없게
  let handleBtnClick = (pageNumber) => {
    setPage(pageNumber);
    setAriaCurrentPage(pageNumber)
  }

  let handlePrevBtn = () => {
    let prevPageNum = page - 1;
    setPage(prevPageNum);
    setAriaCurrentPage(prevPageNum);
  }

  let handleNextBtn = () => {
    let nextPageNum = page + 1;
    setPage(nextPageNum);
    setAriaCurrentPage(nextPageNum)
  }


  return (
    <Nav role="navigation" className={`${styles.pageNav} d-flex justify-content-center`}>
      { 
        page == 1 
          ? null : 
          <Button className={styles.prevBtn} onClick={() => handlePrevBtn()}>
            <ChevronLeft/>
          </Button>   
      }
      {
        Array(numPages)
          .fill()
          .map((_, i) => (
            <Button
              className={`${ariaCurrentPage == i + 1 ? styles.currentPageBtn : styles.noCurrentPageBtn}`}
              key={i + 1}
              onClick={() => handleBtnClick(i + 1)}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </Button>
          ))
      }
      { 
        page == numPages 
          ? null :
          <Button className={styles.nextBtn} onClick={() => handleNextBtn()} disabled={page === numPages}>
            <ChevronRight/>
          </Button>
      }
    </Nav>
  );
}

export default Pagination;
  
