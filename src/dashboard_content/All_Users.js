import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primereact/api";

function All_Users() {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    email: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    mobile: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },

    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllUsers = async () => {
    const all_users = await fetch("https://krushimitr.in/api/admin/all-users");
    const uu = await all_users.json();
    if (uu) {
      let allUsers = [];
      let DeleteUsers = [];
      uu.map((item) => {
        if (item.status === "Active") {
          allUsers.push(item);
        } else {
          DeleteUsers.push(item);
        }
      });
      setUsers(allUsers);
      setDeletedUsers(DeleteUsers);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

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
      "https://krushimitr.in/api/admin/delete-user",
      {
        method: "POST",
        body: JSON.stringify({ user_id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await delete_users.json();
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
  const leftToolbarTemplate = () => {
    return (
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
            Active Users
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
            Deleted Users
          </button>
        </li>
      </ul>
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const header = (
    <div className="">
      <div className="row">
        <div className="col-lg-8">
          <h4 className="m-0">All Users</h4>
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

  // const password = (rowData) => {
  //   if (rowData.stringPassword.length > 0) {
  //     return <span>{rowData.stringPassword}</span>;
  //   }else{
  //     return <span>**********</span>;
  //   }
  // };

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar
        className="py-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>

      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active px-1"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
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
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={["name", "email", "mobile", "status"]}
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
            {/* <Column
              field={password}
              header="Password"
              body={password}
              sortable
            ></Column> */}
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
        <div
          class="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <DataTable
            ref={dt}
            value={deletedUsers}
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
            <Column field="stringPassword" header="Password" sortable></Column>
            <Column
              field="image"
              header="Image"
              body={imageBodyTemplate}
            ></Column>
            {/* <Column
              header="Action"
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "4rem" }}
            ></Column> */}
          </DataTable>
        </div>
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
