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
    getProductData();
    dispatch(emptyCart());
  }, [getProductData]);

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
    for (let aaaa = 0; aaaa < itemID.length; aaaa++) {
      for (let sr = 0; sr < dd.length; sr++) {
        if (itemID[aaaa] === dd[sr]._id) {
          vCommi = vCommi + dd[sr].vCommissionPercent;
          break;
        }
      }
    }
    let adminCom = (parseInt(orderData.finalAmount) / 100) * vCommi;
    let vendorCom = parseInt(orderData.finalAmount) - adminCom;
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
    } else {
      alert(result.result);
      setOrderId("");
      setReason("");
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
              {singleData &&
                singleData.map((item) => {
                  let orderSize = JSON.parse(item.itemsData);
                  return (
                    <table className="table table-stripped table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Name : </td>
                          <td>{item.userName}</td>
                          <td className="fw-bold text-nowrap">
                            Total Amount :{" "}
                          </td>
                          <td>{item.orderDate}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-nowrap">
                            Payment Status :
                          </td>
                          <td>{item.paymentStatus}</td>
                          <td className="fw-bold text-nowrap">
                            Shipping Address :
                          </td>
                          <td>{item.shippingAddress}</td>
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
                                    {"  "}
                                    Quantity : {item.quantity}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold text-nowrap">
                                    MRP : {item.price}
                                  </td>
                                  <td
                                    colSpan={2}
                                    className="fw-bold text-nowrap"
                                  >
                                    {"  "}
                                    Total Price : {item.price * item.quantity}
                                  </td>
                                  <td className="fw-bold text-nowrap">
                                    Size : {item.size}{" "}
                                    {item.unit ? item.unit : ""}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        <tr>
                          <td className="text-danger fw-bold">Total Amount</td>
                          <td className="text-danger fw-bold">
                            {item.finalAmount}
                          </td>
                          <td colSpan={2} className="text-success">
                            {item.deliveryStatus === "Delivered" ? (
                              <p className="mb-0 text-success fw-bold ">
                                Status : Delivered
                              </p>
                            ) : item.status === "Cancel" ? (
                              <p className="mb-0 text-danger">
                                Status :
                                {item.status + " : " + item.userCancelNote}
                              </p>
                            ) : (
                              <p className="mb-0 text-warning fw-bold ">
                                Status : Pending
                              </p>
                            )}
                          </td>
                          {/* <td className="text-success fw-bold">
                            {item.deliveryStatus === "Delivered"
                              ? "Delivered"
                              : "Pending"}
                          </td> */}
                        </tr>
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

export default UserAllOrders;
