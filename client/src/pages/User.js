import styles from '../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';
import Report from '../components/Report.js';

function User() {

    const [user, setUser] = useState();
    const [targetUser, setTargetUser] = useState();
    const [review, setReview] = useState();

    const [modalShow, setModalShow] = useState(false);

    const handleClose = () => {setModalShow(false)};
    const handleOpen = () => {setModalShow(true)};


    return(
        <>
            <Container className='d-flex justify-content-center'>
                <section className={styles.user_menu}>
                    <Container className={styles.section_sub_box}>
                        <div className='inner'>
                            <div className={styles.box}>
                                <p>&lt;사용자이름&gt;님</p>
                                <ul>
                                    <li><Link to="#">판매도서</Link></li>
                                    <li><Link to="#">구매후기</Link></li>
                                </ul>
                            </div>
                            <Button className={styles.report_btn} 
                            variant='outline-danger' onClick={handleOpen}
                            >🚨신고하기</Button>
                        </div>
                    </Container>
                </section>

                <section className={styles.other_user}>
                    <Container className={styles.section_sub_box}>
                        <div className='inner'>
                            <Report show={modalShow} handleClose={handleClose}/>
                            <div className={
                                `${styles.user_box} ${styles.box} d-flex justify-content-around align-items-center`
                            }>
                                <div className={styles.image_box}>
                                    <img className={styles.profile_image} src='' alt='프로필'/>
                                </div>
                                <div className={
                                    `${styles.info_box} row justify-content-between align-items-center flex-wrap`
                                }>
                                    <p className={`${styles.user_info} col-5`}>☆☆☆☆☆</p>
                                    <p className={`${styles.user_info} col-5`}>상세보기</p>
                                    <p className={`${styles.user_info} col-5`}>닉네임</p>
                                    <p className={`${styles.user_info} col-5`}>
                                        <Link to="#">채팅하기</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Container>

                    <Container className={styles.section_sub_box}>
                        <div className="inner">
                            <div className={`${styles.title} ${styles.review_title_box}`}>
                                <h4>이런 점이 좋았어요</h4>
                            </div>
                            {/* api 조회 결과로 map 사용 예정? */}
                            <div>
                                <ReviewTag/>
                                <div className='d-flex justify-content-between text-center'>
                                    <div className={styles.liked}></div>
                                    <div className={styles.tag}>
                                        <button className={
                                            `${styles.more_btn} btn btn-outline-primary`
                                        }>▼</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>

                    <Container className={styles.section_sub_box}>
                        <div className='inner'>
                            <div className={`${styles.title} d-flex justify-content-between`}>
                                <h4>구매후기</h4>
                                <button className={
                                    `${styles.more_btn} btn btn-outline-primary`
                                }>더보기</button>
                            </div>
                            {/* api 조회 결과로 map 사용 예정? */}
                            <div className={styles.box}>
                                <Review/>
                            </div>
                        </div>
                    </Container>

                    <Container className={styles.section_sub_box}>
                        <div className='inner'>
                            <div>
                                <div className={`${styles.title} d-flex justify-content-between`}>
                                    <h4>판매목록</h4>
                                    <button className={
                                        `${styles.more_btn} btn btn-outline-primary`
                                    }>더보기</button>
                                </div>
                                {/* api 조회 결과로 map 사용 예정? */}
                                <div className={
                                    `${styles.sold} ${styles.box} d-flex justify-content-start`
                                }>
                                    <SoldBook/>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
            </Container>
        </>
    )
}


function ReviewTag() {
    return(

        <div className='d-flex justify-content-start text-center'>
            <p className={`${styles.liked} ${styles.box}`}>인원수</p>
            <p className={`${styles.tag} ${styles.box}`}>리뷰</p>
        </div>

    )
}

function Review() {
    return(
        <div className={
            `${styles.review_box} d-flex justify-content-around align-items-center`
        }>
            <p className={`${styles.score} ${styles.box}`}>☆☆☆☆☆</p>
            <div className={`${styles.review} d-flex flex-column`}>
                <p className={`${styles.book_title} ${styles.box}`}>책 제목</p>
                <p className={`${styles.review_content} ${styles.box}`}>리뷰내용</p>
            </div>
            <p className={`${styles.writer} ${styles.box}`}>작성자</p>
            <p className={`${styles.date} ${styles.box}`}>작성날짜</p>
        </div>
    )
}

function SoldBook() {
    return(
        <div className={`${styles.book_card} d-flex flex-column`}>
            <div className={`${styles.book_image_box} ${styles.box}`}>
                <img className={styles.book_image} src='' alt='책사진'/>
            </div>
            <div className={styles.book_info}>
                <p className={`${styles.book_title} ${styles.box}`}>책 제목</p>
                <p className={`${styles.price} ${styles.box}`}>가격</p>
            </div>
        </div>
    )
}

export default User;