import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/search.module.css';
import ProductDataBox from './ProductDataBox';
import { Button } from 'react-bootstrap';
import { useSearchResult } from '../../contexts/SearchResultContext';

function SearchProduct() {

    const { keyword, productResult, handleMoreView } = useSearchResult();
    
    return(
        <>
            <div className={styles.title_box}>
                <div className={styles.result_box}>
                    <h2>"{keyword}" 상품 검색 결과</h2>
                    <p className={styles.result_count}>총 {productResult?.length ?? 0}건</p>
                </div>
                <Button className={styles.more_btn} onClick={handleMoreView}>상세 검색</Button>
            </div>
            <div className={styles.product}>
            {
                (productResult && productResult.length > 0) ?
                productResult.map((el)=>{
                    return(
                    <ProductDataBox key={el.product_id} product={el}/>
                    )
                })
                :
                <div className='blank_box'>
                    <p className='blank_message'>
                        검색된 상품이 없어요!
                    </p>
                </div>
            }
            </div>
        </>
    )
}

export default SearchProduct;