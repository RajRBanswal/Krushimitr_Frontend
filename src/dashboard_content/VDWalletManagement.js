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
const VDWalletManagement = () => {
  const [addDialog, setAddDialog] = useState(false);
  const [walletData, setWalletData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const adminId = localStorage.getItem("admin_id");
  const adminName = localStorage.getItem("admin_name");
  const toast = useRef(null);
  const walletRef = useRef(null);
  const [filterData, setFilterData] = useState([]);

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
    setVDChngStatus(false);
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

  const [date1, setDate1] = useState(null);

  const headerWalletComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4 d-flex">
          <h4 className="m-0">Vendor/Distributor Wallet Management</h4>
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
  const [type, setType] = useState("");
  const [distributorDetail, setDistributorDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    getVendorWalletData();
  }, [getVendorWalletData]);

  const VDChangeStatus = async () => {
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
      hideDialog();
      alert(result.result);
    } else {
      alert(result.result);
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
  return (
    <div className="py-3 px-2">
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
        >
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
    </div>
  );
};

export default VDWalletManagement;
