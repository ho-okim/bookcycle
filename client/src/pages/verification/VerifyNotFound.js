import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container.js';

function VerifyNotFound() {
    return(
        <Container>
            <p>현재 접근 요청한 인증 메일은 이미 인증을 완료했거나 존재하지 않는 인증입니다.</p>
            <p>북사이클 사이트에서 다시 요청을 진행해주시기 바랍니다.</p>
            <p><strong><a href="http://localhost:3000/">북사이클</a></strong> 바로가기</p>
        </Container>
    )
}

export default VerifyNotFound;