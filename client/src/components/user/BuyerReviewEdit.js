import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { buyerReviewWrite, buyerReviewEditData, buyerReviewEdit } from '../../api/mypage';
import { StarFill } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import styles from "../../styles/mypage.module.css";
import { useAuth } from '../../contexts/LoginUserContext';
import { Badge } from 'react-bootstrap';
import EmptyError from '../EmptyError';


function BuyerReviewEdit() {

  const { user } = useAuth(); // 로그인 한 사용자

  const { id } = useParams();
  const [reviewTags, setReviewTags] = useState([]);
  const contentRef = useRef()
  const [tagIndex, setTagIndex] = useState(-1);
  // 최초 렌더링 때 빈 값으로 초기화 되면서 EmptyError 컴포넌트가 순간적으로 렌더링되는 걸 막기 위해 공백을 넣어뒀습니다 - 현경
  const [reviewContent, setReviewContent] = useState(' ');
  const [score, setScore] = useState('');
  const [triggerVibration, setTriggerVibration] = useState(true);
  const scrollTopRef = useRef()

  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams()
  const productId = searchParams.get("productId");

  const handleResizeContentHeight = useCallback(() => {
    contentRef.current.style.height = "1rem";
    contentRef.current.style.height = contentRef.current.scrollHeight + "px";
  }, []);

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
      if(reviewContent){
        console.log("id :", id, " / score :", score, " / tagIndex :", tagIndex, " / reviewContent :", reviewContent, " / productId :")
        await buyerReviewEdit(id, score, tagIndex, reviewContent, productId);
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

  if (!user) { // 로그인 안 한 사용자 접근 차단
    navigate("/login");
  } else if (user && user.blocked === 1) { // 차단된 사용자 접근 차단
    navigate("/error/401");
  }

  return (
    <>
      <Container ref={scrollTopRef}>
        <div className="inner">
          <div className={styles.rating}>
            <div>{star}</div>
          </div>
          <div className={`${styles.review} ${styles.selectTag}`}>
            <div className='d-flex align-items-center'>
              <p className='fs-5'>어떤 점이 좋았나요?</p>
              <Badge className={styles.category_badge}>택 1</Badge>
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
                !reviewContent ?
                <EmptyError triggerVibration={triggerVibration}/> : null
              }
            </div>
            <textarea value={reviewContent} placeholder='리뷰를 작성해주세요' onChange={handleReviewContentChange} maxLength={3000} onInput={handleResizeContentHeight} ref={contentRef}/>
          </div>
          <div className={styles.btnWrap}>
            <Button className={`submit ${styles.submitBtn}`} as="input" type="submit" value="수정" onClick={() => handleSubmit()}/>
            <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate(`/mypage/sellGiveReviewList`)}}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BuyerReviewEdit;