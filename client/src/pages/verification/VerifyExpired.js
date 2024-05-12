import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container.js';

function VerifyExpired() {

    return(
        <Container>
            <h2>인증 메일 만료 안내</h2>
            <p>현재 접근 요청한 인증 메일은 기간이 만료된 이메일입니다.</p>
            <p>북사이클 사이트에서 다시 요청을 진행해주시기 바랍니다.</p>
            <p><strong><a href="http://localhost:3000/">북사이클</a></strong> 바로가기</p>
            <p>북사이클에 관한 문의사항은 북사이클 고객지원 센터를 이용해주시기 바랍니다.</p>
    </Container>
    )
}

export default VerifyExpired;