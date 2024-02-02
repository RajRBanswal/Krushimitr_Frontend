import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";

const VendorDistributorWalletReports = () => {
  const [compOrders, setCompOrders] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const [filterData, setFilterData] = useState([]);
  const [creditData, setCredtiData] = useState([]);
  const [debitData, setDebitData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getVDWalletData = async () => {
    let allData = [];
    let credit = [];
    let debits = [];
    let vendor_wallet = await fetch(
      "https://krushimitr.in/api/distributors/get-vendor-distributor-wallet"
    );
    const vv_wallets = await vendor_wallet.json();

    // console.log(vv_wallets);
    if (vv_wallets.status === 201) {
      vv_wallets.result.map((item) => {
        if (item.type === "Credit") {
          credit.push(item);
        } else if (item.type === "Debit") {
          debits.push(item);
        }
        allData.push(item);
      });
      setCredtiData(credit);
      setDebitData(debits);
      setFilterData(allData);
      setCompOrders(allData);
    } else {
      console.log(vv_wallets.result);
    }
  };

  useEffect(() => {
    getVDWalletData();
  }, [getVDWalletData]);

  const filterApplyTemplate = (options) => {
    return (
      <button
        type="button"
        className="btn btn-outline-primary w-100 btn-sm"
        onClick={() => {
          getOrderData(options._id);
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <i className="pi pi-eye"></i>
      </button>
    );
  };

  const [singleData, setSingleData] = useState("");
  const getOrderData = async (Id) => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/get-orders",
      {
        method: "post",
        body: JSON.stringify({
          orderId: Id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setSingleData(get_orders.result);
      // console.log(get_orders.result);
    } else {
      console.log(get_orders.result);
    }
  };

  const exportCSVS = () => {
    orderCmplt.current.exportCSV();
  };

  const rightToolbarTemplateCompleted = () => {
    return (
      <>
        <button className="btn btn-outline-primary btn-sm" onClick={exportCSVS}>
          <i className="pi pi-file-excel"></i>{" "}
        </button>
        <button
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
    { field: "orderTime", header: "Time" },
    { field: "finalAmount", header: "Amount" },
    { field: "paymentStatus", header: "Pay Status" },
    { field: "paymentMethod", header: "Pay Method" },
    { field: "distName", header: "Distributor Name" },
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

        doc.autoTable(exportColumns, compOrders);
        doc.save("users.pdf");
      });
    });
  };

  const [date1, setDate1] = useState(null);
  const headerComplete = (
    <div className="py-2">
      <div className="row">
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
        <div className="col-lg-6 ">
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
    compOrders.map((item) => {
      let newDate3 = moment(item.orderDate, "DD-MM-YYYY");
      let newDate4 = new Date(newDate3._d);

      if (newDate4 >= newDate1 && newDate4 <= newDate2) {
        Datas.push(item);
      }
    });
    setFilterData(Datas);
  };

  const getItemData = (rowData) => {
    let xyz = JSON.parse(rowData.itemsData);
    let arr = [];
    for (let index = 0; index < xyz.length; index++) {
      let rr = index + 1 + "). Product: " + xyz[index].productName + ",   ";
      arr.push(rr);
    }
    return arr;
  };
  const getTransId = (rowData) => {
    if (
      Array.isArray(rowData.paymentInstrument) ||
      rowData.paymentInstrument !== ""
    ) {
      let arr = JSON.parse(rowData.paymentInstrument);
      if (arr.transactionId !== undefined || arr.transactionId !== "") {
        return arr.transactionId;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  return (
    <div className="">
      <Toast ref={toast} />

      <div className=" p-3 UserCardReports">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active fw-bold"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              All Vendor/Distributor Wallets Reports
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link fw-bold"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Vendor/Distributor Credit Wallets Reports
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link fw-bold"
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false"
            >
              Vendor/Distributor Debit Wallets Reports
            </button>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <DataTable
              ref={orderCmplt}
              value={filterData}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value)}
              dataKey="id"
              paginator
              rows={25}
              rowsPerPageOptions={[10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
              globalFilter={globalFilter}
              header={headerComplete}
            >
              <Column field="transactionDate" header="Date" sortable></Column>
              <Column field="transactionTime" header="Time"></Column>
              <Column field="dvName" header="Name" sortable></Column>
              <Column field="dvMobile" header="Mobile" sortable></Column>

              <Column
                field="amount"
                header="Amount"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="type"
                header="Type"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="reason"
                header="Reason"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field={getTransId}
                header="TransactionId"
                body={getTransId}
              ></Column>

              {/* <Column
              header="Action"
              style={{ minWidth: "4rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column> */}
            </DataTable>
          </div>
          <div
            class="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <DataTable
              ref={orderCmplt}
              value={creditData}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value)}
              dataKey="id"
              paginator
              rows={25}
              rowsPerPageOptions={[10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
              globalFilter={globalFilter}
              header={headerComplete}
            >
              <Column field="transactionDate" header="Date" sortable></Column>
              <Column field="transactionTime" header="Time"></Column>
              <Column field="dvName" header="Name" sortable></Column>
              <Column field="dvMobile" header="Mobile" sortable></Column>
              <Column
                field="amount"
                header="Amount"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="type"
                header="Type"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="reason"
                header="Reason"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field={getTransId}
                header="TransactionId"
                body={getTransId}
              ></Column>
              {/* <Column
              header="Action"
              style={{ minWidth: "4rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column> */}
            </DataTable>
          </div>
          <div
            class="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
          >
            <DataTable
              ref={orderCmplt}
              value={debitData}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value)}
              dataKey="id"
              paginator
              rows={25}
              rowsPerPageOptions={[10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
              globalFilter={globalFilter}
              header={headerComplete}
            >
              <Column field="transactionDate" header="Date" sortable></Column>
              <Column field="transactionTime" header="Time"></Column>
              <Column field="dvName" header="Name" sortable></Column>
              <Column field="dvMobile" header="Mobile" sortable></Column>
              <Column field="amount" header="Amount"></Column>
              <Column
                field="type"
                header="Type"
                bodyStyle={{ color: "red", fontWeight: "bold" }}
              ></Column>
              <Column
                field="reason"
                header="Reason"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field={getTransId}
                header="TransactionId"
                body={getTransId}
              ></Column>
              {/* <Column
              header="Action"
              style={{ minWidth: "4rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column> */}
            </DataTable>
          </div>
        </div>
      </div>

      <div
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
                  let orderUser = JSON.parse(item.userData);
                  return (
                    <table className="table table-stripped table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Name : </td>
                          <td colSpan={2}>{item.userName}</td>
                          <td className="fw-bold text-danger text-nowrap">
                            Order Date : {item.orderDate}
                          </td>
                        </tr>
                        {orderUser && (
                          <tr>
                            <td className="fw-bold">Mobile No. : </td>
                            <td>{orderUser.mobile}</td>
                            <td className="fw-bold text-nowrap">Email :</td>
                            <td>{orderUser.email}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="fw-bold text-nowrap">
                            Payment Status :
                          </td>
                          <td className="fw-bold text-warning">
                            {item.paymentStatus === "Paid" ? (
                              <p className="text-success">
                                {item.paymentStatus}
                              </p>
                            ) : (
                              <p className="text-warning">
                                {item.paymentStatus}
                              </p>
                            )}
                          </td>
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
                                  <td>
                                    {item.price - (item.price * item.gst) / 100}
                                  </td>
                                  <td className="fw-bold text-nowrap">Size</td>
                                  <td>
                                    {item.size} {item.unit ? item.unit : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold text-nowrap">GST</td>
                                  <td>{item.gst}</td>
                                  <td className="fw-bold text-nowrap">
                                    GST Amount
                                  </td>
                                  <td>
                                    {(item.price * item.quantity * item.gst) /
                                      100}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={4}> </td>
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
      </div>
    </div>
  );
};

export default VendorDistributorWalletReports;
