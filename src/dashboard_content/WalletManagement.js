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
import { FilterMatchMode, FilterOperator } from "primereact/api";
import loading from "../images/loading.gif";
import Select from "react-select";

function WalletManagement() {
  const [addDialog, setAddDialog] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const buttonRef = useRef(null);
  const [walletData, setWalletData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [pricePerPoint, setPricePerPoint] = useState(1);
  const adminId = localStorage.getItem("admin_id");
  const adminName = localStorage.getItem("admin_name");
  const toast = useRef(null);
  const walletRef = useRef(null);
  let success = [];
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
    userName: {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserWalletData = async () => {
    getAllUsers();
    const response = await fetch("https://krushimitr.in/api/admin/get-wallet");
    const data = await response.json();
    if (data.status === "201") {
      data.result.map((item) => {
        success.push(item);
      });
      setFilterData(success);
      setWalletData(success);
      setPricePerPoint(
        data.pricePerPoint.length > 0 ? data.pricePerPoint[0] : 1
      );
    } else {
      setWalletData([]);
    }
  };

  const exportCSVS = () => {
    walletRef.current.exportCSV();
  };
  const showDateWiseData = (date2) => {
    let newDate1 = new Date(date1).toISOString();
    let newDate2 = new Date(date2).toISOString();
    let Datas = [];
    let befDatas = [];
    walletData.map((item) => {
      let newDate3 = moment(item.createdAt, "DD-M-YYYY");
      let newDate4 = new Date(newDate3).toISOString();

      if (newDate4 >= newDate1 && newDate4 <= newDate2) {
        Datas.push(item);
      }
    });

    userRupeeWalletData.map((item) => {
      let newDate3 = moment(item.createdAt, "DD-M-YYYY");
      let newDate4 = new Date(newDate3).toISOString();

      if (newDate4 >= newDate1 && newDate4 <= newDate2) {
        befDatas.push(item);
      }
    });
    setUserRupeeWalletData(befDatas);
    setFilterData(Datas);
  };
  const hideDialog = () => {
    setAddDialog(false);
    setChngStatus(false);
    setAddAmountInUserWallet(false);
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
        label="Close"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideDialog}
      />
      {/* <Button
        label="Save"
        icon="pi pi-check"
        className="ms-1"
        // onClick={SaveData}
      /> */}
    </React.Fragment>
  );

  const pointCalculation = (rowData) => {
    let rowPoint = rowData.points;
    // console.log(rowData);
    if (pricePerPoint === 1) {
      return rowPoint * 1;
    } else {
      let point = pricePerPoint.points;
      let price = pricePerPoint.price;
      if (point === 1) {
        return rowPoint * price + ".00";
      } else {
        let abc = rowPoint / point;
        let ss = abc * price;
        return ss.toFixed(2);
      }
    }
  };
  const [options, setOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const getAllUsers = async () => {
    const all_users = await fetch("https://krushimitr.in/api/admin/all-users");
    const uu = await all_users.json();
    let data = [];
    uu.map((item) => {
      if (item.status === "Active") {
        data.push({ value: item._id, label: item.name + " " + item.mobile });
      }
    });
    setUsers(uu);
    setOptions(data);
  };

  const userName = (rowData) => {
    // console.log(rowData.userId);
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id === rowData.userId) {
        return users[i].name + ", " + users[i].mobile;
      }
    }
  };

  const rightToolbarTemplateCompleted = () => {
    return (
      <>
        <button
          className="ms-1 btn btn-outline-primary btn-sm"
          onClick={() => setAddAmountInUserWallet(true)}
        >
          <i className="pi pi-plus"></i>{" "}
        </button>
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

        doc.autoTable(exportColumns, pricePerPoint);
        doc.save("users.pdf");
      });
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [date1, setDate1] = useState(null);
  const headerPointComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4 d-flex">
          <h4 className="m-0">Point Management</h4>
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
  const headerWalletComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4 d-flex">
          <h4 className="m-0">Wallet Management</h4>
        </div>
        <div className="col-lg-3">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
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
        <div className="col-lg-2  ">
          <Toolbar
            className="p-0 border-0"
            right={rightToolbarTemplateCompleted}
          ></Toolbar>
        </div>
      </div>
    </div>
  );

  const headerData = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4 d-flex text-start">
          <h4 className="m-0">All Data</h4>
        </div>
        <div className="col-lg-4 text-center">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
        </div>
        <div className="col-lg-4 text-end">
          <Toolbar
            className="p-0 border-0"
            right={rightToolbarTemplateCompleted}
          ></Toolbar>
        </div>
      </div>
    </div>
  );
  const [userRupeeWalletData, setUserRupeeWalletData] = useState([]);
  const [allUserRupeeData, setAllUserRupeeData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserRupeeWalletData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/users/get-rupee-wallet"
    );
    const data = await response.json();
    if (data.status === "201") {
      let success = [];
      setAllUserRupeeData(data.result);
      let cleanId = removeDuplicates(user_check_duplicate(data.result));
      for (let i = 0; i < cleanId.length; i++) {
        for (let j = 0; j < data.result.length; j++) {
          if (cleanId[i] === data.result[j].userId) {
            success.push(data.result[j]);
            break;
          }
        }
      }
      // console.log(cleanId);
      setUserRupeeWalletData(success);
    } else {
      setUserRupeeWalletData([]);
    }
  };

  function removeDuplicates(abc) {
    return abc.filter((value, index) => abc.indexOf(value) === index);
  }
  let user_check_duplicate = (arr) => {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1].userId === sorted_arr[i].userId) {
        results.push(sorted_arr[i].userId);
      } else {
        results.push(sorted_arr[i].userId);
      }
    }
    return results;
  };
  const UserWalletPrice = (rowData) => {
    let element = 0;
    for (let j = 0; j < allUserRupeeData.length; j++) {
      if (rowData.userId === allUserRupeeData[j].userId) {
        if (allUserRupeeData[j].type === "Credit") {
          element = element + allUserRupeeData[j].amount;
        } else if (allUserRupeeData[j].type === "Debit") {
          element = element - allUserRupeeData[j].amount;
        }
      }
    }
    return element;
  };

  const [userDatas, setUserDatas] = useState([]);
  const userData = (id) => {
    let element = [];
    for (let j = 0; j < allUserRupeeData.length; j++) {
      if (id === allUserRupeeData[j].userId) {
        element.push(allUserRupeeData[j]);
      }
    }
    setUserDatas(element);
  };

  const [selectedData, setSelectedData] = useState([]);
  const [chngStatus, setChngStatus] = useState(false);
  const [addAmountInUserWallet, setAddAmountInUserWallet] = useState(false);

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    getUserWalletData();
    getUserRupeeWalletData();
  }, [getUserRupeeWalletData, getUserWalletData]);

  const changeStatus = async (e) => {
    e.preventDefault();
    setLoadings(true);

    if (type === "" || amount === "" || selectUser === "") {
      alert("Select Type or Enter Amount or Select User");
      setLoadings(false);
      buttonRef.current.disabled = false;
      return;
    } else {
      buttonRef.current.disabled = true;
      setLoadings(true);
      let userId = "";
      let userName = "";
      let userMobile = "";
      users.map((item) => {
        if (item._id === selectUser) {
          userId = selectUser;
          userName = item.name;
          userMobile = item.mobile;
        }
      });

      let walletAmt = UserWalletPrice(selectedData);
      const response = await fetch(
        "https://krushimitr.in/api/admin/users-credit-debit-amount",
        {
          method: "post",
          body: JSON.stringify({
            adminId: adminId,
            adminName: adminName,
            userId: selectedData.userId !== "" ? selectedData.userId : userId,
            userName:
              selectedData.userName !== "" ? selectedData.userName : userName,
            userMobile:
              selectedData.userMobile !== ""
                ? selectedData.userMobile
                : userMobile,
            amount: amount === "" ? UserWalletPrice(selectedData) : amount,
            walletAmt: walletAmt,
            type: type,
            reason: reason,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.status === 201) {
        hideDialog();
        setLoadings(false);
        buttonRef.current.disabled = false;
        alert(result.result);
      } else {
        alert(result.result);
      }
    }
  };
  const changeOlderStatus = async (e) => {
    e.preventDefault();
    setLoadings(true);

    if (type === "" || amount === "") {
      alert("Select Type or Enter Amount or Select User");
      setLoadings(false);
      buttonRef.current.disabled = false;
      return;
    } else {
      buttonRef.current.disabled = true;
      setLoadings(true);
      let userId = "";
      let userName = "";
      let userMobile = "";
      users.map((item) => {
        if (item._id === selectUser) {
          userId = selectUser;
          userName = item.name;
          userMobile = item.mobile;
        }
      });

      let walletAmt = UserWalletPrice(selectedData);
      const response = await fetch(
        "https://krushimitr.in/api/admin/users-credit-debit-amount",
        {
          method: "post",
          body: JSON.stringify({
            adminId: adminId,
            adminName: adminName,
            userId: selectedData.userId !== "" ? selectedData.userId : userId,
            userName:
              selectedData.userName !== "" ? selectedData.userName : userName,
            userMobile:
              selectedData.userMobile !== ""
                ? selectedData.userMobile
                : userMobile,
            amount: amount === "" ? UserWalletPrice(selectedData) : amount,
            walletAmt: walletAmt,
            type: type,
            reason: reason,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.status === 201) {
        hideDialog();
        setLoadings(false);
        buttonRef.current.disabled = false;
        alert(result.result);
      } else {
        alert(result.result);
      }
    }
  };

  const AddCreditDebitDialogFooter = (
    <React.Fragment>
      <Button
        label="Close"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="ms-1"
        onClick={changeOlderStatus}
        ref={buttonRef}
      />
    </React.Fragment>
  );

  const AddNewCreditDebitDialogFooter = (
    <React.Fragment>
      <Button
        label="Close"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="ms-1"
        onClick={changeStatus}
        ref={buttonRef}
      />
    </React.Fragment>
  );

  const filterApplyTemplate = (options) => {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm ms-1"
          onClick={() => {
            userData(options.userId);
            setAddDialog(true);
          }}
        >
          <i className="pi pi-eye"></i> View
        </button>
        <button
          type="button"
          className="btn btn-outline-success btn-sm ms-1"
          onClick={() => {
            setSelectedData(options);
            setType("Credit");
            setChngStatus(true);
          }}
        >
          Credit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm ms-1"
          onClick={() => {
            setType("Debit");
            setSelectedData(options);
            setChngStatus(true);
          }}
        >
          Debit
        </button>
      </>
    );
  };

  const [selectUser, setSelectUser] = useState("");
  const getSelectUser = (data) => {
    setSelectUser(data.value);
  };

  const showDate = (rowData) => (
    <>
      <p className="mb-0">{rowData.transactionDate}</p>
      <p className="mb-0">{rowData.transactionTime}</p>
    </>
  );

  return (
    <div
      className="py-3 px-2"
      disabled={loadings ? "disabled" : ""}
      aria-disabled={loadings ? "disabled" : ""}
    >
      <div className="LoadingDiv">
        <img
          src={loading}
          className={"loader " + (loadings ? "d-block" : "d-none")}
          alt=""
        />
      </div>
      <Toast ref={toast} />
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            User Wallet Management
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Point Management
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
          {/* <div className="card UserCardReports"> */}
          <DataTable
            ref={walletRef}
            value={userRupeeWalletData}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
            globalFilter={globalFilter}
            header={headerWalletComplete}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "transactionDate",
              "transactionId",
              "type",
              "userName",
              "status",
            ]}
          >
            <Column field="orderId" header="Order No." sortable></Column>
            <Column field="transactionId" header="Txn Id" sortable></Column>
            <Column
              field={showDate}
              header="Date/Time"
              body={showDate}
              bodyStyle={{fontSize:13}}
              sortable
            ></Column>
            {/* <Column field="transactionTime" header="Time" sortable></Column> */}
            <Column field="userName" header="Name" sortable></Column>
            <Column
              field="type"
              header="Type"
              bodyStyle={{ fontWeight: "bold" }}
              sortable
            ></Column>
            <Column
              field={UserWalletPrice}
              header="Price"
              body={UserWalletPrice}
              sortable
            ></Column>
            <Column
              field="reason"
              header="Notes"
              bodyStyle={{ fontWeight: "bold" }}
              sortable
            ></Column>
            <Column
              field="status"
              header="Action"
              body={filterApplyTemplate}
              bodyStyle={{ width: "25%" }}
              sortable
            ></Column>
          </DataTable>
          {/* </div> */}
        </div>
        <div
          class="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          {/* <div className="card UserCardReports"> */}
          <DataTable
            ref={walletRef}
            value={filterData}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
            globalFilter={globalFilter}
            header={headerPointComplete}
          >
            <Column
              field="transactionId"
              header="Transaction Id"
              sortable
            ></Column>
            <Column
              field={userName}
              header="Name"
              body={userName}
              sortable
            ></Column>
            <Column field="createdDate" header="Date" sortable></Column>
            <Column field="createdTime" header="Time" sortable></Column>
            <Column field="type" header="Type" sortable></Column>
            <Column
              field="status"
              header="Status"
              bodyStyle={{ fontWeight: "bold", color: "green" }}
              sortable
            ></Column>
            <Column field="points" header="Points" sortable></Column>
            <Column
              field={pointCalculation}
              header="Price"
              body={pointCalculation}
              sortable
            ></Column>
            {/* <Column field="status" header="Status" sortable></Column> */}
            {/* <Column
            header="Action"
            body={filterApplyTemplate}
            severity="success"
          ></Column> */}
          </DataTable>
          {/* </div> */}
        </div>
      </div>
      <Dialog
        visible={addDialog}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={""}
        modal
        className="p-fluid"
        footer={AddPriceDialogFooter}
        onHide={hideDialog}
      >
        <div className="overflow-auto">
          <DataTable
            ref={walletRef}
            value={userDatas}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
            globalFilter={globalFilter}
            header={headerData}
          >
            <Column field="orderId" header="Order Id" sortable></Column>
            <Column
              field="transactionId"
              header="Transaction Id"
              sortable
            ></Column>
            <Column
              field={showDate}
              header="Date / Time"
              body={showDate}
              bodyStyle={{fontSize:13}}
              sortable
            ></Column>
            {/* <Column field="transactionTime" header="Time" sortable></Column> */}
            <Column
              field="type"
              header="Type"
              bodyStyle={{ color: "green" }}
              sortable
            ></Column>
            <Column field="amount" header="Amount" sortable></Column>
            <Column field="reason" header="Reason" sortable></Column>
          </DataTable>
        </div>
      </Dialog>
      <Dialog
        visible={chngStatus}
        style={{
          width: "32rem",
          pointerEvents: loadings ? "none" : "",
          opacity: loadings ? 0.7 : "",
        }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={type}
        modal
        className="p-fluid"
        footer={AddCreditDebitDialogFooter}
        onHide={hideDialog}
      >
        <div
          className="row"
          disabled={loadings ? "disabled" : ""}
          aria-disabled={loadings ? "disabled" : ""}
        >
          <div className="col-lg-12">
            <h4 className="fw-bold">
              <span className="text-dark">Wallet Amount :</span>{" "}
              <i className="fa fa-rupee"></i>{" "}
              <b className="text-success">{UserWalletPrice(selectedData)}</b>
            </h4>
          </div>
          <div className="col-lg-12">
            <label>Type</label>
            <input type="text" className="form-control" value={type} readOnly />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Amount</label>
            <input
              type="text"
              className="form-control"
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
              defaultValue={
                type === "Credit" ? 0 : UserWalletPrice(selectedData)
              }
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Reason</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Reason"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={addAmountInUserWallet}
        style={{
          width: "32rem",
          pointerEvents: loadings ? "none" : "",
          opacity: loadings ? 0.7 : "",
        }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={type}
        modal
        className="p-fluid"
        footer={AddNewCreditDebitDialogFooter}
        onHide={hideDialog}
      >
        <div
          className="row"
          disabled={loadings ? "disabled" : ""}
          aria-disabled={loadings ? "disabled" : ""}
        >
          <div className="col-lg-12">
            <label>All Users</label>
            <Select
              defaultValue={selectUser}
              onChange={(text) => getSelectUser(text)}
              options={options}
            />
          </div>
          <div className="col-lg-12">
            <label>Type</label>
            <select
              className="form-select "
              onChange={(e) => setType(e.target.value)}
            >
              <option value={""}>Select Type</option>
              <option value={"Credit"}>Credit</option>
              <option value={"Debit"}>Debit</option>
            </select>
          </div>
          <div className="col-lg-12 mt-2">
            <label>Amount</label>
            <input
              type="text"
              className="form-control"
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Reason</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Reason"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default WalletManagement;
