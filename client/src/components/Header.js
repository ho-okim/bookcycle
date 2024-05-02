import { useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/LoginUserContext.js';
import { logout } from '../api/login.js';

function Header() {

  const {user, setUser} = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setUser();
    navigate("/");
  }

  return (
    <>
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
                        <Nav.Link onClick={()=>{handleLogout()}}>로그아웃</Nav.Link>
                        <Nav.Link href={`/mypage/${user.id}/buyList`}>마이페이지</Nav.Link>
                      </>
                    }
                  </Nav>
                  <Form className="d-flex">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2"
                      aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
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