import { Link } from "react-router-dom";
import styles from "../../styles/productList.module.css";
import {Eye, HeartFill} from 'react-bootstrap-icons';

function ProductBox({product}){
  
  let newDate = '';
  if (product.publish_date) {
      newDate = new Date(product.publish_date).toLocaleDateString();
  } else {
      newDate = '❔';
  }

  return (
    <Link to={`/productDetail/${product.id}`} className={styles.product_link}>
      <div className={styles.product}>
        <div className={styles.bookpicbox}>
        {
            product.filename ? 
            <img className={styles.bookpic} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
            :
            <img className={styles.no_bookpic} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
        }
        </div>
        <div className={styles.bookinfoabout}>
          <p className={styles.book_title}>{product.product_name}</p>
          <p>{product.category_name}</p>
          <p className={styles.book_info}>
            {product.writer ?? '❔'} | {product.publisher ?? '❔'} | {newDate}
          </p>
          <p>&#8361; {product.price.toLocaleString()}</p>
        </div>
        <div className={styles.seller_info}>
          <p>{product.nickname}</p>
          <p><Eye/> {product.view_count}</p>
          <p><HeartFill className={styles.heart}/> {product.liked}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductBox;
