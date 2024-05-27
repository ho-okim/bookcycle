import "../../styles/main.css"

function MiniBook(props){
  const {el} = props
  // img는 나중에 join한 테이블 뷰에서 가져와야 함
  const {product_name, price, filename} = el
  return(
    <>
      <div className="productWrap d-flex flex-column align-items-center">
        <div className="productImgWrap d-flex justify-content-center align-items-center">
          {
            filename ? 
              <img src={process.env.PUBLIC_URL + `/img/product/${filename}`} alt="" className="productImg"/> :
              <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} alt="" className="productImg"/>
          }
        </div>
        <div className="textWrap">
          <h4 className="productTitle title">{product_name}</h4>
          <p className="productPrice text regular">{price.toLocaleString()} 원</p>
        </div>
      </div>
    </>
  )
}

export default MiniBook