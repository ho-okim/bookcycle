import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { heartList } from "../../api/mypage";
import dateProcessing from '../../lib/dateProcessing.js';

import { PersonFill } from "react-bootstrap-icons";
import styles from "../../styles/mypage.module.css";

function HeartList() {

  const { id } = useParams();
  const [hearts, setHearts] = useState([]);
  const [sortOption, setSortOption] = useState("최근담은순")

  useEffect(() => {
    async function getHeart(){
      try {
        const data = await heartList(id)
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
        sortedHearts.sort((a, b) => b.date - a.date);
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
        <div className={styles.heartTop}>
          <span>1 2 3 4 5 &gt;</span>
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
            <div style={{textAlign:"center", marginTop:'auto'}}>아직 찜한책이 없습니다! 사이트를 둘러보세요😉</div>
          ) : (
            getSortedHearts().map((heart, index) => (
              <div key={index} className={styles.heartWrap}>
                <img className={styles.heartImg} src="" />
                <Link to={`/productDetail`} className={styles.heartInfo}>
                  <p className={styles.heartTitle}>{heart.product_name}</p>
                  <p className={styles.heartContent}>
                    <span>저자 {heart.writer}</span>
                    <span>출판사 {heart.publisher}</span>
                    <span>출간일 {dateProcessing(heart.publish_date)}</span>
                  </p>
                  <p className={styles.heartPrice}>₩{parseInt(heart.price).toLocaleString()}</p>
                </Link>
                <Link to={`/user/${heart.seller_id}`} className={styles.heartSeller}>
                  <PersonFill className={styles.person} />
                  <p>{heart.nickname}</p>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default HeartList;
