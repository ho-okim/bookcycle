import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Container, Badge, Stack } from "react-bootstrap";
import style from "../../styles/productDetail.module.css";
import { useEffect, useState, react } from 'react';
import { useAuth } from "../../contexts/LoginUserContext";
import { MegaphoneFill } from "react-bootstrap-icons";
import Report from "../../components/Report";
import {filesList, productDelete, productDetail} from "../../api/product";
import { getCategory } from '../../api/product.js';
import OtherProduct from "../../components/product/OtherProduct.js";
import Favorite from "../../components/product/Favorite.js";
import { getReportedOrNot } from "../../api/report.js";
import ProductDetailContext from "../../contexts/ProductDetailContext.js";
import ProductCaution from "../../components/product/ProductCaution.js";
import { dateTimeProcessing } from "../../lib/dateProcessing.js";


function ProductDetail() {
  const { id } = useParams();
	const navigate = useNavigate();

  const { user } = useAuth(); // 로그인한 사용자

  const [product, setProduct] = useState({}); // 상품 정보
  const [category, setCategory] = useState([]); // 카테고리
  const [likehit, setLikehit] = useState(0);

  const [modalShow, setModalShow] = useState(false); // modal 표시 여부
  const [isReported, setIsReported] = useState(true); // 현재 사용자의 신고 여부
  // 파일의 배열
  const [files, setFiles] = useState([]); // 상품 이미지

  const handleClose = () => { // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => { // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };

	async function onDelete() { // 상품 데이터 삭제
		try {
				await productDelete(id);
				document.location.href = `/product`
				console.log("삭제id: ", id)
		} catch (error) {
				console.error(error);
		}
	}

  const [like, setLike] = useState(0, 0, 0) //좋아요 셋팅

  let [detail, setDetail] = useState([])

  useEffect(()=>{
    async function productcate() { //카테고리 데이터 가져오기
      const data = await getCategory();
      setCategory(data);
    }
    productcate(); // 최초 렌더링때만 카테고리 가져옴
  },[]);

  useEffect(()=>{
    async function getDetail() { // 상품 정보 가져오기
      const data = await productDetail(id);
      setProduct(data);
      setLikehit(data.liked);

      // 차단되지 않는 상품이거나 내 상품일 경우에만 사진 가져오기
      if (data.blocked === 0 || data.seller_id === parseInt(user.id)) {
        const res = await filesList(id);
        setFiles(res);
      }
    } 

    async function getReported() { // 신고 여부 확인
      const res = await getReportedOrNot('product', id);
      setIsReported((isReported)=>((res === 0) ? false : true));
    }

    getDetail();

    if (user) { // 로그인을 했을 때만 호출
      getReported(); // 로그인 한 사용자가 신고했는지 여부 가져오기
    }
  },[id, user]);

  function renderReportBtn() { // 신고 버튼 렌더링 처리
    if (user) {
      if (user.id != product.seller_id && !isReported) { // user.id == 상품소유자id
        // ownerId = 상품소유자id
        return (
          <>
            <Button variant='danger' size="sm" onClick={handleOpen}><MegaphoneFill/> 신고</Button>
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
      <ProductDetailContext.Provider value={{id, likehit}}>
      <Container>
        <div className={`${style.inner}`}>
          {
            product.seller_id == user?.id ?
            <>
              <Button variant="outline-secondary" className={style.updateBtn} onClick={()=>{navigate(`/product/edit/${product.product_id}`,
              {state: {product: product, files}}
              )}}>글 수정</Button>
              <Button variant="outline-secondary" className={style.deleteBtn} id={id} onClick={onDelete}>글 삭제</Button>
            </> : null
          }
          
        {
            (product ) ?
                  <div className='book-info'>
                    <Container>
                      <div className={`${style.name}`}>
                        <span>{product.product_name}&nbsp;&nbsp;</span>
                        <div className='sold'>
                        {
                          (product.soldDate) ?
                          <Stack direction="horizontal" gap={2}>
                             <Badge bg = "primary">판매 완료</Badge>
                          </Stack>
                          : null
                        }
                        </div>
                        <div className='block'>
                        {
                          (product.blocked === 1) ?
                          <span>차단됨</span>
                          : null
                        }
                        </div>
                      </div>
                      <div>
                      </div>
                    </Container>
                    <Container>
                      <div className={`${style.optioninfo}`}>
                        <p className='option'><span>저자 : {product.writer}</span></p>
                        <p className='option'><span>출판사 : {product.publisher}</span></p> 
                        <p className='option'><span>출간일 : {new Date(product.publish_date).toLocaleDateString()}</span></p>
                        <p className='option'><span>게시일 : {new Date(product.createdAt).toLocaleDateString()}</span></p>
                      </div>
                    </Container>
                  </div>  

            : <p>상품 정보를 찾을 수 없습니다</p>
            }
        </div>
        <Container>
            <div className={`${style.innerbox}`}>  
            {
              (product) ?
                      <>
                      <div className={`${style.infopic}`}>
                      {
                        product.filename ? 
                        <img className={style.book_image} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
                        :
                        <img className={style.no_book_image} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
                    }
                      </div>
                    <div className={`${style.infocate}`}>                     
                      <div className={`${style.cateinfo}`}>카테고리 : <span>{product.category_name}</span></div> 
                      <div className={`${style.cateinfo}`}>ISBN 10 : <span>{product.isbn10}</span></div> 
                      <div className={`${style.cateinfo}`}>ISBN 13 : <span>{product.isbn13}</span></div> 
                      <div className={`${style.cateinfo}`}>판매가 : <span>{product.price}</span></div> 
                    </div>
                      <div>
                      {
                        renderReportBtn()
                      }
                      </div>
                      <div>
                      <Favorite/>
                      </div>
                    </>
              : <p>상품 정보를 찾을 수 없습니다</p>
            }
            </div>
        </Container>

      <div className={`${style.boxinfo}`}>
      {
            (product) ?
                  <>
                  {/* <div className={`${style.info0102}`}>
                    <div className={`${style.info01}`}>
                      <span>책 제목</span>
                    </div>
                    <div className ={`${style.info02}`}>
                      <span>{product.product_name}</span>
                    </div>
                  </div> */}
                  <div className={`${style.info0102}`}>
                    <div className={`${style.info01}`}>
                      <span>책 상태</span>
                    </div>
                    <div className ={`${style.info022}`}>
                      <span>판매자 코멘트 : {product.description}. <br/> 상태 : {product.condition}</span>
                    </div>
                  </div>                
                  <div className={`${style.info0102}`}>
                    <div className={`${style.info01}`}>
                      판매자
                    </div>
                    <div className ={`${style.info0405}`}>
                      <div className ='info4'>
                        <span><Link to={`/user/${product.seller_id}`}>{product.nickname}</Link></span>
                      </div>
                    <div className= 'info05'>
                      <Link to={'/chat'} style={{ textDecoration: "none", color: "black"}}>판매자와 채팅하기</Link>
                    </div>          
                    </div>
                  </div>
                  <ProductCaution/>
                  </>
            : <p>아직 등록한 상품이 없어요!</p>
            }
        </div> 

        <OtherProduct id={product.seller_id}/>
      </Container>
      </ProductDetailContext.Provider>
    );

  }


  
  export default ProductDetail;