import 'bootstrap/dist/css/bootstrap.min.css';
import { useHref } from 'react-router-dom';
import UserReview from './UserReview.js';

function UserReviewList() {

    const url = useHref(); // 현재 url
    const isReviewUrl = url.includes("review"); // 리뷰 목록 페이지 여부
    const currentType = url.includes("review/buy") ? 'buy' : url.includes("review/sell") ? 'sell' : null; 

    return(
        <>
        {
            isReviewUrl ?
                <UserReview tradeType={currentType}/>
            :
            <>
                <UserReview tradeType={'sell'}/>
                <UserReview tradeType={'buy'}/>
            </>
        }
        </>
    )
}

export default UserReviewList;