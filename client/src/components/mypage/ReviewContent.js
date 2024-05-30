import { useState } from 'react';
import styles from '../../styles/mypage.module.css';

function ReviewContent({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandReview = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.reviewContent} regular`} 
      style={isExpanded ? { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } : null}
    >
      {isExpanded ? review : `${review.substring(0, 130)}`}
      {review.length > 200 && (
        <span
          className={styles.readMore}
          onClick={handleExpandReview}
        >
          {isExpanded ? ' __접기' : ' ...더보기'}
        </span>
      )}
    </div>
  );
}
export default ReviewContent;