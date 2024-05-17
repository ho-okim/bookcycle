import styles from '../../styles/product.module.css';
import { useEffect, useRef, useState } from 'react';
import { boardWrite, fileupload } from '../../api/board.js';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form } from "react-bootstrap";
import { Camera, XCircleFill } from 'react-bootstrap-icons'
import DatePicker from "react-datepicker";
import { ko } from 'date-fns/locale';
import { set } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
import "react-datepicker/dist/react-datepicker.css";
import { productWrite } from '../../api/product.js';
import { useAuth } from '../../contexts/LoginUserContext.js';

function BoardWrite() {

  const {user} = useAuth();
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();
  
  const date = new Date();
  const titleRef = useRef();
  const writerRef = useRef();
  const publisherRef = useRef();
  const isbnRef = useRef();
  const priceRef = useRef();
  const contentRef = useRef()
  const [pubDate, setPubDate] = useState(null);

  // 카테고리 배열
  const category = ["문학", "철학", "종교", "사회과학", "자연과학", "기술과학", "예술", "언어", "역사", "인문/교양", "컴퓨터/모바일", "기타"]

  // 파일의 실제 정보 담는 useState
  const [uploadImg, setUploadImg] = useState("")
  // 이미지 미리보기 URL 담는 useState
  const [uploadImgUrl, setUploadImgUrl] = useState("");
  // 카테고리 useState
  const [cate, setCate] = useState();
  // 상품 상태 useState
  const [condition, setCondition] = useState();

  // 카테고리 라디오 버튼 핸들러
  const cateHandler = (e, i) => {
    setCate(i)
  }
  // 상품 상태 라디오 버튼 핸들러
  const conditionHandler = (e, i) => {
    setCondition(i)
  }
  // 출간일 핸들러
  const handleDateChange = (date) => {
    if(date){
      // 사용자 입력 날짜를 로컬 타임으로 설정
      const localDate = set(date, { hours: 12 }); // 시간을 정오로 설정하여 오차를 줄임
      setPubDate(toZonedTime(localDate, 'Asia/Seoul'))
    }
  }

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
    const title = titleRef.current.value
    const price = priceRef.current.value
    const description = contentRef.current.value


    if(user && !isNaN(cate) && title && price && !isNaN(condition) && description){
      // 필수 항목들이 전부 값이 있을 때만 데이터 전송

      // 존재하는 항목들만 쿼리문에 담기 위한 문자열
      let columns = 'seller_id, category_id, product_name, condition, description, price'
      let question = '?, ?, ?, ?, ?, ?'
      // 서버에 보낼 데이터 배열
      let data = {seller_id: user.id, category_id: cate, product_name: title, condition, description, price: Number(price), writer: null, publisher: null, publish_date: null, isbn10: null, isbn13: null}
      if(writerRef.current.value){
        columns += ', writer'
        question += ', ?'
        data.writer(writerRef.current.value)
      } if(publisherRef.current.value){
        columns += ', publisher'
        question += ', ?'
        data.publisher(publisherRef.current.value)
      } if(pubDate){
        columns += ', publish_date'
        question += ', ?'
        data.publish_date(pubDate)
      } if(isbnRef.current.value.length == 10){
        columns += ', isbn10'
        question += ', ?'
        data.isbn10(isbnRef.current.value)
      } if(isbnRef.current.value.length == 13){
        columns += ', isbn13'
        question += ', ?'
        data.isbn13(isbnRef.current.value)
      }
      let sql = `INSERT INTO product (${columns}) VALUES (${question})`
      // setErrorMessage("필수 입력 항목입니다")
  
      // const formData = new FormData()
      // for(let i = 0; i < uploadImg.length; i++){
      //   formData.append('files', uploadImg[i])
      // }
      
      // 데이터 서버에 전송
      const res = await productWrite(sql, data);
  
      // formData.append('boardId', res.insertId)
      // const fileRes = await fileupload(formData)
  
      // console.log(res.message, fileRes)
      // if(res.message == 'success' && fileRes == 'OK'){
      //   // product 경로 확인 후 수정 필요
      //   navigate("/product");
      // } else {
      //   setErrorMessage("제목이나 내용을 다시 확인해주세요");
      // }
    }

  }

  return (
    <>
      <Container className={`board-write ${styles.sec} ${styles.container}`}>
        <form method="post" id="post-form" encType="multipart/form-data" onSubmit={(e)=>{e.preventDefault()}}> 
          <div className={`inner ${styles.boardForm}`}>
            <h3 className={styles.title}>상품 등록</h3>
            <div className={`${styles.imgBox} ${styles.row} row p-0 g-3 gy-3`}>
              <p className={`${styles.essentialInput}`}>상품 사진 ({uploadImg.length}/5)</p>
              <p className={`${styles.imgComment} regular`}>사진은 최대 5장까지 업로드 가능합니다</p>
              <div className={`${styles.imgTop} col-6 col-sm-4 col-lg-2 m-0`}>
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
                <div>
                  <p className={`${styles.essentialInput}`}>카테고리</p>
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
                <div>
                  <p className={`${styles.essentialInput}`}>제목</p>
                </div>
                <input className={`${styles.input}`} placeholder="제목을 입력하세요" maxLength={40} ref={titleRef}></input>
              </div>
              <div className='d-flex justify-content-between'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <p className={``}>저자</p>
                  <input className={`${styles.input}`} placeholder="도서의 저자를 입력하세요" maxLength={40} ref={writerRef}></input>
                </div>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <p className={``}>출판사</p>
                  <input className={`${styles.input}`} placeholder="도서의 출판사를 입력하세요" maxLength={40} ref={publisherRef}></input>
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <p className={``}>isbn 10/13</p>
                  <input className={`${styles.input}`} placeholder="10자리 혹은 13자리를 입력하세요" maxLength={40} ref={isbnRef}></input>
                </div>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <p className={``}>출간일</p>
                  <DatePicker className={`${styles.input}`} selected={pubDate} locale={ko} dateFormat={"yyyy/MM/dd"} showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100} placeholderText='출간일을 선택하세요' maxDate={date} onChange={handleDateChange}/>
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <p className={`${styles.essentialInput}`}>가격</p>
                  <div className='d-flex'>
                    <input className={`${styles.priceInput}`} placeholder="판매 가격을 입력하세요" type='number'min={0} max={1000000} ref={priceRef}></input>
                    <div className='d-flex justify-content-center align-items-center'>
                    <p>원</p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <p className={`${styles.essentialInput}`}>상품의 상태</p>
                  <div className={styles.radioWrap}>
                    <Form>
                      <div key={`inline-radio`} className="d-flex justify-content-between align-items-center">
                        {['상', '중', '하'].map((condition, i)=>{
                          return(
                            <Form.Check inline label={condition} name="condition" type="radio"
                            id={`condition${i}`} onChange={(e)=>conditionHandler(e, i)} key={i}/>
                          )
                        })}
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
              <div className={`col-12 ${styles.col} d-flex flex-column`}>
                <p className={`${styles.essentialInput}`}>내용</p>
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