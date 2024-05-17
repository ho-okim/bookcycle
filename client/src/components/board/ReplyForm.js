import styles from '../../styles/board.module.css'
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import {ChatLeftQuote} from 'react-bootstrap-icons';
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import { BalloonHeart } from 'react-bootstrap-icons';
import { BalloonHeartFill } from 'react-bootstrap-icons';
import { replyWrite, replyList, replyDelete, likeCount, hitLike, unLike, likeState } from '../../api/board';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext';
import { Link } from 'react-router-dom'


// 댓글 작성 폼 ---------------------------------------------
function ReplyForm(props){
  // id = boardDetail이 내려준 게시글 id 
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



// 댓글 목록 및 좋아요---------------------------------------------
function ReplyList(props){
  const { user } = useAuth();
  const {boardId} = props;

  const [errorMessage, setErrorMessage] = useState('');

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

  // 좋아요 상태 조회
  async function getLikeState(){
    const data = await likeState(boardId);
    return data;
  }

  // api에서 받아온 reply/likeCount/likeState - useState 삽입
  let [replies, setReplies] = useState([]);
  let [likeCounts, setLikeCounts] = useState(0);
  let [likeStates, setLikeStates] = useState([])


  // 화면 최초로 rendering 될 때만 reply/likeCount/likeState 요청
  useEffect(()=>{
    let reply;
    let likeCount;
    let likeState;

    const test = async () => {
      reply = await getReply();
      likeCount = await getLikeCount();
      likeState = await getLikeState();

      setReplies(reply)
      setLikeCounts(likeCount)
      setLikeStates(likeState)
    }
    test();
  }, [])

  console.log("좋아요 개수: ", likeCounts)
  console.log("로그인 회원이 좋아요한 게시글(likeStates): ", likeStates)
  console.log("boardId: ", boardId)

  // setLikeStates(likeState) - 만약 현재 게시글의 boardId와 likeState 안에 board_id가 일치하는 게 있다면 💛 / 없다면 🤍 -> find() 활용


  // 빈 하트 클릭 : '좋아요'로 바꾸기 🤍 -> 💛
  const changeToLike = async() => {

    if (!user){
      alert("로그인 후 이용하실 수 있습니다.")
    } else{
      hitLike(boardId)

      // 기존 prevlikeStates에 새로운 state 추가
      setLikeStates(prevLikeStates => [...prevLikeStates, {user_id: user?.id, board_id: Number(boardId)}])

      // 기존 prevLikeCounts에 + 1
      setLikeCounts(prevLikeCounts => ({...prevLikeCounts, likehit: likeCounts.likehit + 1}))
    }
  }

  // 채워진 하트 클릭 : '좋아요 취소' 하기 💛 ->  🤍
  const changeToUnLike = async() => {

    if (!user){
      alert("로그인 후 이용하실 수 있습니다.")
    } else {
      unLike(boardId)

      // 기존에 존재하던 prevlikeStates에 해당 state 제거
      setLikeStates(prevLikeStates => prevLikeStates.filter(likeState => likeState.board_id !== Number(boardId)));
  
      // 기존 prevLikeCounts에 - 1
      setLikeCounts(prevLikeCounts => ({...prevLikeCounts, likehit: likeCounts.likehit - 1}))
    }
  }

  const noUserLike = async() => {
    alert("로그인 후 이용하실 수 있습니다.")
  }


  // 댓글 삭제
  // id = reply.id(삭제할 댓글의 id) 
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
          {
            !user ? (
              <div className={styles.heartCount}>
                <BalloonHeart size="20" className={styles.heartIcon} onClick={() => noUserLike()}/>
                <span>좋아요 </span>
                <span className={styles.likeCounts}>{likeCounts.likehit}</span>개
              </div>
            ) : (
              <div className={styles.heartCount}>
                { 
                  likeStates.find(el => el.board_id === Number(boardId))
                  ? <BalloonHeartFill size="20" className={styles.heartIcon} onClick={() => changeToUnLike()}/>
                  : <BalloonHeart size="20" className={styles.heartIcon} onClick={() => changeToLike()}/>
                }
                <span>좋아요 </span>
                <span className={styles.likeCounts}>{likeCounts.likehit}</span>개
              </div>
            )
          }
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