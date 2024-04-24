import '../../styles/board.css'
import { useState, useRef } from 'react';
import {boardWrite, fileupload} from '../../api/boardWrite.js';
import { useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { Camera, XCircleFill } from 'react-bootstrap-icons'

function BoardWrite() {

  const [form, setForm] = useState({title : '', content : ''});
  const [errorMessage, setErrorMessage] = useState('');

  const fileRef = useRef()

  const navigate = useNavigate();
  
  function handleTitle(value){
    setForm({...form, title : value});
  }

  function handleContent(value){
    setForm({...form, content : value});
  }

  // 파일의 실제 정보 담는 useState
  const [uploadImg, setUploadImg] = useState("")

  // 이미지 미리보기 URL 담는 useState
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  // 이미지 미리보기 함수
  const onchangeImageUpload = (event) => {
    // 하나씩 업로드하면 하나만 들어오고 다중 선택해서 한 번에 업로드 해야 배열로 한번에 들어옴
    const imageLists = event.target.files;
    let imageUrlLists = [...uploadImgUrl];
    // setUploadImg를 위한 카피본 작성
    let uploadImgLists = [...uploadImg]

    for (let i = 0; i < imageLists.length; i++) {
      // URL로 변경한 이미지를 imageUrlLists에 삽입
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);

      // file 정보를 uploadImgLists에 삽입
      uploadImgLists.push(imageLists[i])
    }

    // 사진 개수 5개 넘으면 이전에 업로드된 파일들까지만 slice
    if (imageUrlLists.length > 5) {
      imageUrlLists = imageUrlLists.slice(0, 5);
      uploadImgLists = uploadImgLists.slice(0, 5);
    }

    setUploadImgUrl(imageUrlLists);
    setUploadImg(uploadImgLists)
  };

  // X 버튼 클릭 시 이미지 파일 삭제
  const handleDeleteImage = (id) => {
    setUploadImgUrl(uploadImgUrl.filter((_, index) => index !== id));
    setUploadImg(uploadImg.filter((_, index) => index !== id));
  };

  // 등록 버튼 누르면 실행되는 함수
  const check = async() => {
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

    const formData = new FormData()
    for(let i = 0; i < uploadImg.length; i++){
      formData.append('files', uploadImg[i])
    }
    
    const res = await boardWrite(title, content);
    formData.append('boardId', res.insertId)
    const fileRes = await fileupload(formData)

    if(res.message == 'success' && fileRes == 'OK'){
      navigate("/board");
    } else {
      setErrorMessage("제목이나 내용을 다시 확인해주세요");
    }
  }

  return (
    <>
      <Container className="board-write sec">
        <form method="post" id="post-form" encType="multipart/form-data" onSubmit={(e)=>{e.preventDefault()}}> 
          <div className="inner board-form">
            <h3 className="title">게시글 작성</h3>
            <div className='img-box row p-0 g-3 gy-3'>
              <div className='col-6 col-sm-4 col-lg-2'>
                <div className='imageUploadBtn'>
                  {/* 이미지 업로드 버튼 */}
                  <Camera className='previewDefaultImg'/>
                  <label htmlFor="file" className="fileBtn"></label>
                  <input type="file" multiple name='postImg' id='file' accept="image/*" onChange={onchangeImageUpload} ref={fileRef}/>
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