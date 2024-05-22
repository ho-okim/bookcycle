import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import { getUserReviewTag, getUserReviewTagTotal } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';
import UserReviewTagTable from './UserReviewTagTable.js';

function UserReviewTag() {

    const {targetUserId, userInfo} = useTargetUser(); // 대상 정보
    const [reviewTagTotal, setReveiwTagTotal] = useState(null); // 전체 태그 수
    const [reviewTagList, setReviewTagList] = useState([]); // 리뷰태그 목록
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    const limit = 10; // 가져올 데이터 수

    function handleMoreView() { // 더보기 버튼 처리
        if (reviewTagTotal !== null && reviewTagList.length < reviewTagTotal) {
            setOffset(offset+limit);
        }
        return;
    }

    // 리뷰 더 가져오기
    const getMoreReview = useCallback(async (newOffset) => { 
        const res = await getUserReviewTag(targetUserId, limit, newOffset);

        if (res === 'error') {
            setReviewTagList([]);
            return;
        }

        setReviewTagList((reviewTagList) => ([...reviewTagList, ...res]));
        setLoading(false);
    }, [targetUserId, limit]);

    useEffect(()=>{
        async function getTotal() { // 리뷰 총 개수 가져오기
            const res = await getUserReviewTagTotal(targetUserId);
            setReveiwTagTotal(res.total);
        }

        if (userInfo.blocked === 0) {  // 차단되지 않은 사용자일때만 호출
            getTotal();
        }
    }, [targetUserId, userInfo]);

    useEffect(()=>{ // 요청 id가 바뀔때마다 리뷰 정보를 다시 가져옴
        setLoading(true);
        setOffset(0); // 시작점 초기화
        
        async function getReviewTagList() { // 처음 리뷰 목록 가져오기
            const res = await getUserReviewTag(targetUserId, limit, 0);
    
            if (res === 'error') {
                setReviewTagList([]);
                return;
            }

            setReviewTagList(res);
        }
        // 차단되지 않은 사용자일때만 호출
        if (reviewTagTotal !== null && userInfo.blocked === 0) {
            getReviewTagList();
        }
        setLoading(false);
    }, [targetUserId, reviewTagTotal, userInfo]);

    useEffect(()=>{ // 시작점 바뀔때마다 정보 추가
        setLoading(true);
        // 차단되지 않은 사용자일때만 호출
        if (offset > 0 && userInfo.blocked === 0) {
            getMoreReview(offset); 
        }
        setLoading(false);
    }, [offset, getMoreReview, userInfo]);

    return(
        <Container className='col-12 col-md-8 p-0'>
            <div>
                <h4 className={styles.title_font}>이런 점이 좋았어요</h4>
            </div>
            {
                (loading) ? 
                <div className='d-flex justify-content-center'>
                    <LoadingSpinner/>
                </div>
                :
                (reviewTagList.length == 0) ?
                <div className='blank_box p-0 m-0'>
                    <p className='blank_message'>아직 등록된 평가가 없어요!</p>
                </div>
                : <UserReviewTagTable 
                    reviewTagList={reviewTagList}
                    handleMoreView={handleMoreView}
                    reviewTagTotal={reviewTagTotal}
                    limit={limit}
                />
            }
        </Container>
    )
}

export default UserReviewTag;