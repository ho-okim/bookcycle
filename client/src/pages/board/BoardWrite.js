import '../../styles/board.css'
import { useState } from 'react';
import boardWrite from '../../api/boardWrite.js';
import { Navigate, useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';

function BoardWrite() {

  const [form, setForm] = useState({title : '', content : ''});
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  
  function handleTitle(value){
    setForm({...form, title : value});
  }

  function handleContent(value){
    setForm({...form, content : value});
  }

  async function check(){
    const title = form.title;
    const content = form.content;

    if(!title || title === ''){
      setErrorMessage('제목을 입력해주세요');
      return;
    }
    if(!content || content === ''){
      setErrorMessage('내용을 입력해주세요');
      return;
    }
    
    const res = await boardWrite(title, content);

    if(res.message == 'success'){
      Navigate("/board");
      return;
    } else{
      setErrorMessage("제목이나 내용을 다시 확인해주세요");
      return;
    }
  }


  return (
    <>
      <Container className="board-write">
        <div className="inner board-form">
          <h3 className="title">게시글 작성</h3>
          <div className="col title-box d-flex justify-content-between">
            <lable for="title">제목</lable>
            <input className="title-input" id="title" placeholder="제목을 입력하세요" value={form.title} onChange={(e)=>{handleTitle(e.target.value)}}></input>
          </div>
          <div className="col content-box d-flex justify-content-between">
            <lable for="content">내용</lable>
            <textarea className="content-input" id="content" placeholder="내용을 입력하세요" value={form.content} onChange={(e)=>{handleContent(e.target.value)}}></textarea>
          </div>
          <div className="col btn-wrap d-flex justify-content-end">
            <Button variant="outline-secondary" className="reset" as="input" type="reset" value="취소" onClick={()=>{navigate('/board')}}/>
            <Button className="submit" as="input" type="submit" value="등록" onClick={()=>{check()}}/>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BoardWrite;