import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";
function AllTransaction() {
  const [successData, setSuccessData] = useState([]);
  const [failureData, setFailureData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  let success = [];
  let failure = [];
  const [filterData, setFilterData] = useState([]);
  const [failureFilterData, setFailureFilterData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTransactionData = async () => {
    let all_transaction = await fetch(
      "https://krushimitr.in/api/admin/all-payment-transaction"
    );
    const allTransaction = await all_transaction.json();
    if (allTransaction.status === 201) {
      allTransaction.result.map((item) => {
        if (
          item.status === "Success" &&
          item.message !== "No Transaction found with the given details."
        ) {
          success.push(item);
        } else if (
          item.status === "Failed" &&
          item.message !== "No Transaction found with the given details."
        ) {
          failure.push(item);
        }
      });
      setFilterData(success);
      setSuccessData(success);
      setFailureFilterData(failure);
      setFailureData(failure);
    } else {
      alert(allTransaction.result);
    }
  };

  useEffect(() => {
    getTransactionData();
    setIsLoading(false);
  }, [getTransactionData, isLoading]);

  const filterApplyTemplate = (options) => {
    console.log(options);
    let paymentInstrument = "";
    if (options.paymentInstrument == "" || options.paymentInstrument == null) {
      paymentInstrument = "";
    } else {
      paymentInstrument = JSON.parse(options.paymentInstrument);
    }
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-primary w-100 btn-sm"
          data-bs-toggle="modal"
          data-bs-target={"#exampleModal" + options._id}
        >
          <i className="pi pi-eye"></i>
        </button>
        <div
          className="modal fade "
          id={"exampleModal" + options._id}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content ">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Order Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body orderData">
                <div className="row">
                  <div className="col-lg-6">
                    <p className="mb-0">Order No. : {options.orderNo}</p>
                  </div>
                  <div className="col-lg-6">
                    <p className="mb-0">Name. : {options.user_name}</p>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-lg-6">
                    <p className="mb-0">Mobile No. : {options.user_mobile}</p>
                  </div>
                  <div className="col-lg-6">
                    {options.status === "Success" ? (
                      <p className="mb-0 text-success">
                        Status. : {options.status}
                      </p>
                    ) : (
                      <p className="mb-0 text-danger">
                        Status. : {options.status}
                      </p>
                    )}
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-lg-12">
                    <p className="mb-0">Message. : {options.message}</p>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-lg-12">
                    <h5 className="my-2 underline">Payment Details</h5>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-lg-6">
                    <p className="mb-0">
                      Type : {paymentInstrument && paymentInstrument.type}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p className="mb-0">
                      Account Type :{" "}
                      {paymentInstrument && paymentInstrument.accountType}
                    </p>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-lg-6">
                    <p className="mb-0">
                      Card Network :{" "}
                      {paymentInstrument && paymentInstrument.cardNetwork}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p className="mb-0">
                      UTR : {paymentInstrument && paymentInstrument.utr}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const exportCSVS = () => {
    orderCmplt.current.exportCSV();
  };

  const rightToolbarTemplateCompleted = () => {
    return (
      <>
        <button
          //   label="Excel"
          //   icon="pi pi-file-excel"
          className="btn btn-outline-primary btn-sm"
          onClick={exportCSVS}
        >
          <i className="pi pi-file-excel"></i>{" "}
        </button>
        <button
          //   label="Pdf"
          //   icon="pi pi-file-pdf"
          className="ms-1 btn btn-outline-danger btn-sm"
          onClick={exportPdf}
        >
          <i className="pi pi-file-pdf"></i>{" "}
        </button>
      </>
    );
  };

  const cols = [
    { field: "orderNumber", header: "Order No." },
    { field: "userName", header: "Name" },
    { field: "orderDate", header: "Date" },
    { field: "finalAmount", header: "Amount" },
    { field: "paymentStatus", header: "Pay Status" },
    { field: "paymentMethod", header: "Pay Method" },
    { field: "shippingAddress", header: "Shipping Address" },
    { field: "distName", header: "Distributor Name" },
    { field: "distAddress", header: "Distributor Address" },
    { field: "orderStatus", header: "Order Status" },
    { field: "deliveryStatus", header: "Delivery Status" },
    { field: "deliveryDate", header: "Delivery Date" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, successData);
        doc.save("users.pdf");
      });
    });
  };

  const [date1, setDate1] = useState(null);
  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4">
          <h4 className="m-0">Report</h4>
        </div>
        <div className="col-lg-3">
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
        <div className="col-lg-3 ">
          <div className="row">
            <div className="col-lg-6">
              <Calendar
                value={date1}
                onChange={(e) => setDate1(e.value)}
                dateFormat="dd-mm-yy"
                placeholder="From Date"
              />
            </div>
            <div className="col-lg-6">
              <Calendar
                onChange={(e) => {
                  showDateWiseData(e.value);
                }}
                dateFormat="dd-mm-yy"
                placeholder="To Date"
              />
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <Toolbar
            className="p-0 border-0"
            right={rightToolbarTemplateCompleted}
          ></Toolbar>
        </div>
      </div>
    </div>
  );
  const showDateWiseData = (date2) => {
    let newDate1 = new Date(date1);
    let newDate2 = new Date(date2);
    let Datas = [];
    // console.log(newDate1);
    successData.map((item) => {
      let newDate3 = moment(item.orderDate, "DD-MM-YYYY");
      let newDate4 = new Date(newDate3._d);

      if (newDate4 >= newDate1 && newDate4 <= newDate2) {
        Datas.push(item);
      }
    });
    setFilterData(Datas);
  };
  const dateFormat = (rowData) => {
    return <p>{moment(rowData.createdAt).format("DD-MM-YYYY")}</p>;
  };

  return (
    <div className="p-3">
      <Toast ref={toast} />

      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            Successful Transactions
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Failed Transactions
          </button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <div className="card px-3 UserCardReports">
            <DataTable
              ref={orderCmplt}
              value={filterData}
              selection={selectedUsers}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
              globalFilter={globalFilter}
              header={headerComplete}
            >
              <Column
                field="orderNo"
                header="Type"
                bodyStyle={{ color: "green", fontSize: 12, fontWeight: "bold" }}
              ></Column>
              <Column
                field="createdAt"
                body={dateFormat}
                header="Date"
                sortable
              ></Column>
              <Column field="user_name" header="Name"></Column>
              <Column field="user_mobile" header="Mobile"></Column>
              <Column field="message" header="Message" sortable></Column>
              <Column
                field="status"
                header="Status"
                sortable
                bodyStyle={{ color: "green" }}
              ></Column>
              <Column
                header="Action"
                style={{ minWidth: "4rem" }}
                body={filterApplyTemplate}
                severity="success"
              ></Column>
            </DataTable>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <div className="card px-3 UserCardReports">
            <DataTable
              ref={orderCmplt}
              value={failureFilterData}
              selection={selectedUsers}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
              globalFilter={globalFilter}
              header={headerComplete}
            >
              <Column
                field="createdAt"
                header="Date"
                body={dateFormat}
                sortable
              ></Column>
              <Column field="user_name" header="Name"></Column>
              <Column field="user_mobile" header="Mobile"></Column>
              <Column field="message" header="Message" sortable></Column>
              <Column
                field="status"
                header="Status"
                sortable
                bodyStyle={{ color: "green" }}
              ></Column>
              <Column
                header="Action"
                style={{ minWidth: "4rem" }}
                body={filterApplyTemplate}
                severity="success"
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>

      {/* <div
        className="modal fade "
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Order Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body orderData">
              {singleData &&
                singleData.map((item) => {
                  let orderSize = JSON.parse(item.itemsData);
                  return (
                    <table className="table table-stripped table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Name : </td>
                          <td>{item.userName}</td>
                          <td className="fw-bold text-nowrap">
                            Total Amount :{" "}
                          </td>
                          <td>{item.orderDate}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-nowrap">
                            Payment Status :
                          </td>
                          <td>{item.paymentStatus}</td>
                          <td className="fw-bold text-nowrap">
                            Shipping Address :
                          </td>
                          <td>{item.shippingAddress}</td>
                        </tr>
                        <tr>
                          <td colSpan={4}>
                            <h5>Products Details</h5>
                          </td>
                        </tr>

                        {orderSize &&
                          orderSize.map((item, index) => {
                            return (
                              <>
                                <tr>
                                  <td className="fw-bold text-nowrap">
                                    Product{" "}
                                    <span className="text-primary">
                                      {index + 1}
                                    </span>{" "}
                                    :
                                  </td>
                                  <td colSpan={2}>{item.productName}</td>
                                  <td className="fw-bold text-nowrap">
                                    {" "}
                                    Quantity : {item.quantity}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold text-nowrap">Price</td>
                                  <td>{item.price * item.quantity}</td>
                                  <td className="fw-bold text-nowrap">Size</td>
                                  <td>
                                    {item.size} {item.unit ? item.unit : ""}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        <tr>
                          <td className="text-danger fw-bold">Total Amount</td>
                          <td className="text-danger fw-bold">
                            {item.finalAmount}
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default AllTransaction;
