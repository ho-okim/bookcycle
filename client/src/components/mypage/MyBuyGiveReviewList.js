import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { buyGiveReviewList, reviewDelete } from '../../api/mypage';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';
import Pagination from './Pagination.js';

import styles from '../../styles/mypage.module.css';
import { Dropdown, Table } from 'react-bootstrap';
import { useAuth } from '../../contexts/LoginUserContext.js';

function MyBuyGiveReviewList() {
  const {user} = useAuth(); // 로그인 한 사용자

  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  
  let total = reviews.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getReviews(){
      try {
        const data = await buyGiveReviewList();
        setReviews(data);
      } catch (error) {
        console.error('buyReviewList 데이터를 가져오는 중 에러 발생: ', error);
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
      <p className={styles.contentHeader}> &gt; 총 {reviews.length}개의 판매자에게 남긴후기</p>
      {reviews.length === 0 ? (
        <div className={styles.empty}>판매자에게 남긴 후기가 없습니다.</div>
      ) : (
        <>
          <Table responsive>
            <tbody>
              {reviews.slice(offset, offset + limit).map((review, index) => (
                <tr key={index} className={styles.revWrap}>
                  <td className={styles.star}>{starRating(review.score)}</td>
                  <td>{review.content}</td>
                  <td>{review.buyer_nickname}</td>
                  <td className={`col-2 ${styles.date}`}>{dateProcessingDash(review.createdAt)}</td>
                  <td className='col-1'>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" className={styles.toggleBtn}>
                        ⁝
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {
                          (user.blocked === 0) ?
                          <Dropdown.Item className={styles.dropdownItem} href={`/user/${review.seller_id}/sellerReviewEdit?productId=${review.product_id}`}>
                          수정</Dropdown.Item>
                          : <Dropdown.Item className={`${styles.dropdownItem} text-decoration-line-through`}>
                          수정</Dropdown.Item>
                        }
                        <Dropdown.Item className={styles.dropdownItem} onClick={() => onDelete(review.id)}>삭제</Dropdown.Item>
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

export default MyBuyGiveReviewList;