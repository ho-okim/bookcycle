import styles from '../../styles/boardWrite.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { boardWrite, fileupload } from '../../api/board.js';
import { useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { Camera, XCircleFill } from 'react-bootstrap-icons'
import { useAuth } from '../../contexts/LoginUserContext.js';
import EmptyError from '../../components/EmptyError.js';

function BoardWrite() {
  const { user } = useAuth(); // 로그인 한 사용자

  const [form, setForm] = useState({title : '', content : ''});
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotFirstCheck, setIsNotFirstCheck] = useState(false);
  const [triggerVibration, setTriggerVibration] = useState(true);
  const scrollTopRef = useRef();
  const contentRef = useRef();

  const navigate = useNavigate();

  function handleTitle(value){
    setForm({...form, title : value});
  }

  function handleContent(value){
    setForm({...form, content : value});
  }
  
  // textarea 높이 자동 조절 함수
  const handleResizeHeight = useCallback(() => {
    contentRef.current.style.height = "1rem";
    contentRef.current.style.height = contentRef.current.scrollHeight + "px";
  }, []);

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
    setIsNotFirstCheck(true)
    const title = form.title;
    const content = form.content;

    // 제목이나 내용 비어있으면 alert
    if(!title || title === '' || !content || content === ''){
      scrollTopRef.current?.scrollIntoView({behavior: 'smooth'})

      // EmptyError 컴포넌트 애니메이션 관리
      setTriggerVibration(true);
      setTimeout(() => setTriggerVibration(false), 2000);

      return;
    }

    const formData = new FormData()
    for(let i = 0; i < uploadImg.length; i++){
      formData.append('files', uploadImg[i])
    }
    
    // 제목, 내용 다 있으면 데이터를 서버에 전송하기 위해
    // boardWrite 함수 호출
    const res = await boardWrite(title, content);
    formData.append('boardId', res.insertId)
    const fileRes = await fileupload(formData)

    if(res.message == 'success'){
      navigate("/board");
    } else {
      setErrorMessage("제목이나 내용을 다시 확인해주세요");
    }
  }

  useEffect(()=>{ // 타이틀 설정
    document.title = "게시글 작성";
  }, []);

  if (!user) { // 로그인 안 한 사용자의 접근 차단
    navigate("/login");
  } else if (user && user.blocked === 1) { // 차단된 사용자 접근 차단
    navigate("/error/401");
  }

  return (
    <>
      <Container className={`board-write ${styles.sec} ${styles.container}`} ref={scrollTopRef}>
        <form method="post" id="post-form" encType="multipart/form-data" onSubmit={(e)=>{e.preventDefault()}}> 
          <div className={`inner ${styles.boardForm}`}>
            <h3 className="title">게시글 작성</h3>
            <div className={`${styles.imgBox} ${styles.row} row p-0 g-3 gy-3`}>
              <div className='d-flex'>
                <p className={``}>게시글 사진</p>
                <div className='d-flex align-items-end'>
                  <span className={`${styles.count}`}>({uploadImg.length}/5)</span>
                </div>
              </div>
              <div className={`col-6 col-sm-4 col-lg-2 m-0`}>
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
                    <div className={`col-6 col-sm-4 col-lg-2`} key={id}>
                      <div className={`${styles.uploadedImgBox}`}>
                        <img className={`${styles.previewImg}`} alt='preview' src={img}/>
                        <button className={`${styles.previewImgDelBtn}`} type='button' onClick={() => handleDeleteImage(id)}><XCircleFill/></button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className={`${styles.col}`}>
              <div className={`${styles.titleBox} d-flex justify-content-between`}>
                <label htmlFor="title">제목</label>
                <input className={`${styles.titleInput}`} id="title" placeholder="제목을 입력하세요" maxLength={40} value={form.title} onChange={(e)=>{handleTitle(e.target.value)}}/>
              </div>
              {
                isNotFirstCheck && !form.title ?
                <div className={`${styles.boardError} d-flex justify-content-end`}>
                  <EmptyError triggerVibration={triggerVibration}/>
                </div> : null
              }
            </div>
            <div className={`${styles.col}`}>
              <div className={`${styles.contentBox} d-flex justify-content-between`}>
                <label htmlFor="content">내용</label>
                <textarea className={`${styles.contentInput}`} maxLength={3000} id="content" placeholder="내용을 입력하세요"
                value={form.content} onChange={(e)=>{handleContent(e.target.value)}}
                ref={contentRef} onInput={handleResizeHeight}
                ></textarea>
              </div>
              {
                isNotFirstCheck && !form.content ?
                <div className={`${styles.boardError} d-flex justify-content-end`}>
                  <EmptyError triggerVibration={triggerVibration}/>
                </div> : null
              }
            </div>
            <div className={`col ${styles.col} ${styles.btnWrap} d-flex justify-content-end`}>
              <Button className={`${styles.onPost} submit`} as="input" type="submit" value="등록" onClick={()=>{check()}}/>
              <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate('/board')}}/>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

export default BoardWrite;