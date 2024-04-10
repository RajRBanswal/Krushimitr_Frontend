import { Image } from "primereact/image";
import React, { useEffect, useState } from "react";
import { City, State } from "country-state-city";
const UserProfile = () => {
  const userId = localStorage.getItem("user_id");
  const [userData, setUserData] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [cityCode, setCityCode] = useState([]);
  const [taluka, setTaluka] = useState("");
  const [image, setImage] = useState("");
  const [PAN, setPAN] = useState("");
  const [PANName, setPANName] = useState("");
  const [modal, setModal] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserProfile = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/users/user-profile",
      {
        method: "post",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.user_data) {
      setUserData(data.user_data);
    } else {
      setUserData("");
    }
  };

//   console.log(userData);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const uodateUserData = async () => {
    let talukas = taluka.charAt(0).toUpperCase() + taluka.slice(1);
    let formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", name ? name : "");
    formData.append("mobile", mobile ? mobile : "");
    formData.append("email", email ? email : "");
    formData.append("state", state ? state : "");
    formData.append("city", city ? city : "");
    formData.append("taluka", talukas ? talukas : "");
    formData.append("address", address ? address : "");
    formData.append("pincode", pincode ? pincode : "");
    formData.append("profile_image", image ? image : "");

    let response = await fetch("https://krushimitr.in/api/users/update-users", {
      method: "post",
      body: formData,
    });
    let res = await response.json();
    console.log(res);
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
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#edirUsers"
                >
                  <i className="fa fa-edit"></i>
                </button>
              </div>
              <table className="table table-borderless w-100">
                <tbody>
                  <tr>
                    <td>
                      <b>Name :</b> {userData.name}
                    </td>
                    <td>
                      <b>Mobile :</b> {userData.mobile}
                    </td>
                    <td rowSpan={3}>
                      <Image
                        src={`https://krushimitr.in/upload/${userData.profile_image}`}
                        alt=""
                        width={150}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <b>Email :</b> {userData.email}
                    </td>
                    <td>
                      <b>Address :</b> {userData.address}, {userData.taluka}, 
                      {userData.city}, {userData.state}, {userData.pincode}.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>KYC Status :</b>{" "}
                      {userData.kycstatus === undefined ||
                      userData.kycstatus === "" ||
                      userData.kycstatus === null ? (
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
                        userData.kycstatus
                      )}
                    </td>
                    <td>
                      <b>PAN No. :</b>{" "}
                      {userData.pan === undefined ||
                      userData.pan === "" ||
                      userData.pan === null
                        ? ""
                        : userData.kycstatus}
                    </td>
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
              <div
                className="modal fade"
                id="edirUsers"
                tabindex="-1"
                aria-labelledby="edirUsersLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header py-2">
                      <h5 className="modal-title mb-0" id="edirUsersLabel">
                        Edit User Details
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
                            name="Name"
                            placeholder="Name"
                            defaultValue={userData.name && userData.name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            className="form-control"
                            name="shopmobile"
                            placeholder="Shop Mobile"
                            defaultValue={userData.mobile && userData.mobile}
                            onChange={(e) => setMobile(e.target.value)}
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
                            defaultValue={userData.email && userData.email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            <option value={userData.state}>
                              {userData.state}
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
                            <option value={userData.city}>
                              {userData.city}
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
                            defaultValue={userData.taluka}
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
                            defaultValue={userData.address}
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
                            defaultValue={userData.pincode}
                            onChange={(e) => setPincode(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-5">
                          <label>Profile Image</label>
                          <input
                            type="file"
                            className="form-control"
                            name="Image"
                            placeholder="Image"
                            onChange={(e) => setImage(e.target.files[0])}
                          />
                        </div>
                        <div className="col-lg-3">
                          <Image
                            src={`https://krushimitr.in/upload/${
                              userData.image && userData.image
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
                          uodateUserData();
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
};

export default UserProfile;
