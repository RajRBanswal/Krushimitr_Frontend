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
const AdminWalletReports = () => {
  const [price, setPrice] = useState(0);

  const [addDialog, setAddDialog] = useState(false);
  const [successData, setSuccessData] = useState([]);
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
      setSuccessData(allCharge.result);
    } else {
      alert(allCharge.result);
    }
  };

  useEffect(() => {
    getAdminWalletData();
  }, [getAdminWalletData]);

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

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-6 d-flex">
          <h4 className="m-0">Admin Wallet Reports</h4>
        </div>
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
        >
          <Column field="transactionDate" header="Date" sortable></Column>
          <Column field="transactionTime" header="Time" sortable></Column>
          <Column field="amount" header="Amount" sortable></Column>
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
        </DataTable>
      </div>
    </div>
  );
};

export default AdminWalletReports;
