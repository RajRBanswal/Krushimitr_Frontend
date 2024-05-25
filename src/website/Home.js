import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import { Link, useNavigate } from "react-router-dom";
import "../../node_modules/owl.carousel/dist/assets/owl.carousel.min.css";
import "../../node_modules/owl.carousel/dist/owl.carousel.min";
import "./../styles.css";
import { fromLatLng } from "react-geocode";
import Packages from "./Packages";
import { handelRightClick } from "./AppUtility";

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
      },
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
      },
    },
  };
  const [product, setProducts] = useState([]);

  const getProductData = async (e) => {
    let result = await fetch(
      "https://krushimitr.in/api/admin/all-products"
    ).then((result) => result.json());
    // const getProd = await all_products.json();
    if (result.status === 201) {
      setProducts(result.product_data);
    } else {
      setProducts(result.result);
    }
  };
  const [cate, setCate] = useState([]);
  const getCategoryData = async (e) => {
    let result = await fetch(
      "https://krushimitr.in/api/admin/all-category"
    ).then((result) => result.json());
    setCate(result.getCate);
  };
  const [news, setNews] = useState([]);
  const getNEWSData = async (e) => {
    let result = await fetch("https://krushimitr.in/api/admin/get-news").then(
      (result) => result.json()
    );
    setNews(result.getNEWS);
  };
  const [slider, setSlider] = useState([]);
  const getSliderData = async () => {
    let result = await fetch("https://krushimitr.in/api/admin/all-slider").then(
      (result) => result.json()
    );
    setSlider(result.getSlider);
  };

  const [position, setPosition] = useState({ latitude: null, longitude: null });
  // const location = async () => {
  // if ("geolocation" in navigator) {
  //   navigator.geolocation.getCurrentPosition(async function (position) {
  //     setPosition({
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //     });
  //     let demo = await fetch(
  //       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
  //     );
  //     console.log(demo);
  //   });
  // } else {
  //   console.log("Geolocation is not available in your browser.");
  // }
  const Http = new XMLHttpRequest();
  function getLocation() {
    var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        bdcApi =
          bdcApi +
          "?latitude=20°20'07.4" +
          position.coords.latitude +
          "&longitude=" +
          position.coords.longitude +
          "&localityLanguage=en";
        getApi(bdcApi);
      },
      (err) => {
        getApi(bdcApi);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }
  function getApi(bdcApi) {
    Http.open("GET", bdcApi);
    Http.send();
    Http.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // console.log(this.responseText);
      }
    };
  }
  // };/
  // console.log(position);

  useEffect(() => {
    getSliderData();
    getCategoryData();
    getProductData();
    getNEWSData();

    document.addEventListener("contextmenu", handelRightClick);
    return function cleanup() {
      document.removeEventListener("contextmenu", handelRightClick);
    };
  }, []);

  // console.log(product);

  return (
    <>
      <div className="container-fluid p-0">
        <div
          id="header-carousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {slider.map((slide, key) => {
              if (key === 0) {
                return (
                  <div className="carousel-item active">
                    <img
                      className="w-100"
                      src={`https://krushimitr.in/upload/${slide.slider_image}`}
                      alt="Image1"
                    />
                    <div className="carousel-caption top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center">
                      <div
                        className="text-start p-5"
                        style={{ maxWidth: "900px" }}
                      >
                        <h3 className="text-white">{slide.sub_heading}</h3>
                        <h1 className="display-1 text-white mb-md-4">
                          {slide.heading}
                        </h1>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="carousel-item">
                    <img
                      className="w-100"
                      src={`https://krushimitr.in/upload/${slide.slider_image}`}
                      alt="Image1"
                    />
                    <div className="carousel-caption top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center">
                      <div
                        className="text-start p-5"
                        style={{ maxWidth: "900px" }}
                      >
                        <h3 className="text-white">{slide.sub_heading}</h3>
                        <h1 className="display-1 text-white mb-md-4">
                          {slide.heading}
                        </h1>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* <!-- About Start --> */}
      <div className="container-fluid about pt-5">
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-8 mb-5 mb-lg-0">
              <div className="d-flex h-100 border border-5 border-primary">
                {/* <iframe width="100%" height="100%" src="https://www.youtube.com/watch?v=VCqoGuH_7Bw"></iframe> */}
                <iframe
                  src={`https://www.youtube.com/embed/a81NHb30lt8`}
                  title="youutbe"
                  height={"100%"}
                  width={"100%"}
                />
              </div>
            </div>
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="marquee-wrapper">
                <div className="">
                  <div className="marquee-block">
                    <div className="marquee-inner to-left">
                      {news.map((item) => (
                        <div className="marquee-item">
                          <p className=" mb-0 headingNews">{item.news_title}</p>
                          <p className=" mb-0">{item.news_description}</p>
                          <Link to={item.news_link} target="_blank">
                            Read more...
                          </Link>
                        </div>
                      ))}
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
          <div
            className="mx-auto text-center mb-3 pb-2"
            style={{ maxWidth: "500px" }}
          >
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
                <p className="mb-0">
                  Your problem will be solved here Share your farming problem
                  with us Krishi Mitra Center in your village for your help
                </p>
              </div>
              <div className="text-white">
                {/* <div className="bg-secondary rounded-pill d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa fa-award fs-4 text-white"></i>
                                </div> */}
                <h4 className="text-white">Krushimitr E-Store</h4>
                <p className="mb-0">
                  Ours is an online agriculture service center where you can buy
                  seeds, fertilizers, irrigation materials, electrical and
                  electronic materials without any hesitation.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="d-block bg-white h-100 text-center p-5 pb-lg-0">
                <img
                  className="img-fluid"
                  src="./assets/logo.png"
                  style={{ width: "100%" }}
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text-white mb-5">
                {/* <div className="bg-secondary rounded-pill d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa fa-tractor fs-4 text-white"></i>
                                </div> */}
                <h4 className="text-white">Guarantee / Warranty</h4>
                <p className="mb-0">
                  We get branded company materials the guarantee/warranty
                  applies as given by the company and immediate help through
                  Krishimatr
                </p>
              </div>
              <div className="text-white">
                {/* <div className="bg-secondary rounded-pill d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa fa-phone-alt fs-4 text-white"></i>
                                </div> */}
                <h4 className="text-white">Home Delivery</h4>
                <p className="mb-0">
                  Home delivery within 24 hours of purchase, immediate payment
                  refund if item is returned and training to operate if item is
                  machinery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Features Start --> */}

      {/* <!-- Products Start --> */}
      <div className="container-fluid">
        <div className="container">
          <div
            className="mx-auto text-center mb-5"
            style={{ maxWidth: "500px" }}
          >
            <h6 className="text-primary text-uppercase">Category</h6>
            <h1 className="display-5">Categories</h1>
          </div>
          <OwlCarousel className="owl-theme" loop margin={10} nav {...options}>
            {cate.map((item) => (
              <div className="item card py-3 shadow" key={item._id}>
                <Link to={`/products/${item.category_name}`}>
                  <div
                    className="product-item position-relative bg-white d-flex text-center"
                    style={{ flexDirection: "column" }}
                  >
                    <img
                      className="img-fluid mb-4"
                      src={`https://krushimitr.in/upload/${item.category_image}`}
                      alt={item.category_image}
                    />
                    <p className="mb-1 fw-bold">{item.category_name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
      {/* <!-- Products End --> */}

      {/* <Packages /> */}

      {/* <!-- Category Start --> */}
      <div className="container-fluid py-5">
        <div className="container">
          <div
            className="mx-auto text-center mb-5"
            style={{ maxWidth: "500px" }}
          >
            <h6 className="text-primary text-uppercase">Product</h6>
            <h1 className="display-5">Products</h1>
          </div>

          <div className="row">
            {product.map((item) => {
              let sizes = item.size;
              let abc = JSON.parse(sizes[0]);
              if (item.status === "Active") {
                return (
                  <div className="col-lg-3 my-3">
                    <div
                      aria-disabled={abc.quantity < 1 ? true : false}
                      className={
                        abc.quantity < 1
                          ? "card h-100 shadow productDisabled"
                          : "card h-100 shadow "
                      }
                    >
                      <div className="card-body p-0 productImage">
                        <img
                          src={`https://krushimitr.in/upload/${
                            Array.isArray(item.image) && item.image[0]
                          }`}
                          style={{ margin: "auto" }}
                          width={"200"}
                          alt={item.image}
                        />
                      </div>
                      <div className="px-2 py-3">
                        <p
                          className="text-dark mb-0 text-center fw-bold"
                          style={{ fontSize: 14 }}
                        >
                          {item.productName}
                        </p>
                        <div className="d-flex justify-content-evenly">
                          <label className="text-primary fw-bold mb-0">
                            <i className="fa fa-rupee"></i>{" "}
                            {abc && abc.selling_price}
                          </label>
                          <del className=" fw-bold mb-0">
                            <i className="fa fa-rupee"></i>{" "}
                            {abc && abc.buying_price}
                          </del>
                        </div>
                        <div className="d-flex justify-content-center">
                          <span className="text-primary">
                            Saved Price : <i className="fa fa-rupee"></i>
                            {abc && abc.buying_price - abc.selling_price}
                          </span>
                        </div>
                      </div>
                      <div className="btn-action d-flex justify-content-center pb-3">
                        <button
                          className="btn bg-primary btn-sm py-0"
                          onClick={() =>
                            navigate(
                              `/product-details/${
                                item._id
                              }/${item.productName.replace(/\//g, "")}`
                            )
                          }
                        >
                          <i className="bi bi-eye text-white"></i>
                        </button>
                      </div>
                      <div>
                        <div className="productPercentage">
                          <span>
                            {abc && abc.discount === undefined
                              ? "5% Off"
                              : abc.discount + "% Off"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={
                          abc.quantity < 1 ? "productDisabledText" : "d-none"
                        }
                      >
                        <h4>Out of Stock</h4>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      {/* <!-- End Category --> */}

      {/* <!-- Facts Start --> */}
      <div className="container-fluid bg-secondary facts mb-5">
        <div className="container py-5">
          <div className="row" id="counter">
            <div className="col-md-3 mt-3">
              <div className="milestone-counter">
                <i>
                  {" "}
                  <img
                    src="./assets/logo.png"
                    width={"100"}
                    height={"100"}
                    alt=""
                  />
                </i>
                <br />
                <span className="stat-count highlight">100+</span>
                <div className="milestone-details">Krushimitr Center</div>
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="milestone-counter">
                <i>
                  {" "}
                  <img
                    src="./assets/connect.png"
                    width={"100"}
                    height={"100"}
                    alt=""
                  />
                </i>
                <br />
                <span className="stat-count highlight">1000+</span>
                <div className="milestone-details">
                  Farmers connected with us
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="milestone-counter">
                <i>
                  {" "}
                  <img
                    src="./assets/logo.png"
                    width={"100"}
                    height={"100"}
                    alt=""
                  />
                </i>
                <br />
                <span className="stat-count highlight">100+</span>
                <div className="milestone-details">Krushi Seva Kendra</div>
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="milestone-counter">
                <i>
                  {" "}
                  <img
                    src="./assets/supplychain.png"
                    width={"100"}
                    height={"100"}
                    alt=""
                  />
                </i>
                <br />
                <span className="stat-count highlight">50+</span>
                <div className="milestone-details">Suppliers Company</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Facts End --> */}

      {/* <!-- Category Start --> */}
      <div className="container-fluid py-3">
        <div className="container">
          <div
            className="mx-auto text-center mb-3"
            style={{ maxWidth: "500px" }}
          >
            <h6 className="text-primary text-uppercase">Partners</h6>
            <h1 className="display-5">Company Partners</h1>
          </div>

          <div className="row partnerSlider">
            <OwlCarousel
              className="owl-theme"
              loop
              margin={10}
              nav
              {...optionspartner}
            >
              <div className="item shadow">
                <div className="">
                  <img
                    src={`./assets/img/logo1.jpg`}
                    width={"100%"}
                    alt={"partner logo1"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo2.jpg"}
                    width={"100%"}
                    alt={"partner logo2"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo3.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo4.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo5.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo6.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo7.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo8.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo9.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo10.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo11.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo12.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
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
          <div
            className="mx-auto text-center mb-3"
            style={{ maxWidth: "500px" }}
          >
            <h6 className="text-primary text-uppercase">Partners</h6>
            <h1 className="display-5">Banking Partners</h1>
          </div>

          <div className="row partnerSlider">
            <OwlCarousel
              className="owl-theme"
              loop
              margin={10}
              nav
              {...optionspartner}
            >
              <div className="item shadow">
                <div className="">
                  <img
                    src={`./assets/img/logo13.jpg`}
                    width={"100%"}
                    alt={"partner logo1"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo14.jpg"}
                    width={"100%"}
                    alt={"partner logo2"}
                  />
                </div>
              </div>
              <div className="item shadow">
                <div className="">
                  <img
                    src={"./assets/img/logo15.jpg"}
                    width={"100%"}
                    alt={"partner logo"}
                  />
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
  );
}

export default Home;
