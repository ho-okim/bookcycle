import styles from "../../styles/productDetail.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useState, useEffect} from 'react';
import Button from "react-bootstrap/Button";
import { Heart } from "react-bootstrap-icons";
import { HeartFill } from "react-bootstrap-icons";
import { 
    productLike, 
    productUnLike, 
    productLikeState } from '../../api/product';
import { useAuth } from "../../contexts/LoginUserContext";
import { useProductDetail } from "../../contexts/ProductDetailContext";


function Favorite (){
    const {id, product} = useProductDetail();
    const { user } = useAuth();

    let [productlikeCounts, setproductLikeCounts] = useState(0);
    let [productLikeStates, setproductLikeStates] = useState([]);

    useEffect(()=>{
      const getLikeState = async () => { // 현재 내가 찜한 목록 가져오기
          const result = await productLikeState(id);
          setproductLikeStates(result);
      };

      if (user) { // 사용자가 로그인한 상태일때만 호출
        getLikeState();  
      }
      setproductLikeCounts(product.liked);
    }, [id, product]);

    // console.log("좋아요 개수: ", productlikeCounts);
    // console.log("로그인 회원이 좋아요한 게시글(likeStates): ", productLikeStates);
    // console.log("id: ", id);

    const changeToproductLike = async () => {
      if (!user) {
        alert("로그인 후 이용하실 수 있습니다.");
      } else {
        // 차단 안된 사용자이고, 판매된 상품이 아니고, 내 상품이 아닐때만 동작
        let actCondition = (user.blocked === 0 && user.id !== product.seller_id 
          && (!product.soldDate || product.seller_id == product.buyer_id));
        if (actCondition) {
          productLike(id);

          setproductLikeStates((prevproductLikeStates) => [
            ...prevproductLikeStates,
            { user_id: user?.id, product_id: Number(id) },
          ]);

          setproductLikeCounts((prevproductLikeCounts) => (productlikeCounts + 1));
        }
      }
    };

    // 채워진 하트 클릭 : '좋아요 취소' 하기 💛 ->  🤍
  const changeToproductUnLike = async () => {
    if (!user) {
      alert("로그인 후 이용하실 수 있습니다.");
    } else {
      // 차단 안된 사용자이고, 판매된 상품이 아니고, 내 상품이 아닐때만 동작
      let actCondition = (user.blocked === 0 && user.id !== product.seller_id 
        && (!product.soldDate || product.seller_id == product.buyer_id));
      if (actCondition) {
        productUnLike(id);

        // 기존에 존재하던 prevlikeStates에 해당 state 제거
        setproductLikeStates((prevproductLikeStates) =>
        prevproductLikeStates.filter(
            (productLikeState) => productLikeState.product_id !== Number(id)
          )
        );
  
        // 기존 prevLikeCounts에 - 1
        setproductLikeCounts((prevproductLikeCounts) => (productlikeCounts - 1));
      }
    }
  };

  return(
    
    <>
    <div className='heartproduct d-flex justify-content-center'>
    {!user ? (
        <div className={styles.heartCount}>
          <Heart
            size="20"
            className={styles.heartIcon}
            // onClick={() => productUnLike()} // 로그인 안 한 사용자가 호출하면 로그인 페이지로 이동해 일단 호출을 막았습니다
          />
        </div>
      ) : (
        <div className={styles.heartCount}>
          {productLikeStates.find((el) => el.product_id === Number(id)) ? (
            <HeartFill
              size="20"
              className={styles.heartIcon}
              onClick={() => changeToproductUnLike()}
            />
          ) : (
            <Heart
              size="20"
              className={styles.heartIcon}
              onClick={() => changeToproductLike()}
            />
          )}
        </div>
      )}
      <span className="me-2" style={{color: "#6A6A6A"}}>찜하기 {productlikeCounts}</span>
      </div>
  </>
  );

}

export default Favorite;