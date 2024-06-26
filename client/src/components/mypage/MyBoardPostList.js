import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { boardPostList } from '../../api/mypage';
import Pagination from './Pagination.js';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import Sorting from './Sorting.js';

import { Eye, Heart, ChatLeftDots } from 'react-bootstrap-icons';
import styles from '../../styles/mypage.module.css';

// boardPostList 정렬 옵션
const boardSortOptions = [
  { label: "최신순", value: "createdAt.DESC" },
  { label: "오래된순", value: "createdAt.ASC" },
  { label: "좋아요순", value: "likehit.DESC" },
  { label: "댓글순", value: "reply_numbers.DESC" },
  { label: "조회수순", value: "view_count.DESC" },
];

function MyBoardPostList() {
  const [boardPostItems, setBoardPostItems] = useState([]);
  const [sortOption, setSortOption] = useState("createdAt.DESC")
  const [optionName, setOptionName] = useState('정렬기준'); // 버튼 이름

  let total = boardPostItems.length; // 전체 게시물 수
  let limit = 5; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getItems(){
      try {
        const data = await boardPostList(sortOption);
        setBoardPostItems(data);
      } catch (error) {
        console.error('boardList 데이터를 가져오는 중 에러 발생: ', error);
        setBoardPostItems([]);
      } 
    }
    getItems();
  }, [sortOption]);

  const handleChange = (eventKey, event) => {
    event.persist();
    setSortOption(eventKey);
    setOptionName(event.currentTarget.id);
    console.log(event.currentTarget.id)
    console.log(eventKey)
  };

  return (
    <div className={styles.content}>
      <div className={styles.contentHeader}>
        <p> &gt; 게시글 작성 내역</p>
        <Sorting optionName={optionName} handleChange={handleChange} options={boardSortOptions} />
      </div>
      {boardPostItems.length === 0 ? (
        <div className={`pb-5 ${styles.empty}`}>작성한 게시글이 없습니다.</div>
      ) : (
        boardPostItems.slice(offset, offset + limit).map((item, index) => (
          <Link to={`/board/${item.id}`} key={index} className={styles.boardWrap}>
              {
                item.filename ?
                <div className={styles.boardImgWrap}>
                  <img key={item.id} src={process.env.PUBLIC_URL + `/img/board/${item.filename}`} alt='board image' className={`${styles.boardImg}`}/>
                </div> : ''
              }
            <div className={`${styles.boardInfo} ${item.filename ? styles.withImage : styles.noImage}`} >
              <div className={styles.boardHeader}>
                <p className={styles.boardTitle}>{item.title}</p>
                <p className={styles.boardContent}>{item.content}</p>
              </div>
              <div className={styles.boardBottom}>
                <p className={styles.postDate}>{dateProcessingDash(item.createdAt)}</p>
                <div className={styles.reaction}>
                  <p><Eye className='me-1'/> <span>{item.reply_numbers}</span></p>
                  <p><Heart className='me-1'/> <span>{item.likehit}</span></p>
                  <p><ChatLeftDots className='me-1'/> <span>{item.reply_numbers}</span></p>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
      <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
    </div>
  )

}

export default MyBoardPostList;