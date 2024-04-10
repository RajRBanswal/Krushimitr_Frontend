import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";

function AllRentPayData() {
  // const [addDialog, setAddDialog] = useState(false);
  const [successData, setSuccessData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  const [filterData, setFilterData] = useState([]);

  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRentPayData = async () => {
    let pending = [];
    let accept = [];
    let reject = [];
    const data = await fetch("https://krushimitr.in/api/users/get-rent-pay");
    const getData = await data.json();
    if (getData.status === 201) {
      getData.result.map((item) => {
        if (item.status === "Pending") {
          pending.push(item);
        } else if (item.status === "Accept") {
          accept.push(item);
        } else if (item.status === "Reject") {
          reject.push(item);
        }
      });
      setPendingData(pending);
      setAcceptedData(accept);
      setRejectedData(reject);

      setFilterData(getData.result);
    } else {
      alert(getData.result);
    }
  };

  useEffect(() => {
    getRentPayData();
  }, []);

  const ChangeStatus = async (status, rowData) => {
    const rentPayStatus = await fetch(
      "https://krushimitr.in/api/admin/rent_pay-status",
      {
        method: "post",
        body: JSON.stringify({ status: status, data: rowData }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await rentPayStatus.json();
    if (result.status === 201) {
      alert(result.result);
    } else {
      alert(result.message);
    }
  };

  const filterApplyTemplate = (options) => {
    return (
      <>
        <button
          className="btn btn-success btn-sm"
          onClick={() => ChangeStatus("Accept", options)}
        >
          Accept
        </button>
        <button
          className="btn btn-danger btn-sm ms-1"
          onClick={() => ChangeStatus("Reject", options)}
        >
          Reject
        </button>
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
          <h4 className="m-0">All Rent Pay Data</h4>
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
      let pDatas = [];
      let aDatas = [];
      let rDatas = [];
      pendingData.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          pDatas.push(item);
        }
      });
      acceptedData.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          aDatas.push(item);
        }
      });
      rejectedData.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          rDatas.push(item);
        }
      });

      setPendingData(pDatas);
      setAcceptedData(aDatas);
      setRejectedData(rDatas);
    } else {
      setDate1("");
      return;
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="card p-3 UserCardReports">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="pills-Pending-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-Pending"
              type="button"
              role="tab"
              aria-controls="pills-Pending"
              aria-selected="true"
            >
              Pending Rent Pay
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Accepted Rent Pay
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link "
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Rejected Rent Pay
            </button>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-Pending"
            role="tabpanel"
            aria-labelledby="pills-Pending-tab"
          >
            <div className="table-responsive" style={{ overflow: "auto" }}>
              <DataTable
                ref={orderCmplt}
                value={pendingData}
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
                  field="transactionDate"
                  header="Date"
                  bodyStyle={{ fontWeight: "bold", color: "green" }}
                  sortable
                ></Column>
                <Column field="userName" header="Name" sortable></Column>
                <Column
                  field="amount"
                  header="Amount"
                  bodyStyle={{ fontWeight: "bold", color: "red" }}
                  sortable
                ></Column>
                <Column field="userMobile" header="Mobile" sortable></Column>
                <Column
                  field="types"
                  header="Types"
                  bodyStyle={{ color: "green", fontWeight: "bold" }}
                ></Column>
                <Column
                  header="Status"
                  field="status"
                  bodyStyle={{ color: "goldenrod", fontWeight: "bold" }}
                ></Column>
                <Column field="accountNo" header="Acount No."></Column>
                <Column field="ifscCode" header="IFSC Code"></Column>
                <Column field="paymode" header="Pay Mode"></Column>
                <Column field="utrNo" header="UTR No"></Column>
                <Column
                  field="_id"
                  header="Action"
                  body={filterApplyTemplate}
                ></Column>
              </DataTable>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div className="table-responsive" style={{ overflow: "auto" }}>
              <DataTable
                ref={orderCmplt}
                value={acceptedData}
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
                  field="transactionDate"
                  header="Date"
                  bodyStyle={{ fontWeight: "bold", color: "green" }}
                  sortable
                ></Column>
                <Column field="userName" header="Name" sortable></Column>
                <Column
                  field="amount"
                  header="Amount"
                  bodyStyle={{ fontWeight: "bold", color: "red" }}
                  sortable
                ></Column>
                <Column field="userMobile" header="Mobile" sortable></Column>
                <Column
                  field="types"
                  header="Types"
                  bodyStyle={{ color: "green", fontWeight: "bold" }}
                ></Column>
                <Column
                  header="Status"
                  field="status"
                  bodyStyle={{ color: "green", fontWeight: "bold" }}
                ></Column>
                <Column field="accountNo" header="Acount No."></Column>
                <Column field="ifscCode" header="IFSC Code"></Column>
                <Column field="paymode" header="Pay Mode"></Column>
                <Column field="utrNo" header="UTR No"></Column>
                {/* <Column
                  field="_id"
                  header="Action"
                  body={filterApplyTemplate}
                ></Column> */}
              </DataTable>
            </div>
          </div>
          <div
            class="tab-pane fade "
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <div className="table-responsive" style={{ overflow: "auto" }}>
              <DataTable
                ref={orderCmplt}
                value={rejectedData}
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
                  field="transactionDate"
                  header="Date"
                  bodyStyle={{ fontWeight: "bold", color: "green" }}
                  sortable
                ></Column>
                <Column field="userName" header="Name" sortable></Column>
                <Column
                  field="amount"
                  header="Amount"
                  bodyStyle={{ fontWeight: "bold", color: "red" }}
                  sortable
                ></Column>
                <Column field="userMobile" header="Mobile" sortable></Column>
                <Column
                  field="types"
                  header="Types"
                  bodyStyle={{ color: "green", fontWeight: "bold" }}
                ></Column>
                <Column
                  header="Status"
                  field="status"
                  bodyStyle={{ color: "red", fontWeight: "bold" }}
                ></Column>
                <Column field="accountNo" header="Acount No."></Column>
                <Column field="ifscCode" header="IFSC Code"></Column>
                <Column field="paymode" header="Pay Mode"></Column>
                <Column field="utrNo" header="UTR No"></Column>
                {/* <Column
                  field="_id"
                  header="Action"
                  body={filterApplyTemplate}
                ></Column> */}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllRentPayData;
