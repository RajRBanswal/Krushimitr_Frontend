import { Image } from "primereact/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const logo = "/logo.png";
const google = window.google;
function Navbar() {
  const cart = useSelector((state) => state.cart);
  const [cartProducs, setCartProduct] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [username, setUsername] = useState(null);

  const getDataFromCart = () => {
    setCartProduct(cart.data);
  };
  useEffect(() => {
    let user = localStorage.getItem("user_id");
    let usernames = localStorage.getItem("user_name");
    setUserLoggedIn(user);
    setUsername(usernames);
  });

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        layout: window.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  return (
    <>
      <div className="container-fluid px-5 d-none d-lg-block bg-primary ">
        <div className="row gx-5 py-lg-0 align-items-center">
          <div className="col-lg-6">
            <div className="d-flex align-items-center justify-content-start text-white">
              <i className="fas fa-phone me-2" style={{ fontSize: 14 }}></i>
              <p className="mb-0">+91-9322192188 </p> &nbsp;&nbsp;
              {/* <i className="fa-solid fa-envelope fs-4 text-secondary me-2"></i> */}
              <i
                className="fas fa-solid fa-envelope me-2"
                style={{ fontSize: 14 }}
              ></i>
              <p className="mb-0">shivaneribusiness@gmail.com</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-center justify-content-end">
              <Link
                className="btn btn-primary btn-square rounded-circle me-2"
                to="#"
              >
                <i className="fab fa-twitter"></i>
              </Link>
              <Link
                className="btn btn-primary btn-square rounded-circle me-2"
                to="#"
              >
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link
                className="btn btn-primary btn-square rounded-circle me-2"
                to="#"
              >
                <i className="fab fa-linkedin-in"></i>
              </Link>
              <Link
                className="btn btn-primary btn-square rounded-circle"
                to="#"
              >
                <i className="fab fa-instagram"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg bg-white navbar-dark shadow py-sm-3 py-lg-0 px-3 px-lg-5">
        <Link to="/" className="navbar-brand  ps-lg-5">
          <h1 className="m-0 display-4 text-secondary">
            <Image src={logo} alt="logo" width={100} />
          </h1>
        </Link>
        <button
          className="navbar-toggler bg-success"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav mx-auto py-0">
            <Link to="/" className="nav-item nav-link active">
              Home
            </Link>
            <Link to="/about-us" className="nav-item nav-link">
              About
            </Link>
            <Link to="/service" className="nav-item nav-link">
              Service
            </Link>
            <Link to="/product" className="nav-item nav-link">
              Product
            </Link>
            {/* <div className="nav-item dropdown">
                            <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</Link>
                            <div className="dropdown-menu m-0">
                                <Link to="/blog" className="dropdown-item">Blog Grid</Link> */}
            {/* <Link to="/feature" className="dropdown-item">Features</Link>
                        <Link to="/team" className="dropdown-item">The Team</Link>
                        <Link to="/testimonial" className="dropdown-item">Testimonial</Link> */}
            {/* </div>
                        </div> */}
            <Link to="/contact" className="nav-item nav-link">
              Contact
            </Link>
            <Link
              to="/apply-ekrushimitr"
              className="nav-item nav-link blink_text"
            >
              Apply E-Krushimitr
            </Link>
            <Link to="#" className="nav-item py-1 nav-link">
              <div id="google_translate_element"></div>
            </Link>
            {userLoggedIn === null ? (
              <Link to="/login" className="nav-item nav-link">
                Login
              </Link>
            ) : (
              <Link to="/users/user-dashboard" className="nav-item nav-link">
                {username}
              </Link>
            )}
            <div className="nav-item dropdown">
              <Link
                to="/cart"
                className="nav-link"
                onClick={() => getDataFromCart()}
                data-bs-toggle="dropdown"
              >
                <i className="fa fa-solid fa-shopping-cart"></i>
                <span className="badge rounded-pill bg-success text-light">
                  {cart.data.length}
                </span>
              </Link>
              <div
                className="dropdown-menu m-0 dropdown-menu-end"
                style={{ minWidth: "24rem" }}
              >
                <i
                  className="fa fa-close"
                  style={{ color: "red", float: "right", paddingRight: "10px" }}
                ></i>
                <div className="dropdown-item">
                  <div
                    className="d-flex justify-content-between align-items-center table-responsive "
                    style={{ overflow: "auto" }}
                  >
                    <table className="table table-responsive table-bordered">
                      {cartProducs ? (
                        cartProducs.map((item, index) => {
                          return (
                            <tr>
                              <td>
                                <img
                                  src={`https://krushimitr.in/upload/${item.image[0]}`}
                                  alt="product"
                                  width={50}
                                />
                              </td>
                              <td>
                                <Link
                                  to={"./cart-details"}
                                  className="mb-0 p-0 fw-bold"
                                >
                                  {item.productName} ({item.size}
                                  {item.unit})
                                </Link>
                              </td>
                              <td>
                                <p className="mb-0 p-0">
                                  <span className="fw-bold text-success">
                                    Price : {item.price}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 p-0">
                                  <span className="fw-bold  text-success">
                                    Qty : {item.quantity}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <i
                                    className="fa fa-solid fa-trash-alt"
                                    style={{ margin: "inherit" }}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <div className="p-2 d-flex justify-content-between align-content-center mt-2 ">
                              <p className="mb-0">Your cart is empty</p>
                              <i
                                className="fa fa-solid fa-shopping-cart"
                                style={{ margin: "inherit" }}
                              ></i>
                            </div>
                          </td>
                        </tr>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
