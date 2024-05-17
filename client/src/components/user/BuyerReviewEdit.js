import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { buyerReviewWrite, buyerReviewEditData, buyerReviewEdit } from '../../api/mypage';
import { StarFill } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';

import Container from "react-bootstrap/Container";
import styles from "../../styles/mypage.module.css";


function BuyerReviewEdit() {

  const { id } = useParams();
  const [reviewTags, setReviewTags] = useState([]);
  
  const [tagIndex, setTagIndex] = useState(-1);
  const [reviewContent, setReviewContent] = useState('');
  const [score, setScore] = useState('');

  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams()
  const productId = searchParams.get("productId");

  useEffect(() => {
    async function getReviews() {
      try {
        const tag = await buyerReviewWrite();
        setReviewTags(tag); // 태그 배열 저장
      } catch (error) {
        console.error('리뷰 데이터를 가져오는 중 에러 발생: ', error);
        setReviewTags([]); // 에러 발생 시 빈 배열 저장
      }
    }
    getReviews();

    // 리뷰 데이터 가져와서 초기 설정하기
    async function getReviewData() {
      try {
        // 리뷰 데이터 가져오기
        const reviewData = await buyerReviewEditData(id, productId);
        const tagIndex = reviewData[0].tag_id;
        
        setTagIndex(tagIndex);
        setScore(reviewData[0].score);
        setReviewContent(reviewData[0].content);

      } catch(error) {
        console.error(error);
      }
    }
    getReviewData();
  }, []);


  const handleTagSelect = (index) => { 
    setTagIndex(index+1); 
  }

  const handleReviewContentChange = (e) => {
    setReviewContent(e.target.value);
  }

  const handleSubmit = async () => {
    try {
      console.log("id :", id, " / score :", score, " / tagIndex :", tagIndex, " / reviewContent :", reviewContent, " / productId :")
      await buyerReviewEdit(id, score, tagIndex, reviewContent, productId);
      navigate(`/user/${id}`);
    } catch(error) {
      console.error('리뷰 등록 실패: ', error.message)
    }
  }

  const totalStar = 5;
  const [hoverIndex, setHoverIndex] = useState(score);

  useEffect(() => {
    setHoverIndex(score-1);
  }, [score]);

  const defaultStyle = { color: "#bebdbd" }; // 짙은 노란색
  const hoverStyle = { color: "#FFC100" }; // 회색
  
  function handleClick(index) {
    // 클릭 처리
    setScore(index + 1);
    setHoverIndex(index);
  }

  const star = Array.from({ length: totalStar }, (_, index) => (
    <StarFill
      key={index}
			size={50}
      style={index <= hoverIndex ? hoverStyle : defaultStyle}
      onClick={() => {
        handleClick(index);
      }}
    />
  ));


  return (
    <>
      <Container>
        <div className="inner">
          <div className={styles.rating}>
            <div>{star}</div>
          </div>
          <div className={`${styles.review} ${styles.selectTag}`}>
            <p>어떤 점이 좋았나요? <span>택 1</span></p>
            <div className={styles.tagWrap}>
              {reviewTags.map((tag, index) => {
                return (
                  <div className={styles.tagBtn} key={index}>
                    <input 
                      type="checkbox" 
                      checked={(tagIndex-1) === index} 
                      onChange={() => handleTagSelect(index)}
                    />
                    <p>{tag.tag_name}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={`${styles.review} ${styles.reviewWrite}`}>
            <p>리뷰작성 <span>필수</span></p>
            <textarea value={reviewContent} onChange={handleReviewContentChange}></textarea>
          </div>
          <div className={styles.btnWrap}>
            <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate(`/mypage/${id}/buyRevList`)}}/>
            <Button className={`submit ${styles.submitBtn}`} as="input" type="submit" value="수정" onClick={() => handleSubmit()}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BuyerReviewEdit;