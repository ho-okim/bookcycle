import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, useHref } from 'react-router-dom';
import UserReview from './UserReview.js';

function UserReviewList() {

    const url = useHref(); // 현재 url
    const isReviewUrl = url.includes("review"); // 리뷰 목록 페이지 여부
    let tradeType = url.split('/')[4];

    return(
        <>
        {
            isReviewUrl ?
            
                <Outlet context={{tradeType}}/>
            :
            <>
                <UserReview tradeType={'buy'}/>
                <UserReview tradeType={'sell'}/>
            </>
        }
        </>
    )
}

export default UserReviewList;