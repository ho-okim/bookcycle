import styles from '../../styles/board.module.css';
import { boardDetail, boardDelete, replyWrite, boardReply, filesList } from '../../api/board.js';
import ReplyForm from '../../components/board/ReplyForm.js'
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext.js';
import { getReportedOrNot } from '../../api/report.js';
import Report from '../../components/Report.js';


function BoardDetail(){

  const {id} = useParams();

  const { user } = useAuth();
  // console.log("로그인한 회원 정보: ", user)
  // console.log("로그인한 회원 닉네임: ", user?.nickname)
  
	const navigate = useNavigate();

  const [isReported, setIsReported] = useState(true); // 신고 여부

	// 데이터 조회
  // api > board.js에서 특정 사용자 글 받아오기
  async function getBoardDetail(){
    const data = await boardDetail(id)
    return data;
  }

  // api에서 받아온 특정 사용자의 글 useState에 삽입
  let [content, setContent] = useState([])
  // 파일의 배열
  const [files, setFiles] = useState()

  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  async function getReported() { // 신고 여부 확인
    const res = await getReportedOrNot('board', id);
    setIsReported((isReported)=>((res === 0) ? false : true));
  }

  useEffect(()=>{
    let boardDetail
    const getBoardData = async () => {
      boardDetail = await getBoardDetail()
      setContent(boardDetail)
    }

    const getBoardFile = async () => {
      let res = await getFiles()
      setFiles(res)
    }

    getBoardData()
    getBoardFile()
  }, [id])

  useEffect(()=>{ // 로그인 한 사용자가 신고 했었는지 확인
    if (user) { // 로그인을 했을 때만 호출
        getReported();
    }
  }, [user]);

  // 사진 파일 받아오기
  async function getFiles(){
    const data = await filesList(id)
    return data;
  }

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
    <>
      <Container className={styles.boardDetail}>
        <div className="inner">
          <div className={`${styles.titleWrap} d-flex justify-content-between align-items-center`}>
            <h2 className={styles.title}>게시글</h2>
          </div>

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
                    :<div>이미 신고했어요</div>
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
                <div>{content.content}</div>
              </div>
						</div>

            <ReplyForm id={id} likehits={content.likehit}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BoardDetail;