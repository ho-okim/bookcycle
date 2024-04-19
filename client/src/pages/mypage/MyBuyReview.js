import Container from 'react-bootstrap/Container';
import '../../styles/mypage.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LeftNav from '../../components/mypage/LeftNav';
import RevList from '../../components/mypage/RevList';

function MyBuyReview() {
  return(
    <>
    <Container>
      <div className="inner">
        <div className="row">
          <LeftNav/>
          
          <div className="col col-10 content">
            <p>총 _개의 구매후기</p>
            <RevList/>
            <span>1 2 3 4 5 &gt;</span>
          </div>
        </div>
      </div>
    </Container>
    </>
  )
}

export default MyBuyReview;