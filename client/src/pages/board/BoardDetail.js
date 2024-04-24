import styles from '../../styles/board.module.css';
import { boardDetail } from '../../api/board.js';
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';

function BoardDetail(){
  const {id} = useParams();
  console.log(id)

  // api > board.js에서 특정 사용자 글 받아오기
  async function getBoardDetail(){
    const data = await boardDetail(id)
    return data;
  }

  // api에서 받아온 특정 사용자의 글 useState에 삽입
  let [content, setContent] = useState([])

  useEffect(()=>{
    let boardDetail
    const test = async () => {
      boardDetail = await getBoardDetail()
      setContent(boardDetail)
    }
    test()
  }, [])

  console.log(content)


  // 날짜 yyyy-mm-dd 시:분
  function DateProcessing(date){
    
    let newDate = new Date(date)

    let year = newDate.getFullYear();
    let month = String(newDate.getMonth() + 1).padStart(2, '0');  // getMonth(): 0-11 출력해서 1 더해주기
    let day = String(newDate.getDate()).padStart(2, '0'); 
    
    // Construct the formatted date string in "yyyy-mm-dd" format
    let formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }


  return(
    <>
      <Container className={styles.boardDetail}>
        <div className="inner">
          <h2 className={styles.title}>게시글</h2>
          <div className={`col ${styles.detailWrapper}`}>
            {content.map((contentOne) => {
              return(
                <div className={styles.detailHeader}>
                  <h2 className={styles.detailTitle}>{contentOne.title}</h2>
                  <div className={`${styles.detailInfo} regular`}>
                    <span className={styles.userid}>{contentOne.id}</span>
                    <span className={styles.date}>{DateProcessing(contentOne.createdAt)}</span>
                  </div>
                  <div className={`${styles.detailContent} regular`}>{contentOne.content}</div>
                </div>
              )
            })}

            {/* 댓글 목록 */}
            <div className={styles.commentList}>
              <div className={`${styles.commentInfo} regular`}>
                <span className={styles.userid}>아이디</span>
                <span className={styles.date}>날짜</span>
              </div>
              <div className={styles.commentContent}>
                댓글 내용 여기 나옴
              </div>
            </div>

            {/* 댓글 작성 폼 */}
            <form className={styles.commentForm}>
              <div className={styles.commentId}>아이디</div>
              <div className='d-flex justify-content-between'>
                <input name='comment' id='commentInput' className={styles.commentInput}></input>
                <Button className="submit" as="input" type="submit" value="등록"/>
              </div>
            </form>
          </div>

          
        </div>
      </Container>
    </>
  );
}

export default BoardDetail;