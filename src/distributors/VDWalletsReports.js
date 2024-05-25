import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primereact/api";
const VDWalletsReports = () => {
  const [compOrders, setCompOrders] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const [filterData, setFilterData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    transactionDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    transactionId: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    dvName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    type: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  let distr = localStorage.getItem("distributor_id");
  let distrName = localStorage.getItem("distributor_name");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getVDWalletData = async () => {
    let allData = [];
    let vendor_wallet = await fetch(
      "https://krushimitr.in/api/distributors/get-vendor-distributor-wallet"
    );
    const vv_wallets = await vendor_wallet.json();
    if (vv_wallets.status === 201) {
      vv_wallets.result.map((item) => {
        if (item.dvId === distr) {
          allData.push(item);
        }
      });
      setFilterData(allData);
      setCompOrders(allData);
    } else {
      console.log(vv_wallets.result);
    }
  };

  useEffect(() => {
    getVDWalletData();
  }, []);

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
  const onGlobalFilterChange = (e) => {
    setDate1("");
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [date1, setDate1] = useState(null);
  const headerComplete = (
    <div className="py-2">
      <div className="row">
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
    if (date2 !== "" && date1 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      compOrders.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterData(Datas);
    } else {
      setDate1("");
      getVDWalletData();
      return;
    }
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
        <h3>Wallets Reports</h3>

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
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            "transactionDate",
            "transactionId",
            "type",
            "dvName",
            "status",
          ]}
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
          <Column field="transactionDate" header="Date" sortable></Column>
          <Column field="transactionTime" header="Time"></Column>
          <Column
            field={getTransId}
            header="TransactionId"
            body={getTransId}
          ></Column>
          <Column field="orderId" header="Order Id" sortable></Column>
          <Column field="adminName" header="Admin" sortable></Column>
          <Column
            field="amount"
            header="Amount"
            bodyStyle={{ fontWeight: "bold" }}
          ></Column>
          <Column
            field="type"
            header="Type"
            bodyStyle={{ color: "green", fontWeight: "bold" }}
          ></Column>
          <Column field="reason" header="Reason"></Column>
        </DataTable>
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

export default VDWalletsReports;
