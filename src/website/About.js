import React from 'react'
import { Link } from 'react-router-dom'

function About() {
    return (
        <>
            {/* <!-- Hero Start --> */}
            <div className="container-fluid bg-primary py-5 bg-hero mb-3" id='bg-hero'>
                <div className="container py-3">
                    <div className="row justify-content-start">
                        <div className="col-lg-8 text-center text-lg-start">
                            <h1 className="display-1 text-white mb-md-4">About Us</h1>
                            <Link to="/" className="btn btn-primary py-md-2 px-md-5 me-3">Home</Link>
                            <Link to="/about-us" className="btn btn-secondary py-md-2 px-md-3">About Us</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hero End --> */}


            {/* <!-- About Start --> */}
            <div className="container-fluid about pt-5">
                <div className="container">
                    <div className="row gx-5">
                        <div className="col-lg-4 mb-5 mb-lg-0">
                            <div className="d-flex h-100 border border-5 border-primary border-bottom-0">
                                <img className="img-fluid" src="./assets/img/3898154.jpg" alt='' />
                            </div>
                        </div>
                        <div className="col-lg-8 pb-5">
                            <div className="mb-2 pb-2">
                                <h6 className="text-primary text-uppercase">About Us</h6>
                                {/* <h4 className="mb-0">We Produce Organic Food For Your Family</h4> */}
                            </div>
                            <p className="mb-1"><b>1.</b> Shivneri Business is a state-of-the-art agri technology company, we help millions of farmers across the country to live a happy life, and strive to grow new farming technologies, increase productivity, and grow safe and sustainable food.</p>
                            <p className="mb-1"><b>2.</b> We know the problems of farmers and are ready to bring changes in them.</p>
                            <p className="mb-1"><b>3.</b> We encourage everyone's opinions, yet remain single-mindedly committed to accomplishing our goals</p>
                            <p className="mb-1"><b>4.</b> We know hardwork and hard work, we never take shortcuts in running our business and we are ready to make tough and tough changes at times.</p>
                            <p className="mb-1"><b>5.</b> We always think positively, and solve problems with a smile on our face by keeping positivity around us.</p>
                            <p className="mb-1"><b>6.</b> We have highly educated and experienced staff available who are always ready to solve your problem </p>
                            <p className="mb-1"><b>7.</b> We represent Krushimatr and our resources are of high quality so that the customer is always satisfied.</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- About End --> */}
        </>
    )
}

export default About