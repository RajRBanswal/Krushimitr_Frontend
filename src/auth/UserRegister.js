import { City, State } from "country-state-city";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import loading from "../images/loading.gif";
function UserRegister() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [cityCode, setCityCode] = useState([]);
  const [type, setType] = useState("");
  const [profileImage, setProfileImage] = useState([]);
  const navigate = useNavigate();
  const isFocused = useRef(null);
  const [userType, setUserType] = useState("");
  const [loadings, setLoadings] = useState(false);
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const typeRef = useRef(null);
  const [PAN, setPAN] = useState("");
  const [PANName, setPANName] = useState("");
  const [taluka, setTaluka] = useState("");

  useEffect(() => {
    const user_id = localStorage.getItem("USERID");
    setUserId(user_id);
    const product_id = localStorage.getItem("PRODUCT_ID");
    setProductId(product_id);
  }, []);

  const StoreData = async (e) => {
    let talukas = taluka.charAt(0).toUpperCase() + taluka.slice(1);
    e.preventDefault();
    setLoadings(true);
    if (
      !name ||
      !mobile ||
      !password ||
      !address ||
      talukas === "" ||
      state === "" ||
      city === "" ||
      pincode === ""
    ) {
      alert("Please fill out all required fields.");
    } else if (mobile.length !== 10) {
      alert("Please Enter 10 Digit Mobile Number");
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("state", state);
      formData.append("city", city);
      formData.append("taluka", talukas);
      formData.append("address", address);
      formData.append("pincode", pincode);
      formData.append("pan", PAN);
      formData.append("kycstatus", KYCStatus);
      if (profileImage) {
        formData.append("profile_image", profileImage);
      } else {
        formData.append("profile_image", "");
      }
      formData.append("referenceId", userId);
      formData.append("referenceProductId", productId);

      if (userType === "Users") {
        const result = await fetch(
          "https://krushimitr.in/api/users/user-register",
          {
            method: "post",
            body: formData,
          }
        ).then((result) => result.json());
        if (result.status === 201) {
          setLoadings(false);
          alert(result.result);
          navigate("/login");
        } else {
          setLoadings(false);
          alert(result.result);
        }
      } else if (userType === "Distributors") {
        if (type === "") {
          typeRef.current.focus();
          setLoadings(false);
          return;
        } else {
          formData.append("type", type);
          const res = await fetch(
            "https://krushimitr.in/api/distributor/distributor-register",
            {
              method: "post",
              body: formData,
            }
          );
          const result = await res.json();
          if (result.status === 201) {
            setLoadings(false);
            alert(result.result);
            navigate("/login");
          } else {
            setLoadings(false);
            alert(result.result);
          }
        }
      } else {
        isFocused.current.focus();
        setLoadings(false);
      }
    }
  };

  const onChangeHandler = (e) => {
    setCityCode("");
    setState("");
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const cityCode = el.getAttribute("id");
    setCityCode(cityCode);
    setState(el.getAttribute("value"));
  };
  const [KYCStatus, setKYCStatus] = useState("Pending");
  const [panVerifyStatus, setPANVerifyStatus] = useState(false);
  const panVerify = async () => {
    const res = await fetch(
      "https://krushimitr.in/api/users/users-pan-verification",
      {
        method: "post",
        body: JSON.stringify({
          name: PANName,
          pan: PAN,
        }),
        headers: {
          "Content-Type": "applicaton/json",
        },
      }
    );
    const result = await res.json();
    console.log(result);
    if (result.status === 201) {
      setKYCStatus("Done");
      console.log(result.data);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <img
        src={loading}
        className={"loader " + (loadings ? "d-block" : "d-none")}
        alt=""
      />
      <div
        className="main_div h-100 w-100 "
        style={{ backgroundImage: "url('./assets/images/bgImg.jpg')" }}
      >
        <div className="container py-3">
          <div className="row">
            <ToastContainer />
            <div className="col-lg-8 m-auto">
              <div
                className="card"
                style={{ borderRadius: 0, marginBottom: 10 }}
              >
                <div className="card-body">
                  <h4 className="text-center text-uppercase text-primary fw-bold my-0">
                    Register Form
                  </h4>
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
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <input
                        className="form-check-input ms-2"
                        type="checkbox"
                        name="nopan"
                        id="PanCard"
                        value={true}
                        onChange={(e) => setPANVerifyStatus(e.target.checked)}
                      />
                      <label className="form-check-label ms-5" for="PanCard">
                        Dont't Have PAN CARD
                      </label>
                    </div>
                  </div>
                  {panVerifyStatus === false ? (
                    <div className="row g-5">
                      <div className="col-lg-5 col-5">
                        <label>
                          PAN Number<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="PAN"
                          onChange={(e) => setPAN(e.target.value)}
                          required
                          placeholder="PAN"
                        />
                      </div>
                      <div className="col-lg-5 col-5">
                        <label>PAN Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="panName"
                          placeholder="PAN Name"
                          onChange={(e) => setPANName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-lg-2 col-2">
                        <button
                          className="btn btn-primary mt-4"
                          onClick={() => panVerify()}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {panVerifyStatus === true ? (
                    <>
                      <div className="row py-0">
                        <div className="col-lg-6 col-6">
                          <label>
                            Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Name"
                          />
                        </div>
                        <div className="col-lg-6 col-6">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="row py-0">
                        <div className="col-lg-6 col-6">
                          <label>
                            Mobile No.<span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="mobile"
                            placeholder="Mobile Number"
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                        <div
                          className="col-lg-6 col-6"
                          style={
                            userType === "Distributors"
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <label>
                            Type<span className="text-danger">*</span>
                          </label>
                          <select
                            ref={typeRef}
                            className="form-control"
                            onChange={(e) => setType(e.target.value)}
                          >
                            <option value="">Select Type</option>
                            <option value="Distributor">Distributor</option>
                            <option value="Vendor">Vendor</option>
                          </select>
                        </div>
                      </div>
                      <div className="row py-0">
                        <div className="col-lg-4 col-6">
                          <label htmlFor="name" className="form-label mb-0">
                            State<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-control"
                            onChange={onChangeHandler}
                          >
                            {State.getStatesOfCountry("IN").map((state) => (
                              <option id={state.isoCode} value={state.name}>
                                {state.name}{" "}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-lg-4 col-6">
                          <label htmlFor="name" className="form-label mb-0">
                            City<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-control"
                            onChange={(e) => setCity(e.target.value)}
                          >
                            {City.getCitiesOfState("IN", cityCode).map(
                              (city) => (
                                <option value={city.name}> {city.name} </option>
                              )
                            )}
                          </select>
                        </div>
                        <div className="col-lg-4 col-12">
                          <label>
                            Taluka<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="taluka"
                            placeholder="Taluka"
                            onChange={(e) => setTaluka(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row py-0">
                        <div className="col-lg-6 col-6">
                          <label>
                            Address<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            placeholder="Address"
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-6 col-6">
                          <label>Pin Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="pincode"
                            placeholder="Pincode"
                            onChange={(e) => setPincode(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row py-0">
                        <div className="col-lg-6 col-6">
                          <label>
                            Password <small>(Website use only)</small>
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="address"
                            placeholder="Password for Website"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-6 col-6">
                          <label>Profile Image</label>
                          <input
                            type="file"
                            className="form-control"
                            name="profileImage"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                          />
                        </div>
                      </div>
                      <div className="form-group mt-3 text-center">
                        <button
                          type="button"
                          onClick={StoreData}
                          className="btn btn-danger"
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <div className="row mt-1">
                    <div className="col-lg-12 col-12">
                      <p>
                        You have an already account?{" "}
                        <Link to={"/login"}>Login here...</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRegister;
