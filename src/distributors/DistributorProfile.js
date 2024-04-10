import { Image } from "primereact/image";
import React, { useEffect, useState } from "react";
import { City, State } from "country-state-city";
function DistributorProfile() {
  const distIds = localStorage.getItem("distributor_id");
  const [distId, setDistId] = useState(distIds);
  const [shopDetails, setShopDetails] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopMobile, setShopMobile] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const [shopLicense, setShopLicense] = useState("");
  const [gstNo, setGSTNo] = useState("");
  const [shopLogo, setShopLogo] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [cityCode, setCityCode] = useState([]);
  const [taluka, setTaluka] = useState("");

  const [PAN, setPAN] = useState("");
  const [PANName, setPANName] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getDistributor();
  }, []);

  const getDistributor = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/distributor/distributor-profile",
      {
        method: "post",
        body: JSON.stringify({ distributor_id: distId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.status === 201) {
      setShopDetails(data.distributor);
      // console.log(data.distributor);
    } else {
      setShopDetails("");
    }
  };

  const updateShopData = async () => {
    let talukas = taluka.charAt(0).toUpperCase() + taluka.slice(1);
    let formData = new FormData();
    formData.append("distId", distId);
    formData.append("shopName", shopName ? shopName : "");
    formData.append("shopMobile", shopMobile ? shopMobile : "");
    formData.append("shopEmail", shopEmail ? shopEmail : "");
    formData.append("shopLicense", shopLicense ? shopLicense : "");
    formData.append("gstNo", gstNo ? gstNo : "");
    formData.append("shopLogo", shopLogo ? shopLogo : "");
    formData.append("state", state ? state : "");
    formData.append("city", city ? city : "");
    formData.append("taluka", talukas ? talukas : "");
    formData.append("address", address ? address : "");
    formData.append("pincode", pincode ? pincode : "");

    let response = await fetch(
      "https://krushimitr.in/api/distributor/update-shopdetails",
      {
        method: "post",
        body: formData,
      }
    );
    let res = await response.json();
    if (res.status === 201) {
      alert(res.result);
    } else {
      alert(res.result);
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
    <div className="px-3 py-1">
      <div className="row">
        <div className="col-lg-10 m-auto">
          <div className="card ">
            <div className="card-header text-center py-2">
              <h3 className="my-0">Profile</h3>
            </div>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between">
                <h4 className="my-0">User Profile</h4>
                {/* <button className="btn btn-primary btn-sm">
                  <i className="fa fa-edit"></i>
                </button> */}
              </div>
              <table className="table table-borderless w-100">
                <tbody>
                  <tr>
                    <td>
                      <b>Name :</b> {shopDetails.name}
                    </td>
                    <td>
                      <b>Mobile :</b> {shopDetails.mobile}
                    </td>
                    <td rowSpan={3}>
                      <Image
                        src={`https://krushimitr.in/upload/${shopDetails.profile_image}`}
                        alt=""
                        width={150}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <b>Email :</b> {shopDetails.email}
                    </td>
                    <td>
                      <b>Address :</b> {shopDetails.address},{" "}
                      {shopDetails.taluka}, {shopDetails.city},{" "}
                      {shopDetails.state}, {shopDetails.pincode}.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>KYC Status :</b>{" "}
                      {shopDetails.kycstatus === undefined ||
                      shopDetails.kycstatus === "" ||
                      shopDetails.kycstatus === null ? (
                        <>
                          <span className="text-danger">Pending</span>
                          <button
                            className="btn btn-success btn-sm ms-3"
                            data-bs-toggle="modal"
                            data-bs-target="#kycModal"
                          >
                            KYC Now
                          </button>
                        </>
                      ) : (
                        shopDetails.kycstatus
                      )}
                    </td>
                    <td>
                      <b>PAN No. :</b>{" "}
                      {shopDetails.pan === undefined ||
                      shopDetails.pan === "" ||
                      shopDetails.pan === null
                        ? ""
                        : shopDetails.kycstatus}
                    </td>
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
              <hr className="text-dark" />
              <h4 className="my-0 d-flex justify-content-between">
                Shop Profile{" "}
                <button
                  className="btn btn-outline-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editShopDetails"
                >
                  {shopDetails && shopDetails !== "" ? (
                    <i className="fa fa-edit"></i>
                  ) : (
                    <i className="fa fa-plus"></i>
                  )}
                </button>
              </h4>
              <table className="table table-borderless w-100">
                <tbody>
                  <tr>
                    <td>
                      <b>Shop Name :</b>{" "}
                      {shopDetails.shopName && shopDetails.shopName}
                    </td>
                    <td>
                      <b>Shop Mobile :</b>{" "}
                      {shopDetails.shopMobile && shopDetails.shopMobile}
                    </td>
                    <td rowSpan={3} className="text-center">
                      <Image
                        src={`https://krushimitr.in/upload/${
                          shopDetails.shopLogo && shopDetails.shopLogo
                        }`}
                        alt=""
                        width={100}
                      />
                      <p className="mb-0 fw-bold">Shop Logo</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <b>GST No :</b> {shopDetails.gstNo && shopDetails.gstNo}
                    </td>
                    <td>
                      {" "}
                      <b>Shop Email :</b>{" "}
                      {shopDetails.shopEmail && shopDetails.shopEmail}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <b>License No :</b>{" "}
                      {shopDetails.shopLicense && shopDetails.shopLicense}
                    </td>
                    <td>
                      <b>Address :</b> {shopDetails.address},{" "}
                      {shopDetails.taluka}, {shopDetails.city},{" "}
                      {shopDetails.state}, {shopDetails.pincode}.
                    </td>
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
              <div
                className="modal fade"
                id="editShopDetails"
                tabindex="-1"
                aria-labelledby="editShopDetailsLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header py-2">
                      <h5
                        className="modal-title mb-0"
                        id="editShopDetailsLabel"
                      >
                        {shopDetails && shopDetails.shopName !== ""
                          ? "Edit Shop Details"
                          : "Add Shop Details"}
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
                        <div className="col-lg-6">
                          <input
                            type="text"
                            className="form-control"
                            name="shopname"
                            placeholder="Shop Name"
                            defaultValue={
                              shopDetails.shopName && shopDetails.shopName
                            }
                            onChange={(e) => setShopName(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            className="form-control"
                            name="shopmobile"
                            placeholder="Shop Mobile"
                            defaultValue={
                              shopDetails.shopMobile && shopDetails.shopMobile
                            }
                            onChange={(e) => setShopMobile(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-6">
                          <input
                            type="text"
                            className="form-control"
                            name="shopemail"
                            placeholder="Shop Email"
                            defaultValue={
                              shopDetails.shopEmail && shopDetails.shopEmail
                            }
                            onChange={(e) => setShopEmail(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            className="form-control"
                            name="license"
                            placeholder="Shop License"
                            defaultValue={
                              shopDetails.shopLicense && shopDetails.shopLicense
                            }
                            onChange={(e) => setShopLicense(e.target.value)}
                          />
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
                            <option value={shopDetails.state}>
                              {shopDetails.state}
                            </option>
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
                            <option value={shopDetails.city}>
                              {shopDetails.city}
                            </option>
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
                            defaultValue={shopDetails.taluka}
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
                            defaultValue={shopDetails.address}
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
                            defaultValue={shopDetails.pincode}
                            onChange={(e) => setPincode(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-4">
                          <label>GST No.</label>
                          <input
                            type="text"
                            className="form-control"
                            name="gstno"
                            placeholder="GST NO"
                            defaultValue={
                              shopDetails.gstNo && shopDetails.gstNo
                            }
                            onChange={(e) => setGSTNo(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-5">
                          <label>Shop Logo</label>
                          <input
                            type="file"
                            className="form-control"
                            name="logoImage"
                            placeholder="Shop Logo"
                            onChange={(e) => setShopLogo(e.target.files[0])}
                          />
                        </div>
                        <div className="col-lg-3">
                          <Image
                            src={`https://krushimitr.in/upload/${
                              shopDetails.shopLogo && shopDetails.shopLogo
                            }`}
                            alt=""
                            width={"100%"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer py-1">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          updateShopData();
                        }}
                        data-bs-dismiss="modal"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="modal fade"
                id="kycModal"
                tabindex="-1"
                aria-labelledby="kycModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="kycModalLabel">
                        KYC Form
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      {panVerifyStatus === false ? (
                        <div className="row">
                          <div className="col-lg-12 col-12">
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
                          <div className="col-lg-12 col-12">
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
                          <div className="col-lg-12 col-12 text-center mt-3">
                            <button
                              type="button"
                              class="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button
                              className="btn btn-primary ms-2"
                              onClick={() => panVerify()}
                              data-bs-dismiss="modal"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
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

export default DistributorProfile;
