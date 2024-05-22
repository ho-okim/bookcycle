import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import starRating from '../../lib/starRating.js';
import { dateProcessingYear, dateTimeProcessing } from '../../lib/dateProcessing.js';

function UserReviewBox({review, isReviewUrl}) {

    return(
        <div className={
            `${styles.review_box} d-flex justify-content-around align-items-center`
        }>
            <div className='col-2 my-2'>
                {
                    starRating(review.score)
                }
            </div>
            <div className={'col-6 my-2'}>
                <p className={`${styles.review_content} ${styles.text_hidden}`}>{review.content}</p>
            </div>
            <p className='col-3 my-2'>
                {
                    (isReviewUrl) ?
                    dateTimeProcessing(new Date(review.createdAt))
                    :
                    dateProcessingYear(new Date(review.createdAt))
                }
            </p>
        </div>
    )
}

export default UserReviewBox;