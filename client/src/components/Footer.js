import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"
import { Link } from 'react-router-dom';
import { Github, Youtube } from 'react-bootstrap-icons';
import { Container } from 'react-bootstrap';

const Footer = () => <footer className="page-footer font-small blue pt-4 footerTextSize">
    <div className="">
      <Container className='p-0'>
        <div className='inner row footer'>
          <div className="col-6 col-lg-4 p-0 footerImgWrap">
            <img src={process.env.PUBLIC_URL + '/img/footer-logo.png'} className='footerLogoImg' alt='logo'/>
          </div>
          <div className='col-6 col-lg-4 medium footerTextSize p-0'>
            <div className='footerBorder footerWrap'>
              <p className='bold footerTitle'>북사이클</p>
              <p>이메일: resellboook@gmail.com</p>
              <p>주소: 인천 부평구 시장로 7 부평MH타워 5층</p>
              <div className='d-flex'>
                <Link><div className='footerYoutube d-flex justify-content-center align-items-center'><Youtube/></div></Link>
                <Link to="https://github.com/ho-okim/bookcycle"><div className='footerYoutube d-flex justify-content-center align-items-center'><Github/></div></Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 footerConWrap p-0">
            <div className='d-flex flex-column footerWrap'>
              <div>
                <p className="text-uppercase bold footerTitle">Contributors</p>
                <div className='d-flex'>
                  <div className='footercontributors'>
                    <div className="medium d-flex align-items-center">
                      <Link to="https://github.com/ho-okim">
                        <div className='d-flex align-items-center footerTextSize'>
                          <Github className='footerGithubIcon'/><span>ho-okim</span>
                        </div>
                      </Link>
                    </div>
                    <div className="medium d-flex align-items-center">
                      <Link to="https://github.com/nahyun1012">
                        <div className='d-flex align-items-center footerTextSize'>
                          <Github className='footerGithubIcon'/><span>nahyun1012</span>
                        </div>
                      </Link>
                    </div>
                    <div className="medium d-flex align-items-center">
                      <Link to="https://github.com/Sonamuhan">
                        <div className='d-flex align-items-center footerTextSize'>
                          <Github className='footerGithubIcon'/><span>Sonamuhan</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className='footercontributors'>
                    <div className="medium d-flex align-items-center">
                      <Link to="https://github.com/Kimyejin22">
                        <div className='d-flex align-items-center footerTextSize'>
                          <Github className='footerGithubIcon'/><span>Kimyejin22</span>
                        </div>
                      </Link>
                    </div>
                    <div className="medium d-flex align-items-center">
                      <Link to="https://github.com/ase10git">
                        <div className='d-flex align-items-center footerTextSize'>
                          <Github className='footerGithubIcon'/><span>ase10git</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>

    <div className="footer-copyright medium text-center py-3">
      <p className='footerTextSize'>© 2024 Copyright: Bookcycle All rights reserved.</p>
    </div>

</footer>

export default Footer