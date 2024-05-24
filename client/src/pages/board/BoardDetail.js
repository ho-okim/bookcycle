import styles from '../../styles/board.module.css';
import { boardDetail, boardDelete, filesList } from '../../api/board.js';
import ReplyForm from '../../components/board/ReplyForm.js'
import Report from '../../components/Report.js';
import BoardContext from '../../contexts/BoardContext.js';
import Error from '../Error.js';
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { DashCircle, Ban, Trash3, Pencil, ExclamationTriangle } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext.js';
import { getReportedOrNot } from '../../api/report.js';



function BoardDetail(){

  const {id} = useParams();
  const { user } = useAuth();

	const navigate = useNavigate();

  const [isReported, setIsReported] = useState(true); // 신고 여부
  const [isBlocked, setIsBlocked] = useState(false); // 차단 여부
  const [myBlockedPost, setMyBlockedPost] = useState(false); // 내 글 차단 여부
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState([]); 
  const [files, setFiles] = useState(); // 파일의 배열
  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  useEffect(()=>{
    // 데이터 조회
    // api > board.js에서 특정 사용자 글 받아오기
    async function getBoardDetailData() {

      try {
        const data = await boardDetail(id)
      
          if (!data) {
            setNotFound(true)
          }

          // 차단이 안된 경우나 내 게시글인 경우에만 렌더링(차단되도 내 게시물이면 렌더링)
          if(data.blocked === 0 || data.user_id === user?.id) {
            const res = await filesList(id)
            setContent(data)
            setFiles(res)
          } else { // 차단된 게시글 렌더링 X
            setIsBlocked(true)
          }

          // 내 게시물인데 차단됐다면 그대로 내용 렌더링하고 '차단됐다'는 메시지 추가
          if(data.blocked === 1 && data.user_id === user?.id){
            setMyBlockedPost(true)
          } 
        }  catch (error) {
          console.error(error);
          setNotFound(true);
        }
      }
      

    async function getReported() { // 신고 여부 확인
      const res = await getReportedOrNot('board', id);
      setIsReported((isReported)=>((res === 0) ? false : true));
    }

    getBoardDetailData(); // 데이터 가져오기

    if (user) { // 로그인을 했을 때만 호출
      getReported();
    }
  }, [id, user]);


  if (notFound) {
    return <Error/>
  }

	// 데이터 삭제
	async function onDelete() {
		try {
				await boardDelete(id); 
				document.location.href = `/board`
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

  // 신고하기 기능
  function onSpam() {
    if(!user) {
      alert("로그인 후 이용하실 수 있습니다.")
    } else {
      handleOpen();
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

  return(
    <BoardContext.Provider value={{id, content}}>
      <Container className={styles.boardDetail}>
        <div className="inner">
          <div className={`${styles.titleWrap} d-flex justify-content-between align-items-center`}>
            <h2 className={styles.title}>게시글</h2>
          </div>
          <div className={`col ${styles.detailWrapper}`}>
            {(isBlocked) ? (
              <div className={`${styles.blockedPost} d-flex flex-column align-items-center`}>
                <img style={{width: '80px'}} className='mb-2' src={process.env.PUBLIC_URL + `/report2.png`}/>
                <div className='mb-3'>차단된 게시글입니다</div>
              </div>
            ) : (
              <div className={styles.detailMain}>
                {(myBlockedPost) && 
                <div className='d-flex flex-column mb-3'>
                  <img style={{width: '30px'}} className='me-2' src={process.env.PUBLIC_URL + `/report2.png`}/>
                  <div className='' style={{color : 'rgb(223, 0, 0)'}}>차단된 게시글입니다</div>
                </div>
                }
                <div className={`${styles.detailHeader} d-flex justify-content-between align-items-center`}>
                  <h2 className={styles.detailTitle}>{content.title}</h2>
                  {user?.nickname == content.nickname ? (
                    <div className={`${styles.btnWrap} d-flex`}>
                      <Button 
                        variant="outline-secondary" 
                        className={styles.updateBtn} 
                        onClick={()=>{navigate(`/board/edit/${content.id}`, {state:{title: content.title, content: content.content, files}})}}>
                        <Pencil className='me-1'/>글 수정
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        className={styles.deleteBtn} 
                        id={content.id} 
                        onClick={onDelete}>
                        <Trash3 className='me-1'/>글 삭제
                      </Button>
                      </div>
                  ): null}
                </div>
                <div className={`d-flex justify-content-between ${styles.detailInfo} regular`}>
                  <div className='info'>
                    <span className={`${styles.userid} medium`}>{content.nickname}</span>
                    <span className={styles.date}>{DateProcessing(content.createdAt)}</span>
                  </div>
                  {
                      (user && user?.id != content.user_id) ?
                      (!isReported ) ?
                      <>
                          <Button variant="outline-secondary" 
                            className={`${styles.alertBtn} d-flex`} 
                            onClick={onSpam}>
                            <img style={{width: '23px'}} className='me-1' src={process.env.PUBLIC_URL + `/report.png`}/>신고하기</Button>
                          <Report show={modalShow} handleClose={handleClose} targetId={id} category={'board'}/>
                      </>
                      :<div className='d-flex align-items-center'><DashCircle className='me-1'/>신고완료 게시글</div>
                      :null
                  }
                </div>
                <div className={styles.detailContentWrap}>
                  <div className={`${styles.detailImage} d-flex flex-column align-items-center`}>
                    {
                      files ?
                      files.map((el)=>{
                        return(
                          <img key={el.id}
                          src={process.env.PUBLIC_URL + `/img/board/${el.filename}`}
                          alt='board image' className={`${styles.boardImg}`}/>
                        )
                      })
                      : null
                    }
                  </div>
                  <div className={styles.deatilContent}>{content.content}</div>
                </div>
              </div>
            )}
            {!isBlocked && <ReplyForm/>}
          </div> 
        </div>
      </Container>
    </BoardContext.Provider>
  );
}

export default BoardDetail;