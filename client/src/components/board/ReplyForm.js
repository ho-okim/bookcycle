import styles from '../../styles/board.module.css'
import { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import {ChatLeftQuote} from 'react-bootstrap-icons';
import { replyWrite, replyList } from '../../api/board';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginUserContext';
import { Link } from 'react-router-dom'


function ReplyForm(props){
  const { id } = props;
  const { user } = useAuth();

  const navigate = useNavigate();

  // 댓글 조회
  // client api에 replyList 함수 호출해 -> db에서 댓글 가져오기(get)
  async function getReply(){
    const data = await replyList(id);
    return data;
  }

  // api에서 받아온 reply useState 삽입
  let [replies, setReplies] = useState([]);

  // 화면 최초로 rendering 될 때만 reply get 요청
  useEffect(()=>{
    let reply;
    const test = async () => {
      reply = await getReply()
      setReplies(reply)
    }
    test();
  }, [])


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
      navigate(`/board/${id}`);
    } else {
      setErrorMessage("댓글을 다시 확인해주세요");
    }
  }

  return(
    <>
      <ReplyList replies={replies}/>
      {user ? (
        <form className={styles.commentForm}>
          <div className={styles.commentId}>{user?.nickname}</div>
          <div className='d-flex justify-content-between'>
            <input name='comment' id='commentInput' className={styles.commentInput} onChange={(e)=>{handleReply(e.target.value)}}></input>
            <Button className={styles.submit} as="input" type="submit" value="등록" onClick={()=>{submitReply()}}/>
          </div>
        </form>
      ) : (
        <div className={`${styles.loginNeeded}`}>개인회원 <Link to='/login'><span className={styles.login}> 로그인</span></Link> 후에 댓글 작성이 가능합니다</div>
      ) 
      }
      
    </>
  )
}


function ReplyList(props){
  const { user } = useAuth();
  const {replies} = props;

  // 댓글 삭제
  // async function onDelete(id){
  //   try{
  //     await replyDelete(id);
  //     document.location.href = `/board/`
  //   }
  // }

  async function onDelete(){}

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
      <div className={`${styles.replyCount}`}>
        <span><ChatLeftQuote/></span> 댓글 <span>{replies.length}</span>개
      </div>
      {
        replies.map((reply) => {
          return(
            <div className={styles.commentList}>
              <div className={`${styles.commentInfo} d-flex justify-content-between regular`}>
                <div className='info'>
                  <span className={styles.userid}>{reply.nickname}</span>
                  <span className={styles.date}>{DateProcessing(reply.createdAt)}</span>
                </div>
                {user?.nickname == reply.nickname ? (
                  <Button variant="outline-secondary" className={styles.deleteBtn} id={reply.id} onClick={onDelete}>삭제</Button>
                ) : null}
                {user?.nickname !== reply.nickname ? (
                  <Button variant="outline-secondary" className={styles.deleteBtn}>신고하기</Button>
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

// reply 받아서 replyList에 props로 데이터 내려주고 props.content 등으로 받기