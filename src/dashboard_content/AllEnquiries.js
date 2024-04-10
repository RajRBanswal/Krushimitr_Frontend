import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import loading from "../images/loading.gif";
import { Toast } from "primereact/toast";
const AllEnquiries = () => {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [allData, setAllData] = useState([]);

  const getAllE = async () => {
    let abc = [];
    const all_users = await fetch(
      "https://krushimitr.in/api/distributors/all-enquiry-data"
    );
    const allEnquiry = await all_users.json();
    if (allEnquiry.status === 201) {
      setAllData(allEnquiry.result);
    } else {
      console.log(allEnquiry.result);
    }
  };
  useEffect(() => {
    getAllE();
  }, []);

  const [loadings, setLoadings] = useState(false);
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
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: ress.result,
        life: 3000,
      });
      navigate("/distributors");
    } else {
      toast.current.show({
        severity: "danger",
        summary: "Not Successful",
        detail: ress.result,
        life: 3000,
      });
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
      </div>
    </div>
  );
};

export default AllEnquiries;
