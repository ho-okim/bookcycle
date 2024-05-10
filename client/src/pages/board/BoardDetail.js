import styles from '../../styles/board.module.css';
import { boardDetail, boardDelete, replyWrite, boardReply } from '../../api/board.js';
import ReplyForm from '../../components/board/ReplyForm.js'
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { Heart } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import Report from '../../components/Report.js';
import { useAuth } from '../../contexts/LoginUserContext.js';


function BoardDetail(){

  const {id} = useParams();

  const { user } = useAuth();
  console.log("로그인한 회원 정보: ", user)
  console.log("로그인한 회원 닉네임: ", user?.nickname)
  
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

  // console.log("게시글 내용: ", content)
  console.log("게시글 작성자 nickname: ", content.nickname)


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


  const handleClose = () => { // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => { // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };


  // 날짜 yyyy-mm-dd 시:분
  function DateProcessing(date){
  
    let newDate = new Date(date)

    let year = newDate.getFullYear();
    let month = String(newDate.getMonth() + 1).padStart(2, '0');  // getMonth(): 0-11 출력해서 1 더해주기
    let day = String(newDate.getDate()).padStart(2, '0'); 
    
    let formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }

  return(
    <>
      <Container className={styles.boardDetail}>
        <div className="inner">
          <h2 className={styles.title}>게시글</h2>
          <div className={`col ${styles.detailWrapper}`}>
						<div className={styles.detailMain}>
              <div className={`d-flex justify-content-end`}><Heart className={styles.heartBtn}/></div>
							<div className={`${styles.detailHeader} d-flex justify-content-between align-items-center`}>
								<h2 className={styles.detailTitle}>{content.title}</h2>
                {user?.nickname == content.nickname ? (
                  <div className={`${styles.btnWrap}`}>
                    <Button variant="outline-secondary" className={styles.updateBtn} onClick={()=>{navigate(`/board/edit/${content.id}`)}}>글 수정</Button>
                    <Button variant="outline-secondary" className={styles.deleteBtn} id={content.id} onClick={onDelete}>글 삭제</Button>
								  </div>
                ): null}
								
							</div>
							<div className={`d-flex justify-content-between ${styles.detailInfo} regular`}>
                <div className='info'>
                  <span className={styles.userid}>{content.nickname}</span>
                  <span className={styles.date}>{DateProcessing(content.createdAt)}</span>
                </div>
                <div className={`${styles.spamBtn} medium`}>신고하기</div>
							</div>
							<div className={`${styles.detailContent}`}>{content.content}</div>
						</div>

            <ReplyForm id={id}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BoardDetail;