import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <>
            <div className="container-fluid bg-footer bg-primary text-white pt-3">
                <div className="container">
                    <div className="row gx-5">
                        <div className="col-lg-4 col-md-12 pt-5 mb-5">
                            <h4 className="text-white mb-4">Get In Touch</h4>
                            <div className="d-flex mb-2">
                                <i className="bi bi-geo-alt text-white me-2"></i>
                                <p className="text-white mb-0" style={{textTransform:'capitalize'}}>SHIVANERI BUSINESS PRIVATE LIMITED <br />H N 889 L N 2 HANUMAN NGR LASINA KHANAPUR CHITTA  HINGOLI MH 431513 IN</p>
                            </div>
                            <div className="d-flex mb-2">
                                <i className="bi bi-envelope-open text-white me-2"></i>
                                <p className="text-white mb-0">shivaneribusiness@gmail.com</p>
                            </div>
                            <div className="d-flex mb-2">
                                <i className="bi bi-telephone text-white me-2"></i>
                                <p className="text-white mb-0">+91-9322192188</p>
                            </div>
                           
                        </div>
                        <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                            <h4 className="text-white mb-4">Quick Links</h4>
                            <div className="d-flex flex-column justify-content-start">
                                <Link className="text-white mb-2" to="/"><i className="bi bi-arrow-right text-white me-2"></i>Home</Link>
                                <Link className="text-white mb-2" to="/about-us"><i className="bi bi-arrow-right text-white me-2"></i>About Us</Link>
                                <Link className="text-white mb-2" to="#"><i className="bi bi-arrow-right text-white me-2"></i>Our Services</Link>
                                <Link className="text-white mb-2" to="/terms-and-condition"><i className="bi bi-arrow-right text-white me-2"></i>Terms and Conditions</Link>
                                <Link className="text-white mb-2" to="/privacy-policy"><i className="bi bi-arrow-right text-white me-2"></i>Privacy Policy</Link>
                                <Link className="text-white" to="/contact"><i className="bi bi-arrow-right text-white me-2"></i>Contact Us</Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                            <h4 className="text-white mb-4">Social Media Links</h4>
                            <div className="d-flex mt-4">
                                <Link className="btn btn-secondary btn-square rounded-circle me-2" to="#"><i className="fab fa-twitter"></i></Link>
                                <Link className="btn btn-secondary btn-square rounded-circle me-2" to="#"><i className="fab fa-facebook-f"></i></Link>
                                <Link className="btn btn-secondary btn-square rounded-circle me-2" to="#"><i className="fab fa-linkedin-in"></i></Link>
                                <Link className="btn btn-secondary btn-square rounded-circle" to="#"><i className="fab fa-instagram"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid bg-dark text-white py-3">
                <div className="container text-center">
                    <p className="mb-0" style={{fontSize:'16px'}}>&copy; Copyright<Link className="text-secondary fw-bold" to="#"> Krushimitr</Link>. All Rights Reserved 2023. Designed by <Link className="text-secondary fw-bold" target='_blank' to="https://ewebdigital.com">E Web Digital</Link></p>
                </div>
            </div>

            <Link to="#" className="btn btn-secondary py-3 fs-4 back-to-top"><i className="bi bi-arrow-up"></i></Link>
        </>
    )
}

export default Footer