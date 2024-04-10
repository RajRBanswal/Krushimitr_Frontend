import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";

function AllApplicationForm() {
  const [time, setTime] = useState(false);
  const deleteApplication = async (id) => {
    let resultDel = await fetch(
      "https://krushimitr.in/api/admin/delete-application-form",
      {
        method: "post",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((resultDel) => resultDel.json());
    if (resultDel.status === 201) {
      alert(resultDel.result);
      setTime(true);
    } else {
      alert(resultDel.result);
    }
  };

  const [globalFilter, setGlobalFilter] = useState(null);
  const [allData, setAllData] = useState([]);
  useEffect(() => {
    const getAllApplication = async () => {
      const result = await fetch(
        "https://krushimitr.in/api/admin/all-application-form"
      ).then((result) => result.json());
      setAllData(result.AddShopForm);
    };
    getAllApplication();
  }, [time]);

  const reasonRef = useRef(null);
  const [rejectApplication, setRejectApplication] = useState(false);
  const [reason, setReason] = useState("");
  const getStatusChange = async (id, value) => {
    if (value === "Rejected" && reason === "") {
      return reasonRef.current.focus();
    } else {
      const result = await fetch(
        "https://krushimitr.in/api/admin/change_status_application-form",
        {
          method: "post",
          body: JSON.stringify({
            id: id,
            reason: reason ? reason : "",
            type: value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await result.json();
      if (res.status === 201) {
        alert(res.result);
        window.location.reload();
      } else {
        alert(res.result);
      }
    }
  };

  const filterApplyTemplate = (options) => {
    return (
      <>
        <button
          type="button"
          className="btn btn-primary btn-sm me-1"
          data-bs-toggle="modal"
          data-bs-target={`#editModal`}
        >
          <i className="fas fa-eye"></i>
        </button>
      </>
    );
  };

  const [date1, setDate1] = useState(null);
  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-8 d-flex">
          <h4 className="m-0">All Application Form</h4>
        </div>
        <div className="col-lg-4">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="form-control ps-5"
            />
          </span>
        </div>
      </div>
    </div>
  );
  const showDateWiseData = (date2) => {
    if (date2 !== "" && date1 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let pDatas = [];
      let aDatas = [];
      let rDatas = [];
      allData.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          pDatas.push(item);
        }
      });
    } else {
      setDate1("");
      return;
    }
  };
  const images = (rowData) => {
    return (
      <img
        src={`https://krushimitr.in/upload/${rowData.license_image}`}
        width={100}
        alt=""
      />
    );
  };

  return (
    <>
      <div className="card px-3">
        <DataTable
          value={allData}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
          globalFilter={globalFilter}
          header={headerComplete}
        >
          <Column field="store_type" header="Store Type" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="mobile" header="Mobile" sortable></Column>
          <Column
            field="type_of_license"
            header="Type of License"
            sortable
          ></Column>
          <Column field="status" header="Status" sortable></Column>
          <Column
            field={images}
            header="License Image"
            body={images}
            sortable
          ></Column>
          <Column
            header="Action"
            body={filterApplyTemplate}
            severity="success"
          ></Column>
        </DataTable>
        {/* <div
                    className="modal fade"
                    id={`editModal` + item._id}
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header py-2">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            All Details
                          </h1>
                          <button
                            type="button"
                            className="btn-close text-white pt-4"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body p-4 applicationDetails">
                          <table className="table w-100 table-borderless">
                            <tr>
                              <td className="fw-bold text-end">Status :</td>
                              <td>
                                {item.status === "Accepted" ? (
                                  <span className="text-success">
                                    {item.status}
                                  </span>
                                ) : (
                                  <span className="text-danger">
                                    {item.status}
                                  </span>
                                )}
                              </td>
                              <td className="fw-bold text-end">Reason :</td>
                              <td>{item.reason}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">Store Type :</td>
                              <td>{item.store_type}</td>
                              <td className="fw-bold text-end">Name :</td>
                              <td>{item.name}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">Mobile No. :</td>
                              <td>{item.mobile}</td>

                              <td className="fw-bold text-end">Email :</td>
                              <td>{item.email}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">Address :</td>
                              <td colSpan={3}>
                                {item.address +
                                  ", " +
                                  item.post +
                                  ", " +
                                  item.taluka +
                                  ", " +
                                  item.dist +
                                  ", " +
                                  item.pin_code}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} className="fw-bold">
                                <h4 className="mb-0">Shop & Other Details</h4>
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">
                                License Type :
                              </td>
                              <td>{item.type_of_license}</td>
                              <td className="fw-bold text-end">GST No :</td>
                              <td>{item.GST_no}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">
                                Shop Address :
                              </td>
                              <td colSpan={3}>
                                {item.shop_address +
                                  ", " +
                                  item.shop_post +
                                  ", " +
                                  item.shop_taluka +
                                  ", " +
                                  item.shop_dist +
                                  ", " +
                                  item.shop_pin_code}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">Shop Size :</td>
                              <td>{item.shop_size}</td>
                              <td className="fw-bold text-end">Dealership :</td>
                              <td>{item.dealership}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">
                                Laptop / Computer :
                              </td>
                              <td>{item.laptop_computer}</td>
                              <td className="fw-bold text-end">Printer :</td>
                              <td>{item.printer}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">Investment :</td>
                              <td>{item.investment}</td>
                              <td className="fw-bold text-end">CIN No. :</td>
                              <td>{item.CINNo}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold text-end">
                                Company Name :
                              </td>
                              <td>{item.CompanyName}</td>
                              <td className="fw-bold text-end">
                                Director Name :
                              </td>
                              <td>{item.DirectorName}</td>
                            </tr>
                            <tr>
                              <td colSpan={4} className="fw-bold text-center  ">
                                {item.license_image === undefined ||
                                item.license_image === "" ||
                                item.license_image === null ? (
                                  ""
                                ) : (
                                  <img
                                    src={`https://krushimitr.in/upload/${item.license_image}`}
                                    width={100}
                                    height={100}
                                    alt=""
                                  />
                                )}
                              </td>
                            </tr>
                          </table>
                          <div className="row">
                            <div className="col-lg-6 m-auto text-center">
                              {item.status === undefined ||
                              item.status === "" ||
                              item.status === null ? (
                                <>
                                  <button
                                    className="btn btn-success me-1"
                                    onClick={() => {
                                      getStatusChange(item._id, "Accepted");
                                      setRejectApplication(false);
                                    }}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-danger ms-1"
                                    onClick={() => {
                                      setRejectApplication(true);
                                    }}
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : item.status === "Rejected" ? (
                                <button
                                  className="btn btn-success me-1"
                                  onClick={() => {
                                    getStatusChange(item._id, "Accepted");
                                    setRejectApplication(false);
                                  }}
                                >
                                  Accept
                                </button>
                              ) : (
                                <button
                                  className="btn btn-danger ms-1"
                                  onClick={() => {
                                    setRejectApplication(true);
                                  }}
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                            {rejectApplication === true ? (
                              <>
                                <div className="col-lg-8 col-9">
                                  <label>Reason</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Reject Reason"
                                    onChange={(e) => setReason(e.target.value)}
                                  />
                                </div>
                                <div className="col-lg-4 col-3">
                                  <button
                                    className="btn btn-primary mt-4"
                                    onClick={() =>
                                      getStatusChange(item._id, "Rejected")
                                    }
                                  >
                                    Submit
                                  </button>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
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
                        </div>
                      </div>
                    </div>
                  </div> */}
      </div>
    </>
  );
}

export default AllApplicationForm;
