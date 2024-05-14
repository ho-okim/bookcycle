import React from "react";
import styles from '../../styles/mypage.module.css';
import { ChevronDoubleLeft, ChevronLeft, ChevronRight, ChevronDoubleRight } from "react-bootstrap-icons";

function Pagination({ offset, limit, page, total, setPage }) {
  const totalPages = Math.ceil(total / limit); // 전체 페이지 수
  const pagesPerGroup = 5; // 그룹 당 페이지 수

  // 페이지 그룹 계산
  const currentGroup = Math.ceil(page / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  return (
    <div className={styles.pagination}>
      {page > 1 && (
        <div className={styles.pageBtnWrap}>
          <button 
            onClick={() => setPage(1)} 
            className={`${styles.firstBtn} ${styles.pageBtn}`}
          >
            <ChevronDoubleLeft />
          </button>
          <button 
            onClick={() => setPage(page - 1)} 
            className={`${styles.prevBtn} ${styles.pageBtn}`}
          >
            <ChevronLeft />
          </button>
        </div>
      )}
      {/* 페이지네이션 */}
      <div className={styles.pageNumWrap}>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
          <button 
            key={startPage + i} 
            onClick={() => setPage(startPage + i)} 
            className={styles.pageNum}
            style={{ color: page === startPage + i ? '#427D9D' : 'black' }}
          >
            {startPage + i}
          </button>
        ))}
      </div>
      {/* 다음 페이지로 이동하는 버튼 */}
      {page < totalPages && (
        <div className={styles.pageBtnWrap}>
          <button 
            onClick={() => setPage(page + 1)} 
            className={`${styles.nextBtn} ${styles.pageBtn}`}
          >
            <ChevronRight />
          </button>
          <button 
            onClick={() => setPage(totalPages)} 
            className={`${styles.lastBtn} ${styles.pageBtn}`}
          >
            <ChevronDoubleRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;