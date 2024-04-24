import styles from '../../styles/board.module.css';
import { board } from '../../api/board.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Board() {

  // api > board.js에서 받아온 상위 10개 게시글 리스트
  async function getBoard(){
    const data = await board()
    return data;
  }

  // api에서 받아온 데이터 useState 삽입
  let [contents, setContents] = useState([])

  // 화면 최초로 rendering 될 때만 데이터 get 요청
  useEffect(()=>{
    let board
    const test = async () => {
      board = await getBoard()
      setContents(board)
    }
    test()
  }, [])

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

  function onSelected(){};

  return (
    <>
      <Container className={`${styles.board}`}>
        <div className="inner">
          <div className={`col ${styles.boardHeader} d-flex justify-content-between align-items-center`}>
            <h2 className={`${styles.title} m-0`}>게시판</h2>
            <Button onClick={()=>{navigate('/board/write')}}>글쓰기</Button>
          </div>
          <div className={`col ${styles.listHeader} d-flex justify-content-between`}>
            <p>총 {contents.length}건</p>
            <div className='order'>          
              {<select id="sort" className=" outline-none" onChange={onSelected}>
                <option value="createdAt">최신순</option>
                <option value="likeOrder">좋아요 순</option>
              </select>}
            </div>
          </div>
          {
            contents.map((content) => {
              return(
                <div key={content.id} className={`col ${styles.list}`} onClick={()=>{navigate(`/board/${content.id}`)}}>
                  <div className={styles.listTitle}>{content.title}</div>
                  <div className={`${styles.listInfo} regular`}>
                    <span className={styles.userid}>{content.user_id}</span>
                    <span className={styles.date}>{DateProcessing(content.createdAt)}</span>
                  </div>
                </div>
              )
            })
          }
        </div> 
      </Container>
    </>
  );
}

export default Board;
