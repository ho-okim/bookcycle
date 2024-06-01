import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { buyerReviewWrite, buyerReviewWritePost } from '../../api/mypage';
import { StarFill } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import styles from "../../styles/mypage.module.css";
import { useAuth } from '../../contexts/LoginUserContext';
import EmptyError from '../EmptyError';
import { Badge } from 'react-bootstrap';

function BuyerReviewWrite() {

  const { user } = useAuth(); // 로그인 한 사용자
  // 상대방(=구매자) id
  const { id } = useParams();

  const [reviewTags, setReviewTags] = useState([]);
  const contentRef = useRef()
  const [tagIndex, setTagIndex] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [isNotFirstCheck, setIsNotFirstCheck] = useState(false);
  const [triggerVibration, setTriggerVibration] = useState(true);
  const scrollTopRef = useRef()

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
    setIsNotFirstCheck(true)
    try {
      if(score || tagIndex || reviewContent){
        console.log("handleSubmit 호출");
        await buyerReviewWritePost(id, score, tagIndex, reviewContent, productId);
        console.log("리뷰 등록 완료")
        navigate(`/user/${id}`);
      } else {
        scrollTopRef.current?.scrollIntoView({behavior: 'smooth'})
  
        // EmptyError 컴포넌트 애니메이션 관리
        setTriggerVibration(true);
        setTimeout(() => setTriggerVibration(false), 2000);
      }
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
      <Container ref={scrollTopRef}>
        <div className="inner">
          <div className={`d-flex flex-column justify-content-center ${styles.rating}`}>
            <div className='d-flex justify-content-center mb-2'>
              {
                isNotFirstCheck && !score ?
                <EmptyError triggerVibration={triggerVibration}/> : null
              }
            </div>
            <div>{star}</div>
          </div>
          <div className={`${styles.review} ${styles.selectTag}`}>
            <div className='d-flex align-items-center'>
              <p className='fs-5'>어떤 점이 좋았나요?</p>
              <Badge className={styles.category_badge}>택 1</Badge>
              {
                isNotFirstCheck && !tagIndex ?
                <EmptyError triggerVibration={triggerVibration}/> : null
              }
            </div>
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
            <div className='d-flex align-items-center'>
              <p className='fs-5'>리뷰작성</p>
              <Badge className={styles.category_badge}>필수</Badge>
              {
                isNotFirstCheck && !reviewContent ?
                <EmptyError triggerVibration={triggerVibration}/> : null
              }
            </div>
            <textarea value={reviewContent} placeholder='리뷰를 작성해주세요' onChange={handleReviewContent} maxLength={3000} onInput={handleResizeContentHeight} ref={contentRef}/>
          </div>
          <div className={styles.btnWrap}>
            <Button className={`submit ${styles.submitBtn}`} as="input" type="submit" value="등록" onClick={() => handleSubmit()} />
            <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate(`/mypage/sellList`)}}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BuyerReviewWrite;
