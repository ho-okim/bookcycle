import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { buyerReviewWrite, buyerReviewWritePost } from '../../api/mypage';
import { StarFill } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import styles from "../../styles/mypage.module.css";
import { useAuth } from '../../contexts/LoginUserContext';

function BuyerReviewWrite() {

  const { user } = useAuth(); // 로그인 한 사용자
  // 상대방(=구매자) id
  const { id } = useParams();

  const [reviewTags, setReviewTags] = useState([]);
  const contentRef = useRef()
  const [tagIndex, setTagIndex] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams()
  const productId = searchParams.get("productId")

  useEffect(() => {
    async function getReviews() {
      try {
        const data = await buyerReviewWrite(id);
        setReviewTags(data);
      } catch (error) {
        console.error('리뷰 데이터를 가져오는 중 에러 발생: ', error);
        setReviewTags([]);
      }
    }
    getReviews();
  }, []);

  const handleTagSelect = (index) => { 
    setTagIndex(index+1); 
  }

  const handleReviewContent = (e) => {
    setReviewContent(e.target.value);
  }

  const handleResizeContentHeight = useCallback(() => {
    contentRef.current.style.height = "1rem";
    contentRef.current.style.height = contentRef.current.scrollHeight + "px";
  }, []);

  const handleSubmit = async () => {
    try {
      console.log("handleSubmit 호출");
      await buyerReviewWritePost(id, score, tagIndex, reviewContent, productId);
      console.log("리뷰 등록 완료")
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

  if (!user) { // 로그인 안 한 사용자 접근 차단
    navigate("/login");
  } else if (user && user.blocked === 1) { // 차단된 사용자 접근 차단
    navigate("/error/401");
  }

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
            <textarea value={reviewContent} onChange={handleReviewContent} maxLength={3000} onInput={handleResizeContentHeight} ref={contentRef}/>
          </div>
          <div className={styles.btnWrap}>
            <Button className={`submit ${styles.submitBtn}`} as="input" type="submit" value="등록" onClick={() => handleSubmit()} />
            <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate(`/mypage/buyList`)}}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BuyerReviewWrite;
