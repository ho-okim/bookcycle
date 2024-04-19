import { Navigate, useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Board() {

  const navigate = useNavigate();

  function onSelected(){};

  return (
    <>
      <Container className="board">
        <div className="inner board-list">
          <div className="col board-header d-flex justify-content-between align-items-center">
            <h3 className="title m-0">게시판</h3>
            <Button onClick={()=>{navigate('/boardwrite')}}>글쓰기</Button>
          </div>
          <div className='col list-header d-flex justify-content-between'>
            <p>총 건수</p>
            <div className='order'>          
              {<select id="sort" className=" outline-none" onChange={onSelected}>
                <option value="createdAt">최신순</option>
                <option value="likeOrder">좋아요 순</option>
              </select>}
            </div>
          </div>
          <div className='col list'>
            <div className='list-title'>마켓컬리 후기</div>
            <div className='list-content regular'>마켓컬리하니 배고프네여</div>
            <div className='list-info regular'>
              <span className='userid'>아이디</span>
              <span className='date'>날짜</span>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Board;
