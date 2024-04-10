import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loading from "../images/loading.gif";

function Login() {
  const [loadings, setLoadings] = useState(false);
  const buttonRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState("fa fa-solid fa-eye-slash");

  const LoginPage = async () => {
    setLoadings(true);
    buttonRef.current.disabled = true;
    let result = await fetch("https://krushimitr.in/api/admin/admin_login", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => resp.json());
    // console.log(result);
    if (result.status === 201) {
      buttonRef.current.disabled = false;
      setLoadings(false);
      localStorage.setItem("admin_id", result.admins._id);
      localStorage.setItem("admin_name", result.admins.name);
      let token = result.admins.tokens[result.admins.tokens.length - 1].token;
      localStorage.setItem("admin_token", token);
      alert(result.result);
      navigate("/admin");
    } else {
      setLoadings(false);
      alert("User Not Found");
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
    <div className="main_div py-5 h-100 w-100">
      <div className="container py-5">
        <div className="row">
          <img
            src={loading}
            className={"loader " + (loadings ? "d-block" : "d-none")}
            alt=""
          />
          <ToastContainer />
          <div className="col-lg-5 m-auto">
            <div className="card" style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h3 className="text-center text-uppercase text-primary fw-bold">
                  Login
                </h3>
                <hr />
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
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
                <div className="form-group mt-2">
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
                </div>
                <div className="form-group mt-3 text-center">
                  <button
                    type="button"
                    ref={buttonRef}
                    onClick={LoginPage}
                    className="btn btn-danger"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
