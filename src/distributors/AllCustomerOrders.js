import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forEditOrder } from "../redux/slice/OrderSlice";
import { emptyCart } from "../redux/slice/CartSlice";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const AllCustomerOrders = () => {
  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const [DistAllOrders, setDistAllOrders] = useState([]);
  const [userCancel, setUserCancel] = useState([]);
  const [rejectOrder, setRejectOrder] = useState([]);
  const [shipped, setShipped] = useState([]);
  const [reason, setReason] = useState("");
  const dispatch = useDispatch();
  const [walletData, setWalletData] = useState([]);
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

  const [distData, setDistData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRejectedOrders = async () => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async () => {
    let datass = [];
    let shippedd = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (
          item.shippingAddress === null ||
          item.shippingAddress === undefined ||
          item.shippingAddress === ""
        ) {
        } else {
          if (item.shippingDistId === distributor && item.status === "Active") {
            shippedd.push(item);
          }
          if (
            item.shippingDistId === distributor &&
            item.orderStatus === "Done" &&
            item.status === "Active"
          ) {
            datass.push(item);
          }
        }
      });
      setShipped(shippedd);
      setOrderDone(datass);
    } else {
      setShipped(all_orders.result);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductDataAll = async () => {
    let data = [];
    let datas = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (
          item.shippingAddress === null ||
          item.shippingAddress === undefined ||
          item.shippingAddress === ""
        ) {
        } else {
          let add = item.shippingAddress.split(",");
          let city = add[add.length - 3].trim();
          let state = add[add.length - 2].trim();
          let pincode = add[add.length - 1].trim();

          if (
            ((city === distData.city && state === distData.state) ||
              pincode === distData.pincode) &&
            item.status === "Active"
          ) {
            data.push(item);
          }
          if (
            ((city === distData.city && state === distData.state) ||
              pincode === distData.pincode) &&
            item.orderStatus === "Pending" &&
            item.status === "Active"
          ) {
            datas.push(item);
          }
        }
      });
      setProducts(data);
      setProd(datas);
    } else {
      setProducts(all_orders.result);
    }
  };

  const getTotal = () => {
    let total = 0;
    walletData.map((item) => {
      if (item.type === "Credit" && item.amountStatus === "Done") {
        total += parseInt(item.amount);
      } else if (item.type === "Debit") {
        total -= parseInt(item.amount);
      }
    });
    return total;
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
      <h4 className="m-0">All Orders</h4>
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

  useEffect(() => {
    getProductDataAll();
    getProductData();
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
    const getWalletData = async () => {
      const response = await fetch(
        "https://krushimitr.in/api/distributors/get-vendor-distributor-wallet"
      );
      const data = await response.json();
      if (data.status === 201) {
        let datas = [];
        data.result.map((item) => {
          if (item.dvId === distr) {
            datas.push(item);
          }
        });
        setWalletData(datas);
      } else {
        setWalletData([]);
      }
    };
    getWalletData();
    getRejectedOrders();

    dispatch(emptyCart());
  }, [
    dispatch,
    distr,
    distributor,
    getProductData,
    getProductDataAll,
    getRejectedOrders,
  ]);

  const completedOrders = (options) => {
    return (
      <div className="d-flex">
        <button
          type="button"
          className="btn btn-info btn-sm "
          onClick={() => {
            navigate("/invoice", {
              state: { data: options, goback: "distributors" },
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
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [deliverModal, setDeliverModal] = useState(false);

  const checkOrder = (options) => {
    return (
      <>
        {infomationButton === false &&
        (options.collectStatus === undefined ||
          options.collectStatus === "") ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              getOrderData(options._id);
              setSingleData("");
              setModal(true);
            }}
          >
            Check Order
          </button>
        ) : (
          <>
            {options.deliveryStatus === "Delivered" ? (
              ""
            ) : (
              <button
                className="btn btn-sm btn-danger me-1"
                onClick={() => {
                  getOrderData(options._id);
                  setSingleData("");
                  setDeliverModal(true);
                }}
              >
                Delivered
              </button>
            )}
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                getOrderData(options._id);
                setSingleData("");
                setVisible(true);
              }}
            >
              <i className="fa fa-eye"></i>
            </button>
          </>
        )}
      </>
    );
  };

  const [VehicalNo, setVehicalNo] = useState("");
  const [DriverMo, setDriverMo] = useState("");
  const [TrackingLink, setTrackingLink] = useState("");
  const [TokenNo, setTokenNo] = useState("");
  const [ProductName, setProductName] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Quality, setQuality] = useState("");
  const [Charges, setCharges] = useState("");
  const [shippingMode, setShippingMode] = useState("");
  const [infomationButton, setInfomationButton] = useState(false);

  const getCollected = async () => {
    if (
      shippingMode === true &&
      ((VehicalNo === true && DriverMo === true) ||
        (TrackingLink === true && TokenNo === true)) &&
      ProductName === true &&
      Quantity === true &&
      Quality !== "" &&
      Charges !== ""
    ) {
      const result = await fetch(
        "https://krushimitr.in/api/distributor/collect",
        {
          method: "post",
          body: JSON.stringify({
            orderId: singleData[0]._id,
            ShippingCharges: Charges,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await result.json();
      if (res.status === 201) {
        setInfomationButton(true);
        setModal(false);
        getOrderData("");
        setSingleData("");
        alert("Order Collected");
      } else {
        setInfomationButton(false);
        alert("Order not Collected");
      }
    } else {
      alert("Check the all fields");
    }
  };

  const CheckStatus = (rowData) => {
    if (
      rowData.deliveryStatus === "Delivered" &&
      rowData.shippingStatus === "Shipped"
    ) {
      return "Delivered";
    } else if (rowData.shippingStatus === "Shipped") {
      return "Shipped";
    }
  };

  const [otpVisible, setOtpVisible] = useState(false);
  const [verifieds, setVerifieds] = useState(false);
  const [otp, setOtp] = useState("");

  const verifyMobile = (mobile) => {
    if (mobile) {
      let a = Math.floor(1000 + Math.random() * 9000);
      setOtp(a);
      setOtpVisible(true);
    } else {
      setOtp("");
      alert("Invalid Mobile No");
    }
  };
  const verifyOTP = (otps) => {
    if (otps.length === 4) {
      if (otps == otp) {
        setVerifieds(true);
      } else {
        alert("Incorrect OTP");
        setVerifieds(false);
      }
    }
  };

  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [UTRNo, setUTRNo] = useState("");

  const getDeliveredOrder = async () => {
    if (verifieds === true) {
      const result = await fetch(
        "https://krushimitr.in/api/distributors/order-delivered",
        {
          method: "post",
          body: JSON.stringify({
            orderId: singleData[0]._id,
            orderNumber: singleData[0].orderNumber,
            paymentStatus:
              paymentStatus === ""
                ? singleData[0].paymentStatus
                : paymentStatus,
            deliveryStatus: deliveryStatus,
            paymentMode:
              paymentMode === "" ? singleData[0].paymentMethod : paymentMode,
            UTRNo: UTRNo,
            distName: distData.name,
            distId: distData._id,
            distMobile: distData.mobile,
            vendorId: singleData[0].vendorId,
            vendorName: singleData[0].distName,
            vendorMobile: singleData[0].distMobile,
            paymentType: singleData[0].paymentType,
            finalAmount: singleData[0].finalAmount,
            itemsData: JSON.parse(singleData[0].itemsData),
            walletAmount: getTotal(),
            transactionId: singleData[0].transactionId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await result.json();
      console.log(res);
      if (res.status === 201) {
        setDeliverModal(false);
        alert(res.result);
        window.location.reload();
      } else {
        alert(res.result);
      }
    } else {
      alert("Verify Mobile No. First");
    }
  };

  return (
    <div className="p-3">
      <>
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-shipped_orders-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-shipped_orders"
              type="button"
              role="tab"
              aria-controls="pills-shipped_orders"
              aria-selected="false"
            >
              <h5 className="mb-0">Shipped Orders</h5>
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link  "
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
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-shipped_orders"
            role="tabpanel"
            aria-labelledby="pills-shipped_orders-tab"
          >
            <DataTable
              value={shipped}
              sortMode="multiple"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
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
                field="orderNumber"
                header="Order No"
                sortable
                bodyStyle={{ fontSize: 12, fontWeight: 600 }}
              ></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column field="orderTime" header="Time" sortable></Column>
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
                field={CheckStatus}
                header="Status"
                body={CheckStatus}
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                header="Action"
                field="_id"
                body={checkOrder}
                severity="success"
              ></Column>
            </DataTable>
          </div>
          <div
            className="tab-pane fade "
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
                header="Order No ss"
                sortable
                bodyStyle={{ fontSize: 12, fontWeight: 600 }}
              ></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column field="orderTime" header="Time" sortable></Column>
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
                header="Status"
                bodyStyle={{ color: "red", fontWeight: "bold" }}
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
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column field="orderTime" header="Time" sortable></Column>
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
        </div>
      </>

      <Dialog
        header="Check Order"
        visible={visible}
        style={{ width: "75vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="row">
          <div className="col-lg-12 orderData">
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
                        <td className="fw-bold text-nowrap">
                          Shipping Address :
                        </td>
                        <td style={{ width: "35%" }}>{item.shippingAddress}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-nowrap">
                          Payment Method :
                        </td>
                        <td className="fw-bold text-warning">
                          {item.paymentMethod}
                        </td>
                        <td className="fw-bold text-nowrap">Payment Type :</td>
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
                          <td className="text-danger fw-bold">Total Amount</td>
                          <td className="text-danger fw-bold">
                            {item.finalAmount}
                          </td>
                          <td></td>
                          <td className="text-center"></td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={4}>
                          <h5>Delivery Details</h5>
                        </td>
                      </tr>
                      <tr>
                        <th>Delivery Status</th>
                        <th className="text-success">{item.deliveryStatus}</th>
                        <th>Shipping Mode</th>
                        <th className="text-success">{item.deliveryMode}</th>
                      </tr>
                      <tr>
                        <td className="fw-bold text-nowrap">
                          Delivery Date/Time :
                        </td>
                        <td colSpan={3}>
                          {item.deliveryDate === ""
                            ? ""
                            : item.deliveryDate + " / " + item.deliveryTime}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-nowrap">
                          Distributor Name :
                        </td>
                        <td>{item.shippingDistName}</td>
                        <td className="fw-bold text-nowrap">
                          Shipping Date/Time :
                        </td>
                        <td>{item.shippingDate + " / " + item.shippingTime}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-nowrap">
                          Shipping Status :
                        </td>
                        <td className="fw-bold text-warning">
                          {item.shippingStatus}
                        </td>
                        <td className="fw-bold text-nowrap">Shipping Mode :</td>
                        <td>{item.deliveryMode}</td>
                      </tr>
                      {item.deliveryMode !== undefined &&
                      item.deliveryMode === "Vehical" ? (
                        <tr>
                          <td className="fw-bold text-nowrap">Vehical No :</td>
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
                      {/* <tr>
                        <td colSpan={4} className="text-center py-3">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => setModal(true)}
                          >
                            Confirm
                          </button>
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                );
              })}
          </div>
        </div>
      </Dialog>
      <Dialog
        header="Check Order Status"
        visible={modal}
        style={{ width: "50vw" }}
        onHide={() => setModal(false)}
      >
        {singleData &&
          singleData.map((item) => {
            let orderSize = JSON.parse(item.itemsData);
            let deliveryOption = "";
            if (item.deliveryMode !== undefined && item.deliveryMode !== "") {
              deliveryOption = JSON.parse(item.deliveryOption);
            } else {
              deliveryOption = "";
            }

            return (
              <>
                <div className="row">
                  <div className="col-lg-4 col-6">
                    <b>Shipping Mode : </b>
                  </div>
                  <div className="col-lg-4 col-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={item.deliveryMode}
                        id={item.deliveryMode}
                        onChange={(e) => setShippingMode(e.target.checked)}
                      />
                      <label
                        className="form-check-label"
                        for={item.deliveryMode}
                      >
                        {item.deliveryMode}
                      </label>
                    </div>
                  </div>
                </div>
                {item.deliveryMode !== undefined &&
                item.deliveryMode === "Vehical" ? (
                  <div className="row">
                    <div className="col-lg-4 col-6">
                      <b>Vehical No : </b>
                    </div>
                    <div className="col-lg-8 col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={deliveryOption.vehicalNo}
                          id={deliveryOption.vehicalNo}
                          onChange={(e) => setVehicalNo(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          for={deliveryOption.vehicalNo}
                        >
                          {deliveryOption.vehicalNo}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-4 col-6">
                      <b>Driver Mobile : </b>
                    </div>
                    <div className="col-lg-8 col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={deliveryOption.driverMobileNo}
                          id={deliveryOption.driverMobileNo}
                          onChange={(e) => setDriverMo(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          for={deliveryOption.driverMobileNo}
                        >
                          {deliveryOption.driverMobileNo}
                        </label>
                      </div>
                    </div>
                  </div>
                ) : item.deliveryMode === "Courier" ? (
                  <div className="row">
                    <div className="col-lg-4 col-6">
                      <b>Tracking Link : </b>
                    </div>
                    <div className="col-lg-8 col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={deliveryOption.trackingLink}
                          id={deliveryOption.trackingLink}
                          onChange={(e) => setTrackingLink(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          for={deliveryOption.trackingLink}
                        >
                          {deliveryOption.trackingLink}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-4 col-6">
                      <b>Token No : </b>
                    </div>
                    <div className="col-lg-8 col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={deliveryOption.tokenNo}
                          id={deliveryOption.tokenNo}
                          onChange={(e) => setTokenNo(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          for={deliveryOption.tokenNo}
                        >
                          {deliveryOption.tokenNo}
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {orderSize &&
                  orderSize.map((item, index) => {
                    return (
                      <>
                        <div className="row">
                          <div className="col-lg-4 col-6">
                            <b>Product Name : </b>
                          </div>

                          <div className="col-lg-8 col-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={item.productName}
                                id={item.productName}
                                onChange={(e) =>
                                  setProductName(e.target.checked)
                                }
                              />
                              <label
                                className="form-check-label"
                                for={item.productName}
                              >
                                {item.productName}
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-4 col-6">
                            <b>Quantity : </b>
                          </div>

                          <div className="col-lg-8 col-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={item.quantity}
                                id={item.quantity}
                                onChange={(e) => setQuantity(e.target.checked)}
                              />
                              <label
                                className="form-check-label"
                                for={item.quantity}
                              >
                                {item.quantity}
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                <div className="row">
                  <div className="col-lg-4 col-6">
                    <b>Quality : </b>
                  </div>

                  <div className="col-lg-6 col-6 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="quality"
                        value={"Good"}
                        id={"Quality"}
                        onChange={(e) => setQuality(e.target.value)}
                      />
                      <label className="form-check-label" for={"Quality"}>
                        Good
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="quality"
                        value={"Bad"}
                        id={"Bad"}
                        onChange={(e) => setQuality(e.target.value)}
                      />
                      <label className="form-check-label" for={"Bad"}>
                        Bad
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-6">
                    <b>Driver Charges : </b>
                  </div>

                  <div className="col-lg-8 col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Delivery Charges"
                      onChange={(e) => setCharges(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 m-auto">
                    <button
                      className="btn btn-primary"
                      onClick={() => getCollected()}
                    >
                      Collect
                    </button>
                  </div>
                </div>
              </>
            );
          })}
      </Dialog>

      <Dialog
        header="Delivered Order to customer"
        visible={deliverModal}
        style={{ width: "50vw" }}
        onHide={() => setDeliverModal(false)}
      >
        {singleData &&
          singleData.map((item) => {
            let orderSize = JSON.parse(item.itemsData);
            let orderUser = JSON.parse(item.userData);
            return (
              <div className="row">
                <div className="col-lg-6">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orderUser.name}
                    readOnly
                  />
                </div>
                <div className="col-lg-6">
                  <label>Order No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.orderNumber}
                    readOnly
                  />
                </div>
                <div className="col-lg-4 col-9 mt-1">
                  <label>Customer Mobile No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orderUser.mobile}
                    readOnly
                  />
                </div>
                <div className="col-lg-2 col-3 mt-1">
                  <label></label>

                  <button
                    disabled={otpVisible === true && otp !== "" ? true : false}
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={() => verifyMobile(orderUser.mobile)}
                  >
                    Verify
                  </button>
                </div>
                {otpVisible === true && otp !== "" ? (
                  <>
                    <div className="col-lg-4 col-9 mt-1">
                      <label>Enter OTP ({otp})</label>
                      <input
                        disabled={verifieds === true ? true : false}
                        type="number"
                        className="form-control"
                        placeholder="Enter OTP"
                        onChange={(v) => verifyOTP(v.target.value)}
                      />
                    </div>
                    <div className="col-lg-2 col-3 mt-1 pt-5">
                      {verifieds === true ? (
                        <b className="text-success">Verified</b>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="col-lg-6 col-6 mt-1">
                  <label>Final Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.finalAmount}
                    readOnly
                  />
                </div>
                <div className="col-lg-6 col-6 mt-1">
                  <label>Payment Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.paymentType}
                    readOnly
                  />
                </div>
                {item.paymentType === "COD" ? (
                  <>
                    <div className="col-md-6 col-6 mt-1">
                      <label className="mb-0">Payment Method</label>
                      <select
                        className="form-select form-control"
                        onChange={(e) => setPaymentMode(e.target.value)}
                      >
                        <option value={""}>Select Mode</option>
                        <option value={"UPI"}>UPI</option>
                        <option value={"Cash"}>Cash</option>
                        <option value={"Card"}>Card</option>
                      </select>
                    </div>
                    {paymentMode === "Cash" ? (
                      ""
                    ) : (
                      <div className="col-md-6 col-6 mt-1">
                        <label className="mb-0">
                          UTR Number / Transaction No
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setUTRNo(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="col-md-6 col-6 mt-1">
                      <label className="mb-0">Payment Status</label>
                      <select
                        className="form-select form-control"
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value={""}>Select Status</option>
                        <option value={"Paid"}>Paid</option>
                        <option value={"Pending"}>Pending</option>
                      </select>
                    </div>
                    {/* // <div className="col-md-12 col-12 mt-1 text-center">
                  //   <button className="btn btn-info">Pay Now</button>
                  // </div> */}
                  </>
                ) : (
                  ""
                )}

                <div className="col-md-6 col-6 mt-1">
                  <label className="mb-0">Delivery Status</label>
                  <select
                    className="form-select form-control"
                    onChange={(e) => setDeliveryStatus(e.target.value)}
                  >
                    <option value={""}>Select Status</option>
                    <option value={"Delivered"}>Delivered</option>
                    <option value={"Not Delivered"}>Not Delivered</option>
                  </select>
                </div>
                <div className="col-md-12 col-12 mt-1">
                  <button
                    className="btn btn-primary"
                    onClick={() => getDeliveredOrder()}
                  >
                    Delivered
                  </button>
                </div>
              </div>
            );
          })}
      </Dialog>

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
                                    className="modal fade"
                                    id={"RejectModal" + item._id}
                                    tabindex="-1"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header py-1">
                                          <h5
                                            className="modal-title"
                                            id="exampleModalLabel"
                                          >
                                            Reject Confirm
                                          </h5>
                                          <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div className="modal-body">
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
                                                className="btn btn-primary"
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
};

export default AllCustomerOrders;
