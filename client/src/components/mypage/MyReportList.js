import { useEffect, useState } from "react";
import styles from "../../styles/mypage.module.css";
import { Table } from "react-bootstrap";
import { useAuth } from "../../contexts/LoginUserContext";
import { getReport } from "../../api/report";
import { dateProcessingDash } from "../../lib/dateProcessing.js"
import Pagination from "./Pagination.js";

function MyReportList() {
  const { user } = useAuth(); // 현재 로그인한 사용자
  const [reportItem, setReportItem] = useState([]); // 신고 내역 정보

  let total = reportItem.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getItems() {
      const res = await getReport();
      setReportItem(res);
    }

    getItems();
  }, [user]);

  function setCategoryName(category) {
    let categoryName = "";
    switch (category) {
      case "user":
        categoryName = "사용자";
        break;
      case "board":
        categoryName = "게시글";
        break;
      case "product":
        categoryName = "상품";
        break;
    }
    return categoryName;
  }

  return (
    <>
      <div className={styles.content}>
        <p className={styles.contentHeader}>&gt; 전체 신고 내역</p>
        {reportItem.length === 0 ? (
        <div className={styles.empty}>신고 내역이 없습니다.</div>
        ) : (
          <>
            <Table responsive className={styles.table}>
              <thead className={styles.tradeList}>
                <tr>
                  <th>신고 번호</th>
                  <th>카테고리</th>
                  <th>신고 대상</th>
                  <th>내용</th>
                  <th>날짜</th>
                  <th>처리여부</th>
                  <th>처리날짜</th>
                </tr>
              </thead>
              <tbody>
                {reportItem.slice(offset, offset + limit).map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el.id}</td>
                      <td>{setCategoryName(el.category)}</td>
                      <td>{el.target_id}</td>
                      <td>{el.content}</td>
                      <td>{dateProcessingDash(el.createdAt)}</td>
                      <td>{el.read_or_not}</td>
                      <td>{el.updatedAt ? dateProcessingDash(el.updatedAt) : null}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
          </>
        )}
      </div>
    </>
  );
}

export default MyReportList;
