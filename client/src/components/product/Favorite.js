import styles from "../../styles/productDetail.module.css";
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
    const {id, likehit} = useProductDetail();
    const { user } = useAuth();

    async function getproductLikeState() {
        const data = await productLikeState(id);
        return data;
      }

    let [productlikeCounts, setproductLikeCounts] = useState(0);
    let [productLikeStates, setproductLikeStates] = useState([]);

    useEffect(()=>{

        let productLikeState;
        const getLikeState = async () => { // 현재 내가 찜한 목록 가져오기
            productLikeState = await getproductLikeState();
            setproductLikeStates(productLikeState);
        };

        if (user) { // 사용자가 로그인한 상태일때만 호출
          getLikeState();  
        }
        setproductLikeCounts(likehit);
    }, [id, likehit]);

    // console.log("좋아요 개수: ", productlikeCounts);
    // console.log("로그인 회원이 좋아요한 게시글(likeStates): ", productLikeStates);
    // console.log("id: ", id);

    const changeToproductLike = async () => {
        if (!user) {
          alert("로그인 후 이용하실 수 있습니다.");
        } else {
          productLike(id);

          setproductLikeStates((prevproductLikeStates) => [
            ...prevproductLikeStates,
            { user_id: user?.id, product_id: Number(id) },
          ]);

          setproductLikeCounts((prevproductLikeCounts) => (productlikeCounts + 1));
        }
    };

    // 채워진 하트 클릭 : '좋아요 취소' 하기 💛 ->  🤍
  const changeToproductUnLike = async () => {
    if (!user) {
      alert("로그인 후 이용하실 수 있습니다.");
    } else {
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
  };

  return(
    
    <>
    <div className='heartproduct'>
    {!user ? (
        <div className={styles.heartCount}>
          <Heart
            size="20"
            className={styles.heartIcon}
            onClick={() => productUnLike()}
          />
          <span>좋아요 </span>
        
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
          <span>좋아요 </span>
          <span className={styles.likeCounts}>{productlikeCounts}</span>개
        </div>
      )}
      </div>
  </>
  );

}

export default Favorite;