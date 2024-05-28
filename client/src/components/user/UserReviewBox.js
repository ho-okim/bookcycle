import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import starRating from '../../lib/starRating.js';
import { dateProcessingYear, dateTimeProcessing } from '../../lib/dateProcessing.js';

function UserReviewBox({review, isReviewUrl, tradeType}) {

    if (!isReviewUrl) { // 다른 사용자 기본 페이지에서 볼 때
        return(
            <div className={
                `${styles.review_box} d-flex justify-content-around align-items-center`
            }>
                <div className='col-2 my-2'>
                    {
                        starRating(review.score)
                    }
                </div>
                <div className={'col-5 my-2'}>
                    <p className={`${styles.review_content} ${styles.text_hidden}`}>{review.content}</p>
                </div>
                <p className='col-2'>
                    {
                        (tradeType === 'sell') ?
                        review.buyer_nickname
                        : review.seller_nickname
                    }
                </p>
                <p className={`${styles.date} col-2 my-2`}>
                    { dateProcessingYear(new Date(review.createdAt)) }
                </p>
            </div>
        )
    } else { // 더보기 버튼으로 리뷰 상세보기 페이지로 왔을 때
        return(
            <div className={
                `${styles.review_box_long} p-2 col-12 d-flex flex-column justify-content-center align-items-center`
            }>
                <div className='col-12 d-flex justify-content-between align-items-center'>
                    <div className='col-6 d-flex justify-content-start align-items-center text-start flex-wrap'>
                        <div className='col-8 col-sm-3 my-2'>
                            {
                                starRating(review.score)
                            }
                        </div>
                        <p className='ms-sm-2 col-8'>
                            {
                                (tradeType === 'sell') ?
                                review.buyer_nickname
                                : review.seller_nickname
                            }
                        </p>
                    </div>
                    <p className={`${styles.date} col-6 my-2 text-end`}>
                        { dateTimeProcessing(new Date(review.createdAt)) }
                    </p>
                </div>
                <div className='col-12 my-2'>
                    <p className={styles.review_content_long}>{review.content}</p>
                </div>
            </div>
        )
    }
}

export default UserReviewBox;