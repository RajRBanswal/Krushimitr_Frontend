import React, { useEffect, useState } from "react";

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
  return (
    <>
      <div className="card p-3">
        <div className="row">
          <div className="col-lg-8">
            <h4 className="text-uppercase">All Application Form</h4>
          </div>
          <div className="col-lg-4">
            {/* <button type="button" className='btn btn-primary float-end' data-bs-toggle="modal" onClick={() => setIsSet(true)} data-bs-target="#exampleModal">Add NEWS</button> */}
          </div>
        </div>
        <hr />

        <div className="table-responsive" style={{ overflow: "auto" }}>
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">Store Type</th>
                <th scope="col">Name</th>
                <th scope="col">Mobile</th>
                <th scope="col">Email</th>
                <th scope="col">Type of License</th>
                <th scope="col">License Image</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {allData.map((item) => (
                <tr key={item._id}>
                  <td>{item.store_type}</td>
                  <td>{item.name}</td>
                  <td>{item.mobile}</td>
                  <td>{item.email}</td>
                  <td>{item.type_of_license}</td>
                  <td>
                    <img
                      src={`https://krushimitr.in/upload/${item.license_image}`}
                      width={"100px"}
                      alt={item.license_image}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-1"
                      data-bs-toggle="modal"
                      data-bs-target={`#editModal` + item._id}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => deleteApplication(item._id)}
                      className="btn btn-danger btn-sm me-1"
                    >
                      <i className="fas fa-trash"></i>
                    </button> */}
                  </td>
                  <div
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
                                <img
                                  src={`https://krushimitr.in/upload/${item.license_image}`}
                                  width={100}
                                  height={100}
                                  alt=""
                                />
                              </td>
                            </tr>
                          </table>
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
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AllApplicationForm;
