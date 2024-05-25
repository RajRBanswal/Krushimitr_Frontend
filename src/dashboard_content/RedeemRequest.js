import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Helmet } from "react-helmet";
function RedeemRequest() {
  const [addDialog, setAddDialog] = useState(false);
  const [transId, setTransId] = useState("");
  const [type, setType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [reqId, setReqId] = useState("");
  const [image, setImage] = useState("");
  const [customerPoints, setCustomerPoints] = useState("");
  const [successData, setSuccessData] = useState([]);
  const [pricePerPoint, setPricePerPoint] = useState(1);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  let emptyType = useRef(null);
  let emptyTrans = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  let success = [];
  const [filterData, setFilterData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRedeemRequestData = async () => {
    let all_transaction = await fetch(
      "https://krushimitr.in/api/users/get-redeem-request"
    );
    const allRequest = await all_transaction.json();
    if (allRequest.status === 201) {
      allRequest.result.map((item) => {
        success.push(item);
      });
      setFilterData(success);
      setSuccessData(success);

      setPricePerPoint(
        allRequest.pricePerPoint.length > 0 ? allRequest.pricePerPoint[0] : 1
      );
    } else {
      alert(allRequest.result);
    }
  };

  useEffect(() => {
    getRedeemRequestData();
  }, []);

  const filterApplyTemplate = (options) => {
    if (options.status === "Success") {
      return <button className="btn btn-success">Credited</button>;
    } else {
      return (
        <>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => deletePoints(options._id)}
          >
            <i className="pi pi-ban"></i> Reject
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm ms-1"
            onClick={() => {
              setAddDialog(true);
              setReqId(options._id);
              setCustomerId(options.userId);
              getAllUsers(options.userId);
              setCustomerName(options.name);
              setCustomerPoints(options.points);
            }}
          >
            <i className="pi pi-ban"></i> Accept
          </button>
        </>
      );
    }
  };

  const exportCSVS = () => {
    orderCmplt.current.exportCSV();
  };

  const rightToolbarTemplateCompleted = () => {
    return (
      <>
        <button
          className="ms-1 btn btn-outline-primary btn-sm"
          onClick={exportCSVS}
        >
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
        <div className="col-lg-4 d-flex">
          <h4 className="m-0">Withdraw Requests</h4>
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
    if (date2 !== "" && date1 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      successData.map((item) => {
        let newDate3 = moment(item.date, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterData(Datas);
    } else {
      setDate1("");
      return;
    }
  };

  const hideDialog = () => {
    setAddDialog(false);
  };

  const SaveData = async () => {
    let amount = pointCalculations(customerPoints);
    let date = moment(new Date()).format("D-M-YYYY");
    if (type === "") {
      emptyType.current.focus();
    }
    if (!transId) {
      emptyTrans.current.focus();
    }
    const formData = new FormData();
    formData.append("reqId", reqId);
    formData.append("customerId", customerId);
    formData.append("customerName", customerName);
    formData.append("userMobile", users.mobile);
    formData.append("customerPoints", customerPoints);
    formData.append("adminId", adminId);
    formData.append("amount", amount);
    formData.append("type", type);
    formData.append("transId", transId);
    formData.append("date", date);
    formData.append("image", image);
    const response = await fetch(
      "https://krushimitr.in/api/admin/redeem-request-accept",
      {
        method: "post",
        body: formData,
      }
    );
    const result = await response.json();
    // console.log(result);
    if (result.status === 201) {
      let url = "https://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
      let params = new URLSearchParams({
        secret: "AMIK73UEFFiACG1Y0kuF",
        sender: "KMITR",
        receiver: users.mobile,
        route: "TA",
        tempid: "1207170122633310349",
        msgtype: 1,
        sms: `Dear Krushimitra user , Your account has been credited with Rs.${amount}. Now your updated wallet balance is Rs.-, Thanks - Krushimitra`,
      });
      await fetch(`${url}?${params}`);
      alert(result.msg);
      hideDialog();
    } else {
      alert(result.msg);
    }
  };
  const deletePoints = async (id) => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/delete-point-prices",
      {
        method: "post",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      alert(result.result);
    } else {
      alert(result.result);
    }
  };
  const AddPriceDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="ms-1"
        onClick={SaveData}
      />
    </React.Fragment>
  );

  const pointCalculation = (rowData) => {
    let rowPoint = "";
    if (rowData.name === null || rowData.name === undefined) {
      rowPoint = rowData;
    } else {
      rowPoint = rowData.points;
    }
    if (pricePerPoint === 1) {
      return <p className="mb-0">{rowPoint * 1}</p>;
    } else {
      let point = pricePerPoint.points;
      let price = pricePerPoint.price;
      if (point === 1) {
        return (
          <p className="mb-0">
            {rowPoint * price} <small>(Point 1 x {price})</small>
          </p>
        );
      } else {
        let abc = rowPoint / point;
        let ss = abc * price;
        return (
          <p className="mb-0">
            {ss.toFixed(2)}{" "}
            <small>
              (point {point} x {price})
            </small>
          </p>
        );
      }
    }
  };
  const pointCalculations = (rowData) => {
    let rowPoint = rowData;
    if (pricePerPoint === 1) {
      return <p className="mb-0">{rowPoint * 1}</p>;
    } else {
      let point = pricePerPoint.points;
      let price = pricePerPoint.price;
      if (point === 1) {
        return rowPoint * price;
      } else {
        let abc = rowPoint / point;
        let ss = abc * price;
        return ss.toFixed(2);
      }
    }
  };

  const [users, setUsers] = useState("");
  const getAllUsers = async (userId) => {
    const all_users = await fetch(
      "https://krushimitr.in/api/users/user-profile",
      {
        method: "post",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const uu = await all_users.json();
    setUsers(uu.user_data);
  };

  return (
    <div>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>Redeem Request</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet> */}
      <Toast ref={toast} />

      <div className="card px-3 UserCardReports">
        <DataTable
          ref={orderCmplt}
          value={filterData}
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
            field="#"
            header="Sr. No."
            bodyStyle={{
              fontSize: 15,
              fontWeight: "bold",
              textAlign: "center",
            }}
            body={(data, options) => options.rowIndex + 1}
          ></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column
            field="name"
            header="Name"
            bodyStyle={{ fontWeight: "bold" }}
            sortable
          ></Column>
          <Column field="mobile" header="Mobile" sortable></Column>

          <Column
            field="points"
            header="Points"
            bodyStyle={{ fontWeight: "bold", paddingLeft: 10 }}
            sortable
          ></Column>
          <Column
            field={pointCalculation}
            header="Price"
            bodyStyle={{ fontWeight: "bold", paddingLeft: 10 }}
            body={pointCalculation}
            sortable
          ></Column>
          <Column
            field="status"
            header="Status"
            sortable
            bodyStyle={{ fontWeight: "bold" }}
          ></Column>
          <Column
            header="Action"
            body={filterApplyTemplate}
            severity="success"
          ></Column>
        </DataTable>
      </div>
      <Dialog
        visible={addDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Accept Redeem Request"
        modal
        className="p-fluid"
        footer={AddPriceDialogFooter}
        onHide={hideDialog}
      >
        <div className="row">
          <div className="col-lg-12 mt-2">
            <label>Customer Name</label>
            <input
              type="text"
              className="form-control"
              value={customerName}
              readOnly
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Customer Mobile No.</label>
            <input
              type="text"
              className="form-control"
              value={users.mobile}
              readOnly
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>
              Type <small>(UPI, Card)</small>
            </label>
            <select
              className="form-control form-select"
              ref={emptyType}
              onChange={(e) => setType(e.target.value)}
            >
              <option value={""}>Select One</option>
              <option value={"UPI"}>UPI</option>
              <option value={"Card"}>Card</option>
            </select>
          </div>
          <div className="col-lg-12 mt-2">
            <label>Transaction Id</label>
            <input
              type="text"
              className="form-control"
              placeholder="Transaction Id"
              ref={emptyTrans}
              onChange={(e) => setTransId(e.target.value)}
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>
              upload Screenshot <small>(Optional)</small>
            </label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default RedeemRequest;
