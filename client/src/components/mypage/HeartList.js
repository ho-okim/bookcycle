import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { heartList } from "../../api/mypage";

import { PersonFill } from "react-bootstrap-icons";
import styles from "../../styles/mypage.module.css";

function HeartList() {
  const { id } = useParams();

  async function getHeart() {
    const data = await heartList(id);
    return data;
  }

  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const fetchHearts = async () => {
      const items = await getHeart();
      setHearts(items);
    };
    fetchHearts();
  }, [id]);

  if (!hearts || Object.keys(hearts).length === 0) {
    return <div>Loading...</div>;
  }

  function DateProcessing(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString("ko-KR", options).replaceAll('.', '.');
  }

  console.log(hearts)

  return (
    <>
      <div className={styles.heartList}>
        {hearts.map((heart, index) => (
          <div className={styles.heartWrap}>
            <img className={styles.heartImg} />
            <Link to={`/productDetail`} className={styles.heartInfo}>
              <p className={styles.heartTitle}>{heart.product_name}</p>
              <p className={styles.heartContent}>
                <span>저자 {heart.writer}</span>
                <span>출판사 {heart.publisher}</span>
                <span>출간일 {DateProcessing(heart.publish_date)}</span>
              </p>
              <p className={styles.heartPrice}>₩{parseInt(heart.price).toLocaleString()}</p>
            </Link>
            <Link to={`/user/${heart.seller_id}`} className={styles.heartSeller}>
              <PersonFill className={styles.person} />
              <p>{heart.nickname}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default HeartList;
