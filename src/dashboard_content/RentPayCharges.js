import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

function RentPayCharges() {
  const [price, setPrice] = useState(0);
  const [charges, setCharges] = useState(0);

  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [successData, setSuccessData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  let success = [];
  const [filterData, setFilterData] = useState([]);
  const [editCharges, setEditCharges] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRentPayChargesData = async () => {
    let all_rent_chages = await fetch(
      "https://krushimitr.in/api/admin/all-rent-pay-charges"
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
    getRentPayChargesData();
  }, [getRentPayChargesData]);

  const openNew = () => {
    setAddDialog(true);
  };

  const deleteCharges = async (id) => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/delete-rent-pay-charges",
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
      hideDialog();
      alert(result.result);
    } else {
      alert(result.result);
    }
  };
  const filterApplyTemplate = (options) => {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => deleteCharges(options._id)}
        >
          <i className="pi pi-trash"></i>
        </button>
        <button
          type="button"
          className="btn btn-outline-info btn-sm ms-1"
          onClick={() => {
            setEditCharges(options);
            setEditDialog(true);
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
          <h4 className="m-0">Rent Pay Charges</h4>
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
  const hideEditDialog = () => {
    setEditDialog(false);
  };

  const SaveData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/add-rent-pay-charges",
      {
        method: "post",
        body: JSON.stringify({ price, charges, adminId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      alert(result.result);
      hideDialog();
      setPrice("");
      setCharges("");
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
  const UpdateData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/update-rent-pay-charges",
      {
        method: "post",
        body: JSON.stringify({
          id: editCharges._id,
          price: price,
          charges: charges,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      hideEditDialog();
      setPrice("");
      setCharges("");
      alert(result.result);
    } else {
      alert(result.result);
    }
  };

  const EditPriceDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideEditDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="ms-1"
        onClick={UpdateData}
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
          <Column
            field="price"
            header="price"
            bodyStyle={{ fontWeight: "bold" }}
            sortable
          ></Column>
          <Column
            field="percent"
            header="Charges (in %)"
            bodyStyle={{ fontWeight: "bold", textAlign: "center" }}
            sortable
          ></Column>
          <Column
            field="status"
            header="Status"
            sortable
            bodyStyle={{ color: "green" }}
          ></Column>
          <Column
            header="Action"
            style={{ minWidth: "4rem" }}
            body={filterApplyTemplate}
            severity="success"
          ></Column>
        </DataTable>
      </div>
      <Dialog
        visible={addDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Add Rent Pay Charges"}
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
          <div className="col-lg-12 mt-3">
            <label>Rent Pay Charges (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Rent Pay Charges"
              onChange={(e) => setCharges(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={editDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Update Rent Pay Charges"}
        modal
        className="p-fluid"
        footer={EditPriceDialogFooter}
        onHide={hideEditDialog}
      >
        <div className="row">
          <div className="col-lg-12">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              defaultValue={editCharges && editCharges.price}
            />
          </div>
          <div className="col-lg-12 mt-3">
            <label>Rent Pay Charges (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Rent Pay Charges"
              onChange={(e) => setCharges(e.target.value)}
              defaultValue={editCharges && editCharges.percent}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
export default RentPayCharges;
