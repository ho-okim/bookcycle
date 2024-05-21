import styles from '../../styles/product.module.css';
import { useEffect, useRef, useState } from 'react';
import { boardWrite, fileupload } from '../../api/board.js';
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

function BoardWrite() {

  const {user} = useAuth();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  // 카테고리 배열
  const category = ["문학", "철학", "종교", "사회과학", "자연과학", "기술과학", "예술", "언어", "역사", "인문/교양", "컴퓨터/모바일", "기타"]
  const emptyErrorMsg = "필수 입력 항목입니다";
  
  const date = new Date();
  const [cate, setCate] = useState();
  const titleRef = useRef();
  const writerRef = useRef();
  const publisherRef = useRef();
  const isbnRef = useRef();
  const [price, setPrice] = useState()
  const [con, setCon] = useState();
  const contentRef = useRef()
  const [pubDate, setPubDate] = useState(null);
  const [isEmpty, setIsEmpty] = useState()
  // 빈 값 입력 후 버튼 클릭 시 스크롤 이벤트를 위한 useRef
  const scrollTopRef = useRef()

  // 파일의 실제 정보 담는 useState
  const [uploadImg, setUploadImg] = useState("")
  // 이미지 미리보기 URL 담는 useState
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  // 카테고리 라디오 버튼 핸들러
  const cateHandler = (e, i) => {
    setCate(i)
  }
  // 상품 상태 라디오 버튼 핸들러
  const conditionHandler = (e, condition) => {
    setCon(condition)
  }
  // 출간일 핸들러
  const handleDateChange = (date) => {
    if(date){
      // 사용자 입력 날짜를 로컬 타임으로 설정
      const localDate = set(date, { hours: 12 }); // 시간을 정오로 설정하여 오차를 줄임
      setPubDate(toZonedTime(localDate, 'Asia/Seoul'))
    }
  }
  // 가격을 콤마 제외한 값 받기 위한 핸들러
  const handlePrice = (values) => {
    const {value} = values
    setPrice(Number(value))
  }

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

  // 등록 버튼 누르면 실행되는 함수
  const check = async() => {
    const category_id = cate + 1
    const title = titleRef.current.value
    const description = contentRef.current.value


    if(user && !isNaN(cate) && title && price && con && description){
      // 필수 항목들이 전부 값이 있을 때만 데이터 전송

      // // 서버에 보낼 데이터 배열
      let data = {seller_id: user.id, category_id, product_name: title, condition: con, description, price, writer: null, publisher: null, publish_date: null, isbn10: null, isbn13: null}
      if(writerRef.current.value){
        data.writer = writerRef.current.value
      } if(publisherRef.current.value){
        data.publisher = publisherRef.current.value
      } if(pubDate){
        data.publish_date =pubDate
      } if(isbnRef.current.value.length == 10){
        data.isbn10 = isbnRef.current.value
      } if(isbnRef.current.value.length == 13){
        data.isbn13 = isbnRef.current.value
      }
  
      const formData = new FormData()
      for(let i = 0; i < uploadImg.length; i++){
        formData.append('files', uploadImg[i])
      }
      
      // 데이터 서버에 전송
      const res = await productWrite(data);
      console.log(res)
      if(res){
        console.log("결과값 id: ", res.insertId)
    
        formData.append('productId', res.insertId)
        const fileRes = await productFileupload(formData)
      }
  
      if(res.message == 'success'){
        navigate("/product");
      } else {
        setErrorMessage("제목이나 내용을 다시 확인해주세요");
      }
    } else {
      let emptyList = {cate: true, title: true, price: true, con: true, description: true}
      if(!isNaN(cate)) delete emptyList.cate
      if(title) delete emptyList.title
      if(price) delete emptyList.price
      if(con) delete emptyList.con
      if(description) delete emptyList.description
      setIsEmpty(emptyList)
      scrollTopRef.current?.scrollIntoView({behavior: 'smooth'})

      
    }

  }

  return (
    <>
      <Container className={`board-write ${styles.sec} ${styles.container}`}>
        <form method="post" id="post-form" encType="multipart/form-data" onSubmit={(e)=>{e.preventDefault()}}> 
          <div className={`inner ${styles.boardForm}`}>
            <h3 className={styles.title}>상품 등록</h3>
            <div className={`${styles.imgBox} ${styles.row} row p-0 g-3 gy-3`}>
              <p className={``}>상품 사진 ({uploadImg.length}/5)</p>
              <p className={`${styles.imgComment} regular`}>사진은 최대 5장까지 업로드 가능합니다</p>
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
            <div className={``}>
              <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                <div className={`${styles.inputTitle} d-flex`}>    
                  <p className={`${styles.essentialInput}`}>카테고리</p>
                  {
                    isEmpty?.cate &&
                    <p className={`${styles.emptyErrorMsg} ${styles.vibration} d-flex align-items-center justify-content-center`}>
                    <ExclamationCircleFill className={styles.emptyIcon}/>{emptyErrorMsg}
                    </p>
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
              <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                <div className={`${styles.inputTitle} d-flex`}>    
                  <p className={`${styles.essentialInput}`}>제목</p>
                  {
                    isEmpty?.title &&
                    <p className={`${styles.emptyErrorMsg} ${styles.vibration} d-flex align-items-center justify-content-center`}>
                    <ExclamationCircleFill className={styles.emptyIcon}/>{emptyErrorMsg}
                    </p>
                  }
                </div>
                <input className={`${styles.input}`} placeholder="제목을 입력하세요" maxLength={40} ref={titleRef}></input>
              </div>
              <div className='d-flex justify-content-between'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>                    
                    <p className={``}>저자</p>
                  </div>
                  <input className={`${styles.input}`} placeholder="도서의 저자를 입력하세요" maxLength={40} ref={writerRef}></input>
                </div>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>                    
                    <p className={``}>출판사</p>
                  </div>
                  <input className={`${styles.input}`} placeholder="도서의 출판사를 입력하세요" maxLength={40} ref={publisherRef}></input>
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>                   
                    <p className={``}>isbn 10/13</p>
                  </div>
                  <input className={`${styles.input}`} placeholder="10자리 혹은 13자리를 입력하세요" maxLength={40} ref={isbnRef}></input>
                </div>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={``}>출간일</p>
                  </div>
                  <DatePicker className={`${styles.input}`} selected={pubDate} locale={ko} dateFormat={"yyyy/MM/dd"} showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100} placeholderText='출간일을 선택하세요' maxDate={date} onChange={handleDateChange}/>
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={`${styles.essentialInput}`}>가격</p>
                    {
                      isEmpty?.price &&
                      <p className={`${styles.emptyErrorMsg} ${styles.vibration} d-flex align-items-center justify-content-center`}>
                      <ExclamationCircleFill className={styles.emptyIcon}/>{emptyErrorMsg}
                      </p>
                    }
                  </div>
                  <div className='d-flex'>
                    <NumericFormat thousandSeparator="," className={`${styles.input}`} placeholder="판매 가격을 입력하세요" onValueChange={(values)=>handlePrice(values)} suffix=' 원'/>
                  </div>
                </div>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={`${styles.essentialInput}`}>상태</p>
                    {
                      isEmpty?.con &&
                      <p className={`${styles.emptyErrorMsg} ${styles.vibration} d-flex align-items-center justify-content-center`}>
                      <ExclamationCircleFill className={styles.emptyIcon}/>{emptyErrorMsg}
                      </p>
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
              <div className={`col-12 ${styles.col} d-flex flex-column`}>
                <div className={`${styles.inputTitle} d-flex`}>
                  <p className={`${styles.essentialInput}`}>내용</p>
                    {
                      isEmpty?.description &&
                      <p className={`${styles.emptyErrorMsg} ${styles.vibration} d-flex align-items-center justify-content-center`}>
                      <ExclamationCircleFill className={styles.emptyIcon}/>{emptyErrorMsg}
                      </p>
                    }
                </div>
                <textarea className={`${styles.input} ${styles.content}`} id="content" placeholder="내용을 입력하세요" ref={contentRef}></textarea>
              </div>
              <div className={`col ${styles.col} d-flex justify-content-end`}>
                <Button variant="outline-secondary" className={`${styles.reset}`} as="input" type="reset" value="취소" onClick={()=>{navigate('/board')}}/>
                <Button className="submit" as="input" type="submit" value="등록" onClick={()=>{check()}}/>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

export default BoardWrite;