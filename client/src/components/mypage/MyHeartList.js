import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { heartList } from "../../api/mypage";
import dateProcessing from '../../lib/dateProcessing.js';
import Pagination from './Pagination.js';

import { PersonFill } from "react-bootstrap-icons";
import styles from "../../styles/mypage.module.css";

function MyHeartList() {

  const [hearts, setHearts] = useState([]);
  const [sortOption, setSortOption] = useState("최근담은순")
  
  let total = hearts.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getHeart(){
      try {
        const data = await heartList();
        setHearts(data);
      } catch (error) {
        console.error('heartList 데이터를 가져오는 중 에러 발생: ', error);
        setHearts([]);
      }
    }
    getHeart();
  }, []);
  console.log(hearts)

  const handleChange = (e) => {
    setSortOption(e.target.value);
  }

  // 정렬된 하트 리스트 반환하는 함수
  const getSortedHearts = () => {
    let sortedHearts = [...hearts];
    switch (sortOption) {
      case "최근담은순":
        sortedHearts.sort((a, b) => new Date(a.liked_date).getTime() - new Date(b.liked_date).getTime())
        break;
      case "상품명순":
        sortedHearts.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case "낮은가격순":
        sortedHearts.sort((a, b) => a.price - b.price)
        break;
      case "높은가격순":
        sortedHearts.sort((a, b) => b.price - a.price)
        break;
      case "출간일순":
        sortedHearts.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
        break;
      default:
        break;
    }
    return sortedHearts;
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.conTitle}>
          <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
          <select value={sortOption} onChange={handleChange}>
            <option>최근담은순</option>
            <option>상품명순</option>
            <option>낮은가격순</option>
            <option>높은가격순</option>
            <option>출간일순</option>
          </select>
        </div>
        <div className={styles.heartList}>
          {hearts.length === 0 ? (
            <div className={styles.empty}>아직 찜한책이 없습니다! 사이트를 둘러보세요😉</div>
          ) : (
            getSortedHearts().slice(offset, offset + limit).map((heart, index) => (
              // soldDate가 null인 경우에만 하트 리스트에 표시
              heart.soldDate === null && (
                <div key={index} className={styles.productWrap}>
                  <img className={styles.productImg} src="" />
                  <Link to={`/productDetail`} className={styles.productInfo}>
                    <p className={styles.productTitle}>{heart.product_name}</p>
                    <p className={styles.productContent}>
                      <span>저자 {heart.writer}</span>
                      <span>출판사 {heart.publisher}</span>
                      <span>출간일 {dateProcessing(heart.publish_date)}</span>
                    </p>
                    <p className={styles.productPrice}>₩{parseInt(heart.price).toLocaleString()}</p>
                  </Link>
                  <Link to={`/user/${heart.seller_id}`} className={styles.productSeller}>
                    <PersonFill className={styles.person} />
                    <p>{heart.seller_nickname}</p>
                  </Link>
                </div>
              )
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default MyHeartList;
