import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useHref, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import { getUserReviewList, getUserReviewAll } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';
import UserReviewSorting from './UserReviewSorting.js';
import UserReviewBox from './UserReviewBox.js';

function UserReview({tradeType}) {
    const url = useHref(); // 현재 url
    const isReviewUrl = url.includes("review"); // 리뷰 목록 페이지 여부
    const {targetUserId, setTargetUserId} = useTargetUser(); // 대상 id
    
    const [reviewList, setReviewList] = useState([]); // 리뷰목록
    const [searchParams, setSearchParams] = useSearchParams(); // page query
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    const [order, setOrder] = useState({ // 정렬기준
        name : searchParams.get("order") ?? 'createdAt', 
        ascend : searchParams.get("ascend") ?? false 
    }); 

    let limit = 10;
    let showLimit = 5;

    // 더보기버튼 클릭 시 이동
    const navigate = useNavigate();

    // 전체 데이터 수
    async function getTotal() {
        const res = await getUserReviewAll(targetUserId, tradeType);
        setTotalData(res);    
    }

    // 기본 페이지 - 5개만 출력
    async function getReviewList() {
        let res;
        if (!isReviewUrl) { // 사용자 페이지라면 간략한 정보
            res = await getUserReviewList(targetUserId, tradeType, showLimit, 0, order);
        } else { // 더보기 후 상세 페이지라면 상세 정보
            res = await getUserReviewList(targetUserId, tradeType, limit, offset, order);
        }
        setReviewList(res);
        setLoading(false);
    }

    useEffect(()=>{
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

        getTotal();
        pageOffset();
    }, [totalData, searchParams]);

    useEffect(()=>{ // 요청 url이 바뀔때마다 리뷰 정보를 다시 가져옴
        setLoading(true);
        getReviewList();
    }, [targetUserId, offset, searchParams]);

    function handleMoreView() { // 리뷰 리스트로 이동
        if (!isReviewUrl) {
            navigate(`/user/${targetUserId}/review/${tradeType}?page=1`);
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
    const databox_css = reviewList.length == 0 ?
    `${styles.box} d-flex justify-content-center`
    : `${styles.box}`;

    if (loading) {
        return (
            <Container className={styles.section_sub_box}>
                <div className='inner'>
                    <div className={styles.title}>
                        <h4 className={styles.title_font}>
                            {
                                tradeType === 'buy' ?
                                '구매후기'
                                : tradeType === 'sell' ?
                                '판매후기'
                                :null
                            }
                        </h4>
                    </div>
                    <div className={`${styles.box} d-flex justify-content-center`}>
                        <LoadingSpinner/>
                    </div>
                </div>
            </Container>
        )
    }
    
    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div className={styles.title}>
                    <h4 className={styles.title_font}>
                        {
                            tradeType === 'buy' ?
                            '구매후기'
                            : tradeType === 'sell' ?
                            '판매후기'
                            :null
                        }
                    </h4>
                    {
                        (isReviewUrl || reviewList.length == 0) ? 
                        <div>
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
                <div className={databox_css}>
                    {
                        reviewList.length != 0 ? 
                        reviewList.map((el, i)=>{
                            return(
                                <UserReviewBox key={i} review={el} 
                                setTargetUserId={setTargetUserId}/>
                            )
                        })
                        : tradeType === 'buy' ?
                        <p>아직 구매한 제품에 작성된 후기가 없어요!</p>
                        : tradeType === 'sell' ?
                        <p>아직 판매한 제품에 작성된 후기가 없어요!</p>
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
                            handlePagination={handlePagination}
                            order={order}
                            />
                            <Button variant='secondary'
                            className={`${styles.back_btn}`}
                            onClick={handleMoveBack}
                            >뒤로가기</Button>
                        </div>
                    </>
                    : null
                }
            </div>
        </Container>
    )
}

export default UserReview;