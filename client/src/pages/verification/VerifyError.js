import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container.js';

function VerifyError() {

    return(
        <Container>
            <h2>에러 발생</h2>

            <p>인증 과정에서 에러가 발생했습니다</p>
            <p>북사이클에서 다시 요청을 진행해주시기 바랍니다.</p>
            <p><strong ><a href="http://localhost:3000/">북사이클</a></strong> 바로 가기</p>
        </Container>
    )
}

export default VerifyError;