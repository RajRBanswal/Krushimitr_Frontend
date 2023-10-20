import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserLogin() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const LoginPage = async () => {
    let result = await fetch("http://localhost:8000/users/user-login", {
      method: "post",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((resp) => resp.json());
    if (result.status === 201) {
      localStorage.setItem("user_id", result.user._id);
      localStorage.setItem("user_name", result.user.name);
      // alert("User Logged In");
      alert(result.result);
      navigate("/user-home");
    } else {
      alert("User Not Found");
    }



    // console.warn(result.email);
  }
  return (
    <div className='main_div py-5 h-100 w-100'>
      <div className='container'>
        <div className='row'>
          <ToastContainer />
          <div className='col-lg-5 m-auto'>
            <div className='card' style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h3 className='text-center text-uppercase text-primary fw-bold'>User Login</h3>
                <hr />
                <div className='form-group'>
                  <label htmlFor="name" className="form-label">Email</label>
                  <input type="text" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                </div>
                <div className='form-group mt-2'>
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
                </div>
                <div className='form-group mt-2'>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="Remember" />
                    <label className="form-check-label" htmlFor="Remember">
                      Remember Me
                    </label>
                  </div>
                </div>
                <div className='form-group mt-3 text-center'>
                  <button type="button" onClick={LoginPage} className="btn btn-danger">Primary</button>
                </div>
                <div className='row mt-1'>
                  <div className='col-lg-12 col-12'>
                    <p>Don`t have an account? <Link to={"/user-register"}>Register here...</Link> <Link to={"/admin_login"} style={{ fontSize: 14 }} className='float-end' >Admin Login</Link></p>
                  </div>
      
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
