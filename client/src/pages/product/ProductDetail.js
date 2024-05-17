import { useParams, Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import style from "../../styles/productDetail.module.css";
import { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/LoginUserContext";
import { MegaphoneFill } from "react-bootstrap-icons";
import Report from "../../components/Report";
import {productDetail} from "../../api/product";
import { getCategory } from '../../api/product.js';
import OtherProduct from "../../components/product/OtherProduct.js";


function ProductDetail() {
  const [productList, setProductList] = useState({});
  const [category, setCategory] = useState([]);
  const { id } = useParams();
  const { user } = useAuth(); // 로그인한 사용자

  const { none_like } = useState(0);
  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  const handleClose = () => { // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => { // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };

  async function getDetail() {
    const data = await productDetail(id);
    setProductList(data);
  } //카테고리 데이터 가져오기

  async function productcate(){
    const data = await getCategory();
    setCategory(data);
  }

  const [like, setLike] = useState(0, 0, 0) //좋아요 셋팅

  let [detail, setDetail] = useState([])

  useEffect(()=>{
    const test = async()=>{{
      await getDetail()
    }}
    test()
  },[id])

  useEffect(()=>{
    const test = async()=>{{
      await productcate()
    }}
    test()
  },[])



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
        {
            (productList ) ?
                  <div className='book-info'>
                    <Container>
                      <div className='name'>
                        <span>{productList.product_name}</span>
                      </div>
                    </Container>
                    <Container>
                      <div className={`${style.optioninfo}`}>
                        <p className='option'><span>저자 : {productList.writer}</span></p>
                        <p className='option'><span>출판사 : {productList.publisher}</span></p> 
                        <p className='option'><span>출간일 : {productList.publish_date}</span></p>
                        <p className='option'><span>게시일 : {productList.createdAt}</span></p>
                      </div>
                    </Container>
                  </div>  

            : <p>아직 등록한 상품이 없어요!</p>
            }
        </div>
{/* 
{
            (productList && productList.length > 0) ?
            productList.map((el, i) => {
                return(



  */}
        <Container>
            <div className={`${style.innerbox}`}>  
            {
              (productList) ?
                      <>
                      <div className={`${style.infopic}`}>
                      {
                        productList.filename ? 
                        <img className={style.book_image} src={process.env.PUBLIC_URL + '/img/product/' + productList.filename} alt='책사진'/>
                        :
                        <img className={style.no_book_image} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
                    }
                      </div>
                    <div className={`${style.infocate}`}>                     
                      <div className={`${style.cateinfo}`}>카테고리 : <span>{productList.category_name}</span></div> 
                      <div className={`${style.cateinfo}`}>ISBN 10 : <span>{productList.isbn10}</span></div> 
                      <div className={`${style.cateinfo}`}>판매가 : <span>{productList.price}</span></div> 
                    </div>
                      <div>
                      {
                        renderReportBtn()
                      }
                      </div>
                    </>
              : <p>아직 등록한 상품이 없어요!</p>
            }
            </div>
        </Container>


      <div className={`${style.boxinfo}`}>
      {
            (productList) ?
                  <>
                  <div className={`${style.info0102}`}>
                    <div className={`${style.info01}`}>
                      <span>책 제목</span>
                    </div>
                    <div className ={`${style.info02}`}>
                      <span>{productList.product_name}</span>
                    </div>
                  </div>
                  <div className={`${style.info0102}`}>
                    <div className={`${style.info01}`}>
                      <span>책 상태</span>
                    </div>
                    <div className ={`${style.info022}`}>
                      <span>판매자 코멘트 : {productList.description}. <br/> 상태 : {productList.condition}</span>
                    </div>
                  </div>                
                  <div className={`${style.info0102}`}>
                    <div className={`${style.info01}`}>
                      판매자
                    </div>
                    <div className ={`${style.info0405}`}>
                      <div className ='info4'>
                        <span>{productList.nickname}</span>
                      </div>
                    <div className= 'info05'>
                      <Link to={'/chat'} style={{ textDecoration: "none", color: "black"}}>판매자와 채팅하기</Link>
                    </div>          
                    </div>
                  </div>
                  </>
            : <p>아직 등록한 상품이 없어요!</p>
            }
        </div>

        <OtherProduct id={productList.seller_id}/>
      </Container>
    );

  }


  
  export default ProductDetail;