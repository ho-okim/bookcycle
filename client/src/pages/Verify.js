import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/verify.module.css';
import { useEffect, useState } from 'react';
import {Outlet, useHref, useNavigate, useSearchParams} from 'react-router-dom';
import { Container } from 'react-bootstrap';

function Verify() {

    let [count, setCount] = useState(10); // 자동으로 홈 가는 카운터

    const url = useHref();
    const [searchParams, setSearchParams] = useSearchParams(); // 쿼리스트링
    const navigate = useNavigate();

    useEffect(()=>{
        if (parseInt(searchParams.get('v')) !== 1) { // 인증 메일이 아닌 일반 라우트 접근 차단
            //navigate('/error/401');
        }

        const timer = setInterval(()=>{ // 카운트다운(1초 간격)
            setCount(count => count - 1);
            if (count < 0) {
                clearInterval();
                setCount(10);
            }
        }, 1000);

        return () => clearInterval(timer); // 타이머 클리어
    }, []);

    useEffect(()=>{
        // if (count === 0) { // 인증 완료 주소가 아니라면 홈으로 돌아가기
        //     url.includes("confirmed") ? 
        //     navigate("/login")
        //     : navigate("/")
        // }
    }, [count, navigate, url]);

    return(
        <Container>
            <div className='inner'>
                <div className={styles.box}>
                    <Outlet context={count}/>
                </div>
            </div>
        </Container>
    )
}

export default Verify;