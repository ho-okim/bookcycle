import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import { getUserReviewList, getUserReviewAll } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';
import starRating from '../../lib/starRating.js';
import StarSelect from '../StarSelect.js';

function UserReviewList() {

    const targetUserId = useContext(TargetUserContext); // 대상 id

    const [reviewList, setReviewList] = useState([]); // 리뷰목록
    const [currentUrl, setCurrentUrl] = useState(window.location.href); // 현재 url
    const [isReviewUrl, setIsReviewUrl] = useState(currentUrl.includes("review")); // 리뷰url 포함여부
    const [searchParams, setSearchParams] = useSearchParams(); // page query
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    let limit = 10;

    // 더보기버튼 클릭 시 이동
    const navigate = useNavigate();

    useEffect(()=>{ // 요청 url 확인
        setIsReviewUrl(currentUrl.includes("review"));
    }, [currentUrl, isReviewUrl]);

    useEffect(()=>{
        // 전체 데이터 수
        async function getTotal() {
            const res = await getUserReviewAll(targetUserId);
            setTotalData(res);    
        }

        async function pageOffset() {
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
    }, [targetUserId, totalData, searchParams])

    useEffect(()=>{ // 요청 url이 바뀔때마다 리뷰 정보를 다시 가져옴
        setLoading(true);
        
        // 기본 페이지 - 5개만 출력
        async function getReviewList() {
            let res;
            if (!isReviewUrl) { // 사용자 페이지라면 간략한 정보
                res = await getUserReviewList(targetUserId, 5, 0);
            } else { // 더보기 후 상세 페이지라면 상세 정보
                res = await getUserReviewList(targetUserId, limit, offset);
            }
            setReviewList(res);
            setLoading(false);
        }

        getReviewList();
    }, [targetUserId, currentUrl, isReviewUrl, offset]);

    function handleMoreView() { // 리뷰 리스트로 이동
        if (!isReviewUrl) {
            navigate(`/user/${targetUserId}/review?page=1`);
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

    // 더보기 버튼 유무에 따른 타이틀 css
    const titlebox_css = (isReviewUrl || !reviewList || reviewList.length == 0) ?
    `${styles.title} ${styles.review_title_box}` 
    : `${styles.title}`;

    // 로딩 및 데이터가 없을 때 박스 css
    const databox_css = reviewList.length == 0 ?
    `${styles.box} d-flex justify-content-center`
    : `${styles.box}`;

    if (loading) {
        return (
            <Container className={styles.section_sub_box}>
                <div className='inner'>
                    <div className={`${styles.title} ${styles.review_title_box}`}>
                        <h4>구매후기</h4>
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
                <div className={`${titlebox_css} d-flex justify-content-between`}>
                    <h4>구매후기</h4>
                    {
                        (isReviewUrl || reviewList.length == 0) ? 
                        null 
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
                                <Review key={i} review={el}/>
                            )
                        })
                        : <p>아직 판매한 제품에 작성된 후기가 없어요!</p>
                    }
                </div>
                {
                    isReviewUrl ?
                    <>
                        <div className={styles.pagination_wrap}>
                            <DataPagination 
                            totalData={totalData} limit={limit} blockPerPage={3}
                            handlePagination={handlePagination}
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

function Review({review}) {
    return(
        <div className={
            `${styles.review_box} d-flex justify-content-around align-items-center`
        }>
            <div className={`${styles.score} ${styles.box}`}>
                {
                    starRating(`${review.score}`)
                }
            </div>
            <div className={`${styles.review} d-flex flex-column`}>
                <p className={`${styles.review_content} ${styles.box}`}>{review.content}</p>
            </div>
            <p className={`${styles.writer} ${styles.box}`}>{review.buyer_name}</p>
            <p className={`${styles.date} ${styles.box}`}>{new Date(review.createdAt).toLocaleDateString("ko-kr")}</p>
        </div>
    )
}

export default UserReviewList;