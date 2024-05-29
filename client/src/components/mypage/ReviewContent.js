import { useState } from 'react';
import styles from '../../styles/mypage.module.css';

function ReviewContent({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandReview = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.reviewContent} regular`}>
      {isExpanded ? review : `${review.substring(0, 200)}`}
      {review.length > 200 && (
        <span
          className={styles.readMore}
          onClick={handleExpandReview}
        >
          {isExpanded ? ' 접기' : ' ...더보기'}
        </span>
      )}
    </div>
  );
}
export default ReviewContent;