import styles from '../../styles/boardWrite.module.css';
import { useState, useEffect } from 'react';
import {boardEdit, boardDetail, boardWrite, fileupload} from '../../api/board.js';
import { Navigate, useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { Camera, XCircleFill } from 'react-bootstrap-icons'
import { useParams } from 'react-router-dom';

function BoardEdit() {
  const {id} = useParams();
  console.log("게시글 id :", id)

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // 수정 전 default 데이터 가져오기
  // api > board.js에서 특정 사용자 글 받아오기
  async function getDefaultData(){
    const data = await boardDetail(id)
    return data;
  }

  // api에서 받아온 특정 사용자의 글 defaultData에 삽입
  let [defaultData, setDefault] = useState([])

  // 최초 실행할 때 getDefaultContent()에서 기본값(defaultContent) 받아
  // defaultData에 꽂아준다 -> 이걸로 원래 title, content를 받아오는 것
  useEffect(()=>{
    let defaultData
    const test = async () => {
      defaultData = await getDefaultData()
      setDefault(defaultData)
    }
    test()
  }, [])

  console.log("←수정 전 default title: ", defaultData.title)
  console.log("←수정 전 default content: ", defaultData.content)


  // title, content 각각 useState로 defaultData.title / defaultData.content로 받고 
  // -> handleTitle / handleContent 콜백 실행해 e.target.value(수정값) 꽂아주기 
  const [title, setTitle] = useState(defaultData.title)
  const [content, setContent] = useState(defaultData.content)

  function handleTitle(e) {
      setTitle(e.target.value);
  }

  function handleContent(e) {
      setContent(e.target.value);
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

    // title과 content의 값이 변경되지 않으면(onChange 이벤트 발생x) default data 그대로 제출 되도록 해야 함
    // onChange 발생하지 않을 때의 값은 undefined -> undefined의 경우 default 값 받고, 아니면 수정값 받으면 됨
    const finalTitle = title === undefined ? defaultData.title : title;

    const finalContent = content === undefined ? defaultData.content : content;
  
    console.log("수정 후 title:", finalTitle);
    console.log("수정 후 content:", finalContent)

  
    // 제목이나 내용 비어있으면 alert
    if (!finalTitle || finalTitle === '') {
      alert("제목을 입력해주세요");
      return;
    }
    if (!finalContent || finalContent === '') {
      alert('내용을 입력해주세요');
      return;
    }

    const formData = new FormData()
    for(let i = 0; i < uploadImg.length; i++){
      formData.append('files', uploadImg[i])
    }
    
    // 제목, 내용 다 있으면 데이터를 서버에 전송하기 위해
    // boardWrite 함수 호출
    const res = await boardEdit(id, finalTitle, finalContent);

    formData.append('boardId', res.insertId)
    const fileRes = await fileupload(formData)

    if(res.message == 'success' && fileRes == 'OK'){
      navigate(`/board/${id}`);
    } else {
      setErrorMessage("제목이나 내용을 다시 확인해주세요");
    }
  }


  return (
    <>
      <Container className="board-write sec">
        <form method="post" id="post-form" encType="multipart/form-data" onSubmit={(e)=>{e.preventDefault()}}> 
          <div className={`inner ${styles.boardForm}`}>
            <h3 className="title">게시글 수정</h3>
            <div className={`${styles.imgBox} ${styles.row} row p-0 g-3 gy-3`}>
              <div className='col-6 col-sm-4 col-lg-2'>
                <div className={`${styles.imageUploadBtn}`}>
                  {/* 이미지 업로드 버튼 */}
                  <Camera className={`${styles.previewDefaultImg}`}/>
                  <label htmlFor="file" className={`${styles.fileBtn}`}></label>
                  <input type="file" multiple name='postImg' id='file' accept="image/*" onChange={onchangeImageUpload}/>
                </div>
              </div>
              { // uploadImgUrl이 존재할 때 요소 생성
                uploadImgUrl && uploadImgUrl.map((img, id)=>{
                  return(
                    <div className='col-6 col-sm-4 col-lg-2' key={id}>
                      <div className={`${styles.uploadedImgBox}`}>
                        <img className={`${styles.previewImg}`} alt='preview' src={img}/>
                        <button className={`${styles.previewImgDelBtn}`} type='button' onClick={() => handleDeleteImage(id)}><XCircleFill/></button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className={`col ${styles.col} ${styles.titleBox} d-flex justify-content-between`}>
              <label htmlFor="title">제목</label>
              <input className={`${styles.titleInput}`} id="title" placeholder="제목을 입력하세요" defaultValue={defaultData.title} onChange={(e)=>{handleTitle(e)}}></input>
            </div>
            <div className={`col ${styles.col} ${styles.contentBox} d-flex justify-content-between`}>
              <label htmlFor="content">내용</label>
              <textarea className={`${styles.contentInput}`} id="content" placeholder="내용을 입력하세요" defaultValue={defaultData.content} onChange={(e)=>{handleContent(e)}}></textarea>
            </div>
            <div className={`col ${styles.col} ${styles.btnWrap} d-flex justify-content-end`}>
              <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate('/board')}}/>
              <Button className="submit" as="input" type="submit" value="등록" onClick={()=>{check()}}/>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

export default BoardEdit;