import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { heartList } from "../../api/mypage";
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import Pagination from './Pagination.js';
import Sorting from './Sorting.js'

import { PersonFill } from "react-bootstrap-icons";
import styles from "../../styles/mypage.module.css";

// heartList 정렬 옵션
const heartSortOptions = [
  { label: "최근담은순", value: "liked_date.DESC" },
  { label: "상품명순", value: "product_name.ASC" },
  { label: "가격낮은순", value: "price.ASC" },
  { label: "가격높은순", value: "price.DESC" },
  { label: "출간일순", value: "publish_date.DESC" },
];

function MyHeartList() {

  const [hearts, setHearts] = useState([]);
  const [sortOption, setSortOption] = useState("liked_date.DESC")
  const [optionName, setOptionName] = useState('정렬기준'); // 버튼 이름

  let total = hearts.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getHeart(){
      try {
        const data = await heartList(sortOption);
        setHearts(data);
      } catch (error) {
        console.error('heartList 데이터를 가져오는 중 에러 발생: ', error);
        setHearts([]);
      }
    }
    getHeart();
  }, [sortOption]);

  const handleChange = (eventKey, event) => {
    event.persist();
    setSortOption(eventKey);
    setOptionName(event.currentTarget.id);
  };

  return (
    <div className={styles.content}>
      <div className={`${styles.contentHeader} ${styles.heartHeader}`}>
        <p> &gt; 찜한책 목록</p>
        <Sorting optionName={optionName} handleChange={handleChange} options={heartSortOptions} />
      </div>
      <div className={styles.heartList}>
        {hearts.length === 0 ? (
          <div className={styles.empty}>아직 찜한책이 없습니다! 사이트를 둘러보세요😉</div>
        ) : (
          <div className={styles.heartGrid}>
            {hearts.slice(offset, offset + limit).map((heart, index) => (
              heart.soldDate === null && (
                <div key={index} className={styles.heartWrap}>
                  <Link to={`/product/detail/${heart.product_id}`}>
                    <div className={styles.heartInfo}>
                      {
                        heart.filename ? 
                          <img src={process.env.PUBLIC_URL + `/img/product/${heart.filename}`} alt="" className={styles.heartImg}/> :
                          <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} alt="" className={styles.heartImg}/>
                      }
                      <div className={styles.heartBox}>
                        <p className={styles.heartTitle}>{heart.product_name}</p>
                        <div className={`${styles.heartContent} regular`}>
                          <p>저자 {heart.writer}</p>
                          <p>출판사 {heart.publisher}</p>
                          <p>출간일 {dateProcessingDash(heart.publish_date)}</p>
                        </div>
                        <p className={`${styles.heartPrice} medium`}>₩{parseInt(heart.price).toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                  <Link to={`/user/${heart.seller_id}`} className={styles.heartSeller}>
                    <PersonFill className={styles.person} />
                    <p>{heart.seller_nickname}</p>
                  </Link>
                </div>
              )
            ))}
          </div>
        )}
      </div>
      <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
    </div>
  );
}

export default MyHeartList;
