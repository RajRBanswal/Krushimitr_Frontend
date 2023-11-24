import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { forEditOrder } from "../redux/slice/OrderSlice";
import { emptyCart } from "../redux/slice/CartSlice";

function DAllOrders() {
  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let distr = localStorage.getItem("distributor_id");
  const [distributor, setDistributor] = useState(distr);


  let data = [];
  let datas = [];
  let datass = [];
  const getProductData = async () => {
    let all_products = await fetch("https://krushimitr.in/admin/all-orders");
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (distributor === item.vendorId) {
          data.push(item);
          console.log(data);
        }
        if (item.vendorId == distributor && item.orderStatus == "Pending") {
          datas.push(item);
          console.log(datas);
        }
        if (item.vendorId == distributor && item.orderStatus === "Done") {
          datass.push(item);
          console.log(datass);
        }
      });
      setProducts(data);
      setProd(datas);
      setOrderDone(datass)
    } else {
      setProducts(all_orders.result);
    }
  };

  useEffect(() => {
    getProductData();
    dispatch(emptyCart());
  }, []);

  const filterApplyTemplate = (options) => {
    return (
      <div className="row">
        <div className="col-lg-4">
          <Button
            type="button"
            icon="pi pi-pencil"
            onClick={() => alert(options.productName)}
            severity="primary"
          ></Button>
        </div>
        <div className="col-lg-4">
          <Button
            type="button"
            icon="pi pi-eye"
            onClick={() => getOrderData(options._id)}
            severity="success"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          ></Button>
        </div>
      </div>
    );
  };

  const [singleData, setSingleData] = useState("");
  const getOrderData = async (Id) => {
    let all_products = await fetch("https://krushimitr.in/admin/get-orders", {
      method: "post",
      body: JSON.stringify({
        orderId: Id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setSingleData(get_orders.result);
      console.log(get_orders.result);
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

  return (
    <div className="p-3">
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active "
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
            <h5 className="mb-0">Pending Orders</h5>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
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
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
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
              header="Action"
              field="_id"
              style={{ minWidth: "12rem" }}
              body={filterApplyTemplate}
              severity="success"
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
              style={{ minWidth: "12rem" }}
              body={filterApplyTemplate}
              severity="success"
            ></Column>
          </DataTable>
        </div>
        <div
          class="tab-pane fade"
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
              bodyStyle={{ color: "green",fontWeight:'bold' }}
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
              bodyStyle={{ color: "green",fontWeight:'bold' }}
            ></Column>
            <Column
              header="Action"
              field="_id"
              style={{ minWidth: "12rem" }}
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
                          <td></td>
                          <td className="text-end">
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
                              Dispatch
                            </button>
                            {/* <Link
                              to={"/distributors/edit-orders"}
                              state={{ item: JSON.stringify(item) }}
                              type="button"
                              className="btn btn-success btn-sm"
                            >
                              Dispatch 
                            </Link> */}
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
}

export default DAllOrders;
