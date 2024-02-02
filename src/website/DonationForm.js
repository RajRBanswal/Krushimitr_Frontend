import React, { useState } from "react";
import { useNavigate } from "react-router";

function DonationForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("");
  const [subject, setSubject] = useState("");
  const [pincode, setPin] = useState("");
  const [amount, setAmount] = useState("");

  const storeFormData = async() =>{
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("mobile", mobile);
    data.append("address", address);
    data.append("taluka", taluka);
    data.append("district", district);
    data.append("subject", subject);
    data.append("pincode", pincode);
    data.append("amount", amount);
    const response = await fetch("https://krushimitr.in/api/donation", {
      method: "POST",
      body: data,
    });
    const json = await response.json();
    if (json.status === 201){
        alert("Thank you for helping us")
        navigate("/donation-success");
    }else{
        alert(json.message);
    }
  }
  
  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="mx-auto text-center mb-5" style={{ maxWidth: "500px" }}>
          <h1 className="display-5">Donation Form</h1>
        </div>
        <div className="row g-0">
          <div className="col-lg-10 m-auto col-12">
            <div className="card py-4 px-3">
              <div className="row g-3">
                <div className="col-lg-4 col-12">
                  <label>
                    Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    className="form-control px-2"
                    placeholder="Your Name"
                  />
                </div>
                <div className="col-lg-4 col-12">
                  <label>
                    Mobile Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setMobile(e.target.value)}
                    className="form-control px-2"
                    placeholder="Mobile"
                  />
                </div>
                <div className="col-lg-4 col-12">
                  <label>
                    Email ID <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control px-2"
                    placeholder="Your Email"
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-lg-4 col-12">
                  <label>Address</label>
                  <input
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control px-2"
                    placeholder="Address"
                  />
                </div>
                <div className="col-lg-3 col-6">
                  <label>Taluka</label>
                  <input
                    type="text"
                    onChange={(e) => setTaluka(e.target.value)}
                    className="form-control px-2"
                    placeholder="Taluka"
                  />
                </div>
                <div className="col-lg-3 col-6">
                  <label>Dist</label>
                  <input
                    type="text"
                    onChange={(e) => setDistrict(e.target.value)}
                    className="form-control px-2"
                    placeholder="District"
                  />
                </div>
                <div className="col-lg-2 col-6">
                  <label>Pincode</label>
                  <input
                    type="text"
                    onChange={(e) => setPin(e.target.value)}
                    className="form-control px-2"
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-lg-6 col-12">
                  <label>Subject</label>
                  <input
                    type="text"
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-control px-2"
                    placeholder="Subject"
                  />
                </div>
                <div className="col-lg-6 col-12">
                  <label>Amount</label>
                  <input
                    type="number"
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-control px-2"
                    placeholder="Amount"
                  />
                </div>
              </div>
              <div className="row g-3"></div>

              <div className="row mt-3">
                <div className="col-4 col-lg-3 m-auto">
                  <button className="btn btn-secondary w-100" onClick={()=>{storeFormData()}}>
                    Submit
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

export default DonationForm;

{/* <Link className="text-white mb-0" to="/donation-form">
  <i className="bi bi-arrow-right text-white me-2"></i>Donation
  Form
</Link> */}