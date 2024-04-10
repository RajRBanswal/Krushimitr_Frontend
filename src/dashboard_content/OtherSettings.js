import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import loading from "../images/loading.gif";
import { Toast } from "primereact/toast";
const OtherSettings = () => {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [allData, setAllData] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllE = async () => {
    const all_cod = await fetch(
      "https://krushimitr.in/api/admin/all-cod-settings"
    );
    const AllCODData = await all_cod.json();
    if (AllCODData.status === 201) {
      setAllData(AllCODData.result);
    } else {
      console.log(AllCODData.result);
    }
  };
  useEffect(() => {
    getAllE();
  }, [getAllE]);

  const DeleteData = async (id) => {
    const resetPass = await fetch(
      "https:krushimitr.in/api/admin/delete-cod-settings",
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
  const changeStatus = async (value, mm) => {
    alert(value);
    const resetPass = await fetch(
      "https:krushimitr.in/api/admin/update-cod-settings",
      {
        method: "post",
        body: JSON.stringify({
          id: mm,
          status: value,
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
    } else {
      toast.current.show({
        severity: "danger",
        summary: "Not Successful",
        detail: ress.result,
        life: 3000,
      });
    }
  };

  const [loadings, setLoadings] = useState(false);
  return (
    <div className="py-3">
      <Toast ref={toast} />
      <img
        src={loading}
        className={"loader " + (loadings ? "d-block" : "d-none")}
        alt=""
      />
      <div className="px-3">
        <div className="overflow-auto table-responsive">
          <table className="table table-bordered w-100">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allData &&
                allData.map((item) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>
                      {item.status}
                      <select
                        className="form-control form-select"
                        onChange={(e) => {
                          changeStatus(e.target.value, item._id);
                        }}
                      >
                        <option value={""} selected>Change Status</option>
                        <option value={"Yes"}>Yes</option>
                        <option value={"No"}>No</option>
                      </select>
                    </td>
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
export default OtherSettings;
