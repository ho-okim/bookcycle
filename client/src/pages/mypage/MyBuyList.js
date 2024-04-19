import Container from 'react-bootstrap/Container';

import '../../styles/mypage.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TableList from '../../components/mypage/TableList';
import LeftNav from '../../components/mypage/LeftNav';

function MyBuyList() {
  return(
    <>
    <Container>
      <div className="inner">
        <div className="row">
          <LeftNav/>
          
          <div className="col col-10 content">
            <p> &gt; 전체 구매 내역</p>
            <TableList/>
            <span>1 2 3 4 5 &gt;</span>
          </div>
        </div>
      </div>
    </Container>
    </>
  )
}

export default MyBuyList;