import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import loading from "../images/loading.gif";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Calendar } from "primereact/calendar";
const AdminWallet = () => {
  const [price, setPrice] = useState(0);
  const [loadings, setLoadings] = useState(false);
  const [loadPage, setLoadPage] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [successData, setSuccessData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  const [filterData, setFilterData] = useState([]);
  const [editCharges, setEditCharges] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    transactionDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    orderId: {
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
    distName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
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
  const getAdminWalletData = async () => {
    setLoadPage(true);
    let success = [];
    let all_rent_chages = await fetch(
      "https://krushimitr.in/api/admin/admin-wallet"
    );
    const allCharge = await all_rent_chages.json();
    if (allCharge.status === 201) {
      allCharge.result.map((item) => {
        success.push(item);
      });
      setFilterData(allCharge.result);
      setSuccessData(allCharge.result);
    } else {
      alert(allCharge.result);
    }
  };

  useEffect(() => {
    getAdminWalletData();
  }, [loadPage]);

  const openNew = () => {
    setAddDialog(true);
  };

  const filterApplyTemplate = (options) => {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-info btn-sm ms-1"
          onClick={() => {
            setEditCharges(options);
          }}
        >
          <i className="pi pi-pencil"></i>
        </button>
      </>
    );
  };

  const onGlobalFilterChange = (e) => {
    setDate2("");
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onGlobalFilterChangeDate = (e) => {
    let dates = moment(e.target.value).format("DD-MM-YYYY");
    let _filters = { ...filters };
    _filters["global"].value = dates;
    setFilters(_filters);
    setGlobalFilterValue(dates);
  };

  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-3 d-flex">
          <h4 className="m-0">Admin Wallet</h4>
        </div>
        <div className="col-lg-3">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              className="form-control ps-5"
            />
          </span>
        </div>
        <div className="col-lg-3">
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
                  setDate2(e.target.value);
                  showDateWiseData(e.target.value);
                }}
                dateFormat="dd-mm-yy"
                placeholder="To Date"
              />
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            onClick={openNew}
            className="btn btn-outline-info btn-sm m-auto w-100"
          >
            <i className="pi pi-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  );

  const showDateWiseData = (datea) => {
    if (date2 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(datea).toISOString();
      let Datas = [];
      successData.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3._d).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterData(Datas);
    } else {
      setLoadPage(true);
      setFilterData(successData);
    }
  };

  const hideDialog = () => {
    setAddDialog(false);
  };

  const SaveData = async (e) => {
    e.preventDefault();
    setLoadings(true);
    const response = await fetch(
      "https://krushimitr.in/api/admin/add-admin-wallet",
      {
        method: "post",
        body: JSON.stringify({ userId: adminId, walletAmount: price }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      setLoadings(false);
      hideDialog();
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
  const dateTime = (rowData) => {
    return rowData.transactionDate + " / " + rowData.transactionTime;
  };

  const showClosing = (rowData) => {
    if (rowData.openingBalance === undefined || rowData.openingBalance === "") {
      return "";
    } else {
      return parseInt(rowData.openingBalance) + parseInt(rowData.amount);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <img
        src={loading}
        className={"loader " + (loadings ? "d-block" : "d-none")}
        alt=""
      />
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
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            "orderId",
            "transactionDate",
            "transactionId",
            "type",
            "userName",
            "distName",
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
          <Column field="orderId" header="Order Id" sortable></Column>
          <Column field="transactionId" header="Txn ID" sortable></Column>
          <Column
            field={dateTime}
            header="Date / Time"
            body={dateTime}
            sortable
          ></Column>
          {/* <Column field="transactionTime" header="Time" sortable></Column> */}
          <Column field="openingBalance" header="OpeningAmt" sortable></Column>
          <Column field="amount" header="Amount" sortable></Column>
          <Column
            field={showClosing}
            header="ClosingBal."
            body={showClosing}
          ></Column>
          <Column
            field="type"
            header="Type"
            bodyStyle={{ color: "blue", fontWeight: "bold" }}
            sortable
          ></Column>
          <Column field="userName" header="User Name"></Column>
          <Column field="distName" header="Distr/Vendor Name"></Column>
          <Column field="reason" header="Reason" sortable></Column>
          <Column
            field="status"
            header="Status"
            bodyStyle={{ color: "green" }}
            sortable
          ></Column>
          <Column
            field="amountStatus"
            header="AmtStatus"
            bodyStyle={{ color: "green" }}
            sortable
          ></Column>
          {/* <Column
            header="Action"
            style={{ minWidth: "4rem" }}
            body={filterApplyTemplate}
            severity="success"
          ></Column> */}
        </DataTable>
      </div>
      <Dialog
        visible={addDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Add Amount"}
        modal
        className="p-fluid"
        footer={AddPriceDialogFooter}
        onHide={hideDialog}
      >
        <div className="row">
          <div className="col-lg-12">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminWallet;
