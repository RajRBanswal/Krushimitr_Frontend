import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";

const AllPrimeMember = () => {
  const toast = useRef(null);
  const dt = useRef(null);
  const [purachePack, setPurachePack] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    order_id: {
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
    package_name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    showDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    userMobile: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const getPurchasePackages = async () => {
    let user_package = await fetch(
      "https://krushimitr.in/api/users/all_users-purchage_package_data"
    );
    const allPack = await user_package.json();
    if (allPack.status === 201) {
      setPurachePack(allPack.result);
    } else {
      // alert(allPack.result);
    }
  };

  useEffect(() => {
    getPurchasePackages();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const showDate = (rowData) => (
    <span>{rowData.startDate + " / " + rowData.expiryDate}</span>
  );

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">All Prime Users</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card px-3 UserCard">
        <DataTable
          ref={dt}
          value={purachePack}
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
          globalFilterFields={[
            "order_id",
            "transactionId",
            "package_name",
            "userName",
            "showDate",
            "userMobile",
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
          <Column field="order_id" header="OrderId" sortable></Column>
          <Column field="transactionId" header="Txn Id" sortable></Column>
          <Column field="userName" header="Name" sortable></Column>
          <Column field="userMobile" header="Mobile" sortable></Column>
          <Column
            field="package_name"
            header="Plan"
            bodyStyle={{ color: "green" }}
            sortable
          ></Column>
          <Column field="price" header="Price" sortable></Column>
          <Column field="duration" header="Dur." sortable></Column>
          <Column
            field={showDate}
            header="Date/Exp Date"
            body={showDate}
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AllPrimeMember;
