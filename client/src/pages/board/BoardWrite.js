import '../../styles/board.css'
import { useEffect, useState } from 'react';
import boardWrite from '../../api/boardWrite.js';
import { Navigate, useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { Camera, XCircleFill } from 'react-bootstrap-icons'

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

  // 이미지 미리보기 함수
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  const onchangeImageUpload = (event) => {
    const imageLists = event.target.files;
    let imageUrlLists = [...uploadImgUrl];

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
    }

    if (imageUrlLists.length > 5) {
      imageUrlLists = imageUrlLists.slice(0, 5);
    }

    setUploadImgUrl(imageUrlLists);
  };

  // useEffect(()=>{
  //   console.log('uploadImg: ', uploadImgUrl)
  // }, [uploadImgUrl])

  // X 버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id) => {
    setUploadImgUrl(uploadImgUrl.filter((_, index) => index !== id));
  };


  return (
    <>
      <Container className="board-write sec">
        <form action="/boardwrite" method="post" id="post-form" encType="multipart/form-data"> 
          <div className="inner board-form">
            <h3 className="title">게시글 작성</h3>
            <div className='img-box row p-0 g-3 gy-3'>
              <div className='col-6 col-sm-4 col-lg-2'>
                <div className='imageUploadBtn'>
                  {/* 이미지 업로드 버튼 */}
                  <Camera className='previewDefaultImg'/>
                  <label htmlFor="file" className="fileBtn"></label>
                  <input type="file" multiple name='postImg' id='file' accept="image/*" onChange={onchangeImageUpload}/>
                </div>
              </div>
              { // uploadImgUrl이 존재할 때 요소 생성
                uploadImgUrl && uploadImgUrl.map((img, id)=>{
                  return(
                    <div className='col-6 col-sm-4 col-lg-2' key={id}>
                      <div className='uploadedImgBox'>
                        <img className='previewImg' alt='preview' src={img}/>
                        <button className='previewImgDelBtn' type='button' onClick={() => handleDeleteImage(id)}><XCircleFill/></button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="col title-box d-flex justify-content-between">
              <label htmlFor="title">제목</label>
              <input className="title-input" id="title" placeholder="제목을 입력하세요" value={form.title} onChange={(e)=>{handleTitle(e.target.value)}}></input>
            </div>
            <div className="col content-box d-flex justify-content-between">
              <label htmlFor="content">내용</label>
              <textarea className="content-input" id="content" placeholder="내용을 입력하세요" value={form.content} onChange={(e)=>{handleContent(e.target.value)}}></textarea>
            </div>
            <div className="col btn-wrap d-flex justify-content-end">
              <Button variant="outline-secondary" className="reset" as="input" type="reset" value="취소" onClick={()=>{navigate('/board')}}/>
              <Button className="submit" as="input" type="submit" value="등록" onClick={()=>{check()}}/>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

export default BoardWrite;