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
                    <ReportList/>
                </div>
            </Container>
        </>
    )
}

export default MyReport;