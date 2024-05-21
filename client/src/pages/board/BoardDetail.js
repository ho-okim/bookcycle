import styles from '../../styles/board.module.css';
import { boardDetail, boardDelete, replyWrite, boardReply, filesList } from '../../api/board.js';
import ReplyForm from '../../components/board/ReplyForm.js'
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { DashCircle } from 'react-bootstrap-icons';
import { Ban } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext.js';
import { getReportedOrNot } from '../../api/report.js';
import Report from '../../components/Report.js';
import BoardContext from '../../contexts/BoardContext.js';


function BoardDetail(){

  const {id} = useParams();
  const { user } = useAuth();

	const navigate = useNavigate();

  const [isReported, setIsReported] = useState(true); // 신고 여부

  // api에서 받아온 특정 사용자의 글 useState에 삽입
  let [content, setContent] = useState([])
  // 파일의 배열
  const [files, setFiles] = useState()

  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  // // 로그인 회원인 경우 - 내 차단된 게시물인지 or 차단된 다른 회원 게시물인지
  // // 일반 회원인 경우 - 차단된 게시물 처리
  // async function getBlockState(){ 

  //   if (content.user_id == user?.id){
  //     setBlockState("myBlockedPost")
  //   }

  //   if((content.user_id !== user?.id) || (!user)){
  //     setBlockState("blockedPost")
  //   }
  // }

  // content.blocked == 1 인데 내 게시물인 경우 myblockedpost
  // 다른 회원 게시물이거나(||) 일반 회원의 경우 blockedpost
  // 그 외는 그냥 보이게

  useEffect(()=>{
    // 데이터 조회
    // api > board.js에서 특정 사용자 글 받아오기
    async function getBoardDetailData() {
      const data = await boardDetail(id)
      setContent(data)
      
      // 차단이 안된 경우나 내 게시글인 경우에만 렌더링
      if(data.blocked === 0 || data.user_id === user?.id) {
        const res = await filesList(id)
        setFiles(res)
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
            {/* <div className={`${styles.blockedDetail} d-flex flex-column align-items-center`}>
              <div><Ban size='100' className='mb-4'/></div>
              <div>해달이 너무 귀여워서 차단된 게시글입니다</div>
            </div> */}
          <div className={`col ${styles.detailWrapper}`}>
            <div className={styles.detailMain}>
              <div className={`${styles.detailHeader} d-flex justify-content-between align-items-center`}>
                <h2 className={styles.detailTitle}>{content.title}</h2>
                {user?.nickname == content.nickname ? (
                  <div className={`${styles.btnWrap}`}>
                    <Button variant="outline-secondary" className={styles.updateBtn} onClick={()=>{navigate(`/board/edit/${content.id}`, {state:{title: content.title, content: content.content, files}})}}>글 수정</Button>
                    <Button variant="outline-secondary" className={styles.deleteBtn} id={content.id} onClick={onDelete}>글 삭제</Button>
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
                        <div className={`${styles.spamBtn} medium`} onClick={onSpam}>신고하기</div>
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
            <ReplyForm/>
          </div> 
        </div>
      </Container>
    </BoardContext.Provider>
  );
}

export default BoardDetail;