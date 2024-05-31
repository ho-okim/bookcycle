import styles from '../../styles/productDetail.module.css';
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Container, Badge, Stack } from "react-bootstrap";
import { useEffect, useState, react } from 'react';
import { ChatDotsFill, StarFill, Pencil, Trash3, ChatDots, Person, Star } from "react-bootstrap-icons";
import { useAuth } from "../../contexts/LoginUserContext";
import Report from "../../components/Report";
import {filesList, productDelete, productDetail} from "../../api/product";
import { getCategory } from '../../api/product.js';
import OtherProduct from "../../components/product/OtherProduct.js";
import Favorite from "../../components/product/Favorite.js";
import { getReportedOrNot } from "../../api/report.js";
import ProductDetailContext from "../../contexts/ProductDetailContext.js";
import ProductCaution from "../../components/product/ProductCaution.js";
import PicCarousel from '../../components/product/PicCarousel.js';
import Error from "../../components/Error.js"
import { dateTimeProcessing } from "../../lib/dateProcessing.js";
import DefaultModal from "../../components/DefaultModal.js";
import { newChatroom } from "../../api/chat.js";


function ProductDetail() {
  const { id } = useParams();
	const navigate = useNavigate();

  const { user } = useAuth(); // 로그인한 사용자

  const [product, setProduct] = useState({}); // 상품 정보
  const [category, setCategory] = useState([]); // 카테고리
  const [likehit, setLikehit] = useState(0); // 찜한 수
  const [files, setFiles] = useState([]); // 상품 이미지
  const [notFound, setNotFound] = useState(false);

  
  // 삭제 버튼 모달
  const [modalDeleteShow, setModalDeleteShow] = useState(false); // modal 표시 여부
  const handleDeleteClose = () => { // modal 닫기/숨기기 처리
    if (modalDeleteShow) setModalDeleteShow(false);
  };
  const handleDeleteOpen = () => { // modal 열기 처리
    if (!modalDeleteShow) setModalDeleteShow(true);
  };

  const [modalShow, setModalShow] = useState(false); // modal 표시 여부
  const [isReported, setIsReported] = useState(true); // 현재 사용자의 신고 여부

  // 신고 모달
  const handleClose = () => { // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => { // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };

  // 신규 채팅방 개설
  const handleCreateChatroom = async () => {
    const seller_id = product.seller_id;
    const result = await newChatroom(id, seller_id);
    
    navigate('/chat', {state: {chatroomId: result}})
  }

  useEffect(()=>{
    async function productcate() { //카테고리 데이터 가져오기
      const data = await getCategory();
      setCategory(data);
    }
    productcate(); // 최초 렌더링때만 카테고리 가져옴
  },[]);

  useEffect(()=>{
    async function getDetail() { // 상품 정보 가져오기
      try {
        const data = await productDetail(id);
        const res = await filesList(id);
        
        if (!data) { // 존재하지 않는 게시글로 url 접근 시
          setNotFound(true)
        }

        // 차단되지 않는 상품이거나 내 상품일 경우에만 data 가져오기
        if (data.blocked === 0 || data.seller_id === parseInt(user.id)) {
          setProduct(data);
          // setLikehit(data.liked);
          setFiles(res);
        }
      } catch (error){
        console.error(error);
        setNotFound(true);
      }
    } 

    async function getReported() { // 신고 여부 확인
      const res = await getReportedOrNot('product', id);
      setIsReported((isReported)=>((res === 0) ? false : true));
    }

    getDetail(); // 데이터 가져오기

    if (user) { // 로그인을 했을 때만 호출
      getReported(); // 로그인 한 사용자가 신고했는지 여부 가져오기
    }
  },[id, user]);

  if (notFound) {
    return <Error/>
  }

  function renderReportBtn() { // 신고 버튼 렌더링 처리
    if (user) {
      // 렌더 조건 : 본인 상품 아님, 신고한 적 없음, 본인이 차단된 사용자가 아님, 미판매 제품임
      let renderCondition = (user.id != product.seller_id && !isReported && user.blocked === 0 && (!product.soldDate || product.seller_id === product.buyer_id));
      if (renderCondition) { // user.id == 상품소유자id
        // ownerId = 상품소유자id
        return (
          <>
            <Button 
              variant="outline-secondary" 
              className={styles.reportBtn} 
              onClick={handleOpen}> 
              <img style={{width: '23px'}} className='me-1' src={process.env.PUBLIC_URL + `/report.png`}/>신고하기</Button>
            <Report show={modalShow} handleClose={handleClose} targetId={product.product_id} category={'product'}/>
          </>
        )
      } else if (user.id != product.seller_id && isReported) {
        return(
          <div>이미 신고했어요</div>
        )
      }
    }
    return null;
  }

  return(
    <ProductDetailContext.Provider value={{id, product}}>
      <Container>
        <div className='inner'>
          {/* Product Header */}
          <div className={`${styles.productHeader}`}>
            <div className={`${styles.productTitle} d-flex justify-content-between align-items-center`}>
              <h2>{product.product_name}</h2>
              {(product.seller_id == user?.id) ? 
              (<div className={`${styles.btnWrap} d-flex`}>
                {
                  (!product.soldDate || product.seller_id === product.buyer_id) ?
                  <Button 
                    variant="outline-secondary" className={styles.updateBtn} 
                    onClick={()=>{navigate(`/product/edit/${product.product_id}`,
                    {state: {product: product, files}})}}>
                    <Pencil className='me-1'/>수정
                  </Button>
                  : null
                }
                <Button 
                  variant="outline-secondary" className={styles.deleteBtn} onClick={handleDeleteOpen}>
                    <Trash3 className='me-1'/>삭제
                </Button>
              </div>)  : null }
            </div>
            <div className={`${styles.productHeaderInfo} d-flex justify-content-between align-items-center regular`}>
              <div className={`${styles.headerInfo} d-flex`}>
                <div className={`${styles.headerInfoText} d-flex flex-wrap`}>
                  <div className={`${styles.infoFirst} d-flex flex-wrap`}>
                    <p className={`${styles.info} medium`}>저자
                      {
                        product.writer ? 
                        <span className={`ms-2 regular`} style={{color:"#4D91B6"}}>{product.writer}</span> :
                        <span className={`ms-2 regular ${styles.emptyData}`}>미기입</span>
                      }
                    </p>
                    <p className={`${styles.info} medium`}>출판사
                      {
                        product.publisher ?
                        <span className={`ms-2 regular`} style={{color:"#4D91B6"}}>{product.publisher}</span> :
                        <span className={`ms-2 ${styles.emptyData}`}>미기입</span>
                      }
                    </p>
                  </div>
                  <div className='d-flex flex-wrap'>
                    <p className={`${styles.info} medium`}>출간일
                      {
                        product.publish_date ?
                        <span className={`ms-2 regular`} style={{color:"#4D91B6"}}>{new Date(product.publish_date).toLocaleDateString()}</span> :
                        <span className={`ms-2 ${styles.emptyData}`}>미기입</span>
                      }
                    </p>
                    <p className={`${styles.info} medium`}>게시일
                      <span className={`ms-2 regular ${styles.uploadDate}`} style={{color:"#4D91B6"}}>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${styles.headerBtnWrap} d-flex align-items-center`}>
                <Favorite/>
                { renderReportBtn() }
                <div className={`${styles.user_chat}`}>
                  {
                    (user && user.blocked === 0 && user.id !== product.seller_id) ?
                    // <div className={styles.chat_btn} onClick={handleCreateChatroom}>
                    //   <ChatDots size="30" className={styles.chatIcon}/></div>
                    <Button 
                      variant="outline-secondary" 
                      className={`${styles.chatBtn} regular`} 
                      onClick={handleCreateChatroom}> 
                      <ChatDots className='me-1'/>채팅하기</Button>
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
          <DefaultModal show={modalDeleteShow} handleClose={handleDeleteClose} productId={id}/>
        

        {/* Product Detail */}
        <div className={`${styles.productDetail}`}>
          <div className={`${styles.productMainDetail} d-flex justify-content-between mb-4`}>
            <div className={`${styles.productPic}`}>
              <PicCarousel product={product} files={files}/>
            </div>
            <div className={`${styles.productInfo}`}>                     
              <div className={`${styles.productGroup} d-flex align-items-center`}>
                  <p className={`${styles.detailTitle} bold`}>카테고리</p>
                  <Badge className={styles.category_badge}>{product.category_name}</Badge>
              </div>
              <Link to={`/user/${product.seller_id}`} className={`${styles.productGroup} d-flex align-items-center bold`}>
                <p className={styles.detailTitle}>판매자</p>
                <div className={`${styles.sellerInfo} d-flex align-items-center`}>
                  <div className={`d-flex justify-content-center align-items-center ${styles.profileImgWrap}`}>
                    {
                      product.profile_image == '' || !product.profile_image ?
                      <Person className={`${styles.profileIcon}`}/> :
                      <img src={process.env.PUBLIC_URL + `/img/profile/${product.profile_image}`} className={`${styles.profileImg}`}/>
                    }
                  </div>
                  <div className={`${styles.scoreBox}`}>
                    <div className={`${styles.mannerScore} bold`}>
                      {
                        (product.manner_score) ?
                        (product.manner_score).toFixed(1)
                        : '-'
                      }
                    </div>
                    <StarFill size={35} className={`${styles.starIcon}`}/>
                  </div>
                  <div className={`${styles.sellerNickname} medium`}>
                    <p>{product.nickname}</p>
                  </div>
                </div>
              </Link> 
              <div className={`${styles.productGroup}`}>
                <div className={`${styles.cateinfo2} d-flex align-items-center bold`}>
                  <p className={styles.detailTitle}>가격</p>    
                  <p className={`${styles.productPrice} medium`}>{product.price?.toLocaleString()}원</p>
                </div> 
              </div>
              <div className={`${styles.productGroup} d-flex align-items-center bold`}>
                  <p className={styles.detailTitle}>ISBN</p>
                  <div className='medium'>
                    {
                      !product.isbn10 && !product.isbn13 ?
                        <p className={styles.emptyData}>미기입</p> :
                        <>
                          <p>{product.isbn10}</p>    
                          <p>{product.isbn13}</p>
                        </>
                    }
                  </div> 
              </div>
              <div className={`${styles.productGroup} d-flex bold`}>
                  <p className={styles.detailTitle}>책 소개</p>  
                  <p className={`${styles.bookDescription} medium`}>{product.description}</p>
              </div>
            </div>
          </div>
          <div>
            <ProductCaution/>
          </div>  

        </div>
            {/* <div className='inner'>
      <div className={`${styles.boxinfo}`}>
      {
            (product) ?
                  <>
                  <div className={`${styles.info0102}`}>
                    <div className={`${styles.info01}`}>
                      <span>책 제목</span>
                    </div>
                    <div className ={`${styles.info02}`}>
                      <span>{product.product_name}</span>
                    </div>
                  </div>
                  <div className={`${styles.info0102}`}>
                    <div className={`${styles.info01}`}>
                      <span>책 상태</span>
                    </div>
                    <div className ={`${styles.info022}`}>
                      <span>판매자 코멘트 : {product.description}. <br/> 상태 : {product.condition}</span>
                    </div>
                  </div>                
                  <div className={`${styles.info0102}`}>
                    <div className={`${styles.info01}`}>
                      판매자
                    </div>
                    <div className ={`${styles.info0405}`}>
                      <div className ='info4'>
                        <span><Link to={`/user/${product.seller_id}`}>{product.nickname}</Link></span>
                      </div>
                    <div className= 'info05'>
                      <Link to={'/chat'} styles={{ textDecoration: "none", color: "black"}}>판매자와 채팅하기</Link>
                    </div>          
                    </div>
                  </div>
                  <ProductCaution/>
                  </>
            : <p>아직 등록한 상품이 없어요!</p>
            }
        </div> 
        </div> */}
        <OtherProduct id={product.seller_id}/>
        </div>
      </Container>
    </ProductDetailContext.Provider>
  );
}


  
  export default ProductDetail;