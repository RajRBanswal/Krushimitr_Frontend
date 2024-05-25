import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
function AllPackages() {
  const navigate = useNavigate();
  const [package_name, setPackage_Name] = useState(0);
  const [price, setPrice] = useState(0);

  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  const [filterData, setFilterData] = useState([]);
  const [editPackage, setEditPackage] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPackages = async () => {
    let success = [];
    let all_package = await fetch(
      "https://krushimitr.in/api/admin/all-packages"
    );
    const allPack = await all_package.json();
    if (allPack.status === 201) {
      allPack.result.map((item) => {
        success.push(item);
      });
      setFilterData(allPack.result);
    } else {
      alert(allPack.result);
    }
  };

  useEffect(() => {
    getPackages();
  }, [getPackages]);

  const openNew = () => {
    setAddDialog(true);
  };

  const deletePackage = async (id) => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/delete-packages/" + id
    );
    const result = await response.json();
    if (result.status === 201) {
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
          className="btn btn-outline-info btn-sm "
          onClick={() => {
            setEditPackage(options);
            setEditDialog(true);
          }}
        >
          <i className="pi pi-pencil"></i>Edit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm ms-1"
          onClick={() => deletePackage(options._id)}
        >
          <i className="pi pi-trash"></i>Delete
        </button>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm ms-1"
          onClick={() => navigate("/admin/set-commission/" + options._id)}
        >
          Set Commission
        </button>
      </>
    );
  };
  const checkStatus = (rowData) => {
    if (rowData.status === "Active") {
      return <button className="btn btn-success btn-sm">Active</button>;
    } else {
      return <button className="btn btn-success btn-sm">Deactive</button>;
    }
  };

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-6 d-flex">
          <h4 className="m-0">All Packages</h4>
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
            <i className="pi pi-plus"></i> Add Package
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
      "https://krushimitr.in/api/admin/add-package",
      {
        method: "post",
        body: JSON.stringify({ package_name, price, adminId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      alert(result.result);
      hideDialog();
      setPackage_Name("");
      setPrice("");
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
      "https://krushimitr.in/api/admin/update-package",
      {
        method: "post",
        body: JSON.stringify({
          id: editPackage._id,
          package_name: package_name,
          price: price,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      hideEditDialog();
      setPackage_Name("");
      setPrice("");
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

      <div className="card px-3">
        <DataTable
          ref={orderCmplt}
          value={filterData}
          selection={successData}
          onSelectionChange={(e) => setSuccessData(e.value)}
          dataKey="_id"
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
          <Column
            field="package_name"
            header="package_name"
            bodyStyle={{ fontWeight: "bold" }}
            headerStyle={{ textAlign: "center" }}
            sortable
          ></Column>
          <Column
            field="price"
            header="Price"
            bodyStyle={{ fontWeight: "bold" }}
            sortable
          ></Column>
          <Column field="date" header="Created Data" sortable></Column>
          <Column field="status" header="Status" body={checkStatus}></Column>
          <Column
            header="Action"
            bodyStyle={{ width: "30%" }}
            body={filterApplyTemplate}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        visible={addDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Add Package"}
        modal
        className="p-fluid"
        footer={AddPriceDialogFooter}
        onHide={hideDialog}
      >
        <div className="row">
          <div className="col-lg-12">
            <label>Package Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Package Name"
              onChange={(e) => setPackage_Name(e.target.value)}
            />
          </div>
          <div className="col-lg-12">
            <label>Price (in RS.)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={editDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Edit Package"}
        modal
        className="p-fluid"
        footer={EditPriceDialogFooter}
        onHide={hideEditDialog}
      >
        <div className="row">
          <div className="col-lg-5">
            <label>Package Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Package Name"
              onChange={(e) => setPackage_Name(e.target.value)}
              defaultValue={editPackage && editPackage.package_name}
            />
          </div>
          <div className="col-lg-6">
            <label>Price (in RS.)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Price"
              onChange={(e) => setPrice(e.target.value)}
              defaultValue={editPackage && editPackage.price}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default AllPackages;
