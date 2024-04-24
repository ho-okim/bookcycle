import styles from '../../styles/board.module.css';
import { useState } from 'react';
import {boardWrite} from '../../api/board.js';
import { useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';

function BoardWrite() {

  const [form, setForm] = useState({title : '', content : ''});

  const navigate = useNavigate();
  
  function handleTitle(value){
    setForm({...form, title : value});
  }

  function handleContent(value){
    setForm({...form, content : value});
  }

  // form = {title : value, content : value}
  async function check(){
    const title = form.title;
    const content = form.content;

    // 제목이나 내용 비어있으면 alert
    if(!title || title === ''){
      alert("제목을 입력해주세요");
      return;
    }
    if(!content || content === ''){
      alert('내용을 입력해주세요');
      return;
    }
    
    // 제목, 내용 다 있으면 데이터를 서버에 전송하기 위해
    // boardWrite 함수 호출
    const res = await boardWrite(title, content);

    if(res.message == 'success'){
      navigate("/board");
      return;
    } else{
      alert("제목이나 내용을 다시 확인해주세요");
      return;
    }
  }


  return (
    <>
      <Container className="boardWrite">
        <div className={`inner ${styles.boardForm}`}>
          <h2 className={styles.title}>게시글 작성</h2>
          <div className={`col ${styles.titleBox} d-flex justify-content-between`}>
            <lable for="title">제목</lable>
            <input className={styles.titleInput} id="title" placeholder="제목을 입력하세요" value={form.title} onChange={(e)=>{handleTitle(e.target.value)}}></input>
          </div>
          <div className={`col ${styles.contentBox} d-flex justify-content-between`}>
            <lable for="content">내용</lable>
            <textarea className={styles.contentInput} id="content" placeholder="내용을 입력하세요" value={form.content} onChange={(e)=>{handleContent(e.target.value)}}></textarea>
          </div>
          <div className={`col ${styles.btnWrap} d-flex justify-content-end`}>
            <Button variant="outline-secondary" className={styles.reset} as="input" type="reset" value="취소" onClick={()=>{navigate('/board')}}/>
            <Button className={styles.submit} as="input" type="submit" value="등록" onClick={()=>{check()}}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BoardWrite;