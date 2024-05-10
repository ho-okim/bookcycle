import styles from '../../styles/board.module.css';
import { board } from '../../api/board.js';
import Pagination from '../../components/board/Pagination.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../contexts/LoginUserContext.js';

function Board() {

  const {user, setUser} = useAuth();

  // client > api 에서 받아온 상위 10개 게시글 리스트
  async function getBoard(){
    const data = await board()
    return data;
  }

  // api에서 받아온 데이터 useState 삽입
  let [contents, setContents] = useState([])
  // console.log("상위 10개 게시글: ", contents)

  let total = contents.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  // 화면 최초로 rendering 될 때만 데이터 get 요청
  useEffect(()=>{
    let board
    const test = async () => {
      board = await getBoard()
      setContents(board)
    }
    test()
  }, [])

  async function onPost(){
    if(user){
      document.location.href = `/board/write`
    } else{
      alert('로그인 후 작성할  수 있습니다.')
    }
  }

  async function sortCreatedAt(){
    const data = await board()
    return data;
    // const sortedContents = contents.slice().sort((a, b) => {
    //   const dateA = new Date(a.createdAt);
    //   const dateB = new Date(b.createdAt);

    //   return dateB - dateA;
    // })

    // setContents(sortedContents)
  }

  // 이 방식으로 하면 현재 페이지에 있는 자료만 가지고 정렬함
  // 새로고침하면서 새로 업로드된 글도 받아 모두 정렬해줘야 함 -> useEffect 사용
  function onSelected(e){
    const selectedOption = e.target.value;
    if(selectedOption === "createdAt"){
      sortCreatedAt();
    } else if(selectedOption === "likeOrder"){
    }
  };

  // async function onSelected(e){
  //   const selectedOption = e.target.value;
  //   setSortOption(selectedOption)
  //   if(selectedOption === "createdAt"){
  //     const data = await getBoard();
  //     const sortedContents = sortCreatedAt(data)
  //     setContents(sortedContents)
  //   } else if(selectedOption === "likeOrder"){
  //   }
  // };

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

  const navigate = useNavigate();



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
              <Form.Select aria-label="Default select example" onChange={onSelected}>
                <option value="createdAt">최신순</option>
                <option value="likeOrder">좋아요 순</option>
              </Form.Select>
            </div>
          </div>
          {
            contents.slice(offset, offset + limit).map((content) => {
              return(
                <div key={content.id} className={`col ${styles.list}`} onClick={()=>{navigate(`/board/${content.id}`)}}>
                  <div className={styles.listTitle}>{content.title}</div>
                  <div className={`${styles.listInfo} regular`}>
                    <span className={styles.userid}>{content.nickname}</span>
                    <span className={styles.date}>{DateProcessing(content.createdAt)}</span>
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
