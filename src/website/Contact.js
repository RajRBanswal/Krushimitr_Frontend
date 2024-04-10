import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const storeContact = async (event) => {
        event.preventDefault();
        const customer_data = { name, email, mobile, subject, message };
        const contact_data = await fetch("/contact", {
            method: 'POST',
            body: JSON.stringify({ customer_data }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => resp.json())
        if (contact_data.status === 201) {
            alert(contact_data.result)
        } else {
            alert(contact_data.result)
        }


    }

    return (
        <>
            {/* <!-- Hero Start --> */}
            <div className="container-fluid bg-primary py-5 bg-hero mb-3" id='bg-hero'>
                <div className="container py-3">
                    <div className="row justify-content-start">
                        <div className="col-lg-8 text-center text-lg-start">
                            <h1 className="display-1 text-white mb-md-4">Contact Us</h1>
                            <Link to="/" className="btn btn-primary py-md-2 px-md-5 me-3">Home</Link>
                            <Link to="/contact" className="btn btn-secondary py-md-2 px-md-5">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hero End --> */}


            {/* <!-- Contact Start --> */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="mx-auto text-center mb-5" style={{ maxWidth: '500px' }}>
                        <h6 className="text-primary text-uppercase">Contact Us</h6>
                        <h1 className="display-5">Please Feel Free To Contact Us</h1>
                    </div>
                    <div className="row g-0">
                        <div className="col-lg-7">
                            <div className="bg-primary h-100 p-lg-5 py-5 px-3">
                                <div className="row g-3">
                                    <div className="col-lg-6 col-12">
                                        <input type="text" onChange={(e) => setName(e.target.value)} className="form-control bg-light border-0 px-4" placeholder="Your Name" style={{ height: '45px' }} />
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control bg-light border-0 px-4" placeholder="Your Email" style={{ height: '45px' }} />
                                    </div>
                                    <div className="col-lg-12 col-12">
                                        <input type="number" onChange={(e) => setMobile(e.target.value)} className="form-control bg-light border-0 px-4" placeholder="Mobile" style={{ height: '45px' }} />
                                    </div>
                                    <div className="col-lg-12 col-12">
                                        <input type="text" onChange={(e) => setSubject(e.target.value)} className="form-control bg-light border-0 px-4" placeholder="Subject" style={{ height: '45px' }} />
                                    </div>
                                    <div className="col-12">
                                        <textarea onChange={(e) => setMessage(e.target.value)} className="form-control bg-light border-0 px-4 py-3" rows="2" placeholder="Message"></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-secondary w-100 py-3" onClick={storeContact} >Send Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="bg-secondary h-100 p-5">
                                <h2 className="text-white mb-4">Get In Touch</h2>
                                <div className="d-flex mb-4">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-geo-alt fs-4 text-white"></i>
                                    </div>
                                    <div className="ps-3">
                                        <h5 className="text-white">Our Office</h5>
                                        <span className="text-white">
                                            H No--353, Hingoli Kalamnuri Road Hanuman Nagar Lasina, Lasina, Hingoli, Maharashtra 431702.
                                            {/* <b>SHIVANERI BUSINESS PRIVATE LIMITED</b> <br />H N 889 L N 2 HANUMAN NGR LASINA KHANAPUR CHITTA  HINGOLI MH 431513 IN */}
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex mb-4">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-envelope-open fs-4 text-white"></i>
                                    </div>
                                    <div className="ps-3">
                                        <h5 className="text-white">Email Us</h5>
                                        <span className="text-white">shivaneribusiness@gmail.com</span>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-phone-vibrate fs-4 text-white"></i>
                                    </div>
                                    <div className="ps-3">
                                        <h5 className="text-white">Call Us</h5>
                                        <span className="text-white">+91-9322192188</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Contact End --> */}

        </>
    )
}

export default Contact