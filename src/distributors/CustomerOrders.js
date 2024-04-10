import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forEditOrder } from "../redux/slice/OrderSlice";
import { emptyCart } from "../redux/slice/CartSlice";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";
function CustomerOrders() {
  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const [DistAllOrders, setDistAllOrders] = useState([]);
  const [userCancel, setUserCancel] = useState([]);
  const [rejectOrder, setRejectOrder] = useState([]);
  const [rejectData, setRejectData] = useState([]);
  const [reason, setReason] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let distr = localStorage.getItem("distributor_id");
  let distrName = localStorage.getItem("distributor_name");
  const [distributor, setDistributor] = useState(distr);

  const [globalFilter, setGlobalFilter] = useState(null);
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
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [distData, setDistData] = useState(distr);
  const getRejectedOrders = async () => {
    getProductData();
    let all_rejected = await fetch(
      "https://krushimitr.in/api/distributor/get-reject-orders",
      {
        method: "post",
        body: JSON.stringify({ distributor }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const all_orders = await all_rejected.json();
    if (all_orders.status === 201) {
      setRejectOrder(all_orders.result);
    } else {
      setRejectOrder(all_orders.result);
    }
  };
  const getProductData = async () => {
    let DistData = [];
    let data = [];
    let datas = [];
    let datass = [];
    let usercancel = [];
    let rejects = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (distributor === item.vendorId && item.status === "Active") {
          data.push(item);
        }
        if (
          distributor === item.VId &&
          item.VType === "Distributor" &&
          item.status === "Active"
        ) {
          DistData.push(item);
        }

        if (
          item.vendorId === distributor &&
          item.orderStatus === "Pending" &&
          item.status === "Active"
        ) {
          datas.push(item);
        }
        if (item.vendorId === distributor && item.orderStatus === "Done") {
          datass.push(item);
        }
        if (item.vendorId === distributor && item.status === "Cancel") {
          usercancel.push(item);
        }
        if (rejectOrder !== "") {
          rejectOrder.map((elem) => {
            if (elem.orderId === item._id) {
              rejects.push(item);
            }
          });
        }
      });
      setDistAllOrders(DistData);
      setProducts(data);
      setProd(datas);
      setOrderDone(datass);
      setUserCancel(usercancel);
      setRejectData(rejects);
    } else {
      setProducts(all_orders.result);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      let result = await fetch(
        "https://krushimitr.in/api/distributor/distributor-profile",
        {
          method: "post",
          body: JSON.stringify({ distributor_id: distributor }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let res = await result.json();
      if (res.status === 201) {
        setDistData(res.distributor);
      } else {
        alert(res.message);
      }
    };
    getProfile();
    getRejectedOrders();

    dispatch(emptyCart());
  }, []);

  const completedOrders = (options) => {
    return (
      <div className="d-flex">
        <button
          type="button"
          className="btn btn-info btn-sm "
          onClick={() => {
            navigate("/invoice", {
              state: { data: options, goback: "distributor" },
            });
          }}
        >
          <i className="pi pi-print"></i>
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm ms-2"
          onClick={() => getOrderData(options._id)}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i className="pi pi-eye"></i>
        </button>
      </div>
    );
  };
  const CancelByUsers = (options) => {
    return (
      <button
        type="button"
        className="btn btn-primary btn-sm ms-2"
        onClick={() => getOrderData(options._id)}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <i className="pi pi-eye"></i>
      </button>
    );
  };

  const filterApplyTemplate = (options) => {
    return (
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        onClick={() => {
          getOrderData(options._id);
          setSingleData("");
        }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <i className="pi pi-eye"></i>
      </button>
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
    } else {
      alert(get_orders.result);
    }
  };

  //   const [venderdata, setVendorData] = useState([]);
  //   const getVendorData = async (options) => {};

  //   const [distributors, setDistributors] = useState([]);
  //   const verifiedBodyTemplate = (rowData) => {
  //     return (
  //       <div className="row">
  //         <div className="col-lg-12">
  //           <Button
  //             type="button"
  //             onClick={() => getDistributor(rowData._id)}
  //             severity="success"
  //             data-bs-toggle="modal"
  //             data-bs-target="#exampleModals"
  //           >
  //             View Vender
  //           </Button>
  //         </div>
  //       </div>
  //     );
  //   };

  const RejectOrder = async (orderId) => {
    const response = await fetch(
      "https://krushimitr.in/api/distributor/reject-order",
      {
        method: "post",
        body: JSON.stringify({ orderId, distributor, reason, distrName }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      alert(result.result);
      setReason("");
    } else {
      alert(result.result);
      setReason("");
    }
  };
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

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
        <Calendar
          showButtonBar
          value={globalFilterValue}
          onChange={onGlobalFilterChangeDate}
          dateFormat="dd-m-yy"
          placeholder="Select Date"
        />
      </span>
    </div>
  );

  return (
    <div className="p-3">
      {/* {distData.type === "Distributor" ? (
        <div className="">
          <h3 className="mb-3">All Orders for Customers</h3>
          <DataTable
            value={DistAllOrders}
            sortMode="multiple"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "100%" }}
          >
            <Column
              field="orderNumber"
              header="Order No"
              sortable
              bodyStyle={{ fontSize: 12, fontWeight: 600 }}
            ></Column>
            <Column field="userName" header="Name" sortable></Column>
            <Column field="orderDate" header="Date" sortable></Column>
            <Column
              field="paymentStatus"
              header="Pay Status"
              sortable
              bodyStyle={{ color: "red" }}
            ></Column>
            <Column
              field="shippingAddress"
              header="Shipping Address"
              sortable
            ></Column>
            <Column
              field="orderStatus"
              header="Order Status"
              style={{ fontSize: 14 }}
              bodyStyle={{ color: "green", fontWeight: "bold" }}
              sortable
            ></Column>
            <Column
              header="Action"
              field="_id"
              // style={{ minWidth: "12rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column>
          </DataTable>
        </div>
      ) : ( */}
      <>
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
              <h5 className="mb-0">Pending Orders</h5>
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
              id="pills-cancel_user-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-cancel_user"
              type="button"
              role="tab"
              aria-controls="pills-cancel_user"
              aria-selected="false"
            >
              <h5 className="mb-0">Cancel By User</h5>
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-rejected_orders-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-rejected_orders"
              type="button"
              role="tab"
              aria-controls="pills-rejected_orders"
              aria-selected="false"
            >
              <h5 className="mb-0">Rejected</h5>
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
            <DataTable
              value={products}
              sortMode="multiple"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              tableStyle={{ minWidth: "100%" }}
              globalFilter={globalFilter}
              header={header}
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
                field="orderNumber"
                header="Order No"
                sortable
                bodyStyle={{ fontSize: 12, fontWeight: 600 }}
              ></Column>
              <Column field="transactionId" header="Txn No" sortable></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "red" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
              ></Column>
              <Column
                field="orderStatus"
                header="Order Status"
                style={{ fontSize: 14 }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
                sortable
              ></Column>
              <Column
                header="Action"
                field="_id"
                // style={{ minWidth: "12rem" }}
                body={filterApplyTemplate}
                severity="success"
              ></Column>
            </DataTable>
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <DataTable
              value={prod}
              sortMode="multiple"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
              globalFilter={globalFilter}
              header={header}
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
                field="orderNumber"
                header="Order No"
                sortable
                bodyStyle={{ fontSize: 12, fontWeight: 600 }}
              ></Column>
              <Column field="transactionId" header="Txn No" sortable></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "red" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
              ></Column>
              <Column
                field="deliveryStatus"
                header="Deli. Status"
                bodyStyle={{ color: "red" }}
                sortable
              ></Column>
              <Column
                header="Action"
                field="_id"
                // style={{ minWidth: "12rem" }}
                body={filterApplyTemplate}
                severity="success"
              ></Column>
            </DataTable>
          </div>
          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
          >
            <DataTable
              value={orderDone}
              sortMode="multiple"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
              globalFilter={globalFilter}
              header={header}
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
                field="orderNumber"
                header="Order No"
                sortable
                bodyStyle={{ fontSize: 12, fontWeight: 600 }}
              ></Column>
              <Column field="transactionId" header="Txn No" sortable></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
              ></Column>
              <Column
                field="deliveryStatus"
                header="Deli. Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                header="Action"
                field="_id"
                body={completedOrders}
                severity="success"
              ></Column>
            </DataTable>
          </div>
          <div
            className="tab-pane fade"
            id="pills-cancel_user"
            role="tabpanel"
            aria-labelledby="pills-cancel_user-tab"
          >
            <DataTable
              value={userCancel}
              sortMode="multiple"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
              globalFilter={globalFilter}
              header={header}
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
                field="orderNumber"
                header="Order No"
                sortable
                bodyStyle={{ fontSize: 12, fontWeight: 600 }}
              ></Column>
              <Column field="transactionId" header="Txn No" sortable></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
              ></Column>
              <Column
                field="deliveryStatus"
                header="Deli. Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                header="Action"
                field="_id"
                body={CancelByUsers}
                severity="success"
              ></Column>
            </DataTable>
          </div>
          <div
            className="tab-pane fade"
            id="pills-rejected_orders"
            role="tabpanel"
            aria-labelledby="pills-rejected_orders-tab"
          >
            <DataTable
              value={rejectData}
              sortMode="multiple"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
              globalFilter={globalFilter}
              header={header}
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
                field="orderNumber"
                header="Order No"
                sortable
                bodyStyle={{ fontSize: 12, fontWeight: 600 }}
              ></Column>
              <Column field="transactionId" header="Txn No" sortable></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
              ></Column>
              <Column
                field="deliveryStatus"
                header="Deli. Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                header="Action"
                field="_id"
                body={CancelByUsers}
                severity="success"
              ></Column>
            </DataTable>
          </div>
        </div>
      </>
      {/* // )} */}

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
                    <table className="table table-stripped table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Order No. : </td>
                          <td colSpan={2} className="text-success">
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
                            {item.paymentStatus}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-nowrap">
                            Shipping Address :
                          </td>
                          <td colSpan={3}>{item.shippingAddress}</td>
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
                        <tr>
                          <td colSpan={4}>
                            <h5>Products Details</h5>
                          </td>
                        </tr>

                        {orderSize &&
                          orderSize.map((item, index) => {
                            return (
                              <>
                                <tr>
                                  <td className="fw-bold text-nowrap">
                                    Product{" "}
                                    <span className="text-primary">
                                      {index + 1}
                                    </span>{" "}
                                    :
                                  </td>
                                  <td colSpan={2}>{item.productName}</td>
                                  <td className="fw-bold text-nowrap">
                                    {" "}
                                    Quantity : {item.quantity}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold text-nowrap">Price</td>
                                  <td>{item.price * item.quantity}</td>
                                  <td className="fw-bold text-nowrap">Size</td>
                                  <td>
                                    {item.size} {item.unit ? item.unit : ""}
                                  </td>
                                </tr>
                              </>
                            );
                          })}

                        {distData && distData.type === "Distributors" ? (
                          ""
                        ) : (
                          <tr>
                            <td className="text-danger fw-bold">
                              Total Amount
                            </td>
                            <td className="text-danger fw-bold">
                              {item.finalAmount}
                            </td>
                            <td>
                              {" "}
                              {item.orderStatus === "Pending" &&
                              item.status === "Active" &&
                              item.vendorId === distributor ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target={"#RejectModal" + item._id}
                                  >
                                    Reject Order
                                  </button>

                                  <div
                                    class="modal fade"
                                    id={"RejectModal" + item._id}
                                    tabindex="-1"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                  >
                                    <div class="modal-dialog">
                                      <div class="modal-content">
                                        <div class="modal-header py-1">
                                          <h5
                                            class="modal-title"
                                            id="exampleModalLabel"
                                          >
                                            Reject Confirm
                                          </h5>
                                          <button
                                            type="button"
                                            class="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div class="modal-body">
                                          <div className="row">
                                            <div className="col-lg-12">
                                              <label>Reason</label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                rows={3}
                                                value={reason}
                                                placeholder="Enter Reason Here....."
                                                onChange={(e) =>
                                                  setReason(e.target.value)
                                                }
                                              />
                                            </div>
                                            <div className="col-lg-12 mt-4 text-center">
                                              <button
                                                type="button"
                                                class="btn btn-primary"
                                                onClick={() =>
                                                  RejectOrder(item._id)
                                                }
                                                data-bs-dismiss="modal"
                                              >
                                                Submit
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="text-center">
                              {item.orderStatus === "Pending" &&
                              item.status === "Active" &&
                              item.vendorId === distributor ? (
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() => {
                                    dispatch(forEditOrder(item));
                                    navigate(
                                      `/distributors/edit-orders/${item._id}`
                                    );
                                  }}
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  Confirm
                                </button>
                              ) : item.status === "Cancel" ? (
                                <p className="text-danger">
                                  {item.status + "" + item.userCancelNote}
                                </p>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={4}>
                            <h5>Delivery Details</h5>
                          </td>
                        </tr>
                        <tr>
                          <th>Delivery Status</th>
                          <th className="text-success">
                            {item.deliveryStatus}
                          </th>
                          <th>Shipping Mode</th>
                          <th className="text-success">{item.deliveryMode}</th>
                        </tr>

                        <tr>
                          <td className="fw-bold text-nowrap">
                            Delivery Date/Time :
                          </td>
                          <td>
                            {item.deliveryDate === undefined ||
                            item.deliveryDate === ""
                              ? ""
                              : item.deliveryDate + " / " + item.deliveryTime}
                          </td>
                          <td className="fw-bold text-nowrap">
                            Distributor Name :
                          </td>
                          <td>{item.shippingDistName}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold text-nowrap">
                            Shipping Status :
                          </td>
                          <td className="fw-bold text-warning" colSpan={3}>
                            {item.shippingStatus}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-nowrap">
                            Shipping Date/Time :
                          </td>
                          <td colSpan={3}>
                            {item.shippingDate + " / " + item.shippingTime}
                          </td>
                        </tr>

                        {item.deliveryMode !== undefined &&
                        item.deliveryMode === "Vehical" ? (
                          <tr>
                            <td className="fw-bold text-nowrap">
                              Vehical No :
                            </td>
                            <td className="fw-bold">
                              {deliveryOption.vehicalNo}
                            </td>
                            <td className="fw-bold text-nowrap">
                              Driver Mobile :
                            </td>
                            <td>{deliveryOption.driverMobileNo}</td>
                          </tr>
                        ) : item.deliveryMode === "Courier" ? (
                          <tr>
                            <td className="fw-bold text-nowrap">
                              Tracking Link :
                            </td>
                            <td className="fw-bold">
                              {deliveryOption.trackingLink}
                            </td>
                            <td className="fw-bold text-nowrap">Token No :</td>
                            <td>{deliveryOption.tokenNo}</td>
                          </tr>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </table>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOrders;
