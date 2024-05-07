import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { reviewWrite, reviewWritePost } from '../../api/mypage';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
// import StarSelect from "../../components/StarSelect";
import styles from "../../styles/mypage.module.css";
// import { useState } from "react";
import { StarFill } from "react-bootstrap-icons";
import { useTargetUser } from '../../contexts/TargetUserContext';

function ReviewWrite() {

  const { id } = useParams();
  const {targetUserId} = useTargetUser();
  const [reviewTags, setReviewTags] = useState([]);
  
  const [rating, setRating] = useState(0);
  const [tagIndex, setTagIndex] = useState(-1);
  const [reviewContent, setReviewContent] = useState('');

  const navigate = useNavigate();
  
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  useEffect(() => {
    async function getReviews() {
      try {
        const data = await reviewWrite(id);
        const tags = data && data.tags ? data.tags : [];
        setReviewTags(tags); // 태그 배열만 저장
      } catch (error) {
        console.error('리뷰 데이터를 가져오는 중 에러 발생: ', error);
        setReviewTags([]); // 에러 발생 시 빈 배열 저장
      }
    }
  
    getReviews();
  }, []);

  const handleRatingChange = (rating) => {
    setRating(rating);
  }

  const handleTagSelect = (index) => { 
    setTagIndex(index); 
  }

  const handleReviewContentChange = (e) => {
    setReviewContent(e.target.value);
  }

  const handleSubmit = async () => {
    try {
      await reviewWritePost(id, score, tagIndex, reviewContent, productId);
      navigate(`/user/${id}`);
    } catch(error) {
      console.error('리뷰 등록 실패: ', error.message)
    }
  }

  const totalStar = 5;
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [score, setScore] = useState(0);

  const defaultStyle = { color: "#bebdbd" }; // 짙은 노란색
  const hoverStyle = { color: "#FFC100" }; // 회색
  
  function handleClick(index) {
    // 클릭 처리
    setScore(index + 1);
    setHoverIndex(index);
    console.log("score: ", score)
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
            <p>어떤 점이 좋았나요? <span>필수</span></p>
            <div className={styles.tagWrap}>
              {reviewTags.map((tag, index) => {
                return (
                  <div className={styles.tagBtn} key={index}>
                    <input 
                      type="checkbox" 
                      checked={tagIndex === index} 
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
            <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate(`/mypage/${id}/buyList`)}}/>
            <Button className={`submit ${styles.submitBtn}`} as="input" type="submit" value="등록" onClick={() => handleSubmit()}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default ReviewWrite;
