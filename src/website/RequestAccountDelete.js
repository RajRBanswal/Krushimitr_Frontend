import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import "react-toastify/dist/ReactToastify.css";

const RequestAccountDelete = () => {
  const buttonRef = useRef(null);
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState("No");
  const [otp, setOTP] = useState("");
  const [validOTP, setValidOTP] = useState(false);
  const [reason, setReason] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  const generateRandomNumber = () => {
    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  };

  const validateMobileNo = async (mobilen) => {
    if (mobilen.length === 10) {
      setMobile(mobilen);

      let otps = generateRandomNumber();
      let result = await fetch(
        `https://krushimitr.in/api/users/check-mobile-no`,
        {
          method: "post",
          body: JSON.stringify({ mobile: mobilen }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const res = await result.json();
      if (res.result === "Yes") {
        setOTP(otps);
        console.log(otps);
        setUserId(res.users._id);
        setUsername(res.users.name);
        setIsMobile("Yes");
        await fetch(
          `https://dltsms.bigtgs.in/index.php/smsapi/httpapi/?secret=AMIK73UEFFiACG1Y0kuF&sender=KMITR&tempid=1207161548091433074&receiver=${mobilen}&route=TA&msgtype=1&sms=${otps} is ur OTP for setting MPIN to ur a/c. Valid for 5 mins. DON'T SHARE with anyone. From- Lasina Network`
        );
      } else {
        alert("Mobile Number Not Found");
        setIsMobile("No");
        setMobile("");
      }
    }
  };

  const validateOTP = (userOTP) => {
    if (userOTP.length === 4) {
      //   alert(otp);
      //   alert(userOTP);
      if (otp == userOTP) {
        setValidOTP(true);
      } else {
        alert("Please Enter Valid Reason");
        setValidOTP(false);
      }
    } else {
      setValidOTP(false);
    }
  };

  const SendRequest = async () => {
    if (!userId || !reason) {
      alert("Please fill out all required fields.");
    } else {
      const result = await fetch(
        "https://krushimitr.in/api/users/account-delete-request",
        {
          method: "post",
          body: JSON.stringify({ userId, username, reason }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let res = await result.json();
      if (res.status === 201) {
        alert("Request Send Successfully");
        navigate("/");
      } else {
        alert("Something went wrong");
      }
    }
  };
  return (
    <div className="main_div py-5 h-100 w-100">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-5 m-auto">
            <div className="card" style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h5 className="text-center text-uppercase text-primary fw-bold">
                  Request to Delete Account
                </h5>
                <hr />
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Enter Username / Mobile Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="mobile"
                    onChange={(e) => validateMobileNo(e.target.value)}
                    placeholder="Enter Mobile No."
                    disabled={isMobile === "Yes" ? true : false}
                  />
                </div>
                {isMobile === "Yes" ? (
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Enter OTP
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="mobile"
                      max={4}
                      min={4}
                      onChange={(e) => validateOTP(e.target.value)}
                      placeholder="Enter OTP"
                      disabled={validOTP === true ? true : false}
                    />
                  </div>
                ) : (
                  ""
                )}
                {validOTP === true ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Enter Reason
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="reason"
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter Reason"
                      />
                    </div>
                    <div className="form-group mt-3 text-center">
                      <button
                        type="button"
                        onClick={SendRequest}
                        className="btn btn-danger"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccountDelete;
