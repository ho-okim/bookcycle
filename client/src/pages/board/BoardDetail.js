import styles from '../../styles/board.module.css';
import { boardDetail, boardDelete } from '../../api/board.js';
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import Report from '../../components/Report.js';
import { MegaphoneFill } from 'react-bootstrap-icons';

function BoardDetail(){
  const {id} = useParams();
  console.log("게시글 id :", id)


	const navigate = useNavigate();

	// 데이터 조회
  // api > board.js에서 특정 사용자 글 받아오기
  async function getBoardDetail(){
    const data = await boardDetail(id)
    return data;
  }

  // api에서 받아온 특정 사용자의 글 useState에 삽입
  let [content, setContent] = useState([])

  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  useEffect(()=>{
    let boardDetail
    const test = async () => {
      boardDetail = await getBoardDetail()
      setContent(boardDetail)
    }
    test()
  }, [])

  console.log("게시글 내용: ", content)


	// 데이터 삭제
	async function onDelete() {
		try {
				await boardDelete(id); 
				document.location.href = `/board`
				console.log("삭제id: ", id)
		} catch (error) {
				console.error(error);
		}
	}


  // 날짜 yyyy-mm-dd 시:분
  function DateProcessing(date){
    
    let newDate = new Date(date)

    let year = newDate.getFullYear();
    let month = String(newDate.getMonth() + 1).padStart(2, '0');  // getMonth(): 0-11 출력해서 1 더해주기
    let day = String(newDate.getDate()).padStart(2, '0'); 
    
    let formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }

  const handleClose = () => { // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => { // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };

  return(
    <>
      <Container className={styles.boardDetail}>
        <div className="inner">
          <h2 className={styles.title}>게시글</h2>
          <div className={`col ${styles.detailWrapper}`}>
						<div className={styles.detailMain}>
							<div className={`${styles.detailHeader} d-flex justify-content-between`}>
								<h2 className={styles.detailTitle}>{content.title}</h2>
								<div className={styles.btnWrap}>
									<Button variant="outline-secondary" className={styles.updateBtn} onClick={()=>{navigate(`/board/edit/${content.id}`)}}>글 수정</Button>
									<Button variant="outline-secondary" className={styles.deleteBtn} id={content.id} onClick={onDelete}>글 삭제</Button>
								</div>
							</div>
							<div className={`${styles.detailInfo} regular`}>
								<span className={styles.userid}>{content.user_id}</span>
								<span className={styles.date}>{DateProcessing(content.createdAt)}</span><Button variant='danger' size="sm" onClick={handleOpen}
                    ><MegaphoneFill/> 신고</Button>
							</div>
							<div className={`${styles.detailContent} regular`}>{content.content}</div>
						</div>

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
							<div className={styles.commentId}>{content.user_id}</div>
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