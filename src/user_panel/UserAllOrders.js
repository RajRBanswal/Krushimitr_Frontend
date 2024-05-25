import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch } from "react-redux";
import { emptyCart } from "../redux/slice/CartSlice";
import { useNavigate } from "react-router";
function UserAllOrders() {
  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const [orderCancel, setOrderCancel] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = localStorage.getItem("user_id");
  const [useId, setUserId] = useState(user);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState([]);

  const [reason, setReason] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async () => {
    let data = [];
    let datas = [];
    let datass = [];
    let cancel = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (useId === item.userId) {
          data.push(item);
        }
        if (
          item.userId === useId &&
          item.orderStatus === "Pending" &&
          item.status === "Active"
        ) {
          datas.push(item);
        }
        if (item.userId === useId && item.orderStatus === "Done") {
          datass.push(item);
        }
        if (item.userId === useId && item.status === "Cancel") {
          cancel.push(item);
        }
      });
      setProducts(data);
      setProd(datas);
      setOrderDone(datass);
      setOrderCancel(cancel);
    } else {
      setProducts(all_orders.result);
    }
  };

  useEffect(() => {
    setInterval(() => getProductData(), 5000);
    dispatch(emptyCart());
  }, [dispatch, getProductData]);

  const cancelFilterTemplate = (options) => {
    return (
      <div className="row px-1">
        <div className="col-lg-12">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => getOrderData(options._id)}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-placement="left"
            title="View"
          >
            <i className="pi pi-eye"></i>
          </button>
          {options.deliveryStatus !== "Delivered" ? (
            options.status !== "Active" ? (
              ""
            ) : (
              <button
                type="button"
                className="btn btn-danger btn-sm ms-1"
                data-bs-toggle="modal"
                data-bs-target="#cancelOrderModal"
                onClick={() => {
                  setOrderId(options._id);
                  setReason("");
                  setOrderData(options);
                }}
                data-bs-placement="left"
                title="Order Cancel Now"
              >
                Cancel
              </button>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  const filterApplyTemplate = (options) => {
    return (
      <div className="row px-2">
        <div className="col-lg-12">
          <button
            type="button"
            className="btn btn-primary btn-sm w-100"
            onClick={() => getOrderData(options._id)}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-placement="left"
            title="View"
          >
            <i className="pi pi-eye"></i>
          </button>
        </div>
      </div>
    );
  };

  const COFilterApplyTemplate = (options) => {
    // console.log(options);
    return (
      <div className="row px-2">
        <div className="col-lg-12">
          <button
            type="button"
            className="btn btn-info btn-sm "
            onClick={() => {
              navigate("/invoice", {
                state: { data: options, goback: "users" },
              });
            }}
          >
            <i className="pi pi-print"></i>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm ms-1"
            onClick={() => getOrderData(options._id)}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-placement="left"
            title="View"
          >
            <i className="pi pi-eye"></i>
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
  function removeDuplicates(abc) {
    return abc.filter((value, index) => abc.indexOf(value) === index);
  }

  const refresh = () => window.location.reload(true);
  // console.log(orderData.paymentMethod);
  const orderCancelNow = async () => {
    let userMobile = "";
    let forvcommId = [];
    orderData.userData.map((item) => {
      let dd = JSON.parse(item);
      userMobile = dd.mobile;
    });
    let dd = JSON.parse(orderData.itemsData);
    dd.map((item) => {
      forvcommId.push(item._id);
    });

    let itemID = removeDuplicates(forvcommId);
    let vCommi = 0;
    let ttlCommission = 0;
    for (let aaaa = 0; aaaa < itemID.length; aaaa++) {
      for (let sr = 0; sr < dd.length; sr++) {
        if (itemID[aaaa] === dd[sr]._id) {
          // vCommi = vCommi + dd[sr].vCommissionPercent;
          vCommi = vCommi + parseInt(dd[sr].vCommissionPercent);
          ttlCommission = ttlCommission + parseInt(dd[sr].commission);
          break;
        }
      }
    }
    let adminCom = 0;
    let vendorCom = 0;
    let distCom = 0;
    if (vCommi > 0) {
      let adminComs = (parseInt(orderData.finalAmount) / 100) * vCommi;
      let abc = (adminComs / 100) * (ttlCommission * 10);
      adminCom = adminComs - abc;
      distCom = abc;
      vendorCom = parseInt(orderData.finalAmount) - adminComs;
    } else {
      adminCom = 0;
      vendorCom = parseInt(orderData.finalAmount);
    }

    // let adminCom = (parseInt(orderData.finalAmount) / 100) * vCommi;
    // let vendorCom = parseInt(orderData.finalAmount) - adminCom;
    const response = await fetch(
      "https://krushimitr.in/api/users/cancel-order",
      {
        method: "post",
        body: JSON.stringify({
          orderId: orderId,
          reason: reason,
          distMobile: orderData.distMobile,
          distName: orderData.distName,
          finalAmount: orderData.finalAmount,
          adminCom: adminCom,
          vendorCom: vendorCom,
          distCom: distCom,
          orderNumber: orderData.orderNumber,
          userId: orderData.userId,
          userName: orderData.userName,
          userMobile: userMobile,
          vendorId: orderData.vendorId,
          paymentType: orderData.paymentType,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.staus === 201) {
      alert(result.result);
      setOrderId("");
      setReason("");
      refresh();
    } else {
      alert(result.result);
      setOrderId("");
      setReason("");
      refresh();
    }
  };
  return (
    <div className="">
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
            id="pills-cancel_orders-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-cancel_orders"
            type="button"
            role="tab"
            aria-controls="pills-cancel_orders"
            aria-selected="false"
          >
            <h5 className="mb-0">Cancel Orders</h5>
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
              header="OrderId"
              bodyStyle={{ color: "green", fontSize: 13, fontWeight: "bold" }}
              sortable
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
              bodyStyle={{ width: "30%" }}
            ></Column>
            <Column
              field="deliveryStatus"
              header="Deli. Status"
              sortable
              bodyStyle={{ color: "green", fontWeight: "bold" }}
            ></Column>
            <Column
              field="orderStatus"
              header="Status"
              sortable
              bodyStyle={{ color: "green", fontWeight: "bold" }}
            ></Column>
            <Column
              header="Action"
              field="_id"
              style={{ minWidth: "8rem" }}
              body={cancelFilterTemplate}
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
              header="OrderId"
              bodyStyle={{ color: "green", fontSize: 13, fontWeight: "bold" }}
              sortable
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
              bodyStyle={{ width: "30%" }}
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
              style={{ minWidth: "8rem" }}
              body={cancelFilterTemplate}
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
              header="OrderId"
              bodyStyle={{ color: "green", fontSize: 13, fontWeight: "bold" }}
              sortable
            ></Column>
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
              bodyStyle={{ width: "30%" }}
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
              style={{ minWidth: "4rem" }}
              body={COFilterApplyTemplate}
              severity="success"
            ></Column>
          </DataTable>
        </div>
        <div
          className="tab-pane fade"
          id="pills-cancel_orders"
          role="tabpanel"
          aria-labelledby="pills-cancel_orders-tab"
        >
          <DataTable
            value={orderCancel}
            sortMode="multiple"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
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
              header="OrderId"
              bodyStyle={{ color: "green", fontSize: 13, fontWeight: "bold" }}
              sortable
            ></Column>
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
              bodyStyle={{ width: "30%" }}
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable
              bodyStyle={{ color: "red" }}
            ></Column>
            <Column
              field="reason"
              header="Reason"
              sortable
              bodyStyle={{ color: "red" }}
            ></Column>
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
        class="modal fade"
        id="cancelOrderModal"
        tabindex="-1"
        aria-labelledby="cancelOrderLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header py-1">
              <h5 class="modal-title" id="cancelOrderLabel">
                Cancel Orders
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
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter Reason"
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer py-1">
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => {
                  orderCancelNow();
                }}
                data-bs-dismiss="modal"
              >
                Submit
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
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
            <div className="modal-header py-1">
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
                              <td style={{ width: "35%" }}>
                                {item.shippingAddress}
                              </td>
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
                                      <td className="text-nowrap">
                                        Company : {item.company}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="fw-bold text-nowrap">
                                        Price
                                      </td>
                                      <td>{item.price * item.quantity}</td>
                                      <td className="fw-bold text-nowrap">
                                        Size
                                      </td>
                                      <td>
                                        {item.size} {item.unit ? item.unit : ""}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="fw-bold text-nowrap">
                                        Quantity
                                      </td>
                                      <td colSpan={2}>{item.quantity}</td>
                                      <td className="fw-bold text-nowrap">
                                        GST : {item.gst}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}

                            <tr>
                              <td className="text-danger fw-bold">
                                Total Amount
                              </td>
                              <td className="text-danger fw-bold">
                                {item.finalAmount}
                              </td>
                              <td></td>
                              <td className="text-center"></td>
                            </tr>
                            <tr>
                              <td colSpan={4}>
                                <h5>Delivery Details</h5>
                              </td>
                            </tr>
                            {item.deliveryStatus === "Delivered" ? (
                              <tr>
                                <th>Delivery Status</th>
                                <th className="text-success">
                                  {item.deliveryStatus}
                                </th>
                                <td className="fw-bold text-nowrap">
                                  Distributor Name :
                                </td>
                                <td>{item.shippingDistName}</td>
                              </tr>
                            ) : (
                              <tr>
                                <th>Shipping Status</th>
                                <th className="text-success">
                                  {item.shippingStatus}
                                </th>
                                <td className="fw-bold text-nowrap">
                                  Distributor Name :
                                </td>
                                <td>{item.shippingDistName}</td>
                              </tr>
                            )}

                            {/* {item.shippingStatus === undefined ||
                            item.shippingStatus === "" ? (
                              <>
                                <tr>
                                  <td className="fw-bold text-nowrap">
                                    Delivery Date/Time :
                                  </td>
                                  <td>
                                    {item.deliveryDate === "" ||
                                    item.deliveryDate === undefined
                                      ? ""
                                      : item.deliveryDate +
                                        " / " +
                                        item.shippingTime}
                                  </td>
                                  <td className="fw-bold text-nowrap">
                                    Delivery Status:
                                  </td>
                                  <td>{item.deliveryStatus}</td>
                                </tr>
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td className="fw-bold text-nowrap">
                                    Distributor Name :
                                  </td>
                                  <td>{item.shippingDistName}</td>
                                  <td className="fw-bold text-nowrap">
                                    Shipping Date/Time :
                                  </td>
                                  <td>
                                    {item.shippingDate +
                                      " / " +
                                      item.shippingTime}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold text-nowrap">
                                    Shipping Status :
                                  </td>
                                  <td className="fw-bold text-warning">
                                    {item.shippingStatus}
                                  </td>
                                  <td className="fw-bold text-nowrap"></td>
                                  <td></td>
                                </tr>
                              </>
                            )} */}

                            <tr>
                              <td colSpan={4} className=" text-nowrap">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>Order Status</span>
                                  {item.shippingStatus === undefined ||
                                  item.shippingStatus === "" ? (
                                    <span style={{ color: "grey" }}>
                                      Shipping Status
                                    </span>
                                  ) : (
                                    <span>Shipping Status</span>
                                  )}
                                  {item.shippingStatus === undefined ||
                                  item.shippingStatus === "" ? (
                                    <span style={{ color: "grey" }}>
                                      Delivery Status
                                    </span>
                                  ) : (
                                    <span>Delivery Status</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} className=" text-nowrap ">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="">
                                    {item.orderStatus === "Pending" ? (
                                      <span className="text-secondary">
                                        {item.orderStatus}
                                      </span>
                                    ) : (
                                      <span className="text-success">
                                        {item.orderStatus}
                                      </span>
                                    )}
                                  </span>
                                  <div className="d-flex justify-content-between align-items-center ">
                                    {" "}
                                    <i
                                      class="fa fa-arrow-left"
                                      aria-hidden="true"
                                    ></i>
                                    <div className="lineBottom"></div>
                                    <i
                                      class="fa fa-arrow-right"
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                  <span className="text-center ">
                                    {item.shippingStatus}
                                    <br />
                                    <small>
                                      {item.deliveryDate === "" ||
                                      item.deliveryDate === undefined
                                        ? ""
                                        : item.deliveryDate +
                                            " / " +
                                            item.shippingTime ===
                                          undefined
                                        ? ""
                                        : item.shippingTime}
                                    </small>
                                    <br />
                                    <small>
                                      {item.shippingDistName
                                        ? item.shippingDistName
                                        : ""}
                                    </small>
                                    <br />
                                    <small>
                                      {item.deliveryMode
                                        ? item.deliveryMode
                                        : ""}
                                    </small>
                                  </span>
                                  <div className="d-flex justify-content-between align-items-center ">
                                    {" "}
                                    <i
                                      class="fa fa-thin fa-arrow-left"
                                      aria-hidden="true"
                                    ></i>
                                    <div className="lineBottom"></div>
                                    <i
                                      class="fa fa-thin fa-arrow-right"
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                  <span className="text-center ">
                                    {item.deliveryStatus === "Delivered" ? (
                                      <span className="text-success text-center">
                                        Delivered <br />
                                        <small>
                                          {item.deliveryDate === "" ||
                                          item.deliveryDate === undefined
                                            ? ""
                                            : item.deliveryDate +
                                                " / " +
                                                item.shippingTime ===
                                              undefined
                                            ? ""
                                            : item.shippingTime}
                                        </small>
                                      </span>
                                    ) : (
                                      <span style={{ color: "grey" }}>
                                        Pending
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </td>
                            </tr>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAllOrders;
