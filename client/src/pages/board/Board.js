import styles from '../../styles/board.module.css';
import { board, searchBoard } from '../../api/board.js';
import Pagination from '../../components/board/Pagination.js';
import BoardSorting from '../../components/board/BoardSorting.js';
import BoardSearchInput from '../../components/board/BoardSearchInput.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import {ChatLeftDots, Search, Eye, Heart, PersonFillSlash, ExclamationCircleFill, Ban} from 'react-bootstrap-icons';
import { useAuth } from '../../contexts/LoginUserContext.js';
import { dateProcessingDash } from '../../lib/dateProcessing.js';

function Board() {

  const { user } = useAuth();
  const navigate = useNavigate();

  // api에서 받아온 데이터 useState 삽입
  let [contents, setContents] = useState([])

  // pagination
  let total = contents.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  // order 
  // searchParams() : query parameter를 읽어주는 메서드
  // searchParams.get('param') : 해당 parameter의 value를 가져옴
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = useState({ 
    sortBy : searchParams.get("order") ?? "createdAt", // url에 'order' parameter가 없으면 defualt value -> 'createdAt'
    updown : "DESC" 
  })

  const [searchKeyword, setSearchKeyword] = useState({ // 검색
    type : searchParams.get("stype") ?? 'writer', 
    keyword : searchParams.get("search") ?? ''
  });

  useEffect(()=>{
    // client > api 에서 받아온 상위 10개 게시글 리스트
    async function getBoard() {
      const data = await board(order);
      setContents(data);
    }

    // 검색 결과로 얻은 게시글 리스트
    async function getBoardSearchResult() {
      const data = await searchBoard(searchKeyword, order);
      setContents(data);
    }

    if (!searchParams.get('search')) {
      getBoard();
    } else {
      getBoardSearchResult();
    }
    
  }, [searchParams]);

  function onPost(){
    navigate('/board/write');
  }

  return (
    <>
      <Container className={`${styles.board}`}>
        <div className="inner">
          <div className={`col ${styles.boardHeader} d-flex justify-content-between align-items-center`}>
            <h2 className={`${styles.title} m-0`}>게시판</h2>
            {(!user || user?.blocked === 1) ? null : <Button onClick={onPost} className={styles.onPost}>글쓰기</Button>}
          </div>
          <div className={`col ${styles.listHeader} d-flex justify-content-between`}>
            <p>총 {contents.length}건</p>
            <div className={`${styles.searchOrderWrap} d-flex`}>     
              <BoardSorting 
                className={styles.order}
                order={order} 
                setOrder={setOrder}/>
              <BoardSearchInput searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword}/>
            </div>
          </div>
          {
            contents.slice(offset, offset + limit).map((content) => {
              return(
                <div key={content.id} className={`col ${styles.list}`} onClick={()=>{navigate(`/board/${content.id}`)}}>
                  <div className={styles.listTitle}>{content.title}</div>
                  <div className={`${styles.listContent} regular`}>{content.content}</div>
                  <div className={`${styles.listInfo} d-flex justify-content-between regular`}>
                    <div className='userInfo'>
                      <span className={(content.user_blocked === 1 ? styles.bannedUserId : styles.userid)}>
                        {(content.user_blocked === 1) ? 
                        <Ban className='fs-6 me-1'/> : null}
                        {content.nickname}
                      </span>
                      <span className={styles.date}>{dateProcessingDash(content.createdAt)}</span>
                    </div>
                    <div className='boardInfo'>
                      <Eye/> {content.view_count}
                      <Heart className='ms-3'/> {content.likehit}
                      <ChatLeftDots className='ms-3'/> {content.reply_numbers}
                    </div>
                  </div>
                </div>
              )
            })
          }
          <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
        </div> 
      </Container>
    </>
  );
}

export default Board;
