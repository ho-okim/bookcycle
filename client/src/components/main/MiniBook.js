import "../../styles/main.css"

function MiniBook(props){
  const {el} = props
  // img는 나중에 join한 테이블 뷰에서 가져와야 함
  const {product_name, price} = el
  return(
    <>
      <div className="productWrap">
        <img src="" alt="" className="productImg"/>
        <div className="textWrap">
          <h4 className="productTitle title">{product_name}</h4>
          <p className="productPrice text">{price} 원</p>
        </div>
      </div>
    </>
  )
}

export default MiniBook