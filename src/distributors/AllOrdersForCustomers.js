import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forEditOrder } from "../redux/slice/OrderSlice";
import { emptyCart } from "../redux/slice/CartSlice";
const AllOrdersForCustomers = () => {
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
      console.log(all_orders.result);
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
  }, [getRejectedOrders]);



  const filterApplyTemplate = (options) => {
    return (
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        onClick={() => {
          setSingleData("");
          getOrderData(options._id);
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
  return (
    <div className="p-3">
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
                        <tr>
                          <td className="text-danger fw-bold">Total Amount</td>
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
                                  navigate("/distributors/edit-orders");
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
export default AllOrdersForCustomers;
