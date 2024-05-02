import { useParams, Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import style from "../../styles/productDetail.module.css";
import { useContext, useEffect, useState } from 'react';
import { useAuth } from "../../contexts/LoginUserContext";
import { MegaphoneFill } from "react-bootstrap-icons";
import Report from "../../components/Report";

function ProductDetail() {
  const {id} = useParams();
  const { user } = useAuth(); // 로그인한 사용자
  const { none_like } = useState(0);
  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  const handleClose = () => { // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => { // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };

  function renderReportBtn() { // 신고 버튼 렌더링 처리
    if (user) {
      if (user.id == 1) { // user.id == 상품소유자id
        // ownerId = 상품소유자id
        return (
          <>
            <Button variant='danger' size="sm" onClick={handleOpen}><MegaphoneFill/> 신고</Button>
            <Report show={modalShow} handleClose={handleClose} ownerId={1}/>
          </>
        )
      }
    }
    return null;
  }

    return(
      <Container>
        <div className={`${style.inner}`}>
          <div className='book-info'>
            <Container>
              <div className='name'>
                책 제목
              </div>
            </Container>
            <Container>
              <div className={`${style.optioninfo}`}>
                <p className='option'>저자</p>
                <p className='option'>출판사</p>
                <p className='option'>출간일</p>
                <p className='option'>상품등록일</p>
              </div>
            </Container>
          </div>
        </div>


      <Container>

          <div className={`${style.innerbox}`}>      
              <Container>
                <div className={`${style.infopic}`}>
                  <img className='infopic-image' src='' alt='사진'/>
                </div>
              </Container>
          <Container>
            <div className={`${style.infocate}`}>
              <div className='cate'>카테고리</div> 
              <div className='isbn'>ISBN</div> 
              <div className='waste'>가격</div> 
            </div>
            <div>
              {
                renderReportBtn()
              }
            </div>
          </Container>
          </div>

      </Container>
      <Container className={`${style.boxinfo}`}>
        <Container className={`${style.info0102}`}>
          <div className={`${style.info01}`}>
            책소개
          </div>
          <div className ={`${style.info02}`}>
            책 소개 내용
          </div>
        </Container>
        <Container className={`${style.info0102}`}>
          <div className={`${style.info01}`}>
            판매자
          </div>
        <div className ={`${style.info0405}`}>
          <div className ='info4'>
            판매자 닉네임
          </div>
          <div className= 'info05'>
          <Link to={'/'} style={{ textDecoration: "none", color: "black"}}> 채팅하기</Link>
          </div>          
        </div>
        </Container>
        </Container>

      <Container className={`${style.anotherbookcon}`}>
        <Container className={`${style.anotherinfo}`}>
        <Container>
          <div className={`${style.another}`}>
            판매자의 다른 중고서
          </div>
        </Container>
        <div className={`${style.anotherbook}`}>
        <Link to={"/productDetail"} style={{ textDecoration: "none", color: "black" }}>
          <div className='anotherbook-info col'>
          <img className='infopic-image' src='' alt='사진'/>
          <div className='info-title'>제목</div> 
          <div className='info-price'>가격</div> 
          </div>
          </Link>
          <Link to={"/productDetail"} style={{ textDecoration: "none", color: "black" }}>
          <div className='anotherbook-info col'>
          <img className='infopic-image' src='' alt='사진'/>
          <div className='info-title'>제목</div> 
          <div className='info-price'>가격</div> 
          </div>
          </Link>
          <Link to={"/productDetail"} style={{ textDecoration: "none", color: "black" }}>
          <div className='anotherbook-info col'>
          <img className='infopic-image' src='' alt='사진'/>
          <div className='info-title'>제목</div> 
          <div className='info-price'>가격</div> 
          </div>
          </Link>
          <Link to={"/productDetail"} style={{ textDecoration: "none", color: "black" }}>
          <div className='anotherbook-info col'>
          <img className='infopic-image' src='' alt='사진'/>
          <div className='info-title'>제목</div> 
          <div className='info-price'>가격</div> 
          </div>
          </Link>
          <Link to={"/productDetail"} style={{ textDecoration: "none", color: "black" }}>
          <div className='anotherbook-info col'>
          <img className='infopic-image' src='' alt='사진'/>
          <div className='info-title'>제목</div> 
          <div className='info-price'>가격</div> 
          </div>
          </Link>

        </div>
        </Container>
      </Container>
      </Container>
    );

  }


  
  export default ProductDetail;