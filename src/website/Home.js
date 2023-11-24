import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import { Link, useNavigate } from 'react-router-dom';
import '../../node_modules/owl.carousel/dist/assets/owl.carousel.min.css';
import '../../node_modules/owl.carousel/dist/owl.carousel.min';
import './../styles.css';

function Home() {
    const navigate = useNavigate();
    const options = {
        margin: 30,
        responsiveClass: true,
        nav: true,
        dots: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 1,
            },
            600: {
                items: 2,
            },
            700: {
                items: 3,
            },
            1000: {
                items: 5,

            }
        },
    };
    const optionspartner = {
        margin: 30,
        responsiveClass: true,
        nav: true,
        dots: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 1,
            },
            600: {
                items: 2,
            },
            700: {
                items: 3,
            },
            1000: {
                items: 4,

            }
        },
    };
    const [product, setProducts] = useState([]);

    const getProductData = async (e) => {
        let result = await fetch("https://krushimitr.in/admin/all-products").then(result => result.json());
        // const getProd = await all_products.json();
        if (result.status === 201) {
            setProducts(result.product_data);
        } else {
            setProducts(result.result);
        }
    };
    const [cate, setCate] = useState([]);
    const getCategoryData = async (e) => {
        let result = await fetch("https://krushimitr.in/admin/all-category").then(result => result.json());
        // const getCat = await all_category.json();
        setCate(result.getCate);
    };
    const [news, setNews] = useState([]);
    const getNEWSData = async (e) => {
        let result = await fetch("https://krushimitr.in/admin/get-news").then(result => result.json());
        // const getCat = await all_category.json();
        setNews(result.getNEWS);
    };
    const [slider, setSlider] = useState([]);
    const getSliderData = async () => {
        let result = await fetch("https://krushimitr.in/admin/all-slider").then(result => result.json());
        // const getSlider = await all_slider.json();
        // console.log(result);
        setSlider(result.getSlider);
    };
    useEffect(() => {
        getSliderData();
        getProductData();
        getCategoryData();
        getNEWSData();
    }, [])

    return (
        <>

            <div className="container-fluid p-0">
                <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {
                            slider.map((slide, key) => {
                                if (key === 0) {
                                    return (<div className="carousel-item active">

                                        <img className="w-100" src={`https://krushimitr.in/upload/${slide.slider_image}`} alt="Image1" />
                                        <div className="carousel-caption top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center" >
                                            <div className="text-start p-5" style={{ maxWidth: '900px' }}>
                                                <h3 className="text-white">{slide.sub_heading}</h3>
                                                <h1 className="display-1 text-white mb-md-4">{slide.heading}</h1>
                                            </div>
                                        </div>
                                    </div>)

                                } else {
                                    return (<div className="carousel-item">

                                        <img className="w-100" src={`https://krushimitr.in/upload/${slide.slider_image}`} alt="Image1" />
                                        <div className="carousel-caption top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center" >
                                            <div className="text-start p-5" style={{ maxWidth: '900px' }}>
                                                <h3 className="text-white">{slide.sub_heading}</h3>
                                                <h1 className="display-1 text-white mb-md-4">{slide.heading}</h1>
                                            </div>
                                        </div>
                                    </div>)
                                }

                            })
                        }
                        {/* <div className="carousel-item active">
                            <img className="w-100" src={'./assets/img/krushi1.jpg'} alt="Image1" />
                            <div className="carousel-caption top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center" >
                                <div className="text-start p-5" style={{ maxWidth: '900px' }}>
                                    <h3 className="text-white">Organic Vegetables</h3>
                                    <h1 className="display-1 text-white mb-md-4">Organic Vegetables For Healthy Life</h1>
                                    <Link href="" className="btn btn-primary py-md-3 px-md-5 me-3">Explore</Link>
                                    <Link href="" className="btn btn-secondary py-md-3 px-md-5">Contact</Link>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="w-100" src={"./assets/img/krushi2.jpg"} alt="Image2" />
                            <div className="carousel-caption top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center">
                                <div className="text-start p-5" style={{ maxWidth: '900px' }}>
                                    <h3 className="text-white">Organic Fruits</h3>
                                    <h1 className="display-1 text-white mb-md-4">Organic Fruits For Better Health</h1>
                                    <Link href="" className="btn btn-primary py-md-3 px-md-5 me-3">Explore</Link>
                                    <Link href="" className="btn btn-secondary py-md-3 px-md-5">Contact</Link>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="w-100" src={"./assets/img/krushi3.jpg"} alt="Image2" />
                            <div className="carousel-caption top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center">
                                <div className="text-start p-5" style={{ maxWidth: '900px' }}>
                                    <h3 className="text-white">Organic Fruits</h3>
                                    <h1 className="display-1 text-white mb-md-4">Organic Fruits For Better Health</h1>
                                    <Link href="" className="btn btn-primary py-md-3 px-md-5 me-3">Explore</Link>
                                    <Link href="" className="btn btn-secondary py-md-3 px-md-5">Contact</Link>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel"
                        data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#header-carousel"
                        data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* <!-- Banner Start --> */}
            {/* <div className="container-fluid banner mb-5">
                <div className="container">
                    <div className="row gx-0">

                        <div className="col-md-6">
                            <div className="bg-primary bg-vegetable d-flex flex-column justify-content-center p-5" style={{ height: "300px", background: 'linear-gradient(rgba(52, 173, 84, .2), rgba(52, 173, 84, .2)),url(./assets/img/vegetable.png) bottom right no-repeat' }}>
                                <h3 className="text-white mb-3">Organic Vegetables</h3>
                                <p className="text-white">Dolor magna ipsum elitr sea erat elitr amet ipsum stet justo dolor, amet lorem diam no duo sed dolore amet diam</p>
                                <Link className="text-white fw-bold" href="">Read More<i className="bi bi-arrow-right ms-2"></i></Link>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="bg-secondary bg-fruit d-flex flex-column justify-content-center p-5" style={{ height: "300px", background: 'linear-gradient(rgba(255, 153, 51, .2), rgba(255, 153, 51, .2)), url(./assets/img/fruit.png) bottom right no-repeat' }}>
                                <h3 className="text-white mb-3">Organic Fruits</h3>
                                <p className="text-white">Dolor magna ipsum elitr sea erat elitr amet ipsum stet justo dolor, amet lorem diam no duo sed dolore amet diam</p>
                                <Link className="text-white fw-bold" href="">Read More<i className="bi bi-arrow-right ms-2"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* <!-- Banner Start --> */}

            {/* <!-- About Start --> */}
            <div className="container-fluid about pt-5">
                <div className="container">
                    <div className="row gx-5">
                        <div className="col-lg-8 mb-5 mb-lg-0">
                            <div className="d-flex h-100 border border-5 border-primary">

                                {/* <iframe width="100%" height="100%" src="https://www.youtube.com/watch?v=VCqoGuH_7Bw"></iframe> */}
                                <iframe src={`https://www.youtube.com/embed/a81NHb30lt8`} title='youutbe' height={"100%"} width={"100%"} />
                            </div>
                        </div>
                        <div className="col-lg-4 mb-5 mb-lg-0">
                            <div class="marquee-wrapper">
                                <div class="">
                                    <div class="marquee-block">
                                        <div class="marquee-inner to-left">
                                                {
                                                    news.map(item => (
                                                        <div class="marquee-item">
                                                            <p class=" mb-0 headingNews">{item.news_title}</p>
                                                            <p class=" mb-0">{item.news_description}</p>
                                                            <Link to={item.news_link} target='_blank' >Read more...</Link>
                                                        </div>
                                                    ))
                                                }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- About End --> */}



            {/* <!-- Features Start --> */}
            <div className="container-fluid bg-primary feature pb-lg-0 my-5">
                <div className="container pt-5 pb-lg-0">
                    <div className="mx-auto text-center mb-3 pb-2" style={{ maxWidth: '500px' }}>
                        <h6 className="text-uppercase text-secondary">Features</h6>
                        <h1 className="display-5 text-white">Why Choose Us!!!</h1>
                    </div>
                    <div className="row g-5 py-3">
                        <div className="col-lg-4">
                            <div className="text-white mb-5">
                                {/* <div className="bg-secondary rounded-pill d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa fa-seedling fs-4 text-white"></i>
                                </div> */}
                                <h4 className="text-white">Krushimitr</h4>
                                <p className="mb-0">Your problem will be solved here Share your farming problem with us Krishi Mitra Center in your village for your help</p>
                            </div>
                            <div className="text-white">
                                {/* <div className="bg-secondary rounded-pill d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa fa-award fs-4 text-white"></i>
                                </div> */}
                                <h4 className="text-white">Krushimitr E-Store</h4>
                                <p className="mb-0">Ours is an online agriculture service center where you can buy seeds, fertilizers, irrigation materials, electrical and electronic materials without any hesitation.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="d-block bg-white h-100 text-center p-5 pb-lg-0">

                                <img className="img-fluid" src="./assets/logo.png" style={{ width: '100%' }} alt="" />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="text-white mb-5">
                                {/* <div className="bg-secondary rounded-pill d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa fa-tractor fs-4 text-white"></i>
                                </div> */}
                                <h4 className="text-white">Guarantee / Warranty</h4>
                                <p className="mb-0">We get branded company materials the guarantee/warranty applies as given by the company and immediate help through Krishimatr</p>
                            </div>
                            <div className="text-white">
                                {/* <div className="bg-secondary rounded-pill d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa fa-phone-alt fs-4 text-white"></i>
                                </div> */}
                                <h4 className="text-white">Home Delivery</h4>
                                <p className="mb-0">Home delivery within 24 hours of purchase, immediate payment refund if item is returned and training to operate if item is machinery.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Features Start --> */}

            {/* <!-- Services Start --> */}
            {/* <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <h6 className="text-primary text-uppercase">Services</h6>
                                <h1 className="display-5">Organic Farm Services</h1>
                            </div>
                            <p className="mb-4">Tempor erat elitr at rebum at at clita. Diam dolor diam ipsum et tempor sit. Clita erat ipsum et lorem et sit sed stet labore</p>
                            <Link href="" className="btn btn-primary py-md-3 px-md-5">Contact Us</Link>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item bg-light text-center p-5">
                                <i className="fa fa-carrot display-1 text-primary mb-3"></i>
                                <h4>Fresh Vegetables</h4>
                                <p className="mb-0">Labore justo vero ipsum sit clita erat lorem magna clita nonumy dolor magna dolor vero</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item bg-light text-center p-5">
                                <i className="fa fa-apple-alt display-1 text-primary mb-3"></i>
                                <h4>Fresh Fruits</h4>
                                <p className="mb-0">Labore justo vero ipsum sit clita erat lorem magna clita nonumy dolor magna dolor vero</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item bg-light text-center p-5">
                                <i className="fa fa-dog display-1 text-primary mb-3"></i>
                                <h4>Healty Cattle</h4>
                                <p className="mb-0">Labore justo vero ipsum sit clita erat lorem magna clita nonumy dolor magna dolor vero</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item bg-light text-center p-5">
                                <i className="fa fa-tractor display-1 text-primary mb-3"></i>
                                <h4>Modern Truck</h4>
                                <p className="mb-0">Labore justo vero ipsum sit clita erat lorem magna clita nonumy dolor magna dolor vero</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item bg-light text-center p-5">
                                <i className="fa fa-seedling display-1 text-primary mb-3"></i>
                                <h4>Farming Plans</h4>
                                <p className="mb-0">Labore justo vero ipsum sit clita erat lorem magna clita nonumy dolor magna dolor vero</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* <!-- Services End --> */}




            {/* <!-- Products Start --> */}
            <div className="container-fluid">
                <div className="container">
                    <div className="mx-auto text-center mb-5" style={{ maxWidth: '500px' }}>
                        <h6 className="text-primary text-uppercase">Category</h6>
                        <h1 className="display-5">Categories</h1>
                    </div>
                    <OwlCarousel className='owl-theme' loop margin={10} nav {...options}>
                        {
                            cate.map((item) => (
                                <div class='item card py-3 shadow'>
                                    <Link to={`/products/${item.category_name}`}>
                                        <div className="product-item position-relative bg-white d-flex flex-column text-center">
                                            <img className="img-fluid mb-4" src={`https://krushimitr.in/upload/${item.category_image}`} alt={item.category_image} />
                                            <p className="mb-1 fw-bold">{item.category_name}</p>
                                        </div>
                                    </Link>
                                </div>

                            ))
                        }

                    </OwlCarousel>
                </div>
            </div>
            {/* <!-- Products End --> */}



            {/* <!-- Category Start --> */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="mx-auto text-center mb-5" style={{ maxWidth: '500px' }}>
                        <h6 className="text-primary text-uppercase">Product</h6>
                        <h1 className="display-5">Products</h1>
                    </div>

                    <div className='row'>

                        {product.map((item) => (

                            <div className='col-lg-3 mt-3'>
                                <div className='card h-100'>
                                    <div className='card-body p-0 productImage'>
                                        <img src={`https://krushimitr.in/upload/${item.image[0]}`} style={{ margin: 'auto' }} width={'100%'} alt={item.image} />
                                    </div>
                                    <div className='p-3'>
                                        <p className='text-dark text-center fw-bold'>{item.productName}</p>
                                        {/* <p><label className="text-primary fw-bold mb-0"><i className='fa fa-rupee' ></i>{item.price}</label> &nbsp;  {item.oldPrice ? <del className=''><i className='fa fa-rupee' ></i>{item.oldPrice}</del> : ''}</p> */}
                                    </div>
                                    <div className="btn-action d-flex justify-content-center pb-3">
                                        <button className="btn bg-secondary py-2 px-3 mx-2 btn-sm" onClick={() => navigate('/product-details',{state: { item: item }})} ><i className="bi bi-eye text-white"></i></button>
                                    </div>
                                    <div className='productPercentage'>
                                        {item.discount ? <span>{item.discount}{item.percentSbl}</span> : ''}
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>

                </div>
            </div>
            {/* <!-- End Category --> */}


            {/* <!-- Testimonial Start --> */}
            {/* <div className="container-fluid bg-testimonial py-5 my-5">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="owl-carousel testimonial-carousel p-5">
                                <div className="testimonial-item text-center text-white">
                                    <img className="img-fluid mx-auto p-2 border border-5 border-secondary rounded-circle mb-4" src="./assets/img/testimonial-2.jpg" alt="" />
                                    <p className="fs-5">Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.</p>
                                    <hr className="mx-auto w-25" />
                                    <h4 className="text-white mb-0">Client Name</h4>
                                </div>
                                <div className="testimonial-item text-center text-white">
                                    <img className="img-fluid mx-auto p-2 border border-5 border-secondary rounded-circle mb-4" src="./assets/img/testimonial-2.jpg" alt="" />
                                    <p className="fs-5">Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.</p>
                                    <hr className="mx-auto w-25" />
                                    <h4 className="text-white mb-0">Client Name</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* <!-- Testimonial End --> */}


            {/* <!-- Team Start --> */}
            {/* <div className="container-fluid py-5">
                <div className="container">
                    <div className="mx-auto text-center mb-5" style={{ maxWidth: '500px' }}>
                        <h6 className="text-primary text-uppercase">The Team</h6>
                        <h1 className="display-5">We Are Professional Organic Farmers</h1>
                    </div>
                    <div className="row g-5">
                        <div className="col-lg-4 col-md-6">
                            <div className="row g-0">
                                <div className="col-10">
                                    <div className="position-relative">
                                        <img className="img-fluid w-100" src="./assets/img/team-1.jpg" alt="" />
                                        <div className="position-absolute start-0 bottom-0 w-100 py-3 px-4" style={{ background: 'rgba(52, 173, 84, .85)' }}>
                                            <h4 className="text-white">Farmer Name</h4>
                                            <span className="text-white">Designation</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="h-100 d-flex flex-column align-items-center justify-content-around bg-secondary py-5">
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-twitter text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-facebook-f text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-linkedin-in text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-instagram text-secondary"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="row g-0">
                                <div className="col-10">
                                    <div className="position-relative">
                                        <img className="img-fluid w-100" src="./assets/img/team-2.jpg" alt="" />
                                        <div className="position-absolute start-0 bottom-0 w-100 py-3 px-4" style={{ background: 'rgba(52, 173, 84, .85)' }}>
                                            <h4 className="text-white">Farmer Name</h4>
                                            <span className="text-white">Designation</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="h-100 d-flex flex-column align-items-center justify-content-around bg-secondary py-5">
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-twitter text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-facebook-f text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-linkedin-in text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-instagram text-secondary"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="row g-0">
                                <div className="col-10">
                                    <div className="position-relative">
                                        <img className="img-fluid w-100" src="./assets/img/team-3.jpg" alt="" />
                                        <div className="position-absolute start-0 bottom-0 w-100 py-3 px-4" style={{ background: 'rgba(52, 173, 84, .85)' }}>
                                            <h4 className="text-white">Farmer Name</h4>
                                            <span className="text-white">Designation</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="h-100 d-flex flex-column align-items-center justify-content-around bg-secondary py-5">
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-twitter text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-facebook-f text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-linkedin-in text-secondary"></i></Link>
                                        <Link className="btn btn-square rounded-circle bg-white" href="#"><i className="fab fa-instagram text-secondary"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* <!-- Team End --> */}
            {/* <!-- Facts Start --> */}
            <div className="container-fluid bg-secondary facts mb-5">
                <div className="container py-5">
                    <div class="row" id="counter">

                        <div class="col-md-3 mt-3">
                            <div class="milestone-counter">
                                <i> <img src='./assets/logo.png' width={"100"} height={"100"} alt='' /></i><br />
                                <span class="stat-count highlight">100+</span>
                                <div class="milestone-details">Krushimitr Center</div>
                            </div>
                        </div>
                        <div class="col-md-3 mt-3">
                            <div class="milestone-counter">
                                <i> <img src='./assets/connect.png' width={"100"} height={"100"} alt='' /></i><br />
                                <span class="stat-count highlight">1000+</span>
                                <div class="milestone-details">Farmers connected with us</div>
                            </div>
                        </div>
                        <div class="col-md-3 mt-3">
                            <div class="milestone-counter">
                                <i> <img src='./assets/logo.png' width={"100"} height={"100"} alt='' /></i><br />
                                <span class="stat-count highlight">100+</span>
                                <div class="milestone-details">Krushi Seva Kendra</div>
                            </div>
                        </div>
                        <div class="col-md-3 mt-3">
                            <div class="milestone-counter">
                                <i> <img src='./assets/supplychain.png' width={"100"} height={"100"} alt='' /></i><br />
                                <span class="stat-count highlight">50+</span>
                                <div class="milestone-details">Suppliers Company</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Facts End --> */}


            {/* <!-- Category Start --> */}
            <div className="container-fluid py-3">
                <div className="container">
                    <div className="mx-auto text-center mb-3" style={{ maxWidth: '500px' }}>
                        <h6 className="text-primary text-uppercase">Partners</h6>
                        <h1 className="display-5">Company Partners</h1>
                    </div>

                    <div className='row partnerSlider'>
                        <OwlCarousel className='owl-theme' loop margin={10} nav {...optionspartner}>
                            <div class='item shadow'>
                                <div className=''>
                                    <img src={`./assets/img/logo1.jpg`} width={'100%'} alt={'partner logo1'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo2.jpg"} width={'100%'} alt={'partner logo2'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo3.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo4.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo5.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo6.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo7.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo8.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo9.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo10.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo11.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo12.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                        </OwlCarousel>

                    </div>

                </div>
            </div>
            {/* <!-- End Category --> */}


            {/* <!-- Category Start --> */}
            <div className="container-fluid py-3">
                <div className="container">
                    <div className="mx-auto text-center mb-3" style={{ maxWidth: '500px' }}>
                        <h6 className="text-primary text-uppercase">Partners</h6>
                        <h1 className="display-5">Banking Partners</h1>
                    </div>

                    <div className='row partnerSlider'>
                        <OwlCarousel className='owl-theme' loop margin={10} nav {...optionspartner}>
                            <div class='item shadow'>
                                <div className=''>
                                    <img src={`./assets/img/logo13.jpg`} width={'100%'} alt={'partner logo1'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo14.jpg"} width={'100%'} alt={'partner logo2'} />
                                </div>
                            </div>
                            <div className='item shadow'>
                                <div class=''>
                                    <img src={"./assets/img/logo15.jpg"} width={'100%'} alt={'partner logo'} />
                                </div>
                            </div>
                        </OwlCarousel>
                    </div>
                </div>
            </div>
            {/* <!-- End Category --> */}

            {/* <!-- Blog Start --> */}
            {/* <div className="container-fluid py-5">
                <div className="container">
                    <div className="mx-auto text-center mb-5" style={{ maxWidth: '500px' }}>
                        <h6 className="text-primary text-uppercase">Our Blog</h6>
                        <h1 className="display-5">Latest Articles From Our Blog Post</h1>
                    </div>
                    <div className="row g-5">
                        <div className="col-lg-4">
                            <div className="blog-item position-relative overflow-hidden">
                                <img className="img-fluid" src="./assets/img/blog-1.jpg" alt="" />
                                <Link className="blog-overlay" href="">
                                    <h4 className="text-white">Lorem elitr magna stet eirmod labore amet</h4>
                                    <span className="text-white fw-bold">Jan 01, 2050</span>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="blog-item position-relative overflow-hidden">
                                <img className="img-fluid" src="./assets/img/blog-2.jpg" alt="" />
                                <Link className="blog-overlay" href="">
                                    <h4 className="text-white">Lorem elitr magna stet eirmod labore amet</h4>
                                    <span className="text-white fw-bold">Jan 01, 2050</span>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="blog-item position-relative overflow-hidden">
                                <img className="img-fluid" src="./assets/img/blog-3.jpg" alt="" />
                                <Link className="blog-overlay" href="">
                                    <h4 className="text-white">Lorem elitr magna stet eirmod labore amet</h4>
                                    <span className="text-white fw-bold">Jan 01, 2050</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* <!-- Blog End --></div> */}
        </>
    )
}

export default Home