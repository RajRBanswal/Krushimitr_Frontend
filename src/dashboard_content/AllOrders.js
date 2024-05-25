import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Calendar } from "primereact/calendar";
function AllOrders() {
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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [compOrders, setCompOrders] = useState([]);
  const [rejectOrders, setRejectOrders] = useState([]);
  const [cancelOrders, setCancelOrders] = useState([]);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [user, setUser] = useState(emptyProduct);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [selectedUsers1, setSelectedUsers1] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilters, setGlobalFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orderNumber: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    orderDate: {
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
    paymentStatus: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    orderStatus: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [filterData, setFilterData] = useState([]);
  const [filterPendingData, setFilterPendingData] = useState([]);
  const [filterCompletedData, setFilterCompletedData] = useState([]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);
  const orderCmplt = useRef(null);
  let data = [];
  let datas = [];
  let datass = [];
  let reject = [];
  let usercancel = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async () => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (item.status === "Active" && item.orderStatus !== "Done") {
          data.push(item);
        }
        if (item.orderStatus === "Done" && item.status !== "Cancel") {
          datass.push(item);
        }
        if (
          (item.orderStatus === "Pending" && item.reason === "") ||
          (item.reason === undefined && item.status === "Active")
        ) {
          datas.push(item);
        }

        if (item.status === "Cancel") {
          usercancel.push(item);
        }
        if (
          item.reason === "" ||
          item.reason === null ||
          item.reason === undefined
        ) {
        } else {
          reject.push(item);
        }
      });
      setFilterData(data);
      setProducts(data);

      setFilterPendingData(datas);
      setProd(datas);

      setFilterCompletedData(datass);
      setCompOrders(datass);

      setRejectOrders(reject);
      setCancelOrders(usercancel);
    } else {
      setProducts(all_orders.result);
    }
  };
  useEffect(() => {
    getProductData();
    setIsLoading(false);
  }, []);

  const filterApplyTemplate = (options) => {
    return (
      <button
        type="button"
        className="btn btn-outline-primary w-100 btn-sm"
        onClick={() => {
          getOrderData(options._id);
          setReasonData("");
          getRejectCause(options._id);
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <i className="pi pi-eye"></i>
      </button>
    );
  };
  const filterApplyTemplateCompleted = (options) => {
    return (
      <div className="row">
        <div className="col-lg-4">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => getOrderData(options._id)}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <i className="pi pi-eye"></i>
          </button>
        </div>
        <div className="col-lg-4">
          <button
            type="button"
            onClick={() => {
              navigate("/admin-invoice", {
                state: { data: options, goback: "admin" },
              });
            }}
            className="btn btn-outline-info btn-sm"
          >
            <i className="pi pi-print"></i>
          </button>
        </div>
      </div>
    );
  };

  const [singleData, setSingleData] = useState("");
  const getOrderData = async (Id) => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/get-orders",
      {
        method: "post",
        body: JSON.stringify({
          orderId: Id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setSingleData(get_orders.result);
      // console.log(get_orders.result);
    } else {
      alert(get_orders.result);
    }
  };

  const [distributor, setDistributor] = useState([]);
  const getAddressWiseVender = async (address) => {
    let add = address.split(",");
    let city = add[add.length - 3].trim();
    let state = add[add.length - 2].trim();
    let pincode = add[add.length - 1].trim();
    let abc = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/get-address-wise-vender",
      {
        method: "post",
        body: JSON.stringify({
          state: state,
          city: city,
          pincode: pincode,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      get_orders.result.map((item) => {
        if (item.type === "Vendor") {
          abc.push(item);
        }
      });
      setDistributor(abc);
    } else {
      alert(get_orders.result);
    }
  };

  const [selected, setSelected] = useState("");
  const sendToVendor = async (vendorData, item, id) => {
    setSelected(vendorData);
    let orderTransferDate = moment().format("DD-MM-YYYY");
    const adminId = localStorage.getItem("admin_id");
    const adminName = localStorage.getItem("admin_name");

    const distAddress =
      vendorData.address +
      ", " +
      vendorData.city +
      ", " +
      vendorData.state +
      ", " +
      vendorData.pincode +
      ".";
    const distName = vendorData.name;
    const distMobile = vendorData.mobile;
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/send-to-vendor",
      {
        method: "post",
        body: JSON.stringify({
          vendorId: vendorData._id,
          distName: distName,
          distMobile: distMobile,
          distAddress: distAddress,
          orderId: id,
          adminId: adminId,
          adminName: adminName,
          orderData: item,
          orderTransferDate: orderTransferDate,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setIsLoading(true);
      alert(get_orders.result);
    } else {
      alert(get_orders.result);
    }
  };

  const [venderdata, setVendorData] = useState([]);
  const getVendorData = async (options) => {};

  const [distributors, setDistributors] = useState([]);

  const getDistributor = async (id) => {
    let all_products = await fetch(
      "https://krushimitr.in/api/distributor/distributor-profile",
      {
        method: "post",
        body: JSON.stringify({ distributor_id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setDistributors(get_orders.distributor);
    } else {
      alert(get_orders.message);
    }
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <div className="row">
        <div className="col-lg-12">
          <Button
            type="button"
            onClick={() => getDistributor(rowData.vendorId)}
            severity="success"
            className="btn btn-sm btn-primary"
            style={{ fontSize: "0px" }}
          >
            <i className="fa fa-eye" style={{ fontSize: "14px" }}></i>
          </Button>
          {distributors && (
            <>
              <p className="mb-0" style={{ fontSize: "14px" }}>
                {distributors.name}
              </p>
              <p className="mb-0" style={{ fontSize: "14px" }}>
                {distributors.mobile}
              </p>
            </>
          )}
        </div>
      </div>
    );
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
    // console.log(response);
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

  const exportCSVS = () => {
    orderCmplt.current.exportCSV();
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
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

  const rightToolbarTemplateCompleted = () => {
    return (
      <>
        <button
          //   label="Excel"
          //   icon="pi pi-file-excel"
          className="btn btn-outline-primary btn-sm"
          onClick={exportCSVS}
        >
          <i className="pi pi-file-excel"></i>{" "}
        </button>
        <button
          //   label="Pdf"
          //   icon="pi pi-file-pdf"
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
    { field: "paymentStatus", header: "Pay Status" },
    { field: "paymentMethod", header: "Pay Method" },
    { field: "shippingAddress", header: "Shipping Address" },
    { field: "distName", header: "Distributor Name" },
    { field: "distAddress", header: "Distributor Address" },
    { field: "orderStatus", header: "Order Status" },
    { field: "deliveryStatus", header: "Delivery Status" },
    { field: "deliveryDate", header: "Delivery Date" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, compOrders);
        doc.save("users.pdf");
      });
    });
  };

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
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const onGlobalFilterChangeDate = (e) => {
    const value = moment(e.target.value).format("DD-M-YYYY");
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const [date1, setDate1] = useState(null);
  const header = (
    <div className="row">
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
      <div className="col-lg-6 ">
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
        <Toolbar
          className="p-0 border-0"
          right={rightToolbarTemplate}
        ></Toolbar>
      </div>
    </div>
  );

  const showDateWiseData = (date2) => {
    if (date2 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      // alert(newDate1, newDate2);
      products.map((item) => {
        let newDate3 = moment(item.orderDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3._d).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterData(Datas);
    } else {
      setFilterData(products);
    }
  };
  const pending_header = (
    <div className="row">
      <div className="col-lg-6">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="form-control"
          />
        </span>
      </div>
      <div className="col-lg-6 ">
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
                showPendingDateWiseData(e.target.value);
              }}
              dateFormat="dd-mm-yy"
              placeholder="To Date"
            />
          </div>
        </div>
      </div>
    </div>
  );
  const showPendingDateWiseData = (date2) => {
    if (date2 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      // alert(newDate1, newDate2);
      prod.map((item) => {
        let newDate3 = moment(item.orderDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3._d).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterPendingData(Datas);
    } else {
      setFilterData(products);
    }
  };
  const headerComplete = (
    <div className="row">
      <div className="col-lg-4">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="form-control"
          />
        </span>
      </div>
      <div className="col-lg-6 ">
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
                showCompletedDateWiseData(e.target.value);
              }}
              dateFormat="dd-mm-yy"
              placeholder="To Date"
            />
          </div>
        </div>
      </div>
      <div className="col-lg-2 ">
        <Toolbar
          className="p-0 "
          right={rightToolbarTemplateCompleted}
        ></Toolbar>
      </div>
    </div>
  );
  const showCompletedDateWiseData = (date2) => {
    if (date2 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      // alert(newDate1, newDate2);
      compOrders.map((item) => {
        let newDate3 = moment(item.orderDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3._d).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterCompletedData(Datas);
    } else {
      setFilterData(products);
    }
  };

  const getItemData = (rowData) => {
    let xyz = JSON.parse(rowData.itemsData);
    let arr = [];
    for (let index = 0; index < xyz.length; index++) {
      let rr =
        index +
        1 +
        "). Name: " +
        xyz[index].productName +
        ", Price: " +
        xyz[index].price +
        ", Qty: " +
        xyz[index].quantity +
        ", Total: " +
        xyz[index].price * xyz[index].quantity +
        "\n";
      arr.push(rr);
    }
    return arr;
    // rowData.itemsData.map((item) => {
    // return xyz[0].productName;
    //  (
    //   <>
    //     <p className="mb-0">
    //       {item[0].productName} ({item[0].size + "" + item[0].unit})
    //     </p>
    //     <p className="mb-0">{item[0].price}</p>
    //     <p className="mb-0">{item[0].quantity}</p>
    //     <p className="mb-0">{item[0].price * item[0].quantity}</p>
    //   </>
    // );
    // });
  };

  const [reasonData, setReasonData] = useState([]);
  const getRejectCause = async (id) => {
    const rejectReason = await fetch(
      "https://krushimitr.in/api/admin/get-reject-orders-data",
      {
        method: "post",
        body: JSON.stringify({
          orderId: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await rejectReason.json();
    if (result.status === 201) {
      result.result === "" ? setReasonData("") : setReasonData(result.result);
    } else {
      setReasonData("");
    }
  };

  return (
    <div className="p-3">
      <Toast ref={toast} />
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active "
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            <h5 className="mb-0">All Orders</h5>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            <h5 className="mb-0">Pending</h5>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-contact-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-contact"
            type="button"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
          >
            <h5 className="mb-0">Completed Orders</h5>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-reject_orders-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-reject_orders"
            type="button"
            role="tab"
            aria-controls="pills-reject_orders"
            aria-selected="false"
          >
            <h5 className="mb-0">Rejected By Distributor</h5>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-cancel_users-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-cancel_users"
            type="button"
            role="tab"
            aria-controls="pills-cancel_users"
            aria-selected="false"
          >
            <h5 className="mb-0">Cancel By Users</h5>
          </button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <div className="card px-3 UserCard">
            <DataTable
              ref={dt}
              value={filterData}
              selection={selectedUsers1}
              onSelectionChange={(e) => setSelectedUsers1(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders"
              globalFilter={globalFilter}
              header={header}
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "orderNumber",
                "orderDate",
                "transactionId",
                "type",
                "userName",
                "paymentStatus",
                "orderStatus",
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
              <Column
                field="orderNumber"
                header="Order No."
                bodyStyle={{ color: "green", fontSize: 14 }}
              ></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column field="orderTime" header="Time" sortable></Column>
              <Column
                field={getItemData}
                header="Purchase Item / Price / Qty / Total"
                body={getItemData}
                style={{ display: "none" }}
              ></Column>

              <Column
                field="finalAmount"
                header="Amount"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentMethod"
                header="Pay Status"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "green" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
                bodyStyle={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="orderStatus"
                header="Order Status"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column field="transactionId" header="Txn Id" sortable></Column>
              <Column
                header="Action"
                field="_id"
                style={{ minWidth: "4rem" }}
                body={filterApplyTemplate}
                severity="success"
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
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <DataTable
            value={filterPendingData}
            sortMode="multiple"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
            header={pending_header}
            filters={filters}
            filterDisplay="menu"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders"
            globalFilterFields={[
              "orderNumber",
              "orderDate",
              "transactionId",
              "type",
              "userName",
              "paymentStatus",
              "orderStatus",
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
            <Column field="userName" header="Name" sortable></Column>
            <Column field="orderDate" header="Date" sortable></Column>
            <Column field="orderTime" header="Time" sortable></Column>
            <Column field="paymentStatus" header="Pay Status" sortable></Column>
            <Column
              field="shippingAddress"
              header="Shipping Address"
              sortable
              bodyStyle={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field={"distName"}
              header="VenderDetails"
              // body={verifiedBodyTemplate}
              bodyStyle={{ color: "green" }}
            ></Column>
            <Column
              field="orderStatus"
              header="Status"
              bodyStyle={{ color: "green", fontWeight: "bold" }}
            ></Column>
            <Column field="transactionId" header="Txn Id" sortable></Column>
          </DataTable>
        </div>
        <div
          className="tab-pane fade"
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <div className="card px-3 UserCard">
            <DataTable
              value={filterCompletedData}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders"
              header={headerComplete}
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "orderNumber",
                "orderDate",
                "transactionId",
                "type",
                "userName",
                "paymentStatus",
                "orderStatus",
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
              <Column
                field="orderNumber"
                header="Order No."
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column field="orderTime" header="Time" sortable></Column>
              <Column
                field={getItemData}
                header="Purchase Item / Price / Qty / Total"
                body={getItemData}
                style={{ display: "none" }}
              ></Column>

              <Column
                field="finalAmount"
                header="Amount"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentMethod"
                header="Pay Status"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "green" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
                bodyStyle={{ minWidth: "12rem" }}
              ></Column>
              <Column field={"distName"} header="Vender Name"></Column>
              <Column
                field="distAddress"
                header="Vender Address"
                style={{ display: "none" }}
              ></Column>
              <Column
                field="orderStatus"
                header="Order Status"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="deliveryStatus"
                header="Deli. Status"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="deliveryDate"
                header="Deli Date"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column field="transactionId" header="Txn Id" sortable></Column>
              <Column
                header="Action"
                style={{ minWidth: "8rem" }}
                body={filterApplyTemplateCompleted}
                severity="success"
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
        <div
          className="tab-pane fade"
          id="pills-reject_orders"
          role="tabpanel"
          aria-labelledby="pills-reject_orders-tab"
        >
          <DataTable
            value={rejectOrders}
            sortMode="multiple"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders"
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
            <Column field="userName" header="Name" sortable></Column>
            <Column field="orderDate" header="Date" sortable></Column>
            <Column field="orderTime" header="Time" sortable></Column>
            <Column field="paymentStatus" header="Pay Status" sortable></Column>
            <Column
              field="shippingAddress"
              header="Shipping Address"
              sortable
              bodyStyle={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field={"distName"}
              header="VenderDetails"
              // body={verifiedBodyTemplate}
              bodyStyle={{ color: "green" }}
            ></Column>
            <Column
              field="orderStatus"
              header="Status"
              bodyStyle={{ color: "green", fontWeight: "bold" }}
            ></Column>
            <Column
              field="reason"
              header="Reason"
              bodyStyle={{ color: "red", fontSize: 13 }}
            ></Column>
            <Column field="transactionId" header="Txn Id" sortable></Column>
            <Column
              header="Action"
              field="_id"
              style={{ minWidth: "4rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column>
          </DataTable>
        </div>
        <div
          className="tab-pane fade"
          id="pills-cancel_users"
          role="tabpanel"
          aria-labelledby="pills-cancel_users-tab"
        >
          <DataTable
            value={cancelOrders}
            sortMode="multiple"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "orderNumber",
              "orderDate",
              "transactionId",
              "type",
              "userName",
              "paymentStatus",
              "orderStatus",
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
            <Column field="userName" header="Name" sortable></Column>
            <Column field="orderDate" header="Date" sortable></Column>
            <Column field="orderTime" header="Time" sortable></Column>
            <Column field="paymentStatus" header="Pay Status" sortable></Column>
            <Column
              field="shippingAddress"
              header="Shipping Address"
              sortable
              bodyStyle={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field={"distName"}
              header="VenderDetails"
              bodyStyle={{ color: "green" }}
            ></Column>
            <Column
              field="status"
              header="Status"
              bodyStyle={{ color: "green", fontWeight: "bold" }}
            ></Column>
            <Column
              field="userCancelNote"
              header="Cancel Note"
              bodyStyle={{ color: "red", fontSize: 13 }}
            ></Column>
            <Column field="transactionId" header="Txn Id" sortable></Column>
            <Column
              header="Action"
              field="_id"
              style={{ minWidth: "4rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column>
          </DataTable>
        </div>
      </div>

      <div
        className="modal fade "
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Order Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body orderData">
              {singleData &&
                singleData.map((item) => {
                  let orderSize = JSON.parse(item.itemsData);
                  let orderUser = JSON.parse(item.userData);
                  let deliveryOption = "";
                  if (
                    item.deliveryMode !== undefined &&
                    item.deliveryMode !== ""
                  ) {
                    deliveryOption = JSON.parse(item.deliveryOption);
                  } else {
                    deliveryOption = "";
                  }
                  return (
                    <>
                      <table className="table table-stripped table-bordered">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Order No. : </td>
                            <td colSpan={2} className="fw-bold text-success">
                              {item.orderNumber}
                            </td>
                            <td className="fw-bold text-danger">
                              Time : {item.orderTime}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">TransactionId : </td>
                            <td colSpan={2} className="text-success">
                              {item.transactionId}
                            </td>
                            <td className="fw-bold text-danger"></td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Name : </td>
                            <td colSpan={2}>{item.userName}</td>
                            <td className="fw-bold text-danger text-nowrap">
                              Order Date : {item.orderDate}
                            </td>
                          </tr>
                          {orderUser && (
                            <tr>
                              <td className="fw-bold">Mobile No. : </td>
                              <td>{orderUser.mobile}</td>
                              <td className="fw-bold text-nowrap">Email :</td>
                              <td>{orderUser.email}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="fw-bold text-nowrap">
                              Payment Status :
                            </td>
                            <td className="fw-bold text-warning">
                              {item.paymentStatus === "Paid" ? (
                                <p className="text-success">
                                  {item.paymentStatus}
                                </p>
                              ) : (
                                <p className="text-warning">
                                  {item.paymentStatus}
                                </p>
                              )}
                            </td>
                            <td className="fw-bold text-nowrap">
                              Shipping Address :
                            </td>
                            <td>{item.shippingAddress}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold text-nowrap">
                              Payment Method :
                            </td>
                            <td className="fw-bold text-warning">
                              {item.paymentMethod}
                            </td>
                            <td className="fw-bold text-nowrap">
                              Payment Type :
                            </td>
                            <td>{item.paymentType}</td>
                          </tr>
                        </tbody>
                      </table>
                      <table className="table table-stripped table-bordered">
                        <thead>
                          <tr>
                            <th colSpan={6}>
                              <h5 className="fw-bold text-secondary">
                                Products Details
                              </h5>
                            </th>
                          </tr>
                          <tr>
                            <th style={{ fontSize: 14 }}>Sr.No.</th>
                            <th style={{ fontSize: 14 }}>Product</th>
                            <th style={{ fontSize: 14 }}>Size</th>
                            <th style={{ fontSize: 14 }}>Price</th>
                            <th style={{ fontSize: 14 }}>Quantity</th>
                            <th style={{ fontSize: 14 }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderSize &&
                            orderSize.map((elem, index) => {
                              return (
                                <tr>
                                  <td style={{ fontSize: 14 }}>{index + 1}</td>
                                  <td style={{ fontSize: 14 }}>
                                    {elem.productName}
                                  </td>
                                  <td style={{ fontSize: 14 }}>
                                    {elem.size} {elem.unit ? elem.unit : ""}
                                  </td>
                                  <td style={{ fontSize: 14 }}>{elem.price}</td>
                                  <td style={{ fontSize: 14 }}>
                                    {elem.quantity}
                                  </td>
                                  <td style={{ fontSize: 14 }}>
                                    {elem.price * elem.quantity}
                                  </td>
                                </tr>
                              );
                            })}
                          <tr>
                            <td></td>
                            <td className="text-danger fw-bold">
                              Total Amount
                            </td>
                            <td colSpan={4} className="text-danger fw-bold">
                              ₹ {item.finalAmount}
                              {item.withWallet !== undefined ||
                              item.withWallet > 0
                                ? " ( Wallet Use : ₹ " + item.withWallet + ")"
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>
                              {item.orderStatus === "Done" ||
                              item.status === "Cancel" ||
                              item.vendorId !== "" ? (
                                ""
                              ) : (
                                <div className="btn-group">
                                  <button
                                    type="button"
                                    className="btn btn-warning dropdown-toggle btn-sm"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={() => {
                                      getAddressWiseVender(
                                        item.shippingAddress
                                      );
                                    }}
                                  >
                                    Shipped to Distributor
                                  </button>
                                  <ul className="dropdown-menu">
                                    {distributor &&
                                      distributor.map((ele) => {
                                        return (
                                          <li>
                                            <Link
                                              className="dropdown-item"
                                              to=""
                                              style={{
                                                borderBottom:
                                                  "0.5px solid #b8b8b8",
                                              }}
                                              onClick={() => {
                                                sendToVendor(
                                                  ele,
                                                  item,
                                                  item._id
                                                );
                                              }}
                                              data-bs-dismiss="modal"
                                            >
                                              {ele.name} ( {ele.address},{" "}
                                              {ele.city}, {ele.pincode} )
                                            </Link>
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              )}
                              {selected ? (
                                <label className="text-success">
                                  {selected.name} ( {selected.address},
                                  {selected.city}, {selected.pincode} )
                                </label>
                              ) : (
                                ""
                              )}
                            </td>
                            <td>
                              {/* <button
                              type="button"
                              className="btn btn-danger btn-sm"
                            >
                              Dispatch
                            </button> */}
                            </td>
                          </tr>
                          {reasonData &&
                            reasonData.map((ele) => (
                              <>
                                <tr>
                                  <td colSpan={4}>
                                    <h5>Reject Order Details</h5>
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    className="text-danger fw-bold"
                                    colSpan={2}
                                  >
                                    Distributor / Vendor : {ele.distrName}
                                  </td>
                                  <td
                                    className="text-danger fw-bold"
                                    colSpan={2}
                                  >
                                    Reason : {ele.reason}
                                  </td>
                                </tr>
                              </>
                            ))}
                          <tr>
                            <th colSpan={6}>
                              <h5 className="fw-bold text-secondary">
                                Vendor Details
                              </h5>
                            </th>
                          </tr>
                          <tr>
                            <th>Vendor Name</th>
                            <td className="" colSpan={2}>
                              {item.distName}
                            </td>
                            <th>Vendor Mobile</th>
                            <td className="" colSpan={2}>
                              {item.distMobile}
                            </td>
                          </tr>
                          <tr>
                            <th>Vendor Address</th>
                            <td className="" colSpan={5}>
                              {item.distAddress}
                            </td>
                          </tr>
                          <tr>
                            <th colSpan={6}>
                              <h5 className="fw-bold text-secondary">
                                Delivery Details
                              </h5>
                            </th>
                          </tr>
                          <tr>
                            <th>Delivery Status</th>
                            <th colSpan={2} className="text-success">
                              {item.deliveryStatus}
                            </th>
                            <th>Shipping Mode</th>
                            <th className="text-success">
                              {item.deliveryMode}
                            </th>
                          </tr>
                          {item.shippingStatus === undefined ||
                          item.shippingStatus === "" ? (
                            <>
                              <tr>
                                <td className="fw-bold text-nowrap">
                                  Delivery Date/Time :
                                </td>
                                <td colSpan={2}>
                                  {item.deliveryDate === undefined
                                    ? ""
                                    : item.deliveryDate +
                                      " / " +
                                      item.shippingTime}
                                </td>
                                <td className="fw-bold text-nowrap">
                                  Delivery Status:
                                </td>
                                <td colSpan={2}>{item.deliveryStatus}</td>
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr>
                                <td className="fw-bold text-nowrap">
                                  Distributor Name :
                                </td>
                                <td colSpan={2}>{item.shippingDistName}</td>
                                <td className="fw-bold text-nowrap">
                                  Shipping Date/Time :
                                </td>
                                <td
                                  colSpan={2}
                                  className="fw-bold"
                                  style={{ fontSize: 14 }}
                                >
                                  {item.shippingDate +
                                    " / " +
                                    item.shippingTime}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-bold text-nowrap">
                                  Shipping Status :
                                </td>
                                <td colSpan={2} className="fw-bold">
                                  {item.shippingStatus}
                                </td>
                                <td className="fw-bold text-nowrap">
                                  Shipping Mode :
                                </td>
                                <td colSpan={2}>{item.deliveryMode}</td>
                              </tr>
                            </>
                          )}
                          {item.deliveryMode !== undefined &&
                          item.deliveryMode === "Vehical" ? (
                            <tr>
                              <td className="fw-bold text-nowrap">
                                Vehical No :
                              </td>
                              <td colSpan={2} className="fw-bold">
                                {deliveryOption.vehicalNo}
                              </td>
                              <td className="fw-bold text-nowrap">
                                Driver Mobile :
                              </td>
                              <td colSpan={2}>
                                {deliveryOption.driverMobileNo}
                              </td>
                            </tr>
                          ) : item.deliveryMode === "Courier" ? (
                            <tr>
                              <td className="fw-bold text-nowrap">
                                Tracking Link :
                              </td>
                              <td colSpan={2} className="fw-bold">
                                {deliveryOption.trackingLink}
                              </td>
                              <td className="fw-bold text-nowrap">
                                Token No :
                              </td>
                              <td colSpan={2}>{deliveryOption.tokenNo}</td>
                            </tr>
                          ) : (
                            ""
                          )}
                        </tbody>
                      </table>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllOrders;
