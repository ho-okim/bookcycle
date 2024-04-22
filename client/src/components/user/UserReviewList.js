import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import { getUserReviewList } from '../../api/user.js';

function UserReviewList() {

    const [reviewList, setReviewList] = useState([]);
    const targetUserId = useContext(TargetUserContext);

    useEffect(()=>{ // 요청 id가 바뀔때마다 리뷰 정보를 다시 가져옴
        async function getReviewList() {
            const res = await getUserReviewList(targetUserId);
            setReviewList(res);
        }
        getReviewList();
    }, [targetUserId]);

    if (!reviewList || reviewList.length == 0) {
        return (
            <Container className={styles.section_sub_box}>
                <div className='inner'>
                    <div className={`${styles.title} ${styles.review_title_box}`}>
                        <h4>구매후기</h4>
                    </div>
                    <div className={`${styles.box} d-flex justify-content-center`}>
                        <p>아직 판매한 제품에 작성된 후기가 없어요!</p>
                    </div>
                </div>
            </Container>
        )
    }

    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div className={`${styles.title} d-flex justify-content-between`}>
                    <h4>구매후기</h4>
                    <Button variant='outline-primary' className={styles.more_btn}
                    >더보기</Button>
                </div>
                <div className={styles.box}>
                    {
                        reviewList.map((el, i)=>{
                            return(
                                <Review key={i} review={el}/>
                            )
                        })
                    }
                </div>
            </div>
        </Container>
    )
}

function Review({review}) {
    return(
        <div className={
            `${styles.review_box} d-flex justify-content-around align-items-center`
        }>
            <p className={`${styles.score} ${styles.box}`}>{review.score}</p>
            <div className={`${styles.review} d-flex flex-column`}>
                <p className={`${styles.book_title} ${styles.box}`}>{review.product_name}</p>
                <p className={`${styles.review_content} ${styles.box}`}>{review.content}</p>
            </div>
            <p className={`${styles.writer} ${styles.box}`}>{review.buyer_name}</p>
            <p className={`${styles.date} ${styles.box}`}>{new Date(review.createdAt).toLocaleDateString("ko-kr")}</p>
        </div>
    )
}

export default UserReviewList;