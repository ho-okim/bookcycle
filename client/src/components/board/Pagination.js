import styles from '../../styles/board.module.css';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { ChevronLeft, ChevronRight, ChevronDoubleLeft, ChevronDoubleRight } from 'react-bootstrap-icons';
import { useState } from 'react';

function Pagination({ total, limit, page, setPage }) {
  let [ariaCurrentPage, setAriaCurrentPage] = useState(page);
  let numPages = Math.ceil(total / limit);
  let buttonLimit = 5;

  // 렌더링 될 버튼 수
  const getPageNumbers = () => {
    let startPage = Math.max(1, page - Math.floor(buttonLimit / 2));
    let endPage = Math.min(numPages, startPage + buttonLimit - 1);

    if (endPage - startPage < buttonLimit - 1) {
      startPage = Math.max(1, endPage - buttonLimit + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // 페이지 버튼 클릭 시
  const handleBtnClick = (pageNumber) => {
    setPage(pageNumber);
    setAriaCurrentPage(pageNumber);
  };

  // 첫 페이지로 가기
  const handleFirstBtn = () => {
    setPage(1);
    setAriaCurrentPage(1);
  };

  // 마지막 페이지로 가기
  const handleLastBtn = () => {
    setPage(numPages);
    setAriaCurrentPage(numPages);
  };

  // 이전 버튼 클릭 시
  const handlePrevBtn = () => {
    setPage(page - 1);
    setAriaCurrentPage(page - 1);
  };

  // 다음 버튼 클릭 시
  const handleNextBtn = () => {
    setPage(page + 1);
    setAriaCurrentPage(page + 1);
  };

  const pageNumbers = getPageNumbers();

  return (
    <Nav role="navigation" className={`${styles.pageNav} d-flex justify-content-center`}>
      {
        page > 1 && (
          <>
            <Button className={styles.firstBtn} onClick={handleFirstBtn}>
              <ChevronDoubleLeft />
            </Button>
            <Button className={styles.prevBtn} onClick={handlePrevBtn}>
              <ChevronLeft />
            </Button>
          </>
        )
      }
      {
        pageNumbers.map((pageNumber) => (
          <Button
            className={`${ariaCurrentPage === pageNumber ? styles.currentPageBtn : styles.noCurrentPageBtn}`}
            key={pageNumber}
            onClick={() => handleBtnClick(pageNumber)}
            aria-current={ariaCurrentPage === pageNumber ? 'page' : undefined}
          >
            {pageNumber}
          </Button>
        ))
      }
      {
        page < numPages && (
          <>
            <Button className={styles.nextBtn} onClick={handleNextBtn}>
              <ChevronRight />
            </Button>
            <Button className={styles.lastBtn} onClick={handleLastBtn}>
              <ChevronDoubleRight />
            </Button>
          </>
        )
      }
    </Nav>
  );
}

export default Pagination;
  
