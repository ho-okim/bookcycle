import { Link } from "react-router-dom";
import styles from "../../styles/search.module.css";
import {Eye, HeartFill} from 'react-bootstrap-icons';

function ProductDataBox({product}) {

    let newDate = '';
    if (product.publish_date) {
        newDate = new Date(product.publish_date).toLocaleDateString();
    } else {
        newDate = '❔';
    }

    return(
        <Link to={`/productDetail/${product.product_id}`} className={styles.product_box}>
            <div className={styles.box_content}>
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
                        <span className={styles.writer}>{product.writer ?? '❔'}</span>
                        <span className={styles.publisher}>{product.publisher ?? '❔'}</span>
                        <span>{newDate}</span>
                    </p>
                    <p>&#8361; {product.price.toLocaleString()}</p>
                    <div className={styles.seller_info}>
                        <p>{product.nickname}</p>
                        <p>
                            <span className={styles.view_count}><Eye/> {product.view_count.toLocaleString()}</span>
                            <span><HeartFill className={styles.heart}/> {product.liked.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductDataBox;