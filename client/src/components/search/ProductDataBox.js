import { Link } from "react-router-dom";
import styles from "../../styles/search.module.css";
import {Eye, Heart, Person} from 'react-bootstrap-icons';
import { dateProcessingDash } from "../../lib/dateProcessing";
import { Badge } from "react-bootstrap";

function ProductDataBox({product}) {

    return(
        <Link to={`/product/detail/${product.product_id}`} className='p-2 col-12 col-lg-6'>
            <div className={`${styles.box_content} p-2 d-flex justify-content-around align-items-start flex-wrap`}>
                <div className={`${styles.pic_box} col-5 col-sm-3`}>
                {
                    product.filename ? 
                    <img className={styles.bookpic} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
                    :
                    <img className={styles.bookpic} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
                }
                </div>
                <div className={`${styles.info_box} px-2 my-3 my-sm-0 col-8 col-sm-8 text-sm-start`}>
                    <div>
                        <Badge className={styles.category_badge}>{product.category_name}</Badge>
                        <p className={`${styles.book_title} ${styles.text_hidden}`}>{product.product_name}</p>
                        <div className={`${styles.book_info} ${styles.text_hidden}`}>
                            {(product.writer && <span>{product.writer}</span>)}
                            {(product.publisher && <span>{product.publisher}</span>)}
                            {(product.publish_date && <span>{dateProcessingDash(product.publish_date)}</span>)}
                        </div>
                        <p className={styles.price}>{product.price.toLocaleString()} 원</p>
                    </div>
                    <div className={styles.seller_info}>
                        <div className={`${styles.book_title} d-flex align-items-center`}>
                            <Person className={styles.person_icon}/> <span>{product.nickname}</span>
                        </div>
                        <div className={styles.view_like_box}>
                            <span className='me-2'><Eye/> {product.view_count.toLocaleString()}</span>
                            <span><Heart/> {product.liked.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductDataBox;