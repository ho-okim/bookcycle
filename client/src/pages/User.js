import '../styles/user.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function User() {

    const [user, setUser] = useState();
    const [targetUser, setTargetUser] = useState();
    const [review, setReview] = useState();

    return(
        <>
            <div className='d-flex justify-content-center'>
                <section className='user-menu'>
                    <Container>
                        <div className='inner'>
                            <div className='menu-box'>
                                <div className='box'>
                                    <p className='username'>&lt;사용자이름&gt;님</p>
                                    <ul className='nav-bar'>
                                        <li><Link to="#">판매도서</Link></li>
                                        <li><Link to="#">구매후기</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                <section className='other-user'>
                    <Container>
                        <div className='inner'>
                            <div className='user-box box d-flex justify-content-around align-items-center'>
                                <div className='image-box'>
                                    <img className='profile-image' src='' alt='프로필'/>
                                </div>
                                <div className='info-box row justify-content-between align-items-center flex-wrap'>
                                    <p className='user-info col-5'>☆☆☆☆☆</p>
                                    <p className='user-info col-5'>상세보기</p>
                                    <p className='user-info col-5'>닉네임</p>
                                    <p className='user-info col-5'><Link to="#">채팅하기</Link></p>
                                </div>
                            </div>
                        </div>
                    </Container>

                    <Container>
                        <div className="inner">
                            <div className='title'>
                                <h4 className='box'>이런 점이 좋았어요</h4>
                            </div>
                            {/* api 조회 결과로 map 사용 예정? */}
                            <div>
                                <ReviewTag/>
                                <div className='d-flex justify-content-between text-center'>
                                    <div className='liked'></div>
                                    <div className='tag'>
                                        <button className='more-btn btn btn-outline-primary'>▼</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>

                    <Container>
                        <div className='inner'>
                            <div className='title d-flex justify-content-between'>
                                <h4 className='box'>구매후기</h4>
                                <button className='more-btn btn btn-outline-primary'>더보기</button>
                            </div>
                            {/* api 조회 결과로 map 사용 예정? */}
                            <div className='box'>
                                <Review/>
                            </div>
                        </div>
                    </Container>

                    <Container>
                        <div className='inner'>
                            <div>
                                <div className='title d-flex justify-content-between'>
                                    <h4 className='box'>판매목록</h4>
                                    <button className='more-btn btn btn-outline-primary'>더보기</button>
                                </div>
                                {/* api 조회 결과로 map 사용 예정? */}
                                <div className='sold box d-flex justify-content-start'>
                                    <SoldBook/>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
        </>
    )
}


function ReviewTag() {
    return(

        <div className='d-flex justify-content-start text-center'>
            <p className='liked box'>인원수</p>
            <p className='tag box'>리뷰</p>
        </div>

    )
}

function Review() {
    return(
        <div className='review-box d-flex justify-content-around align-items-center'>
            <p className='score box'>☆☆☆☆☆</p>
            <div className='review d-flex flex-column'>
                <p className='book-title box'>책 제목</p>
                <p className='review-content box'>리뷰내용</p>
            </div>
            <p className='writer box'>작성자</p>
            <p className='date box'>작성날짜</p>
        </div>
    )
}

function SoldBook() {
    return(
        <div className='book-card d-flex flex-column'>
            <div className='book-image-box box'>
                <img className='book-image' src='' alt='책사진'/>
            </div>
            <div className='book-info'>
                <p className='book-title box'>책 제목</p>
                <p className='price box'>가격</p>
            </div>
        </div>
    )
}

export default User;