import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { heartList } from "../../api/mypage";
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import Pagination from './Pagination.js';
import Sorting from './Sorting.js'

import { PersonFill, Eye, Heart } from "react-bootstrap-icons";
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
  
  let total = hearts.length; // 전체 게시물 수
  let limit = 5; // 페이지 당 게시물 수
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

  const handleChange = (e) => {
    setSortOption(e.target.value);
  }

  return (
    <div className={styles.content}>
      <div className={`${styles.contentHeader} ${styles.heartHeader}`}>
        <p> &gt; 찜한책 목록</p>
        <Sorting sortOption={sortOption} handleChange={handleChange} options={heartSortOptions} />
      </div>
      <div className={styles.heartList}>
        {hearts.length === 0 ? (
          <div className={styles.empty}>아직 찜한책이 없습니다! 사이트를 둘러보세요😉</div>
        ) : (
          hearts.slice(offset, offset + limit).map((heart, index) => (
            heart.soldDate === null && (
              <Link to={`/product/detail/${heart.product_id}`} key={index} className={styles.heartWrap}>
                <div className={styles.heartImgWrap}>
                  {
                    heart.filename ? 
                      <img src={process.env.PUBLIC_URL + `/img/product/${heart.filename}`} alt="" className={styles.heartImg}/> :
                      <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} alt="" className={styles.heartImg}/>
                  }
                </div>
                <div className={styles.heartInfo}>
                  <p className={styles.heartTitle}>{heart.product_name}</p>
                  <div className={`${styles.heartContent} regular`}>
                    <span>저자 {heart.writer}</span>
                    <span>출판사 {heart.publisher}</span>
                    <span>출간일 {dateProcessingDash(heart.publish_date)}</span>
                  </div>
                  <div className={`d-flex ${styles.heartFooter}`}>
                    <p className={`${styles.heartPrice} medium`}>{parseInt(heart.price).toLocaleString()}원</p>
                    <div className={`ms-2 ${styles.heartSeller}`}>
                      <PersonFill className={styles.person} />
                      <p>{heart.seller_nickname}</p>
                    </div>
                    <div className={`ms-auto ${styles.reaction}`}>
                      <p><Eye className='me-1'/><span>{heart.view_count}</span></p>
                      <p><Heart className='me-1'/><span>{heart.liked}</span></p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))
        )}
      </div>
      <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
    </div>
  );
}

export default MyHeartList;
