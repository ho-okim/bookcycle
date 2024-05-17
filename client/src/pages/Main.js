import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import '../styles/main.css'
import BookList from "../components/main/BookList";
import BoardList from "../components/main/BoardList";
import { useNavigate } from "react-router-dom";

function Main(){
  const navigate = useNavigate()

  const navigateToBoard = () => {
    navigate('/board')
  }

  const navigateToProduct = () => {
    navigate('/productList')
  }
  
  return(
    <>
      <Container className="productSec sec">
        <div className="inner">
          <div className="productTop d-flex justify-content-between">
            <div className="d-flex align-center">
              <h3 className="newBookTitle">신규도서</h3>
            </div>
            <Button variant="outline-secondary" onClick={navigateToProduct}>상품 더보기</Button>
          </div>
          <div className="newBooks">
            <BookList/>
          </div>
        </div>
      </Container>
      <Container className="boardSec sec">
        <div className="inner">
          <div className="productTop d-flex justify-content-between">
            <div className="d-flex align-center">
              <h3 className="newBookTitle">게시판</h3>
            </div>
            <Button variant="outline-secondary" onClick={navigateToBoard}>게시글 더보기</Button>
          </div>
          <div className="boardContent">
            <BoardList/>
          </div>
        </div>
      </Container>
    </>
  )
}

export default Main