import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import { getUserReviewTag } from '../../api/user.js';

function UserReviewTag() {

    const [reviewTagList, setReviewTagList] = useState([]);
    const targetUserId = useContext(TargetUserContext);

    useEffect(()=>{ // 요청 id가 바뀔때마다 리뷰 정보를 다시 가져옴
        async function getReviewTagList() {
            const res = await getUserReviewTag(targetUserId);
            setReviewTagList(res);
        }
        getReviewTagList();
    }, [targetUserId]);

    if (!reviewTagList || reviewTagList.length == 0) {
        return(
            <Container className={styles.section_sub_box}>
                <div className="inner">
                    <div className={`${styles.title} ${styles.review_title_box}`}>
                        <h4>이런 점이 좋았어요</h4>
                    </div>
                    <div className={`${styles.box} d-flex justify-content-center`}>
                        <p>아직 사용자를 평가한 내용이 없어요!</p>
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
                                <Button variant='outline-primary' className={styles.arrow_more_btn}
                                >▼</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Container>
    )
}


function ReviewTag({reviewTag}) {
    return(
        <tr>
            <td className={styles.liked}>
                <p className={styles.box}>{reviewTag.size}</p>
            </td>
            <td className={styles.tag}>
                <p className={styles.box}>{reviewTag.tag_name}</p>
            </td>
        </tr>
    )
}

export default UserReviewTag;