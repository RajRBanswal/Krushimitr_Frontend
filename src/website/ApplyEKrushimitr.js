import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ApplyEKrushimitr({ navigation }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [StoreType, setStoreType] = useState("");
  const [OwnerAddress, setOwnerAddress] = useState("");
  const [OwnerTaluka, setOwnerTaluka] = useState("");
  const [OwnerDist, setOwnerDist] = useState("");
  const [OwnerPost, setOwnerPost] = useState("");
  const [OwnerPin, setOwnerPin] = useState("");
  const [ShopAddress, setShopAddress] = useState("");
  const [ShopTaluka, setShopTaluka] = useState("");
  const [ShopDist, setShopDist] = useState("");
  const [ShopPost, setShopPost] = useState("");
  const [ShopPin, setShopPin] = useState("");
  const [ShopSize, setShopSize] = useState("");
  const [GST, setGST] = useState("");
  const [TypeLicense, setTypeLicense] = useState("");
  const [LicenseImage, setLicenseImage] = useState("");
  const [Laptop, setLaptop] = useState("");
  const [Printer, setPrinter] = useState("");
  const [Dealership, setDealership] = useState("");
  const [Invest, setInvest] = useState("");

  const [CINNo, setCINNo] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [DirectorName, setDirectorName] = useState("");

  const ApplyEKrushimitrForm = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("StoreType", StoreType);
    formData.append("OwnerAddress", OwnerAddress);
    formData.append("OwnerTaluka", OwnerTaluka);
    formData.append("OwnerDist", OwnerDist);
    formData.append("OwnerPost", OwnerPost);
    formData.append("OwnerPin", OwnerPin);
    formData.append("ShopAddress", ShopAddress);
    formData.append("ShopTaluka", ShopTaluka);
    formData.append("ShopDist", ShopDist);
    formData.append("ShopPost", ShopPost);
    formData.append("ShopPin", ShopPin);
    formData.append("ShopSize", ShopSize);
    formData.append("GST", GST);
    formData.append("TypeLicense", TypeLicense);
    formData.append("LicenseImage", LicenseImage);
    formData.append("Laptop", Laptop);
    formData.append("Printer", Printer);
    formData.append("Dealership", Dealership);
    formData.append("Invest", Invest);
    formData.append("CINNo", CINNo);
    formData.append("CompanyName", CompanyName);
    formData.append("DirectorName", DirectorName);
    const result = await fetch(
      "https://krushimitr.in/api/apply_ekrushimitr_store",
      {
        method: "post",
        body: formData,
      }
    ).then((result) => result.json());
    if (result.status === 201) {
      alert(result.result);
      navigate("/");
    } else {
      alert(result.result);
    }
  };

  return (
    <>
      {/* <!-- Contact Start --> */}
      <div className="container-fluid py-5">
        <div className="container">
          <div
            className="mx-auto text-center mb-5"
            style={{ maxWidth: "500px" }}
          >
            {/* <h6 className="text-primary text-uppercase">Contact Us</h6> */}
            <h1 className="display-5">Apply E-Krushimitr Store</h1>
          </div>
          <div className="row g-0">
            <div className="col-lg-10 m-auto col-12">
              <div className="card py-4 px-3">
                <div className="row g-3">
                  <div className="col-lg-4 col-12">
                    <label>
                      Select Store Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      onChange={(e) => setStoreType(e.target.value)}
                      className="form-control form-select px-2"
                    >
                      <option value={""}>Select One </option>
                      <option value={"Individual"}>Individual </option>
                      <option value={"Krushi Seva Kendra"}>
                        Krushi Seva Kendra
                      </option>
                      <option value={"Electric Machinery Store "}>
                        Electric Machinery Store{" "}
                      </option>
                      <option value={"Electronic Shop"}>Electronic Shop</option>
                      <option value={"FPO"}>FPO</option>
                    </select>
                  </div>
                  <div className="col-lg-8 col-12">
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
                </div>
                <div className="row g-3">
                  <div className="col-lg-6 col-12">
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
                  <div className="col-lg-6 col-12">
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
                  <div className="col-lg-6 col-12">
                    <label>Owner Address</label>
                    <input
                      type="text"
                      onChange={(e) => setOwnerAddress(e.target.value)}
                      className="form-control px-2"
                      placeholder="Owner Address"
                    />
                  </div>
                  <div className="col-lg-3 col-6">
                    <label>Taluka</label>
                    <input
                      type="text"
                      onChange={(e) => setOwnerTaluka(e.target.value)}
                      className="form-control px-2"
                      placeholder="Taluka"
                    />
                  </div>
                  <div className="col-lg-3 col-6">
                    <label>Dist</label>
                    <input
                      type="text"
                      onChange={(e) => setOwnerDist(e.target.value)}
                      className="form-control px-2"
                      placeholder="District"
                    />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-lg-4 col-12">
                    <label>Post</label>
                    <input
                      type="text"
                      onChange={(e) => setOwnerPost(e.target.value)}
                      className="form-control px-2"
                      placeholder="Post"
                    />
                  </div>
                  <div className="col-lg-4 col-6">
                    <label>Pincode</label>
                    <input
                      type="text"
                      onChange={(e) => setOwnerPin(e.target.value)}
                      className="form-control px-2"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
                <hr />
                {StoreType !== "Individual" ? (
                  <>
                    <div className="row g-3">
                      <div className="col-lg-12 col-12 ">
                        <h4>Shop Details</h4>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-lg-6 col-12">
                        <label>
                          Shop Address <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setShopAddress(e.target.value)}
                          className="form-control px-2"
                          placeholder="Shop Address"
                        />
                      </div>
                      <div className="col-lg-3 col-6">
                        <label>
                          Taluka <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setShopTaluka(e.target.value)}
                          className="form-control px-2"
                          placeholder="Shop Taluka"
                        />
                      </div>
                      <div className="col-lg-3 col-6">
                        <label>
                          Dist <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setShopDist(e.target.value)}
                          className="form-control px-2"
                          placeholder="Shop District"
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-lg-4 col-12">
                        <label>Post</label>
                        <input
                          type="text"
                          onChange={(e) => setShopPost(e.target.value)}
                          className="form-control px-2"
                          placeholder="Shop Post"
                        />
                      </div>
                      <div className="col-lg-4 col-6">
                        <label>
                          Pincode <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setShopPin(e.target.value)}
                          className="form-control px-2"
                          placeholder="Shop Pincode"
                        />
                      </div>
                      <div className="col-lg-4 col-12">
                        <label>Shop Size</label>
                        <input
                          type="text"
                          onChange={(e) => setShopSize(e.target.value)}
                          className="form-control px-2"
                          placeholder="Shop Size"
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-lg-4 col-6">
                        <label>GST No. </label>
                        <input
                          type="text"
                          onChange={(e) => setGST(e.target.value)}
                          className="form-control px-2"
                          placeholder="GST NO"
                        />
                      </div>
                      <div className="col-lg-4 col-12">
                        <label>Type of License </label>
                        <select
                          onChange={(e) => setTypeLicense(e.target.value)}
                          className="form-control form-select px-2"
                        >
                          <option value={""}>Select One </option>
                          <option value={"Fertilizer"}>Fertilizer </option>
                          <option value={"Seeds"}>Seeds</option>
                          <option value={"Electronic"}>Electronic</option>
                          <option value={"Pesticide "}>Pesticide </option>
                        </select>
                      </div>
                      <div className="col-lg-4 col-12">
                        <label>License Image </label>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => setLicenseImage(e.target.files[0])}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-lg-3 col-12">
                        <label>Laptop / Computer </label>
                        <select
                          onChange={(e) => setLaptop(e.target.value)}
                          className="form-control form-select px-2"
                        >
                          <option value={""}>Select One </option>
                          <option value={"Yes"}>Yes </option>
                          <option value={"No"}>No</option>
                        </select>
                      </div>
                      <div className="col-lg-3 col-6">
                        <label>Printer </label>
                        <select
                          onChange={(e) => setPrinter(e.target.value)}
                          className="form-control form-select px-2"
                        >
                          <option value={""}>Select One </option>
                          <option value={"Yes"}>Yes </option>
                          <option value={"No"}>No</option>
                        </select>
                      </div>
                      <div className="col-lg-3 col-6">
                        <label>Dealership </label>
                        <input
                          type="text"
                          onChange={(e) => setDealership(e.target.value)}
                          placeholder="Dealership"
                          className="form-control"
                        />
                      </div>
                      <div className="col-lg-3 col-6">
                        <label>How much can you invest? </label>
                        <select
                          onChange={(e) => setInvest(e.target.value)}
                          className="form-control form-select px-2"
                        >
                          <option value={""}>Select One </option>
                          <option value={"5 TO 10 LAC"}>5 TO 10 LAC </option>
                          <option value={"10 TO 20 LAC "}>10 TO 20 LAC </option>
                          <option value={"20 TO 50 LAC "}>20 TO 50 LAC </option>
                          <option value={"50 TO 1 CR+"}>50 TO 1 CR+</option>
                        </select>
                      </div>
                    </div>
                    {StoreType === "FPO" ? (
                      <div className="row g-3 mb-3">
                        <div className="col-lg-4 col-12">
                          <label>CIN Number </label>
                          <input
                            type="text"
                            onChange={(e) => setCINNo(e.target.value)}
                            placeholder="CIN Number"
                            className="form-control"
                          />
                        </div>
                        <div className="col-lg-4 col-6">
                          <label>Company Name </label>
                          <input
                            type="text"
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Company Name"
                            className="form-control"
                          />
                        </div>
                        <div className="col-lg-4 col-6">
                          <label>Director Name </label>
                          <input
                            type="text"
                            onChange={(e) => setDirectorName(e.target.value)}
                            placeholder="Director Name"
                            className="form-control"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row g-3 mb-3"></div>
                    )}
                  </>
                ) : (
                  <div className="row g-3 mb-3">
                    <div className="col-lg-3 col-12">
                      <label>Laptop / Computer </label>
                      <select
                        onChange={(e) => setLaptop(e.target.value)}
                        className="form-control form-select px-2"
                      >
                        <option value={""}>Select One </option>
                        <option value={"Yes"}>Yes </option>
                        <option value={"No"}>No</option>
                      </select>
                    </div>
                    <div className="col-lg-3 col-6">
                      <label>Printer </label>
                      <select
                        onChange={(e) => setPrinter(e.target.value)}
                        className="form-control form-select px-2"
                      >
                        <option value={""}>Select One </option>
                        <option value={"Yes"}>Yes </option>
                        <option value={"No"}>No</option>
                      </select>
                    </div>
                    <div className="col-lg-3 col-6">
                      <label>Dealership </label>
                      <input
                        type="text"
                        onChange={(e) => setDealership(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-lg-3 col-6">
                      <label>How much can you invest? </label>
                      <select
                        onChange={(e) => setInvest(e.target.value)}
                        className="form-control form-select px-2"
                      >
                        <option value={""}>Select One </option>
                        <option value={"5 TO 10 LAC"}>5 TO 10 LAC </option>
                        <option value={"10 TO 20 LAC "}>10 TO 20 LAC </option>
                        <option value={"20 TO 50 LAC "}>20 TO 50 LAC </option>
                        <option value={"50 TO 1 CR+"}>50 TO 1 CR+</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="row mt-3">
                  <div className="col-4 col-lg-3 m-auto">
                    <button
                      className="btn btn-secondary w-100"
                      onClick={ApplyEKrushimitrForm}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Contact End --> */}
    </>
  );
}

export default ApplyEKrushimitr;
