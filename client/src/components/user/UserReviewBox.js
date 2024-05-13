import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import starRating from '../../lib/starRating.js';

function UserReviewBox({review}) {

    return(
        <div className={
            `${styles.review_box} d-flex justify-content-around align-items-center`
        }>
            <div className={styles.score}>
                {
                    starRating(review.score)
                }
            </div>
            <div className={styles.review}>
                <p className={`${styles.review_content} ${styles.text_hidden}`}>{review.content}</p>
            </div>
            <p className={styles.date}>{new Date(review.createdAt).toLocaleDateString("ko-kr")}</p>
        </div>
    )
}

export default UserReviewBox;