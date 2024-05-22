import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sellGiveReviewList, reviewDelete } from '../../api/mypage';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';
import Pagination from './Pagination.js';

import { Dropdown, Table } from 'react-bootstrap';
import styles from '../../styles/mypage.module.css';


function MySellGiveReviewList() {

  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  let total = reviews.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getReviews(){
      try {
        const data = await sellGiveReviewList();
        setReviews(data);
      } catch (error) {
        console.error('sellReviewList 데이터를 가져오는 중 에러 발생: ', error);
        setReviews([]); 
      }
    }
    getReviews();
  }, []);

    // 데이터 삭제
	async function onDelete(id) {
		try {
			await reviewDelete(id); 
			document.location.href = `/reviewDelete/${id}`
      navigate(0)
		} catch (error) {
			console.error(error);
		}
	}

  return (
    <div className={styles.content}>
      <p className={styles.contentHeader}> &gt; 총 {reviews.length}개의 구매자에게 남긴후기</p>
      {reviews.length === 0 ? (
        <div className={styles.empty}>구매자에게 남긴 후기가 없습니다.</div>
      ) : (
        <>
          <Table responsive>
            <tbody>
              {reviews.slice(offset, offset + limit).map((review, index) => (
                <tr key={index} className={styles.revWrap}>
                  <td>{starRating(review.score)}</td>
                  <td>{review.content}</td>
                  <td>
                    <Link to={`/user/${review.buyer_id}`}>{review.buyer_nickname}</Link>
                  </td>
                  <td className={`col-2 ${styles.date}`}>{dateProcessingDash(review.createdAt)}</td>
                  <td className="col-1">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" className={styles.toggleBtn}>
                        ⁝
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href={`/user/${review.buyer_id}/buyerReviewEdit?productId=${review.product_id}`}>
                          수정
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onDelete(review.id)}>삭제</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
        </>
      )}
    </div>
  );
}

export default MySellGiveReviewList;