import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import loading from "../images/loading.gif";
import { Toast } from "primereact/toast";
const EnquiryForm = () => {
  const { userType } = useParams();
  const [isSet, setIsSet] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [distributor, setDistributor] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    let distributor_id = localStorage.getItem("distributor_id");
    const getProfile = async () => {
      let result = await fetch(
        "https://krushimitr.in/api/distributor/distributor-profile",
        {
          method: "post",
          body: JSON.stringify({ distributor_id }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let res = await result.json();
      if (res.status === 201) {
        setDistributor(res.distributor);
      } else {
        alert(res.message);
      }
    };
    getProfile();
    const getAllE = async () => {
      let abc = [];
      const all_users = await fetch(
        "https://krushimitr.in/api/distributors/all-enquiry-data"
      );
      const allEnquiry = await all_users.json();
      console.log(allEnquiry);
      if (allEnquiry.status === 201) {
        allEnquiry.result.map((item) => {
          if (distributor_id === item.dId) {
            abc.push(item);
          }
        });
        setAllData(abc);
      } else {
        console.log(allEnquiry.result);
      }
    };
    getAllE();
  }, []);

  const [loadings, setLoadings] = useState(false);
  const SendData = async () => {
    setLoadings(true);
    const resetPass = await fetch(
      "https:krushimitr.in/api/distributors/add-enquiry-data",
      {
        method: "post",
        body: JSON.stringify({
          dId: distributor._id,
          name: distributor.name,
          mobile: distributor.mobile,
          email: distributor.email,
          subject,
          message,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const ress = await resetPass.json();
    if (ress.status === 201) {
      setLoadings(false);
      setIsSet(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: ress.result,
        life: 3000,
      });
      navigate("/distributors");
    } else {
      setIsSet(false);
      toast.current.show({
        severity: "danger",
        summary: "Not Successful",
        detail: ress.result,
        life: 3000,
      });
    }
  };
  const DeleteData = async (id) => {
    const resetPass = await fetch(
      "https:krushimitr.in/api/distributors/delete-enquiry-data",
      {
        method: "post",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const ress = await resetPass.json();
    if (ress.status === 201) {
      setLoadings(false);
      setIsSet(false);
      alert(ress.result);
    } else {
      setIsSet(false);
      alert(ress.result);
    }
  };
  return (
    <div className="py-3">
      <Toast ref={toast} />
      <img
        src={loading}
        className={"loader " + (loadings ? "d-block" : "d-none")}
        alt=""
      />
      <div className="px-3">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="text-uppercase">All Enquiries</h2>
          </div>
          <div className="col-lg-4">
            <button
              type="button"
              className="btn btn-primary float-end"
              data-bs-toggle="modal"
              onClick={() => setIsSet(true)}
              data-bs-target="#exampleModal"
            >
              Add Enquiry
            </button>
          </div>
        </div>
        <hr />
        <div className="overflow-auto table-responsive">
          <table className="table table-bordered w-100">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allData &&
                allData.map((item) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.subject}</td>
                    <td>{item.message}</td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => DeleteData(item._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div
          className={`modal fade ${isSet ? "show" : ""} `}
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header bg-secondary py-2">
                <h1
                  className="modal-title fs-5 text-white"
                  id="exampleModalLabel"
                >
                  Enquiry Form
                </h1>
                <button
                  type="button"
                  className="btn-close text-white pt-4"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body p-3">
                <div className="row">
                  <div className="col-lg-12 m-auto">
                    <div className="card-body pt-0 p-4">
                      <div className="row">
                        <div className="col-lg-12">
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Name"
                            defaultValue={distributor.name}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-6">
                          <label htmlFor="name" className="form-label">
                            Mobile Number
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="mobile"
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter Mobile Number"
                            defaultValue={distributor.mobile}
                          />
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            defaultValue={distributor.email}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <label htmlFor="sub">Subject</label>
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter Subject"
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <label htmlFor="name">Message / Query</label>
                          <textarea
                            type="text"
                            className="form-control"
                            id="message"
                            rows={5}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter Message / Query"
                          ></textarea>
                        </div>
                      </div>
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
                    className="btn btn-primary"
                    onClick={() => SendData()}
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
  );
};
export default EnquiryForm;
