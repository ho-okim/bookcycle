import { Link } from "react-router-dom";
import styles from "../../styles/search.module.css";
import {Eye, HeartFill} from 'react-bootstrap-icons';
import { dateProcessingDash } from "../../lib/dateProcessing";

function ProductDataBox({product}) {

    let newDate = '';
    if (product.publish_date) {
        newDate = dateProcessingDash(product.publish_date);
    } else {
        newDate = '❔';
    }

    return(
        <Link to={`/product/detail/${product.product_id}`} className='py-1 col-12 col-lg-6'>
            <div className={`${styles.box_content} p-1 d-flex justify-content-around flex-wrap`}>
                <div className={`${styles.bookpicbox} col-6 col-sm-3`}>
                {
                    product.filename ? 
                    <img className={styles.bookpic} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
                    :
                    <img className={styles.no_bookpic} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
                }
                </div>
                <div className='p-2 col-8 col-sm-6 text-center text-sm-start'>
                    <p className={styles.book_title}>{product.product_name}</p>
                    <p>{product.category_name}</p>
                    <div className={styles.book_info}>
                        <p className={styles.writer}>{product.writer ?? '❔'}</p>
                        <span className={styles.publisher}>{product.publisher ?? '❔'}</span>
                        <span>{newDate}</span>
                    </div>
                    <p>&#8361; {product.price.toLocaleString()}</p>
                    <div className={styles.seller_info}>
                        <p>{product.nickname}</p>
                        <div>
                            <span className={styles.view_count}><Eye/> {product.view_count.toLocaleString()}</span>
                            <span><HeartFill className={styles.heart}/> {product.liked.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductDataBox;