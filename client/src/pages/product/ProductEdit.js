import styles from '../../styles/product.module.css';
import { productEdit, productFileupdate } from '../../api/product.js';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Form } from "react-bootstrap";
import { Camera, XCircleFill } from 'react-bootstrap-icons'
import DatePicker from "react-datepicker";
import { ko } from 'date-fns/locale';
import { set } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from 'react-router-dom';
import EmptyError from '../../components/EmptyError.js';
import { NumericFormat } from 'react-number-format';
import { useAuth } from '../../contexts/LoginUserContext.js';

// 버려진 기존 파일 이름 담을 배열
var delFiles = []

function ProductEdit() {
  const { user } = useAuth(); // 로그인 한 사용자

  const {id} = useParams();
  const navigate = useNavigate();

  // useNavigate와 useLocation을 이용하여 페이지 간 데이터 넘기기
  let location = useLocation()
  if (!location.state) { // 버튼 등이 아닌 직접 url을 입력하면 접근 차단
    navigate('/error/400');
  }
  const {product, files} = location.state
  const {category_id, product_name, writer, publisher, isbn10, isbn13, publish_date, condition, description} = product
  const prevPrice = product.price;

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
  const priceRef = useRef();
  const [price, setPrice] = useState()
  const [con, setCon] = useState();
  const contentRef = useRef()
  const [pubDate, setPubDate] = useState(null);
  // 빈 값 입력 후 버튼 클릭 시 스크롤 이벤트를 위한 useRef
  const scrollTopRef = useRef()

  const [titleLen, setTitleLen] = useState(product_name.length)
  const [writerLen, setWriterLen] = useState(writer ? writer.length : 0)
  const [publisherLen, setPublisherLen] = useState(publisher? publisher.length : 0)
  const [isbn10Len, setiIsbn10Len] = useState(isbn10 ? isbn10.toString().length : 0)
  const [isbn13Len, setIsbn13Len] = useState(isbn13 ? isbn13.toString().length : 0)
  const [contentLen, setContentLen] = useState(description.length)

  // 파일의 실제 정보 담는 useState
  const [uploadImg, setUploadImg] = useState("")
  // 이미지 미리보기 URL 담는 useState
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  const [errorMessage, setErrorMessage] = useState('');


  // 최초 렌더링 때 초기값 useState에 담아주기
  useEffect(()=>{

    setUploadImg(files);
    setUploadImgUrl(files);
    setCate(category_id - 1);
    setCon(condition);
    setPubDate(publish_date);
    titleRef.current.value = product_name
    writerRef.current.value = writer
    publisherRef.current.value = publisher;
    isbn10Ref.current.value = isbn10 ? isbn10.toString() : null
    isbn13Ref.current.value = isbn13 ? isbn13.toString() : null
    setPrice(prevPrice)
    contentRef.current.value = description;
    
    return(()=>{
      delFiles = []
    })

  }, [])

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
    if(uploadImg[id].id){
      // id가 존재한다면 기존의 파일이므로 delFiles에 저장
      delFiles.push({id: uploadImg[id].id, boardNo: uploadImg[id].boardNo, filename: uploadImg[id].filename})
      console.log(delFiles)
    }
    setUploadImgUrl(uploadImgUrl.filter((_, index) => index !== id));
    setUploadImg(uploadImg.filter((_, index) => index !== id));
  };

  const handleLength = () => {
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
    const category_id = cate + 1
    const title = titleRef.current.value
    const description = contentRef.current.value
    const isbn10 = isbn10Ref.current.value;
    const isbn13 = isbn13Ref.current.value;

    if(!isNaN(cate) && title && price && con && description
    && (isbn10Len === 10 || isbn10Len === 0)
    && (isbn13Len === 13 || isbn13Len === 0)){ // 필수 항목들이 전부 값이 있고 선택 항목이 조건에 맞으면 데이터 전송

      // 서버에 보낼 데이터 배열
      let data = {category_id, product_name: title, condition: con, description, price, writer: null, publisher: null, publish_date: null, isbn10: null, isbn13: null}
      if(writerRef.current.value){
        data.writer = writerRef.current.value
      } if(publisherRef.current.value){
        data.publisher = publisherRef.current.value
      } if(pubDate){
        data.publish_date =pubDate
      } if(isbn10Len == 10){
        data.isbn10 = isbn10Ref.current.value
      } if(isbn13Len == 13){
        data.isbn13 = isbn13Ref.current.value
      }
      
      // 사진 업데이트
      const formData = new FormData()
      let prevFiles = []
      if(uploadImg){
        uploadImg.forEach((el) => {
          if(!el.id) {
            formData.append('files', el)
          } else {
            console.log(el)
            prevFiles.push({id: el.id, boardNo: el.boardNo})
          }
        })
      }
      formData.delete('editProductId')
      formData.append('editProductId', id)
      formData.delete('prevFiles')
      formData.append('prevFiles', JSON.stringify(prevFiles))
      formData.delete('delFiles')
      formData.append('delFiles', JSON.stringify(delFiles))
      
      // 데이터 서버에 전송
      const res = await productEdit(id, data);
      console.log(res)
      const fileRes = await productFileupdate(formData)

      if(res.message == 'success'){
        navigate(`/product/detail/${id}`);
        window.location.reload()
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
            <h3 className={styles.title}>상품 수정</h3>
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
                        { // img.id가 존재한다면 기존의 파일임
                          img.id ?
                          <img className={`${styles.previewImg}`} alt='preview' src={process.env.PUBLIC_URL + `/img/product/${img.filename}`}/>
                          : <img className={`${styles.previewImg}`} alt='preview' src={img}/>
                        }
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
                  <div>
                    <p className={`${styles.essentialInput}`}>카테고리</p>
                  </div>
                  <div className={styles.radioWrap}>
                      <div>
                        <div key={`inline-radio`} className="d-flex flex-wrap">
                          {category.map((category, i)=>{
                            return(
                              i == cate ?
                              <Form.Check className={styles.category} label={category} name="category" type="radio" id={`category${i}`} onChange={(e)=>cateHandler(e, i)} key={i} checked="checked"/> :
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
                      titleLen === 0 ?
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
                  <DatePicker className={`${styles.input} regular`} selected={pubDate}
                    locale={ko} dateFormat={"yyyy/MM/dd"} showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100} placeholderText='출간일을 선택하세요' maxDate={date}
                    onChange={handleDateChange}
                    dayClassName={(d) => (d.getDate() == pubDate ? styles.selectedDay : styles.unselectedDay)}
                    />
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
                      (isbn10Len !== 0 && isbn10Len !== 10) ?
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
                      (isbn13Len !== 0 && isbn13Len !== 13) ?
                      <EmptyError emptyErrorMsg={isbn13Msg} triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <input className={`${styles.input}`} placeholder="isbn 13자리를 입력하세요" maxLength={13} ref={isbn13Ref} onChange={handleLength}></input>
                </div>
              </div>
              <div className='col-12 col-lg-6'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <div className={`${styles.inputTitle} d-flex`}>
                    <p className={`${styles.essentialInput}`}>가격</p>
                    {
                      (!price || price === 0) ?
                      <EmptyError triggerVibration={triggerVibration}/> : null
                    }
                  </div>
                  <div className='d-flex'>
                    <NumericFormat thousandSeparator="," value={price} className={`${styles.input}`} placeholder="판매 가격을 입력하세요" onValueChange={(values)=>handlePrice(values)} suffix=' 원'  maxLength={10}/>
                  </div>
                </div>
              </div>
              <div className='col-6 col-lg-3'>
                <div className={`${styles.col} ${styles.inputBox} d-flex flex-column`}>
                  <p className={`${styles.essentialInput}`}>상태</p>
                  <div className={styles.radioWrap}>
                    <Form>
                      <div key={`inline-radio`} className="d-flex justify-content-between align-items-center">
                        {['상', '중', '하'].map((condition, i)=>{
                          return(
                            condition == con ?
                            <Form.Check inline label={condition} name="condition" type="radio"
                            id={`condition${i}`} onChange={(e)=>conditionHandler(e, condition)} key={i} checked="checked"/> :
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
                        contentLen === 0 ?
                        <EmptyError triggerVibration={triggerVibration}/> : null
                      }
                  </div>
                  <textarea className={`${styles.input} ${styles.content}`} id="content" placeholder="내용을 입력하세요"
                    ref={contentRef} maxLength={3000} onChange={handleLength}></textarea>
                </div>
                <div className={`col ${styles.col} d-flex justify-content-end`}>
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

export default ProductEdit;