import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import { getUserReviewTag, getUserReviewTagTotal } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';
import { useHref, useParams } from 'react-router-dom';

function UserReviewTag() {

    const { id } = useParams();

    const {targetUserId} = useTargetUser(); // 대상 id
    const [reviewTagTotal, setReveiwTagTotal] = useState(null);
    const [reviewTagList, setReviewTagList] = useState([]); // 리뷰태그 목록
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    let limit = 4;

    async function getTotal() { // 리뷰 총 개수 가져오기
        const res = await getUserReviewTagTotal(targetUserId);
        setReveiwTagTotal(res.total);
    }

    async function getReviewTagList() { // 리뷰 목록 가져오기
        
        const res = await getUserReviewTag(targetUserId, limit, offset);
        if (res === 'error') {
            console.log('에러가 생겼어요')
            setReviewTagList([]);
            return;
        }

        setReviewTagList((reviewTagList) => ([...reviewTagList, ...res]));

        // if (reviewTagTotal !== 0) {
        //     if (res.length === reviewTagTotal && res.seller_id === targetUserId) {
        //         console.log(res, res.length)
        //         console.log('더 가져올 게 없어요')
        //         setLoading(false);
        //         return;
        //     }
        // }

        setOffset(offset+limit);
        setLoading(false);
    }

    useEffect(()=>{ // 대상 id 바뀔 때마다 총 개수 다시 가져오기
        // 에러 수정중----------------------------------------------
        getTotal();
        getReviewTagList();
    }, [targetUserId, id]);

    function handleMoreView() { // 더보기 버튼 처리
        if (reviewTagTotal !== 0) {
            if (reviewTagList.length === reviewTagTotal) {
                return;
            }
        }
        getReviewTagList();
    }

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