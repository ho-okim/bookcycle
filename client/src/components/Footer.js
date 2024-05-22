import React from "react"
import { Link } from 'react-router-dom';
import { Github } from 'react-bootstrap-icons';

const Footer = () => <footer className="page-footer font-small blue pt-4">
    <div className="container-fluid text-center text-md-left" style={{maxWidth:'1100px'}}>
        <div className="row justify-content-between">
            <div className="col-md-6 mt-md-0 mt-3">
                <h5 className="text-uppercase"><img src={process.env.PUBLIC_URL + '/img/bookcycle-logo.png'} style={{ width:'150px' }} alt='logo'/></h5>
            </div>
            <div className="col-md-3 mb-md-0 mb-3">
                <h5 className="text-uppercase">Contributors</h5>
                <ul className="list-unstyled">
                    <li><Link to="https://github.com/ho-okim"><Github/> ho-okim</Link></li>
                    <li><Link to="https://github.com/nahyun1012"><Github/> nahyun1012</Link></li>
                    <li><Link to="https://github.com/Sonamuhan"><Github/> Sonamuhan</Link></li>
                    <li><Link to="https://github.com/Kimyejin22"><Github/> Kimyejin22</Link></li>
                    <li><Link to="https://github.com/ase10git"><Github/> ase10git</Link></li>
                </ul>
            </div>
        </div>
    </div>

    <div className="footer-copyright text-center py-3">© 2024 Copyright: <Link to="https://github.com/ho-okim/bookcycle"><Github/> Bookcycle Github</Link>
        {/*<a href="https://mdbootstrap.com/"> MDBootstrap.com</a>*/}
    </div>

</footer>

export default Footer