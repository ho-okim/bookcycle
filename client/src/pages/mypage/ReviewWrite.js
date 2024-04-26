import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reviewWrite } from '../../api/mypage';

import Container from "react-bootstrap/Container";
import StarSelect from "../../components/StarSelect";

import styles from "../../styles/mypage.module.css";

function ReviewWrite() {

  const { id } = useParams();

  async function getReviews(){
    const data = await reviewWrite(id)
    return data
  }

  const [reviewTags, setReviewTags] = useState([]);

  useEffect(() => {
    // Axios 인스턴스를 이용하여 서버로부터 데이터 가져오기
    let items
    const test = async() => {
      items = await getReviews()
      setReviewTags(items)
    }
    test()
  }, []);
  
  console.log("reviewTags: ", reviewTags)


  return (
    <>
      <Container>
        <div className="inner">
          <div className={styles.rating}>
            <StarSelect size={50}/>
          </div>
          <div className={`${styles.review} ${styles.selectTag}`}>
            <p>어떤 점이 좋았나요? <span>필수</span></p>
            <div className={styles.tagWrap}>
              {reviewTags.map((tag, index) => {
                return (
                  <button className={styles.tagBtn}>{tag.tag_name}</button>
                )
              })}
            </div>
          </div>
          <div className={`${styles.review} ${styles.reviewWrite}`}>
            <p>리뷰작성 <span>선택</span></p>
            <textarea></textarea>
          </div>
          <button>등록</button>
        </div>
      </Container>
    </>
  );
}

export default ReviewWrite;
