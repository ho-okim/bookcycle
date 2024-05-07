import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';

import TargetUserContext from '../../contexts/TargetUserContext.js';
import { getUserReviewTag, getUserReviewTagTotal } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';

function UserReviewTag() {

    const {targetUserId} = useContext(TargetUserContext); // 대상 id
    const [reviewTagTotal, setReveiwTagTotal] = useState(null);
    const [reviewTagList, setReviewTagList] = useState([]); // 리뷰태그 목록
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    let limit = 4;

    useEffect(()=>{
        async function getTotal() { // 리뷰 총 개수 가져오기
            const res = await getUserReviewTagTotal(targetUserId);
            setReveiwTagTotal(res.total);
        }
        getTotal();
    }, [targetUserId]);

    async function getReviewTagList() { // 리뷰 목록 가져오기
        if (reviewTagTotal !== 0) {
            if (reviewTagList.length === reviewTagTotal) {
                return;
            }
        }

        const res = await getUserReviewTag(targetUserId, limit, offset);

        if (res === 'error') {
            setReviewTagList([]);
            return;
        }

        setReviewTagList((reviewTagList) => [...reviewTagList, ...res]);
        setOffset(offset+limit);
        setLoading(false);
    }

    function handleMoreView() { // 더보기 버튼 처리
        if (reviewTagTotal !== 0) {
            if (reviewTagList.length === reviewTagTotal) {
                return;
            }
        }
        getReviewTagList();
    }

    useEffect(()=>{ // 요청 id가 바뀔때마다 리뷰 정보를 다시 가져옴
        if (reviewTagTotal !== null) {
            getReviewTagList();
        }
    }, [reviewTagTotal]);

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