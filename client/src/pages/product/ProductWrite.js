import styles from '../../styles/product.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form } from "react-bootstrap";
import { Camera, ExclamationCircleFill, XCircleFill } from 'react-bootstrap-icons'
import DatePicker from "react-datepicker";
import { ko } from 'date-fns/locale';
import { set } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
import "react-datepicker/dist/react-datepicker.css";
import { productFileupload, productWrite } from '../../api/product.js';
import { useAuth } from '../../contexts/LoginUserContext.js';
import { NumericFormat } from "react-number-format"
import EmptyError from '../../components/EmptyError.js';

function BoardWrite() {

  const {user} = useAuth();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();
  const [isNotFirstCheck, setIsNotFirstCheck] = useState(false);

  // 카테고리 배열
  const category = ["문학", "철학", "종교", "사회과학", "자연과학", "기술과학", "예술", "언어", "역사", "인문/교양", "컴퓨터/모바일", "기타"]
  const isbn10Msg = "10자리여야 합니다";
  const isbn13Msg = "13자리여야 합니다";

  const [triggerVibration, setTriggerVibration] = useState(true);
  
  const date = new Date();
  const [cate, setCate] = useState();
  const titleRef = useRef();
  const writerRef = useRef();
  const publisherRef = useRef();
  const isbn10Ref = useRef();
  const isbn13Ref = useRef();
  const [price, setPrice] = useState()
  const [con, setCon] = useState();
  const contentRef = useRef()
  const [pubDate, setPubDate] = useState(null);
  // 빈 값 입력 후 버튼 클릭 시 스크롤 이벤트를 위한 useRef
  const scrollTopRef = useRef()

  const [titleLen, setTitleLen] = useState(0)
  const [writerLen, setWriterLen] = useState(0)
  const [publisherLen, setPublisherLen] = useState(0)
  const [isbn10Len, setiIsbn10Len] = useState(0)
  const [isbn13Len, setIsbn13Len] = useState(0)
  const [contentLen, setContentLen] = useState(0)

  // 파일의 실제 정보 담는 useState
  const [uploadImg, setUploadImg] = useState("")
  // 이미지 미리보기 URL 담는 useState
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  // 카테고리 라디오 버튼 핸들러
  const cateHandler = useCallback((e, i) => setCate(i), []);
  // 상품 상태 라디오 버튼 핸들러
  const conditionHandler = useCallback((e, condition) => setCon(condition), []);
  // 출간일 핸들러
  const handleDateChange = useCallback((date) => {
    if (date) {
      const localDate = set(date, { hours: 12 });
      setPubDate(toZonedTime(localDate, 'Asia/Seoul'));
    }
  }, []);
  // 가격을 콤마 제외한 값 받기 위한 핸들러
  const handlePrice = useCallback((values) => {
    setPrice(Number(values.value));
  }, []);

  // 이미지 미리보기 함수
  const onchangeImageUpload = (event) => {
    const imageLists = event.target.files;
    let imageUrlLists = [...uploadImgUrl];
    let uploadImgLists = [...uploadImg]

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);

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

  const handleLength = () => {
    if (isbn10Ref.current) { // 숫자 외 다른 문자, 공백은 제거
      isbn10Ref.current.value = isbn10Ref.current.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }
    if (isbn13Ref.current) { // 숫자 외 다른 문자, 공백은 제거
      isbn13Ref.current.value = isbn13Ref.current.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }

    setTitleLen(titleRef.current?.value.length);
    setWriterLen(writerRef.current?.value.length);
    setPublisherLen(publisherRef.current?.value.length);
    setiIsbn10Len(isbn10Ref.current?.value.length);
    setIsbn13Len(isbn13Ref.current?.value.length);
    setContentLen(contentRef.current?.value.length);
  }

  // textarea 높이 자동 조절 함수
  const handleResizeHeight = useCallback(() => {
    titleRef.current.style.height = "1rem";
    titleRef.current.style.height = titleRef.current.scrollHeight + "px";
  }, []);
  const handleResizeContentHeight = useCallback(() => {
    contentRef.current.style.height = "1rem";
    contentRef.current.style.height = contentRef.current.scrollHeight + "px";
  }, []);

  // 등록 버튼 누르면 실행되는 함수
  const check = async() => {
    setIsNotFirstCheck(true)
    const category_id = cate + 1;
    const title = titleRef.current.value;
    const description = contentRef.current.value;
    const isbn10 = isbn10Ref.current.value;
    const isbn13 = isbn13Ref.current.value;

    if(user && !isNaN(cate) && title && price && con && description
    && (isbn10Len === 10 || isbn10Len === 0)
    && (isbn13Len === 13 || isbn13Len === 0)){ // 필수 항목들이 전부 값이 있고 선택 항목이 조건에 맞으면 데이터 전송
      const data = { // 서버에 보낼 데이터 배열
        seller_id: user.id,
        category_id,
        product_name: title,
        condition: con,
        description,
        price,
        writer: writerRef.current.value || null,
        publisher: publisherRef.current.value || null,
        publish_date: pubDate || null,
        isbn10: isbn10Len === 10 ? isbn10 : null,
        isbn13: isbn13Len === 13 ? isbn13: null
      };
  
      const formData = new FormData()
      if(uploadImg){
        uploadImg.forEach((img) => formData.append('files', img));
      }
      
      // 데이터 서버에 전송
      const res = await productWrite(data);
      if(res){
        formData.append('productId', res.insertId)
        const fileRes = await productFileupload(formData)
      }
  
      if(res.message == 'success'){
        navigate("/product");
      } else {
        setErrorMessage("제목이나 내용을 다시 확인해주세요");
      }
    } else {
      scrollTopRef.current?.scrollIntoView({behavior: 'smooth'})

      // EmptyError 컴포넌트 애니메이션 관리
      setTriggerVibration(true);
      setTimeout(() => setTriggerVibration(false), 2000);
    }
  }

  useEffect(()=>{ // 타이틀 설정
    document.title = "상품 작성";
  }, []);

  if (!user) { // 로그인 안 한 사용자의 접근 차단
    navigate("/login");
  } else if (user && user.blocked === 1) { // 차단된 사용자 접근 차단
    navigate("/error/401");
  }

  return (
    <>
      <Container className={`board-write ${styles.sec} ${styles.container}`}>
        <form method="post" id="post-form" encType="multipart/form-data" onSubmit={(e)=>{e.preventDefault()}}> 
          <div className={`inner ${styles.boardForm}`}>
            <h3 className={styles.title}>상품 등록</h3>
            <div className={`${styles.imgBox} row p-0 g-3 gy-3`}>
              <div className='d-flex'>
              <p className={``}>상품 사진</p>
              <div className='d-flex align-items-end'>
                <span className={`${styles.count}`}>({uploadImg.length}/5)</span>
              </div>
              </div>
              {/* <p className={`${styles.imgComment} regular`}>사진은 최대 5장까지 업로드 가능합니다</p> */}
              <div className={`${styles.imgTop} col-6 col-sm-4 col-lg-2 m-0`} ref={scrollTopRef}>
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
                    <div className={`${styles.imgTop} col-6 col-sm-4 col-lg-2 m-0`} key={id}>
                      <div className={`${styles.uploadedImgBox}`}>
                        <img className={`${styles.previewImg}`} alt='preview' src={img}/>
                        <button className={`${styles.previewImgDelBtn}`} type='button' onClick={() => handleDeleteImage(id)}><XCircleFill/></button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={`${styles.essentialInput}`}>카테고리</p>
                    {
                      isNotFirstCheck && isNaN(cate) ?
                      <EmptyError triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <div className={styles.radioWrap}>
                    <div>
                      <div key={`inline-radio`} className="d-flex flex-wrap">
                        {category.map((category, i)=>{
                          return(
                            <Form.Check className={styles.category} label={category} name="category" type="radio" id={`category${i}`} onChange={(e)=>cateHandler(e, i)} key={i}/>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>    
                    <p className={`${styles.essentialInput}`}>제목</p>
                    <div className='d-flex align-items-end'>
                      <span className={`${styles.count}`}>({titleLen}/80)</span>
                    </div>
                    {
                      isNotFirstCheck && titleLen === 0 ?
                      <EmptyError triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <textarea className={`${styles.input} ${styles.titleTextarea}`} placeholder="제목을 입력하세요" maxLength={80} ref={titleRef} onInput={handleResizeHeight} onChange={handleLength}/>
                </div>
              </div>
              <div className='col-12 col-sm-6'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>                    
                    <p className={``}>저자</p>
                    <div className='d-flex align-items-end'>
                      <span className={`${styles.count}`}>({writerLen}/50)</span>
                    </div>
                  </div>
                  <input className={`${styles.input}`} placeholder="도서의 저자를 입력하세요" maxLength={50} ref={writerRef} onChange={handleLength}></input>
                </div>
              </div>
              <div className='col-6'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>                    
                    <p className={``}>출판사</p>
                    <div className='d-flex align-items-end'>
                      <span className={`${styles.count}`}>({publisherLen}/50)</span>
                    </div>
                  </div>
                  <input className={`${styles.input}`} placeholder="도서의 출판사를 입력하세요" maxLength={50} ref={publisherRef} onChange={handleLength}></input>
                </div>
              </div>
              <div className='col-6'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={``}>출간일</p>
                  </div>
                  <DatePicker className={`${styles.input} regular`} selected={pubDate} locale={ko} dateFormat={"yyyy/MM/dd"} showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100} placeholderText='출간일을 선택하세요' maxDate={date} onChange={handleDateChange}/>
                </div>
              </div>
              <div className='col-6 col-lg-3'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>                   
                    <p className={``}>isbn10</p>
                    <div className='d-flex align-items-end'>
                      <span className={`${styles.count}`}>({isbn10Len}/10)</span>
                    </div>
                    {
                      isNotFirstCheck && (isbn10Len !== 0 && isbn10Len !== 10) ?
                      <EmptyError emptyErrorMsg={isbn10Msg} triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <input className={`${styles.input}`} placeholder="isbn 10자리를 입력하세요" maxLength={10} ref={isbn10Ref} onChange={handleLength}></input>
                </div>
              </div>
              <div className='col-6 col-lg-3'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>                   
                    <p className={``}>isbn13</p>
                    <div className='d-flex align-items-end'>
                      <span className={`${styles.count}`}>({isbn13Len}/13)</span>
                    </div>
                    {
                      isNotFirstCheck && (isbn13Len !== 0 && isbn13Len !== 13) ?
                      <EmptyError emptyErrorMsg={isbn13Msg} triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <input className={`${styles.input}`} placeholder="isbn 13자리를 입력하세요" maxLength={13} ref={isbn13Ref} onChange={handleLength}></input>
                </div>
              </div>
              <div className='col-6 col-lg-3'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={`${styles.essentialInput}`}>가격</p>
                    {
                      isNotFirstCheck && (!price || price === 0) ?
                      <EmptyError triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <div className='d-flex'>
                    <NumericFormat thousandSeparator="," className={`${styles.input}`} placeholder="판매 가격을 입력하세요" onValueChange={(values)=>handlePrice(values)} suffix=' 원'  maxLength={10}/>
                  </div>
                </div>
              </div>
              <div className='col-6 col-lg-3'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={`${styles.essentialInput}`}>상태</p>
                    {
                      isNotFirstCheck && !con ?
                      <EmptyError triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <div className={styles.radioWrap}>
                    <Form>
                      <div key={`inline-radio`} className="d-flex justify-content-between align-items-center">
                        {['상', '중', '하'].map((condition, i)=>{
                          return(
                            <Form.Check inline label={condition} name="condition" type="radio"
                            id={`condition${i}`} onChange={(e)=>conditionHandler(e, condition)} key={i}/>
                          )
                        })}
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
              <div className='col-12'>
                <div className={`${styles.col} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={`${styles.essentialInput}`}>내용</p>
                      <div className='d-flex align-items-end'>
                        <span className={`${styles.count}`}>({contentLen}/3000)</span>
                      </div>
                      {
                        isNotFirstCheck && contentLen === 0 ?
                        <EmptyError triggerVibration={triggerVibration}/> : null
                      }
                  </div>
                    <textarea className={`${styles.input} ${styles.content}`} id="content" placeholder="내용을 입력하세요"
                      ref={contentRef} maxLength={3000} onInput={handleResizeContentHeight} onChange={handleLength}></textarea>
                  </div>
                  <div className={`${styles.col} d-flex justify-content-end`}>
                    <Button className={`${styles.onPost} submit`} as="input" type="submit" value="등록" onClick={()=>{check()}}/>
                    <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate('/board')}}/>
                  </div>
                </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

export default BoardWrite;