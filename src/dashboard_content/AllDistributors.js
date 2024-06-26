import moment from "moment";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { City, State } from "country-state-city";
import { Dialog } from "primereact/dialog";
import CryptoJS from "crypto-js";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
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
  const [visible, setVisible] = useState(false);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    email: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    mobile: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },

    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const StoreData = async (e) => {
    e.preventDefault();
    setLoadings(true);
    if (!name || !mobile || !password || !address) {
      alert("Please fill out all required fields.");
    }

    try {
      const formData = new FormData();
      formData.append("type", type);
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
        "https://krushimitr.in/api/distributor/distributor-register",
        {
          method: "post",
          body: formData,
        }
      ).then((result) => result.json());

      if (result.status === 201) {
        setLoadings(false);
        alert(result.result);
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

  const [activeDistributor, setActiveDistributor] = useState([]);
  const [deactiveDistributor, setDeactiveDistributor] = useState([]);
  const [pendingDistributor, setPendingVendor] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllDistributor = async () => {
    let aDistributor = [];
    let dDistributor = [];
    let pendingDist = [];
    const all_users = await fetch(
      "https://krushimitr.in/api/admin/distributor-vendor"
    );
    const result = await all_users.json();
    if (result.status === 201) {
      result.distributor.map((item) => {
        if (item.type === "Distributor" && item.status === "Active") {
          aDistributor.push(item);
        } else if (item.type === "Distributor" && item.status === "Deactive") {
          dDistributor.push(item);
        } else if (item.type === "Distributor" && item.status === "Pending") {
          pendingDist.push(item);
        }
      });

      setActiveDistributor(aDistributor);
      setDeactiveDistributor(dDistributor);
      setPendingVendor(pendingDist);
    } else {
      alert(result.message);
    }
  };
  useEffect(() => {
    getAllDistributor();
  }, [getAllDistributor]);
  const getAddressData = (rowData) => {
    return (
      <p className="mb-0" style={{ fontSize: "14px" }}>
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

  const [userData, setUserData] = useState([]);
  const filterApplyTemplate = (rowData) => {
    return (
      <div>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => {
            setVisible(true);
            setUserData(rowData);
          }}
        >
          <i className="fa fa-eye"></i>View
        </button>
      </div>
    );
  };

  const hideDialog = () => {
    setVisible(false);
  };
  const changeStatus = async (status, Ids) => {
    const vendorStatus = await fetch(
      "https://krushimitr.in/api/distributor/vendor-status",
      {
        method: "post",
        body: JSON.stringify({ status: status, vendorId: Ids }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await vendorStatus.json();
    if (result.status === 201) {
      alert(result.result);
      hideDialog();
    } else {
      alert(result.message);
    }
  };
  const vendorDialogFooter = (
    <React.Fragment>
      <Button label="Close" icon="pi pi-times" outlined onClick={hideDialog} />
    </React.Fragment>
  );

  const [passwordShow, setPasswordShow] = useState(false);

  const showPassword = (id) => {
    if (passwordShow === false) {
      setPasswordShow(true);
    } else {
      setPasswordShow(false);
    }
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <>
      <div className="card p-3 adminPanelCode">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="pills-Pending-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-Pending"
              type="button"
              role="tab"
              aria-controls="pills-Pending"
              aria-selected="true"
            >
              Pending Distributor
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Active Distributor
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link "
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Deactive Distributor
            </button>
          </li>
        </ul>
        <div className="row">
          <div className="col-lg-6"></div>
          <div className="col-lg-4">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Keyword Search"
              />
            </span>
          </div>
          <div className="col-lg-2">
            <button
              type="button"
              className="btn btn-primary float-end btn-sm position-absolute"
              style={{ right: 20, top: 10 }}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Add Distributor
            </button>
          </div>
        </div>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-Pending"
            role="tabpanel"
            aria-labelledby="pills-Pending-tab"
          >
            <div className="table-responsive" style={{ overflow: "auto" }}>
              <DataTable
                value={pendingDistributor}
                sortMode="multiple"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                tableStyle={{ minWidth: "100%" }}
                globalFilter={globalFilter}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={["name", "email", "mobile", "status"]}
              >
                <Column
                  field="#"
                  header="Sr. No."
                  bodyStyle={{
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  body={(data, options) => options.rowIndex + 1}
                ></Column>
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
                <Column field="status" header="Status" sortable></Column>
                <Column
                  header="Action"
                  field="_id"
                  body={filterApplyTemplate}
                ></Column>
              </DataTable>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div className="table-responsive" style={{ overflow: "auto" }}>
              <DataTable
                value={activeDistributor}
                sortMode="multiple"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                tableStyle={{ minWidth: "100%" }}
                globalFilter={globalFilter}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={["name", "email", "mobile", "status"]}
              >
                <Column
                  field="#"
                  header="Sr. No."
                  bodyStyle={{
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  body={(data, options) => options.rowIndex + 1}
                ></Column>
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
                <Column field="status" header="Status" sortable></Column>
                <Column
                  header="Action"
                  field="_id"
                  body={filterApplyTemplate}
                ></Column>
              </DataTable>
            </div>
          </div>
          <div
            class="tab-pane fade "
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <div className="table-responsive" style={{ overflow: "auto" }}>
              <DataTable
                value={deactiveDistributor}
                sortMode="multiple"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                tableStyle={{ minWidth: "100%" }}
                globalFilter={globalFilter}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={["name", "email", "mobile", "status"]}
              >
                <Column
                  field="#"
                  header="Sr. No."
                  bodyStyle={{
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  body={(data, options) => options.rowIndex + 1}
                ></Column>
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
                <Column field="status" header="Status" sortable></Column>
                <Column
                  header="Action"
                  field="_id"
                  body={filterApplyTemplate}
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
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
                    min={10}
                    max={10}
                    placeholder="Mobile Number"
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="col-lg-4 col-6">
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
              </div>
              <div className="row g-5">
                <div className="col-lg-3 col-6">
                  <label htmlFor="name" className="form-label">
                    City<span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-control"
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

      <Dialog
        visible={visible}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={vendorDialogFooter}
        onHide={hideDialog}
      >
        <div className="confirmation-content">
          <div className="row">
            <div className="col-lg-12">
              <h4 className="mb-2 underline">
                <b>Vendor Details </b>
              </h4>
            </div>
            <div className="row">
              <div className="col-lg-9 py-3">
                <p className="mb-1">
                  <b>Name : </b>
                  {userData && userData.name}
                </p>

                <p className="mb-1">
                  <b>Mobile : </b>
                  {userData && userData.mobile}
                </p>

                <p className="mb-1">
                  <b>Address : </b>
                  {userData &&
                    userData.address +
                      ", " +
                      userData.city +
                      ", " +
                      userData.pincode}
                </p>
                <p className="mb-1">
                  <b>Email : </b>
                  {userData && userData.email}
                </p>
                <p className="mb-1">
                  <b>Password : </b>
                  {passwordShow === true ? (
                    userData === undefined ||
                    userData === "" ||
                    userData === null ? (
                      <span>No Password Found</span>
                    ) : (
                      userData.stringPassword
                    )
                  ) : (
                    "**********"
                  )}{" "}
                  {"   "}
                  {passwordShow === true ? (
                    <i className="fa fa-eye" onClick={() => showPassword()}></i>
                  ) : (
                    <i
                      className="fa fa-eye-slash"
                      onClick={() => showPassword()}
                    ></i>
                  )}
                </p>
              </div>
              <div className="col-lg-3">
                <img
                  src={`https://krushimitr.in/upload/${
                    userData && userData.profile_image
                  }`}
                  width={"100%"}
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <h4 className="my-2 underline">
                <b>Shop Details </b>
              </h4>
            </div>

            <div className="col-lg-6">
              <p className="mb-1">
                <b>Shop Name : </b>
                {userData && userData.shopName}
              </p>
            </div>
            <div className="col-lg-6 ">
              <p className="mb-1">
                <b>Shop Mobile : </b>
                {userData && userData.shopMobile}
              </p>
            </div>
            <div className="col-lg-6 ">
              <p className="mb-1">
                <b>Shop Mail : </b>
                {userData && userData.shopEmail}
              </p>
            </div>
            <div className="col-lg-6">
              <p className="mb-1">
                <b>Shop License : </b>
                {userData && userData.shopLicense}
              </p>
            </div>
            <div className="col-lg-6 ">
              <p className="mb-1">
                <b>GST No : </b>
                {userData && userData.gstNo}
              </p>
            </div>
            <div className="col-lg-6 ">
              {userData && userData.status === "Active" ? (
                <p className="mb-1 text-success">
                  <b>Status : </b>
                  {userData.status}
                </p>
              ) : userData.status === "Deactive" ? (
                <p className="mb-1 text-danger">
                  <b>Status : </b>
                  {userData.status}
                </p>
              ) : (
                <p className="mb-1 text-info">
                  <b>Status : </b>
                  {userData.status}
                </p>
              )}
            </div>
            <div className="col-lg-12 ">
              <p className="mb-1">
                <b>Shop Address : </b>
                {userData &&
                  userData.address +
                    ", " +
                    userData.city +
                    ", " +
                    userData.pincode}
              </p>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 m-auto">
              {(userData && userData.status === "Pending") ||
              userData.status === "Deactive" ? (
                <button
                  className="btn btn-outline-success"
                  onClick={() =>
                    changeStatus("Active", userData && userData._id)
                  }
                >
                  <i className="fa fa-check"></i> Active
                </button>
              ) : (
                ""
              )}
              {(userData && userData.status === "Pending") ||
              userData.status === "Active" ? (
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={() =>
                    changeStatus("Deactive", userData && userData._id)
                  }
                >
                  <i className="fa fa-close"></i> Deactive
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default AllDistributors;
