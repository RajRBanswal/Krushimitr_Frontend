import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import moment from "moment";

function All_Users() {
  // const [tt, setTT] = useState(false);
  const [users, setUsers] = useState([]);
  const getAllUsers = async () => {
    const all_users = await fetch("https://krushimitr.in/admin/all-users");
    const uu = await all_users.json();
    // console.log(uu);
    setUsers(uu);
  };
  useEffect(() => {
    getAllUsers();
    // setTT(false)
  }, []);

  let emptyProduct = {
    _id: null,
    name: "",
    email: null,
    mobile: "",
    address: null,
    city: 0,
    state: 0,
    pincode: 0,
  };

  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [user, setUser] = useState(emptyProduct);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const confirmDeleteProduct = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteProduct = async () => {
    let user_id = user._id;
    const delete_users = await fetch(
      "https://krushimitr.in/admin/delete-user",
      {
        method: "POST",
        body: JSON.stringify({ user_id }),
        headers:{
            "Content-Type":"application/json"
        }
      }
    );
    const response = await delete_users.json();
    console.log(response);
    if (response.status === 201) {
      setDeleteUserDialog(false);
      setUser(emptyProduct);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: response.result,
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "danger",
        summary: "Not Successful",
        detail: response.result,
        life: 3000,
      });
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Excel"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
        <Button
          label="Pdf"
          icon="pi pi-file-pdf"
          className="ms-1 p-button-primary"
          onClick={exportPdf}
        />
      </>
    );
  };
  const cols = [
    { field: "_id", header: "id" },
    { field: "name", header: "Name" },
    { field: "email", header: "Email" },
    { field: "mobile", header: "Mobile" },
    { field: "address", header: "Address" },
    { field: "city", header: "City" },
    { field: "state", header: "State" },
    { field: "pincode", header: "Pin" },
    { field: "mobile", header: "Mobile" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, users);
        doc.save("users.pdf");
      });
    });
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`https://krushimitr.in/upload/${rowData.profile_image}`}
        alt={rowData.image}
        className="shadow-2 border-round"
        style={{ width: "64px" }}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <Button
          icon="pi pi-pencil"
          className="btn btn-info mr-2 btn-sm"
          onClick={() => editProduct(rowData)}
        /> */}
        <Button
          icon="pi pi-trash"
          severity="danger"
          className="btn btn-danger btn-sm"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };
  const header = (
    <div className="">
      <div className="row">
        <div className="col-lg-8">
          <h4 className="m-0">All Users</h4>
        </div>
        <div className="col-lg-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              className="form-control ps-4"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
            />
          </span>
        </div>
      </div>
    </div>
  );
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        className="ms-2"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  const addressBodyTemplate = (rowData) => {
    return (
      <p>
        {rowData.address +
          ", " +
          rowData.city +
          ", " +
          rowData.state +
          ", " +
          rowData.pincode +
          "."}
      </p>
    );
  };
  const dateBodyTemplate = (rowData) => {
    return (
      <label className="text-nowrap">
        {moment(rowData.createdAt).format("DD-MM-YYYY")}
      </label>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar
        className="py-2"
        //   left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <div className="card px-3 UserCard">
        <DataTable
          ref={dt}
          value={users}
          selection={selectedUsers}
          onSelectionChange={(e) => setSelectedUsers(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="createdAt"
            header="Date"
            sortable
            body={dateBodyTemplate}
          ></Column>
          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="email"
            header="Email"
            sortable
            className="text-break"
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="mobile"
            header="Mobile"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="address"
            header="Address"
            body={addressBodyTemplate}
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="image"
            header="Image"
            body={imageBodyTemplate}
          ></Column>
          <Column
            header="Action"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "4rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={deleteUserDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteUserDialogFooter}
        onHide={hideDeleteUserDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {user && (
            <span>
              Are you sure you want to delete <b>{user.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default All_Users;
