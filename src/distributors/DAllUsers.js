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
function DAllUsers() {
  let distr = localStorage.getItem("distributor_id");
  const [distributor, setDistributor] = useState(distr);
  const [usersId, setUsersId] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    email: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async () => {
    let data = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (distributor === item.vendorId) {
          data.push(item.userId);
        }
      });
      setUsersId(uniq(data));
      getAllUsers();
    } else {
      console.log(all_orders.result);
    }
  };
  function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }

  const [users, setUsers] = useState([]);
  const getAllUsers = async () => {
    let abc = [];
    const all_users = await fetch("https://krushimitr.in/api/admin/all-users");
    const uu = await all_users.json();
    usersId.map((elem) => {
      uu.map((item) => {
        if (elem === item._id) {
          abc.push(item);
        }
      });
    });
    setUsers(abc);
  };
  useEffect(() => {
    getProductData();
  }, [distr, getProductData]);

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
      <button
        className="btn btn-primary btn-sm"
        // onClick={() => confirmDeleteProduct(rowData)}
      >
        <i className="pi pi-eye"></i>
      </button>
    );
  };

  const [globalFilterValue, setGlobalFilterValue] = useState("");
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
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["name", "email", "mobile", "status"]}
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

export default DAllUsers;
