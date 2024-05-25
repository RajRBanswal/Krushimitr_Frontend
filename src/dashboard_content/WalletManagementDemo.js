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

function WalletManagement() {
  const [addDialog, setAddDialog] = useState(false);
  const [walletData, setWalletData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [pricePerPoint, setPricePerPoint] = useState(1);
  const toast = useRef(null);
  const walletRef = useRef(null);
  let success = [];
  const [filterData, setFilterData] = useState([]);

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
    let newDate1 = new Date(date1);
    let newDate2 = new Date(date2);
    let Datas = [];
    walletData.map((item) => {
      let newDate3 = moment(item.createdAt, "DD-MM-YYYY");
      let newDate4 = new Date(newDate3._d);

      if (newDate4 >= newDate1 && newDate4 <= newDate2) {
        Datas.push(item);
      }
    });
    setFilterData(Datas);
  };
  const hideDialog = () => {
    setAddDialog(false);
    setChngStatus(false);
    setVDChngStatus(false);
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
  const [users, setUsers] = useState([]);
  const getAllUsers = async () => {
    const all_users = await fetch("https://krushimitr.in/api/admin/all-users");
    const uu = await all_users.json();
    setUsers(uu);
  };

  const userName = (rowData) => {
    // console.log(rowData.userId);
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id == rowData.userId) {
        return users[i].name + ", " + users[i].mobile;
      }
    }
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

        doc.autoTable(exportColumns, pricePerPoint);
        doc.save("users.pdf");
      });
    });
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
    // if (rowData.type === "Credit") {
    //   return <p className="mb-0 text-success">+ {rowData.amount}</p>;
    // } else {
    //   return <p className="mb-0 text-danger">- {rowData.amount}</p>;
    // }
  };

  const [dvRupeeWalletData, setDVRupeeWalletData] = useState([]);
  const [allDVRupeeData, setAllDVRupeeData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDVRupeeWalletData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/distributors/get-vendor-distributor-wallet"
    );
    const data = await response.json();
    if (data.status === 201) {
      let success = [];
      setAllDVRupeeData(data.result);
      let n = data.result.length;
      let cleanId = printDistinct(data.result, n);
      // let cleanId = removeDuplicatesVD(dv_check_duplicate(data.result));
      for (let i = 0; i < cleanId.length; i++) {
        for (let j = 0; j < data.result.length; j++) {
          if (cleanId[i] === data.result[j].dvId) {
            success.push(data.result[j]);
            break;
          }
        }
      }
      setDVRupeeWalletData(success);
    } else {
      setDVRupeeWalletData([]);
    }
  };

  function printDistinct(arr, n) {
    let aaarr = [];
    for (let i = 0; i < n; i++) {
      let j;
      for (j = 0; j < i; j++) if (arr[i].dvId === arr[j].dvId) break;

      if (i === j) aaarr.push(arr[i].dvId);
    }
    return aaarr;
  }

  const DVWalletPrice = (rowData) => {
    let element = 0;
    for (let j = 0; j < allDVRupeeData.length; j++) {
      if (rowData.dvId === allDVRupeeData[j].dvId) {
        if (allDVRupeeData[j].type === "Credit") {
          element = element + allDVRupeeData[j].amount;
        } else if (allDVRupeeData[j].type === "Debit") {
          element = element - allDVRupeeData[j].amount;
        }
      }
    }
    return element;
  };
  const [activeDistributor, setActiveDistributor] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllDistributor = async () => {
    let aDistributor = [];
    const all_users = await fetch(
      "https://krushimitr.in/api/admin/distributor"
    );
    const result = await all_users.json();
    if (result.status === 201) {
      result.distributor.map((item) => {
        if (item.status === "Active") {
          aDistributor.push(item);
        }
      });
      setActiveDistributor(aDistributor);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    getUserWalletData();
    getUserRupeeWalletData();
    getDVRupeeWalletData();
    getAllDistributor();
  }, []);

  const [userDatas, setUserDatas] = useState([]);
  const userData = (id) => {
    setDVWalletDatas("");
    let element = [];
    for (let j = 0; j < allUserRupeeData.length; j++) {
      if (id === allUserRupeeData[j].userId) {
        element.push(allUserRupeeData[j]);
      }
    }
    setUserDatas(element);
  };

  const [dvWalletDatas, setDVWalletDatas] = useState([]);
  const VDData = (id) => {
    setUserDatas("");
    let element = [];
    for (let j = 0; j < allDVRupeeData.length; j++) {
      if (id === allDVRupeeData[j].dvId) {
        element.push(allDVRupeeData[j]);
      }
    }
    setDVWalletDatas(element);
  };

  const [selectedData, setSelectedData] = useState([]);
  const [chngStatus, setChngStatus] = useState(false);
  const [selectedVDData, setSelectedVDData] = useState([]);
  const [VDChngStatus, setVDChngStatus] = useState(false);
  const [type, setType] = useState("");
  const [distributorDetail, setDistributorDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [UTR, setUTR] = useState("");
  const [reason, setReason] = useState("");

  const changeStatus = async () => {
    let distName = "";
    let distMobile = "";
    let walletAmt = 0;
    let dvWalletAmt = 0;
    if (paymentType === "" || UTR === "" || reason === "") {
      alert("Fill Mandatory fields");
    } else {
      walletAmt = UserWalletPrice(selectedData);
      activeDistributor.map((item) => {
        if (item._id === distributorDetail) {
          distName = item.name;
          distMobile = item.mobile;
        }
      });
      dvRupeeWalletData.map((item) => {
        if (item.dvId === distributorDetail) {
          dvWalletAmt = DVWalletPrice(item);
        }
      });

      const response = await fetch(
        "https://krushimitr.in/api/admin/users-credit-debit-amount",
        {
          method: "post",
          body: JSON.stringify({
            userId: selectedData.userId,
            userName: selectedData.userName,
            userMobile: selectedData.userMobile,
            amount: amount === 0 ? walletAmt : amount,
            walletAmt: walletAmt,
            type: type,
            distId: distributorDetail,
            distName: distName,
            distMobile: distMobile,
            dvWalletAmt: dvWalletAmt,
            paymentType: paymentType,
            UTRNo: UTR,
            reason: reason,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      // console.log(result);
      if (result.status === 201) {
        hideDialog();
        alert(result.result);
      } else {
        alert(result.result);
      }
    }
  };
  const VDChangeStatus = async () => {
    let distName = "";
    let distMobile = "";
    let dvWalletAmt = 0;

    if (
      type === "Credit" &&
      (paymentType === "" || UTR === "" || reason === "")
    ) {
      alert("Fill Mandatory fields");
    } else {
      activeDistributor.map((item) => {
        if (item._id === distributorDetail) {
          distName = item.name;
          distMobile = item.mobile;
        }
      });
      dvRupeeWalletData.map((item) => {
        if (item.dvId === distributorDetail) {
          dvWalletAmt = DVWalletPrice(item);
        }
      });

      const response = await fetch(
        "https://krushimitr.in/api/admin/distributor-vendor-credit-debit",
        {
          method: "post",
          body: JSON.stringify({
            amount: amount === 0 ? dvWalletAmt : amount,
            type: type,
            distId: distributorDetail,
            distName: distName,
            distMobile: distMobile,
            dvWalletAmt: dvWalletAmt,
            paymentType: paymentType,
            UTRNo: UTR,
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
        onClick={changeStatus}
      />
    </React.Fragment>
  );
  const AddVDCreditDebitDialogFooter = (
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
        onClick={VDChangeStatus}
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
  const VDfilterApplyTemplate = (options) => {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm ms-1"
          onClick={() => {
            VDData(options.dvId);
            setAddDialog(true);
          }}
        >
          <i className="pi pi-eye"></i> View
        </button>
        <button
          type="button"
          className="btn btn-outline-success btn-sm ms-1"
          onClick={() => {
            setSelectedVDData(options);
            setType("Credit");
            setVDChngStatus(true);
            setDistributorDetail(options.dvId);
          }}
        >
          Credit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm ms-1"
          onClick={() => {
            setType("Debit");
            setSelectedVDData(options);
            setVDChngStatus(true);
            setDistributorDetail(options.dvId);
          }}
        >
          Debit
        </button>
      </>
    );
  };

  return (
    <div className="py-3 px-2">
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
            id="pills-distributor_vendor-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-distributor_vendor"
            type="button"
            role="tab"
            aria-controls="pills-distributor_vendor"
            aria-selected="false"
          >
            Vendor/Distributor Wallet Management
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
            <Column field="userName" header="Name" sortable></Column>
            <Column field="transactionDate" header="Date" sortable></Column>
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
          id="pills-distributor_vendor"
          role="tabpanel"
          aria-labelledby="pills-distributor_vendor-tab"
        >
          {/* <div className="card UserCardReports"> */}
          <DataTable
            ref={walletRef}
            value={dvRupeeWalletData}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
            globalFilter={globalFilter}
            header={headerWalletComplete}
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
            <Column field="dvName" header="Name" sortable></Column>
            <Column field="transactionDate" header="Date" sortable></Column>
            <Column
              field="type"
              header="Type"
              bodyStyle={{ fontWeight: "bold" }}
              sortable
            ></Column>
            <Column
              field={DVWalletPrice}
              header="Price"
              body={DVWalletPrice}
              sortable
            ></Column>
            <Column
              field="status"
              header="Action"
              body={VDfilterApplyTemplate}
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
              field="#"
              header="Sr. No."
              bodyStyle={{
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center",
              }}
              body={(data, options) => options.rowIndex + 1}
            ></Column>
            <Column
              field={userName}
              header="Name"
              body={userName}
              sortable
            ></Column>
            <Column field="createdDate" header="Date" sortable></Column>
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
        header={"All Data"}
        modal
        className="p-fluid"
        footer={AddPriceDialogFooter}
        onHide={hideDialog}
      >
        <div className="overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Type</th>
                <th>Amount</th>
                {/* <th>Pay Method</th>
                <th>UTR</th> */}
              </tr>
            </thead>
            <tbody>
              {userDatas &&
                userDatas.map((item) => (
                  <tr>
                    <td className="p-1">
                      {item.transactionDate} /
                      {item.transactionTime !== undefined
                        ? item.transactionTime
                        : ""}
                    </td>
                    <td className="p-1 ">{item.type}</td>
                    <td className="p-1 ">{item.amount}</td>
                    {/* <td className="p-1 ">{item.paymode}</td>
                    <td className="p-1 ">{item.utrNo}</td> */}
                  </tr>
                ))}
              {dvWalletDatas &&
                dvWalletDatas.map((item) => (
                  <tr>
                    <td className="p-1">
                      {item.transactionDate} /
                      {item.transactionTime !== undefined
                        ? item.transactionTime
                        : ""}
                    </td>
                    <td className="p-1 ">{item.type}</td>
                    <td className="p-1 ">{item.amount}</td>
                    {/* <td className="p-1 ">{item.paymode}</td>
                    <td className="p-1 ">{item.utrNo}</td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Dialog>

      <Dialog
        visible={chngStatus}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"All Data"}
        modal
        className="p-fluid"
        footer={AddCreditDebitDialogFooter}
        onHide={hideDialog}
      >
        <div className="row">
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
          {/* {type === "Debit" ? (
            <div className="col-lg-12 mt-2">
              <label>Select Distributor / Vendor</label>
              <select
                className="form-control form-select"
                onChange={(e) => setDistributorDetail(e.target.value)}
              >
                <option value={""}>Select One</option>
                {activeDistributor &&
                  activeDistributor.map((item) => (
                    <option value={item._id}>
                      {item.name +
                        " (" +
                        item.mobile +
                        ")  " +
                        item.address +
                        "," +
                        item.city}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            ""
          )} */}

          {/* <div className="col-lg-6 mt-2">
            <label>Payment Type</label>
            <select
              className="form-control form-select"
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value={""}>Select One</option>
              <option value={"UPI"}>UPI</option>
              <option value={"Card"}>Card</option>
              <option value={"Net Banking"}>Net Banking</option>
            </select>
          </div>
          <div className="col-lg-6 mt-2">
            <label>UTR No</label>
            <input
              type="text"
              placeholder="UTR No"
              className="form-control"
              onChange={(e) => setUTR(e.target.value)}
            />
          </div> */}
          <div className="col-lg-12 mt-2">
            <label>Amount</label>
            <input
              type="text"
              className="form-control"
              defaultValue={UserWalletPrice(selectedData)}
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

      <Dialog
        visible={VDChngStatus}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"All Data"}
        modal
        className="p-fluid"
        footer={AddVDCreditDebitDialogFooter}
        onHide={hideDialog}
      >
        <div className="row">
          <div className="col-lg-12">
            <label>Wallet Amount : {DVWalletPrice(selectedVDData)}</label>
            <input type="text" className="form-control" value={type} readOnly />
          </div>
          <div className="col-lg-12">
            <label>Type</label>
            <input type="text" className="form-control" value={type} readOnly />
          </div>
          {/* <div className="col-lg-12 mt-2">
            <label>Select Distributor / Vendor</label>
            <select
              className="form-control form-select"
              onChange={(e) => setDistributorDetail(e.target.value)}
            >
              <option value={""}>Select One</option>
              {activeDistributor &&
                activeDistributor.map((item) => (
                  <option value={item._id}>
                    {item.name +
                      " (" +
                      item.mobile +
                      ")  " +
                      item.address +
                      "," +
                      item.city}
                  </option>
                ))}
            </select>
          </div> */}
          {/* {type === "Credit" ? (
            <>
              <div className="col-lg-6 mt-2">
                <label>Payment Type</label>
                <select
                  className="form-control form-select"
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value={""}>Select One</option>
                  <option value={"UPI"}>UPI</option>
                  <option value={"Card"}>Card</option>
                  <option value={"Net Banking"}>Net Banking</option>
                </select>
              </div>
              <div className="col-lg-6 mt-2">
                <label>UTR No</label>
                <input
                  type="text"
                  placeholder="UTR No"
                  className="form-control"
                  onChange={(e) => setUTR(e.target.value)}
                />
              </div>
            </>
          ) : (
            ""
          )} */}
          <div className="col-lg-12 mt-2">
            <label>Amount</label>
            <input
              type="text"
              className="form-control"
              defaultValue={
                type === "Credit" ? 0 : DVWalletPrice(selectedVDData)
              }
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
