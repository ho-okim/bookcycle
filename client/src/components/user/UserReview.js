import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useHref, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import { getUserReviewList, getUserReviewAll } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';
import UserReviewSorting from './UserReviewSorting.js';
import UserReviewBox from './UserReviewBox.js';

function UserReview({tradeType}) {
    const url = useHref(); // 현재 url
    const isReviewUrl = url.includes("review"); // 리뷰 목록 페이지 여부
    const location = useLocation(); // location 객체
    
    const {targetUserId, userInfo} = useTargetUser(); // 대상 정보
    
    const [reviewList, setReviewList] = useState([]); // 리뷰목록
    const [searchParams, setSearchParams] = useSearchParams(); // page query
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    const [order, setOrder] = useState({ // 정렬기준
        name : location.state?.order?.name ?? 'createdAt', 
        ascend : location.state?.order?.ascend ?? false 
    }); 

    let limit = 15;
    let showLimit = 5;

    // 더보기버튼 클릭 시 이동
    const navigate = useNavigate();

    useEffect(()=>{
        async function getTotal() { // 전체 데이터 수
            const res = await getUserReviewAll(targetUserId, tradeType);
            setTotalData(res);    
        }
        async function pageOffset() { // 페이지 시작점 처리
            if (!searchParams.get("page") 
            || searchParams.get("page") < 0 
            || searchParams.get("page") > Math.max(Math.ceil(totalData/limit), 1) ) 
            {   
                setOffset(0);
            } else {
                setOffset((searchParams.get("page")-1)*limit);
            }
        }

        if (userInfo.blocked === 0) { // 차단되지 않은 사용자일때만 호출
            getTotal();
            pageOffset();
        }
    }, [targetUserId, totalData, searchParams, userInfo]);

    useEffect(()=>{ // 요청 url이 바뀔때마다 리뷰 정보를 다시 가져옴
        setLoading(true);

        // 기본 페이지 - 5개만 출력
        async function getReviewList() {
            let res;
            if (!isReviewUrl) { // 사용자 페이지라면 간략한 정보
                res = await getUserReviewList(targetUserId, tradeType, showLimit, 0, order);
            } else { // 더보기 후 상세 페이지라면 상세 정보
                res = await getUserReviewList(targetUserId, tradeType, limit, offset, order);
            }
            setReviewList(res);
        }

        if (userInfo.blocked === 0) { // 차단되지 않은 사용자일때만 호출
            getReviewList();
        }
        setLoading(false);
    }, [targetUserId, offset, searchParams, order, userInfo]);

    function handleMoreView() { // 리뷰 리스트로 이동
        if (!isReviewUrl) {
            navigate(`/user/${targetUserId}/review/${tradeType}`);
        }
    }

    function handleMoveBack() { // 이전 페이지 - 유저정보
        if (isReviewUrl) {
            navigate(`/user/${targetUserId}`);
        }
    }

    function handlePagination(value) { // pagination에서 offset 변경
        setOffset((value-1)*limit);
    }

    // 로딩 및 데이터가 없을 때 박스 css
    const databox_css = (reviewList.length === 0) ?
    `d-flex justify-content-center`
    : (isReviewUrl) ? 
    'd-flex justify-content-between flex-wrap'
    : '';
    
    return(
        <section className={styles.section_box}>
            <Container>
                <div className={styles.title}>
                    <h4 className={styles.title_font}>
                        {/* buy : buyer_id = targetUserId
                            sell : seller_id = targetuserId
                        */}
                        {
                            tradeType === 'buy' ?
                            `${userInfo.nickname}님에게 상품을 판매했어요`
                            : tradeType === 'sell' ?
                            `${userInfo.nickname}님의 상품을 구매했어요`
                            :null
                        }
                    </h4>
                    {
                        (isReviewUrl) ? 
                        <div className='d-flex justify-content-end align-items-center flex-wrap'>
                            <UserReviewSorting
                            sortType={'score'} 
                            typeAscend={order.name === 'score' && order.ascend} 
                            order={order} setOrder={setOrder}/>
                            <UserReviewSorting 
                            sortType={'createdAt'} 
                            typeAscend={order.name === 'createdAt' && order.ascend}
                            order={order} setOrder={setOrder}/>
                        </div> 
                        : <Button 
                            variant='outline-primary' 
                            className={styles.more_btn}
                            onClick={handleMoreView}
                            >더보기</Button>
                    }
                </div>
                {
                    (loading) ? 
                    <div className={`${styles.box} d-flex justify-content-center`}>
                        <LoadingSpinner/>
                    </div>
                    : null
                }
                <div className={databox_css}>
                    {
                        (reviewList && reviewList.length != 0) ? 
                        reviewList.map((el, i)=>{
                            return(
                                <UserReviewBox key={i} review={el} isReviewUrl={isReviewUrl} tradeType={tradeType}/>
                            )
                        })
                        : tradeType === 'buy' ?
                        <div className='blank_box p-0 m-0 col-12'>
                            <p className='blank_message'>아직 구매한 제품에 작성된 후기가 없어요!</p>
                        </div>
                        : tradeType === 'sell' ?
                        <div className='blank_box p-0 m-0 col-12'>
                            <p className='blank_message'>아직 판매한 제품에 작성된 후기가 없어요!</p>
                        </div>
                        :null
                    }
                </div>
                {
                    isReviewUrl ?
                    <>
                        <div className={styles.pagination_wrap}>
                            <DataPagination 
                            totalData={totalData} 
                            limit={limit} blockPerPage={3}
                            handlePagination={handlePagination}/>
                        </div>
                        <div className={styles.back_wrap}>
                            <Button variant='outline-secondary'
                            className={`${styles.back_btn}`}
                            onClick={handleMoveBack}
                            >사용자 페이지로 돌아가기</Button>
                        </div>
                    </>
                    : null
                }
            </Container>
        </section>
    )
}

export default UserReview;