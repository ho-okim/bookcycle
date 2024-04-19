import {BrowserRouter, useParams} from "react-router-dom";
import { Container } from "react-bootstrap";



function ProductDetail() {

    return(


      <Container>
        <div className='inner'>
          <div className='book-info'>
            <Container>
              <div className='name'>
                책 제목
              </div>
            </Container>
            <Container>
              <div className='option row justify-content-between align-items-center flex-wrap'>
                <p className='option-info col-5'>저자</p>
                <p className='option-info col-5'>출판사</p>
                <p className='option-info col-5'>출간일</p>
                <p className='option-info col-5'>상품등록일</p>
              </div>
            </Container>
          </div>
        </div>


      <Container>
        <div className='ineer"'>
          <div className='info'>
          
        <Container>
          <div className='infopic'>
            <img className='infopic-image' src='' alt='사진'/>
          </div>
        </Container>
          </div>

        <Container>
          <div className='infocate'>
            카테고리
            ISBN
            가격
          </div>
        </Container>
        </div>
        </Container>

        <Container>
        <Container>
        <div className='info1'>
          책소개
        </div>
        </Container>
        <Container>
          <div clasName = 'info2'>
            책 소개 내용
          </div>
        </Container>
        </Container>

        <Container>
        <Container>
        <div className='info3'>
          판매자
        </div>
        </Container>
        <Container>
          <div clasName = 'info4'>
            판매자 닉네임
          </div>

        </Container>
        </Container>

        <Container>
        <Container>
          <div className='another'>
            판매자의 다른 중고서
          </div>
        </Container>
        <Container>
          <div className='anotherbook'>
            사진
            제목
            가격
          </div>
        </Container>
        </Container>

      </Container>

    );

  }


  
  export default ProductDetail;