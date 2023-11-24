import moment from "moment";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { City, State } from "country-state-city";

function AllDistributors() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [cityCode, setCityCode] = useState([]);
  const [type, setType] = useState([]);
  const [profileImage, setProfileImage] = useState([]);
  const navigate = useNavigate();
  const isFocused = useRef(null);
  const [userType, setUserType] = useState("");
  const [loadings, setLoadings] = useState(false);

  const StoreData = async (e) => {
    e.preventDefault();
    setLoadings(true);
    if (!name || !mobile || !password || !address) {
      alert("Please fill out all required fields.");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("state", state);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("pincode", pincode);
      if (profileImage) {
        formData.append("profile_image", profileImage);
      } else {
        formData.append("profile_image", "");
      }

      const result = await fetch(
        "https://krushimitr.in/distributor/distributor-register",
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
    } catch (error) {}
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

  const [distributor, setDistributor] = useState([]);
  const getAllDistributor = async () => {
    const all_users = await fetch("https://krushimitr.in/admin/distributor");
    const uu = await all_users.json();
    if (uu.status === 201) {
      setDistributor(uu.distributor);
    } else {
      alert(uu.message);
    }
  };
  useEffect(() => {
    getAllDistributor();
  }, []);
  const getAddressData = (rowData) => {
    return (
      <p className="mb-0" style={{fontSize:'14px'}}>
        {rowData.address}, {rowData.city}, {rowData.state} {rowData.pincode}
      </p>
    );
  };
  const getRegisterDate = (rowDatas) => {
    const dates = moment(rowDatas.createdAt).format("DD-MM-YYYY");
    return (
      <p className="mb-0" style={{ whiteSpace: "nowrap" }}>
        {dates}
      </p>
    );
  };

  const filterApplyTemplate = (options) => {
    return (
      <div className="row">
        {/* <div className="col-lg-4">
          <button
            type="button"
            icon="pi pi-pencil"
            onClick={() => alert(options.productName)}
            severity="primary"
            className="btn btn-sm btn-primary"
          >
            <i className="fa fa-edit"></i>
          </button>
        </div>
        <div className="col-lg-4">
          <button
            type="button"
            icon="pi pi-eye"
            // onClick={() => getOrderData(options._id)}
            severity="success"
            className="btn btn-info"
          >
            <i className="fa fa-eye"></i>
          </button>
        </div> */}
      </div>
    );
  };
  return (
    <>
      <div className="card p-3">
        <div className="row mb-2">
          <div className="col-lg-8">
            <h4 className="text-uppercase">All Distributors</h4>
          </div>
          <div className="col-lg-4">
            <button
              type="button"
              className="btn btn-primary float-end btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Add Distributor
            </button>
          </div>
        </div>
        <div className="table-responsive" style={{ overflow: "auto" }}>
          <DataTable
            value={distributor}
            sortMode="multiple"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "100%" }}
          >
            <Column field="name" header="Name" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="mobile" header="Mobile No." sortable></Column>
            <Column
              field="address"
              header="Address"
              sortable
              body={getAddressData}
            ></Column>
            <Column
              field=""
              header="Reg. Date"
              sortable
              body={getRegisterDate}
            ></Column>
            {/* <Column
              header="Action"
              field="_id"
              style={{ minWidth: "12rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column> */}
          </DataTable>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          data-bs-config={{ backdrop: true }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Distributor
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row g-5">
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
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row g-5">
                <div className="col-lg-4 col-6">
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
                  className="col-lg-4 col-6"
                  
                >
                  <label>
                    Type<span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Vendor">Vendor</option>
                  </select>
                </div>
                <div className="col-lg-4 col-6">
                  <label htmlFor="name" className="form-label">
                    State<span className="text-danger">*</span>
                  </label>
                  <select
                    class="form-select form-control"
                    onChange={onChangeHandler}
                  >
                    {State.getStatesOfCountry("IN").map((state) => (
                      <option id={state.isoCode} value={state.name}>
                        {state.name}{" "}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row g-5">
                <div className="col-lg-3 col-6">
                  <label htmlFor="name" className="form-label">
                    City<span className="text-danger">*</span>
                  </label>
                  <select
                    class="form-select form-control"
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {City.getCitiesOfState("IN", cityCode).map((city) => (
                      <option value={city.name}> {city.name} </option>
                    ))}
                  </select>
                </div>
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
                <div className="col-lg-3 col-6">
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
              <div className="row g-5">
                <div className="col-lg-6 col-6">
                  <label>
                    Password<span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="address"
                    placeholder="Password"
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllDistributors;
