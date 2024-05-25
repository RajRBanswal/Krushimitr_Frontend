import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import Select from "react-select";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import loading from "../images/loading.gif";
const VDWalletManagement = () => {
  const [loadings, setLoadings] = useState(false);
  const buttonRef = useRef(null);
  const [addDialog, setAddDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  const adminId = localStorage.getItem("admin_id");
  const adminName = localStorage.getItem("admin_name");
  const toast = useRef(null);
  const walletRef = useRef(null);
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
    type: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    dvName: {
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

  const exportCSVS = () => {
    walletRef.current.exportCSV();
  };
  const hideDialog = () => {
    setAddDialog(false);
    setVDChngStatus(false);
    setAddVendorInWallet(false);
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

  const rightToolbarTemplateCompleted = () => {
    return (
      <>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setAddVendorInWallet(true)}
        >
          <i className="fa fa-plus"></i>
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

        doc.autoTable(exportColumns);
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
  const headerWalletComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-6 d-flex">
          <h4 className="m-0">Vendor/Distributor Wallet Management</h4>
        </div>
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
        {/* <div className="col-lg-3 ">
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
        </div> */}
        <div className="col-lg-2">
          <Toolbar
            className="p-0 border-0"
            right={rightToolbarTemplateCompleted}
          ></Toolbar>
        </div>
      </div>
    </div>
  );

  const headerWalletCompleteData = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4 d-flex">
          <h4 className="m-0">Wallet Data</h4>
        </div>
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
        <div className="col-lg-4">
          <Toolbar
            className="p-0 border-0"
            right={rightToolbarTemplateCompleted}
          ></Toolbar>
        </div>
      </div>
    </div>
  );

  const [dvRupeeWalletData, setDVRupeeWalletData] = useState([]);
  const [allDVRupeeData, setAllDVRupeeData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getVendorWalletData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/distributors/get-vendor-distributor-wallet"
    );
    const data = await response.json();
    if (data.status === 201) {
      let success = [];
      setAllDVRupeeData(data.result);
      let n = data.result.length;
      let cleanId = printDistinct(data.result, n);
      for (let i = 0; i < cleanId.length; i++) {
        for (let j = 0; j < data.result.length; j++) {
          if (
            cleanId[i] === data.result[j].dvId &&
            data.result[j].dvId !== ""
          ) {
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
        if (
          allDVRupeeData[j].type === "Credit" &&
          allDVRupeeData[j].amountStatus === "Done"
        ) {
          element = element + allDVRupeeData[j].amount;
        } else if (allDVRupeeData[j].type === "Debit") {
          element = element - allDVRupeeData[j].amount;
        }
      }
    }
    return element.toFixed(2);
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

  const [options, setOptions] = useState([]);
  const [allDistributor, setAllDistributor] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAlsDistributor = async () => {
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
      let data = [];
      aDistributor.map((item) => {
        data.push({ value: item._id, label: item.name + " " + item.mobile });
      });
      setOptions(data);
      setAllDistributor(aDistributor);
    } else {
      alert(result.message);
    }
  };

  const [dvWalletDatas, setDVWalletDatas] = useState([]);
  const VDData = (id) => {
    let element = [];
    for (let j = 0; j < allDVRupeeData.length; j++) {
      if (id === allDVRupeeData[j].dvId) {
        element.push(allDVRupeeData[j]);
      }
    }
    setDVWalletDatas(element);
  };

  const [selectedVDData, setSelectedVDData] = useState([]);
  const [VDChngStatus, setVDChngStatus] = useState(false);
  const [addVendorInWallet, setAddVendorInWallet] = useState(false);
  const [type, setType] = useState("");
  const [distributorDetail, setDistributorDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    getVendorWalletData();
    getAlsDistributor();
  }, [getVendorWalletData, getAlsDistributor]);

  const VDChangeStatus = async () => {
    if (type === "" || amount === "" || distributorDetail === "") {
      alert("Select Type or Enter Amount or Select Vendors / Distributors");
      setLoadings(false);
      buttonRef.current.disabled = false;
      return;
    } else {
      setLoadings(true);
      buttonRef.current.disabled = true;

      let distName = "";
      let distMobile = "";
      let dvWalletAmt = 0;

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
            adminId: adminId,
            adminName: adminName,
            amount: amount === 0 ? dvWalletAmt : amount,
            type: type,
            distId: distributorDetail,
            distName: distName,
            distMobile: distMobile,
            dvWalletAmt: dvWalletAmt,
            reason: reason,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.status === 201) {
        setType("");
        setAmount("");
        setReason("");
        setSelectVD("");
        setDistributorDetail("");
        hideDialog();
        setLoadings(false);
        alert(result.result);
      } else {
        alert(result.result);
      }
    }
  };

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
        ref={buttonRef}
      />
    </React.Fragment>
  );

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
            getAllDistributor();
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
            getAllDistributor();
          }}
        >
          Debit
        </button>
      </>
    );
  };

  const getVendorType = (rowData) => {
    let abc = allDistributor.map((item) => {
      if (item._id == rowData.dvId) {
        return <p className="mb-0 fw-bold">{item.type}</p>;
      }
    });
    return abc;
  };
  const [selectVd, setSelectVD] = useState("");
  const getSelectVD = (data) => {
    getAllDistributor();
    setSelectVD(data.label);
    setDistributorDetail(data.value);
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
      <div className="UserCardReports">
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
          <Column field="dvName" header="Name" sortable></Column>
          <Column
            field={getVendorType}
            header="UserType"
            body={getVendorType}
            sortable
          ></Column>
          <Column
            field="transactionDate"
            header="Date"
            style={{ display: "none" }}
            sortable
          ></Column>
          <Column
            field={showDate}
            header="Date/Time"
            body={showDate}
            bodyStyle={{ fontSize: 13 }}
            sortable
          ></Column>
          <Column field="transactionId" header="Txn ID" sortable></Column>
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
            value={dvWalletDatas}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
            globalFilter={globalFilter}
            header={headerWalletCompleteData}
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
            <Column field="transactionId" header="Txn ID" sortable></Column>
            <Column
              field="transactionDate"
              header="Date"
              style={{ display: "none" }}
              sortable
            ></Column>
            <Column
              field={showDate}
              header="Date/Time"
              body={showDate}
              bodyStyle={{ fontSize: 13 }}
              sortable
            ></Column>
            <Column field="amount" header="Amount" sortable></Column>
            <Column
              field="type"
              header="Type"
              bodyStyle={{ fontWeight: "bold" }}
              sortable
            ></Column>
            <Column field="reason" header="Reason" sortable></Column>
            <Column
              field="amountStatus"
              header="Amount Status"
              bodyStyle={{ fontWeight: "bold", color: "green" }}
              sortable
            ></Column>
          </DataTable>
          {/* <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
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
                  </tr>
                ))}
            </tbody>
          </table> */}
        </div>
      </Dialog>

      <Dialog
        visible={VDChngStatus}
        style={{
          width: "32rem",
          pointerEvents: loadings ? "none" : "",
          opacity: loadings ? 0.7 : "",
        }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={type + " Data"}
        modal
        className="p-fluid"
        footer={AddVDCreditDebitDialogFooter}
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
              <b className="text-success">{DVWalletPrice(selectedVDData)}</b>
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

      <Dialog
        visible={addVendorInWallet}
        style={{
          width: "32rem",
          pointerEvents: loadings ? "none" : "",
          opacity: loadings ? 0.7 : "",
        }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={type + " Data"}
        modal
        className="p-fluid"
        footer={AddVDCreditDebitDialogFooter}
        onHide={hideDialog}
      >
        <div
          className="row"
          disabled={loadings ? "disabled" : ""}
          aria-disabled={loadings ? "disabled" : ""}
        >
          <div className="col-lg-12">
            <label>All Vendors / Destributors</label>
            <Select
              defaultValue={selectVd}
              onChange={(text) => getSelectVD(text)}
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
};

export default VDWalletManagement;
