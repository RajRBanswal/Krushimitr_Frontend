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
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "jspdf-autotable";
const AdminWalletReports = () => {
  const [price, setPrice] = useState(0);
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
    orderId: {
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
  const [addDialog, setAddDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  let success = [];
  const [filterData, setFilterData] = useState([]);
  const [editCharges, setEditCharges] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAdminWalletData = async () => {
    let all_rent_chages = await fetch(
      "https://krushimitr.in/api/admin/admin-wallet"
    );
    const allCharge = await all_rent_chages.json();
    if (allCharge.status === 201) {
      allCharge.result.map((item) => {
        success.push(item);
      });
      setFilterData(allCharge.result);
    } else {
      alert(allCharge.result);
    }
  };

  useEffect(() => {
    getAdminWalletData();
  }, []);

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
  const [date1, setDate1] = useState(null);
  const onGlobalFilterChange = (e) => {
    setDate1("");
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const showDateWiseData = (date2) => {
    if (date2 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      filterData.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterData(Datas);
    } else {
      return;
    }
  };

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4 d-flex">
          <h4 className="m-0">Admin Wallet Reports</h4>
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
  const hideDialog = () => {
    setAddDialog(false);
  };

  const SaveData = async () => {
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
      alert(result.result);
      hideDialog();
    } else {
      alert(result.result);
    }
  };
  const getDateTime = (rowData) => {
    return (
      <p className="mb-0 fw-bold" style={{ fontSize: 12 }}>
        {rowData.transactionDate}
        <br />
        {rowData.transactionTime}
      </p>
    );
  };

  const lastYearTotal = () => {
    let element = 0;
    filterData.map((item) => {
      if (item.type === "Credit" && item.amountStatus === "Done") {
        element = element + parseInt(item.amount);
      } else if (item.type === "Debit" && item.amountStatus === "Done") {
        element = element - item.amount;
      }
    });

    return "₹" + element;
  };
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totals:"
          colSpan={2}
          footerStyle={{ textAlign: "right" }}
        />
        <Column footer={lastYearTotal} />
      </Row>
    </ColumnGroup>
  );

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
            "userName",
            "distName",
            "type",
            "status",
          ]}
          footerColumnGroup={footerGroup}
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
            field={getDateTime}
            header="Date/Time"
            body={getDateTime}
            sortable
          ></Column>
          <Column field="orderId" header="Order No." sortable></Column>
          <Column field="transactionId" header="TxnId" sortable></Column>
          <Column field="openingBalance" header="Ope.Amt" sortable></Column>
          <Column field="amount" header="Amount" sortable></Column>
          <Column
            field={showClosing}
            header="ClosingBal."
            body={showClosing}
          ></Column>
          <Column
            field="type"
            header="Type"
            bodyStyle={{ fontWeight: "bold", color: "green" }}
            sortable
          ></Column>
          <Column field="userName" header="User Name"></Column>
          <Column field="distName" header="Distr/Vendor Name"></Column>
          <Column field="reason" header="Reason" sortable></Column>
          <Column field="status" header="Status" sortable></Column>
          <Column
            field="amountStatus"
            header="AmtStatus"
            bodyStyle={{ color: "green" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AdminWalletReports;
