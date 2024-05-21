import styles from '../../styles/board.module.css';
import { board } from '../../api/board.js';
import Pagination from '../../components/board/Pagination.js';
import BoardSorting from '../../components/board/BoardSorting.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {ChatLeftDots} from 'react-bootstrap-icons';
import { Eye } from 'react-bootstrap-icons';
import { Heart } from 'react-bootstrap-icons';
import { useAuth } from '../../contexts/LoginUserContext.js';

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

  // client > api 에서 받아온 상위 10개 게시글 리스트
  async function getBoard(){
    const data = await board(order)
    return data;
  }

  // 화면 최초로 rendering 될 때만 데이터 get 요청
  // 요청 url이 바뀔때마다 board 정보 다시 가져옴
  useEffect(()=>{
    let board
    const getBoardData = async () => {
      board = await getBoard()
      setContents(board)
    }
    getBoardData()
  }, [searchParams])


  async function onPost(){
    if(user){
      document.location.href = `/board/write`
    } else{
      alert('로그인 후 작성할  수 있습니다.')
    }
  }

  // 날짜 yyyy-mm-dd 형식 변환
  function DateProcessing(date){
    
    let newDate = new Date(date)

    let year = newDate.getFullYear();
    let month = String(newDate.getMonth() + 1).padStart(2, '0');  // getMonth(): 0-11 출력해서 1 더해주기
    let day = String(newDate.getDate()).padStart(2, '0'); 
    
    // Construct the formatted date string in "yyyy-mm-dd" format
    let formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }



  return (
    <>
      <Container className={`${styles.board}`}>
        <div className="inner">
          <div className={`col ${styles.boardHeader} d-flex justify-content-between align-items-center`}>
            <h2 className={`${styles.title} m-0`}>게시판</h2>
            <Button onClick={onPost} className={styles.onPost}>글쓰기</Button>
          </div>
          <div className={`col ${styles.listHeader} d-flex justify-content-between`}>
            <p>총 {contents.length}건</p>
            <div className='order'>          
              <BoardSorting 
                order={order} 
                setOrder={setOrder}/>
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
                      <span className={`${styles.userid} medium`}>{content.nickname}</span>
                      <span className={styles.date}>{DateProcessing(content.createdAt)}</span>
                    </div>
                    <div className='boardInfo'>
                      <ChatLeftDots/> {content.reply_numbers}
                      <Eye className='ms-3'/> {content.view_count}
                      <Heart className='ms-3'/> {content.likehit}
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
