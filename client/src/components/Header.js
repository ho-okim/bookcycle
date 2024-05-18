import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/LoginUserContext.js';
import { BellFill, ChatDotsFill, Search } from 'react-bootstrap-icons';
import Notification from './Notification.js';

function Header() {

  const { user, handleLogout } = useAuth(); // 로그인 한 사용자
  let search = ''; // 검색어

  const [showToast, setShowToast] = useState(false); // 알림창 표시 여부
  const toggleToast = () => setShowToast(!showToast); // 알림창 온오프

  const navigate = useNavigate();

  const navigateToChat = () => { // 채팅방 이동
    navigate('/chat');
  }

  async function handleLogoutClick() { // 로그아웃 처리
    const res = await handleLogout();
    navigate(0);
  }

  function handleKeyword(e) { // 검색어 설정
    search = e.target.value;
  }

  function handleSubmit() { // 검색 페이지 이동
    if (!search) {
      return;
    }
    navigate(`/search?keyword=${search}`);
  }

  function handleEnter(e) { // 검색하고 엔터 눌러도 검색되도록 설정
    if (e.keyCode == 13) {
      e.preventDefault();
      handleSubmit();
    }
  }

  // 현재 페이지가 chat 이라면 채팅 바로가기 버튼 안 보이도록 설정하기 위함
  const location = useLocation();

  return (
    <>
      {
        !user ? null : 
          <div className='notify_btn_wrap'>
            <Notification showToast={showToast} toggleToast={toggleToast}/>
            <button className='notification_btn' onClick={toggleToast}>
              <BellFill className='notification'/>
            </button>
          </div>
      }
      {
        location.pathname == '/chat' ? null :
        <div className="chatBtnWrap">
          <button className="chatBtn" onClick={navigateToChat}>
            <ChatDotsFill className="ChatDotsFill"/>
          </button>
        </div>
      }
      <Navbar className="bg-body-tertiary mb-3" expand={'md'}>
        <Container className='p-0'>
          <div className='inner d-flex' style={{ width: "100%" }}>
            <Navbar.Brand href="/" style={{ fontSize: "25px" }}>
              <img src={process.env.PUBLIC_URL + '/img/bookcycle-logo.png'} style={{ width:'250px' }} alt='logo'/>
            </Navbar.Brand>
            <div className='d-flex justify-content-end toggleBtnWrap' style={{ width: "100%" }}>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} className='toggleBtn'/>
            </div>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-md`}
              aria-labelledby={`offcanvasNavbarLabel-expand-md`}
              placement="end"
              className="d-flex justify-content-center"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                  <Link to={'/'}>BookCycle</Link>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  {
                    !user ? 
                    <>
                      <Nav.Link href="/login">로그인</Nav.Link>
                      <Nav.Link href="/join">회원가입</Nav.Link>
                    </>
                    : 
                    <>
                      <Nav.Link onClick={handleLogoutClick}>로그아웃</Nav.Link>
                      <Nav.Link href={'/mypage/buyList'}>마이페이지</Nav.Link>
                    </>
                  }
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="전체 검색"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e)=>{handleKeyword(e)}}
                    onKeyDown={(e)=>{handleEnter(e)}}
                    maxLength={50}
                  />
                  <Button 
                  variant="outline-success" 
                  onClick={handleSubmit}>
                    <Search/>
                  </Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;