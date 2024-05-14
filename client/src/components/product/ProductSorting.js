import style from "../../styles/productList.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductSorting() {

    return(
        <div className={`${style.buttonList}`}>
        <span>1 2 3 4 5 &gt; </span>
        <div className={`${style.productcondition}`}>
          {<select id="sort" className=" outline-none" onChange={onSelected}>
              <option value="condition">상품상태</option>
              <option value="conditiontop">상</option>
              <option value="conditionmid">중</option>
              <option value="conditionbo">하</option>
            </select>
          }
        </div>
        <div className={`${style.order}`}>
          {<select id="sort" className=" outline-none" onChange={onSelected}>
              <option value="createdAt">최신순</option>
              <option value="likeOrder">좋아요 순</option>
            </select>
          }
        </div>
      </div> 
    )
}

export default ProductSorting;