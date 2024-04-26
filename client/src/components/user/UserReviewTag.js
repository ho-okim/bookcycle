import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import { getUserReviewTag } from '../../api/user.js';
import LoadingSpinner from '../LoadingSpinner.js';

function UserReviewTag() {

    const targetUserId = useContext(TargetUserContext); // 대상 id
    const [reviewTagList, setReviewTagList] = useState([]); // 리뷰태그 목록
    const [tagListLength, setTagListLength] = useState(0);
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] = useState(0); // 데이터 가져오는 시작점
    let limit = 5;

    useEffect(()=>{ // 요청 id가 바뀔때마다 리뷰 정보를 다시 가져옴
        setLoading(true);
        async function getReviewTagList() {
            const res = await getUserReviewTag(targetUserId, limit, offset);
            
            let newData = [...reviewTagList, ...res];
            if (newData.length !== tagListLength) { // 길이가 다를때만 추가 데이터 합치기
                setReviewTagList(newData);
                setTagListLength(newData.length);
            }
            setLoading(false);
        }
        getReviewTagList();
    }, [offset]);

    async function handleMoreView() { // 더보기 버튼 처리
        if ((offset+limit) < tagListLength) {
            setOffset(offset+limit);
        } else {
            setOffset(tagListLength);
        }
    }

    if (loading) {
        return(
            <Container className={styles.section_sub_box}>
                <div className="inner">
                    <div className={`${styles.title} ${styles.review_title_box}`}>
                        <h4>이런 점이 좋았어요</h4>
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
                <div className={`${styles.title} ${styles.review_title_box}`}>
                    <h4>이런 점이 좋았어요</h4>
                </div>
                {
                    reviewTagList.length == 0 ?
                    <div className={`${styles.box} d-flex justify-content-center`}>
                        <p>아직 등록된 평가가 없어요!</p>
                    </div>
                    : <ReviewTable 
                        reviewTagList={reviewTagList}
                        handleMoreView={handleMoreView}
                        tagListLength={tagListLength}
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
    tagListLength, 
    limit
    }) 
    {
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
                            tagListLength < limit ?
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