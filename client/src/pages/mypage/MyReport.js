import styles from "../../styles/mypage.module.css";
import Container from "react-bootstrap/Container";
import LeftNav from "../../components/mypage/LeftNav";
import ReportList from "../../components/mypage/ReportList";

function MyReport() {

    return(
        <>
            <Container>
            <div className={styles.inner}>
                <LeftNav />
                <div className={styles.content}>
                <p> &gt; 전체 신고 내역</p>
                <ReportList/>
                <span>1 2 3 4 5 &gt;</span>
                </div>
            </div>
            </Container>
        </>
    )
}

export default MyReport;