import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loading from "../images/loading.gif";
function UserLogin() {
  const { state } = useLocation();
  const [username, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState("fa fa-solid fa-eye-slash");

  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Users");
  const isFocused = useRef(null);
  const navigate = useNavigate();
  const [loadings, setLoadings] = useState(false);

  const LoginPage = async () => {
    setLoadings(true);
    if (userType === "Users") {
      let result = await fetch("https://krushimitr.in/api/users/user-login", {
        method: "post",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }).then((resp) => resp.json());
      if (result.status === 201) {
        setLoadings(false);
        localStorage.setItem("user_id", result.user[0]._id);
        localStorage.setItem("user_name", result.user[0].name);
        localStorage.setItem("user_pincode", result.user[0].pincode);
        if (state && state.product.length > 0) {
          navigate("/cart-details");
        } else {
          navigate("/users/user-dashboard");
        }
      } else {
        setLoadings(false);
        alert("User Not Found");
      }
    } else if (userType === "Distributors") {
      let result = await fetch(
        "https://krushimitr.in/api/distributor/distributor-login",
        {
          method: "post",
          body: JSON.stringify({ username, password }),
          headers: { "Content-Type": "application/json" },
        }
      ).then((resp) => resp.json());
      // console.log(result);
      if (result.status === 201) {
        setLoadings(false);
        localStorage.setItem("distributor_id", result.distributor._id);
        localStorage.setItem("distributor_name", result.distributor.name);
        localStorage.setItem(
          "distributor_token",
          result.distributor.tokens[result.distributor.tokens.length - 1].token
        );
        // alert("User Logged In");
        // alert(result.result);
        navigate("/distributors");
      } else {
        setLoadings(false);
        alert("Distributor Not Found");
      }
    } else {
      isFocused.current.focus();
    }

    // console.warn(result.email);
  };
  const handleToggle = () => {
    if (type === "password") {
      setIcon("fa fa-eye");
      setType("text");
    } else {
      setIcon("fa fa-solid fa-eye-slash");
      setType("password");
    }
  };
  return (
    <div
      className="main_div py-3 h-100 w-100"
      style={{ backgroundImage: "url('./assets/images/bgImg.jpg')" }}
    >
      <div className="container">
        <div className="row">
          <img
            src={loading}
            className={"loader " + (loadings ? "d-block" : "d-none")}
            alt=""
          />
          <div className="col-lg-5 m-auto">
            <div className="card" style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h3 className="text-center text-uppercase text-primary fw-bold">
                  Login
                </h3>
                <hr className="my-2" />
                <div className="row">
                  <div className="col-lg-6 text-end">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        value="Users"
                        ref={isFocused}
                        onChange={(e) => setUserType(e.target.value)}
                      />
                      <label
                        className="form-check-label"
                        for="flexRadioDefault1"
                      >
                        Users
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        value="Distributors"
                        id="flexRadioDefault2"
                        onChange={(e) => setUserType(e.target.value)}
                      />
                      <label
                        className="form-check-label"
                        for="flexRadioDefault2"
                      >
                        Distributors / Vendor
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Mobile Number"
                  />
                </div>
                <div className="form-group mt-2 position-relative">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type={type}
                    className="form-control"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                  />
                  <span
                    class="flex justify-around items-center"
                    onClick={handleToggle}
                  >
                    <i class={"absolute passwordIcon " + icon} size={25} />
                  </span>
                </div>
                <div className="form-group mt-2 d-flex justify-content-between">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="Remember"
                    />
                    <label className="form-check-label" htmlFor="Remember">
                      Remember Me
                    </label>
                  </div>
                  <div className="form-check">
                    <Link to={"/forgot-password/" + userType}>
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Forgot Password
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="form-group">
                              <label htmlFor="name" className="form-label">
                                Mobile Number
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="mobile"
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Enter Mobile Number"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group mt-3 text-center">
                  <button
                    type="button"
                    onClick={LoginPage}
                    className="btn btn-danger"
                  >
                    Login
                  </button>
                </div>
                <div className="row mt-1">
                  <div className="col-lg-12 col-12">
                    <p>
                      Don`t have an account?{" "}
                      <Link to={"/user-register"}>Register here...</Link>{" "}
                      <Link
                        to={"/admin_login"}
                        style={{ fontSize: 14 }}
                        className="float-end"
                      >
                        Admin Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
