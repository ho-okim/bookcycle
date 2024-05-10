import styles from '../../styles/board.module.css'
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import {ChatLeftQuote} from 'react-bootstrap-icons';
import { Heart } from 'react-bootstrap-icons';
import { replyWrite, replyList, replyDelete, likeCount } from '../../api/board';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext';
import { Link } from 'react-router-dom'


// 댓글 작성 폼
function ReplyForm(props){
  // boardDetail이 내려준 게시글 id 
  // -> 댓글 삭제시 해당 게시글로 navigate 하기 위해, 댓글 목록(replyList)으로 내려준다
  const { id } = props; 
  const { user } = useAuth(); 

  const navigate = useNavigate();

  // 댓글 작성
  // client api에 replyWrite 함수 호출해 -> db에 댓글 등록하기(post)
  const [reply, setReply] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleReply(value){
    setReply(value)
  }

  // 댓글 등록 버튼 누르면 실행
  const submitReply = async()=>{
    if(!reply || reply === ''){
      alert("댓글을 입력해주세요")
      return;
    }

    console.log("댓글 등록 내용: ", reply)

    // client api 함수 호출해 등록된 reply -> server에 날리기(server에서 update 쿼리 실행)
    const res = await replyWrite(id, reply);

    if(res.message == 'success'){
      navigate(0);
    } else {
      setErrorMessage("댓글을 다시 확인해주세요");
    }
  }

  return(
    <>
      <ReplyList boardId={id}/>
      {user ? (
        <form className={styles.replyForm} onSubmit={(e)=>{e.preventDefault();}}>
          <div className={styles.replyId}>{user?.nickname}</div>
          <div className='d-flex justify-content-between'>
            <input name='comment' id='commentInput' className={styles.replyInput} onChange={(e)=>{handleReply(e.target.value)}}></input>
            <Button className={styles.replySubmit} as="input" type="submit" value="등록" onClick={()=>{submitReply()}}/>
          </div>
        </form>
      ) : (
        <div className={`${styles.loginNeeded}`}>개인회원 <Link to='/login' className={styles.login}><span> 로그인</span></Link> 후에 댓글 작성이 가능합니다</div>
      ) 
      }
    </>
  )
}



// 댓글 목록
function ReplyList(props){
  const { user } = useAuth();
  const {boardId} = props;

  const [errorMessage, setErrorMessage] = useState('');

  const [isLike, setIsLike] = useState('')
  // setIsLike 함수 이용해 아래 조건 모두 충족하면 liked / 하나라도 아니면 unliked로 update
  // board.id = board_liked.board_id
  // user.id = board_liked.user_id


  const navigate = useNavigate();


  // 댓글 조회
  async function getReply(){
    const data = await replyList(boardId);
    return data;
  }

  // 좋아요 개수 조회
  async function getLikeCount(){
    const data = likeCount(boardId);
    return data;
  }

  // api에서 받아온 likeCount useState 삽입
  let [likeCounts, setLikeCounts] = useState(0);
  // api에서 받아온 reply useState 삽입
  let [replies, setReplies] = useState([]);

  // 화면 최초로 rendering 될 때만 reply/likeCount 요청(+이후 좋아요상태 여부도 추가)
  useEffect(()=>{
    let reply;
    let likeCount;
    const test = async () => {
      reply = await getReply();
      likeCount = await getLikeCount();

      setReplies(reply)
      setLikeCounts(likeCount)
    }
    test();
  }, [])

  console.log("좋아요 개수: ", likeCounts.likehit)

  // 댓글 삭제
  // id는 reply.id(삭제할 댓글의 id) -> api 함수의 인자로 전달
  async function onDelete(id){
    console.log("삭제한 댓글 id: ", id)
    console.log("게시글 아이디: ", boardId)
    
    const res = await replyDelete(id);

    if(res.message == 'success'){
      navigate(0);
    } else{
      setErrorMessage("댓글이 삭제되지 않았습니다.")
    }
  }



  const handleLike = async()=>{

  }

  // 좋아요 등록
  // const handleLike = async()=>{
  //   // unliked 상황에서 좋아요 누르면
  //   // -> board_id와 user_id 등록
  //   if (isLike == unliked){
  //     const res = await likeActive(user?.id, boardId);
  //     if(res.message == 'success'){
  //       navigate(0);
  //     } else {
  //       setErrorMessage("좋아요 등록 실패");
  //     }
  //   } else { // liked 상황에서 좋아요 누르면 -> 열 삭제
  //     const res = await likeDelete(user?.id, boardId);
  //     if(res.message == 'success'){
  //       navigate(0);
  //     } else {
  //       setErrorMessage("좋아요 취소 실패");
  //     }
  //   }
  // }


  // 신고하기 기능
  async function onSpam(){
    if(!user){
      alert("로그인 후 이용하실 수 있습니다.")
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
      <div className={`${styles.replyHeader} d-flex justify-content-between align-items-center`}>
        <div className={`${styles.replyCountWrap} d-flex`}>
          <div className={styles.replyCount}>
            <ChatLeftQuote size="20" className={styles.chatIcon}/>
            <span>댓글 </span>
            <span className={styles.replyLength}>{replies.length}</span>개
          </div>
          <div className={styles.heartCount}>
            <Heart size="20" className={styles.heartIcon} onClick={() => handleLike()}/>
            <span>좋아요 </span>
            <span className={styles.likeCounts}>{likeCounts.likehit}</span>개
          </div>
        </div>
        <Button variant="outline-secondary" className={`${styles.goBoard}`} onClick={()=>{navigate('/board')}}>목록으로</Button>
      </div>
      {
        replies.map((reply) => {
          return(
            <div key={reply.id} className={styles.replyList}>
              <div className={`${styles.replyInfo} d-flex justify-content-between regular`}>
                <div className='info'>
                  <span className={styles.userid}>{reply.nickname}</span>
                  <span className={styles.date}>{DateProcessing(reply.createdAt)}</span>
                </div>
                {user?.nickname == reply.nickname ? (
                  <Button variant="outline-secondary" className={styles.deleteBtn} onClick={()=>onDelete(reply.id)}>삭제</Button>
                ) : null}
                {user?.nickname !== reply.nickname ? (
                  <Button variant="outline-secondary" className={styles.alertBtn} onClick={onSpam}>신고하기</Button>
                ) : null}
              </div>
              <div className={styles.commentContent}>
                {reply.content}
              </div>
            </div>
          )
        })
      }
    </>
  )
}

export default ReplyForm;