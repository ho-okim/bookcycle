import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/verify.module.css';
import { useEffect, useState } from 'react';
import {Outlet, useHref, useNavigate} from 'react-router-dom';
import { Container } from 'react-bootstrap';

function Verify() {

    let [count, setCount] = useState(10);

    const url = useHref();

    const navigate = useNavigate();

    useEffect(()=>{
        const timer = setInterval(()=>{
            setCount(count => count - 1);
            if (count < 0) {
                clearInterval();
                setCount(10);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(()=>{
        if (count === 0) {
            url.includes("confirmed") ? 
            navigate("/login")
            : navigate("/")
        }
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