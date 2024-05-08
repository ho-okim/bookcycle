import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import { getUserReviewTag, getUserReviewTagTotal } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';

function UserReviewTag() {

    const {targetUserId} = useTargetUser(); // 대상 id
    const [reviewTagTotal, setReveiwTagTotal] = useState(null);
    const [reviewTagList, setReviewTagList] = useState([]); // 리뷰태그 목록
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    const limit = 10; // 가져올 데이터 수

    useEffect(()=>{
        async function getTotal() { // 리뷰 총 개수 가져오기
            const res = await getUserReviewTagTotal(targetUserId);
            setReveiwTagTotal(res.total);
        }
        getTotal();
    }, [targetUserId]);

    useEffect(()=>{ // 요청 id가 바뀔때마다 리뷰 정보를 다시 가져옴
        setOffset(0); // 시작점 초기화
        
        async function getReviewTagList() { // 처음 리뷰 목록 가져오기
            const res = await getUserReviewTag(targetUserId, limit, 0);
    
            if (res === 'error') {
                setReviewTagList([]);
                return;
            }
            console.log('여기인가')
            setReviewTagList(res);
            setLoading(false);
        }

        if (reviewTagTotal !== null) {
            getReviewTagList();
        }
    }, [targetUserId, reviewTagTotal]);

    function handleMoreView() { // 더보기 버튼 처리
        if (reviewTagTotal !== null && reviewTagList.length < reviewTagTotal) {
            setOffset(offset+limit);
        }
        return;
    }

    async function getMoreReview(newOffset) { // 리뷰 더 가져오기
        const res = await getUserReviewTag(targetUserId, limit, newOffset);

        if (res === 'error') {
            setReviewTagList([]);
            return;
        }

        setReviewTagList((reviewTagList) => ([...reviewTagList, ...res]));
        setLoading(false);
    }

    useEffect(()=>{ // 시작점 바뀔때마다 정보 추가
        if (offset > 0) {
            getMoreReview(offset); 
        }
    }, [offset]);

    if (loading) {
        return(
            <Container className={styles.section_sub_box}>
                <div className="inner">
                    <div className={styles.title}>
                        <h4 className={styles.title_font}>이런 점이 좋았어요</h4>
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
            <div className="inner">
                <div className={styles.title}>
                    <h4 className={styles.title_font}>이런 점이 좋았어요</h4>
                </div>
                {
                    reviewTagList.length == 0 ?
                    <div className={`${styles.box} d-flex justify-content-center`}>
                        <p>아직 등록된 평가가 없어요!</p>
                    </div>
                    : <ReviewTable 
                        reviewTagList={reviewTagList}
                        handleMoreView={handleMoreView}
                        reviewTagTotal={reviewTagTotal}
                        limit={limit}
                    />
                }
            </div>
        </Container>
    )
}

// 리뷰 출력 테이블
function ReviewTable({
    reviewTagList, 
    handleMoreView,
    reviewTagTotal,
    limit
    }) {
    return(
        <table>
            <tbody>
                {
                    reviewTagList.map((el, i)=>{
                        return (
                            <ReviewTag key={i} reviewTag={el}/>
                        )
                    })
                }
                <tr>
                    <td className={styles.liked}></td>
                    <td className={styles.tag}>
                        {
                            (reviewTagList.length < limit)
                            || (reviewTagList.length == reviewTagTotal)
                            ?
                            null
                            :
                            <Button 
                            variant='outline-primary' 
                            className={styles.arrow_more_btn}
                            onClick={handleMoreView}
                            >▼</Button>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

// 리뷰 행
function ReviewTag({reviewTag}) {
    return(
        <tr>
            <td className={styles.liked}>
                <p className={styles.box}>{reviewTag.size} 명</p>
            </td>
            <td className={styles.tag}>
                <p className={styles.box}>{reviewTag.tag_name}</p>
            </td>
        </tr>
    )
}

export default UserReviewTag;