import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import loading from "../images/loading.gif";
const ForgotPassword = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadings, setLoadings] = useState(false);
  const verifyPassword = async () => {
    setLoadings(true);
    const resetPass = await fetch(
      "https:krushimitr.in/api/users/forgot-password",
      {
        method: "post",
        body: JSON.stringify({
          userType: userType,
          mobile: mobile,
          password: newPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const ress = await resetPass.json();
    if (ress.status === 201) {
      setLoadings(false);
      alert(ress.result);
      navigate("/login");
    } else {
      setLoadings(false);
      alert(ress.result);
    }
  };
  return (
    <div
      className="py-5"
      style={{ backgroundColor: "lightgrey", height: "100vh" }}
    >
      <div className="container py-5 mt-5">
        <div className="row">
          <img
            src={loading}
            className={"loader " + (loadings ? "d-block" : "d-none")}
            alt=""
          />
          <div className="col-lg-5 m-auto">
            <div className="card">
              <div className="card-body pt-3 pb-0">
                <h4 className="my-0 text-center">{userType} Forgot Password</h4>
                <hr className="mt-3 border border-dark" />
              </div>
              <div className="card-body pt-0 p-4">
                <div className="row">
                  <div className="col-lg-12">
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
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <label htmlFor="name">Enter New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="mobile"
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter New Password"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <label htmlFor="name">Enter Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="mobile"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter Confirm Password"
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-lg-12 text-center ">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        newPassword === confirmPassword
                          ? verifyPassword()
                          : alert("Password Not Match")
                      }
                      disabled={newPassword === confirmPassword ? false : true}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
