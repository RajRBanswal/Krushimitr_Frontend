import React from 'react'
import { Link } from 'react-router-dom';
function Navbar() {

    
    return (
        <>
            <div className="container-fluid px-5 d-none d-lg-block bg-primary ">
                <div className="row gx-5 py-lg-0 align-items-center">
                    <div className="col-lg-6">
                        <div className="d-flex align-items-center justify-content-start text-white">
                            <i className="fas fa-phone me-2" style={{fontSize:14}}></i>
                            <p className="mb-0">+91-9322192188  </p> &nbsp;&nbsp;
                            {/* <i className="fa-solid fa-envelope fs-4 text-secondary me-2"></i> */}
                            <i className="fas fa-solid fa-envelope me-2" style={{fontSize:14}}></i>
                            <p className="mb-0">shivaneribusiness@gmail.com</p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="d-flex align-items-center justify-content-end">
                            <Link className="btn btn-primary btn-square rounded-circle me-2" to="#"><i className="fab fa-twitter"></i></Link>
                            <Link className="btn btn-primary btn-square rounded-circle me-2" to="#"><i className="fab fa-facebook-f"></i></Link>
                            <Link className="btn btn-primary btn-square rounded-circle me-2" to="#"><i className="fab fa-linkedin-in"></i></Link>
                            <Link className="btn btn-primary btn-square rounded-circle" to="#"><i className="fab fa-instagram"></i></Link>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand-lg bg-white navbar-dark shadow py-3 py-lg-0 px-3 px-lg-5">
                <Link to="/" className="navbar-brand  ps-lg-5">
                    <h1 className="m-0 display-4 text-secondary"> <img src={'./assets/logo.png'} alt='logo' width={100} /></h1>
                </Link>
                <button className="navbar-toggler bg-success" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav mx-auto py-0">
                        <Link to="/" className="nav-item nav-link active">Home</Link>
                        <Link to="/about-us" className="nav-item nav-link">About</Link>
                        <Link to="/service" className="nav-item nav-link">Service</Link>
                        <Link to="/product" className="nav-item nav-link">Product</Link>
                        {/* <div className="nav-item dropdown">
                            <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</Link>
                            <div className="dropdown-menu m-0">
                                <Link to="/blog" className="dropdown-item">Blog Grid</Link> */}
                                {/* <Link to="/feature" className="dropdown-item">Features</Link>
                        <Link to="/team" className="dropdown-item">The Team</Link>
                        <Link to="/testimonial" className="dropdown-item">Testimonial</Link> */}
                            {/* </div>
                        </div> */}
                        <Link to="/contact" className="nav-item nav-link">Contact</Link>
                        <Link to="/apply-ekrushimitr" className="nav-item nav-link blink_text">Apply E-Krushimitr</Link>
                        <Link to="#" className="nav-item py-1 nav-link" ><div id="google_translate_element"></div></Link>
                        <Link to="/user_login" className="nav-item nav-link">Login</Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar