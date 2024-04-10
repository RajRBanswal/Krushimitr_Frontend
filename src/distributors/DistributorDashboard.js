import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Dialog } from "primereact/dialog";
import { cashfree } from "../cashfree/util";
import axios from "axios";

function DistributorDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const [distData, setDistData] = useState([]);
  const [modal, setModal] = useState(false);

  const [purachePack, setPurachePack] = useState([]);

  const [filterData, setFilterData] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const distributor_id = localStorage.getItem("distributor_id");
    const getPackages = async () => {
      let success = [];
      let all_package = await fetch(
        "https://krushimitr.in/api/admin/distributors-packages"
      );
      const allPack = await all_package.json();
      if (allPack.status === 201) {
        allPack.result.map((item) => {
          success.push(item);
        });
        setFilterData(allPack.result);
      } else {
        alert(allPack.result);
      }
    };
    getPackages();
    
    const getPurchasePackages = async () => {
      const distributor_id = localStorage.getItem("distributor_id");
      let user_package = await fetch(
        "https://krushimitr.in/api/distributors/distributors-purchage_package_data",
        {
          method: "post",
          body: JSON.stringify({ distributor_id }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const allPack = await user_package.json();
      if (allPack.status === 201) {
        allPack.result.map((item) => {
          // console.log(item);
          if (item.status === "Active") {
            return setModal(false);
          } else {
            return setModal(true);
          }
        });
        setPurachePack(allPack.result);
      } else {
        setModal(true);
        // alert(allPack.result);
      }
    };
    getPurchasePackages();

    const getProfile = async () => {
      let result = await fetch(
        "https://krushimitr.in/api/distributor/distributor-profile",
        {
          method: "post",
          body: JSON.stringify({ distributor_id }),
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

    const getProductData = async () => {
      let all_products = await fetch(
        "https://krushimitr.in/api/admin/all-products"
      );
      const getProd = await all_products.json();
      if (getProd.status === 201) {
        let productss = getProd.product_data.filter((item) => {
          return distData._id === item.vendor_id ? item : "";
        });
        setProducts(productss);
      } else {
        setProducts(getProd.result);
      }
    };
    getProductData();
    const getOrderData = async () => {
      let data = [];
      let datas = [];
      let datass = [];
      let all_products = await fetch(
        "https://krushimitr.in/api/admin/all-orders"
      );
      const all_orders = await all_products.json();
      if (all_orders.status === 201) {
        all_orders.result.map((item) => {
          if (distData._id === item.vendorId && item.status === "Active") {
            data.push(item);
          }
          if (
            item.vendorId === distData._id &&
            item.orderStatus === "Pending" &&
            item.status === "Active"
          ) {
            datas.push(item);
          }
          if (item.vendorId === distData._id && item.orderStatus === "Done") {
            datass.push(item);
          }
        });
        setAllOrder(data);
        setProd(datas);
        setOrderDone(datass);
      } else {
        setProducts(all_orders.result);
      }
    };
    getOrderData();
  }, [distData._id]);

  const [sessionIds, setSessionIds] = useState("");
  let version = cashfree.version();

  // console.log(distData);

  const getSessionId = async (item) => {
    await axios
      .post(
        "https://krushimitr.in/api/distributors/distributors-purchase-package",
        {
          user_id: distData._id,
          price: item.price,
          phone: distData.mobile,
          name: distData.name,
          duration: item.duration,
          packageName: item.package_name,
          packageId: item._id,
          data: item,
          distType: distData.type,
        }
      )
      .then((res) => {
        // console.log(res.data);
        setSessionIds(res.data);
        handlePayment();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePayment = () => {
    let checkoutOptions = {
      paymentSessionId: sessionIds,
    };
    cashfree.checkout(checkoutOptions).then(function (result) {
      if (result.redirect) {
        console.log(result);
      }
    });
  };

  return (
    <>
      <div className="row">
        <ToastContainer />
        <div className="col-lg-12">
          <div className="card p-3">
            <h2 className="d-flex justify-content-between">
              {distData.type} Dashboard{" "}
              <Link
                to={"/distributors/shop-details"}
                className="btn btn-primary"
              >
                Shop Profile
              </Link>
            </h2>
            <hr />
            {distData && distData.type === "Vendor" ? (
              <>
                <div className="row VendorDiv">
                  <div className="col-lg-4">
                    <Link to={"/allproducts"}>
                      <div className="card p-3 bg-info">
                        <h3 className="text-center text-white fw-bold text-uppercase">
                          {products.length}
                        </h3>
                        <p className="text-center text-white fw-bold text-uppercase">
                          All Product
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to={"customer-orders"}>
                      <div className="card p-3 bg-danger">
                        <h3 className="text-center text-white fw-bold text-uppercase">
                          {allOrder.length}
                        </h3>
                        <p className="text-center text-white fw-bold text-uppercase">
                          All Orders
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to={"customer-orders"}>
                      <div className="card p-3 bg-warning">
                        <h3 className="text-center text-dark fw-bold text-uppercase">
                          {prod.length}
                        </h3>
                        <p className="text-center text-dark fw-bold text-uppercase">
                          Pending Orders
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="row mt-3 VendorDiv">
                  <div className="col-lg-4">
                    <Link to={"customer-orders"}>
                      <div className="card p-3 bg-primary">
                        <h3 className="text-center text-white fw-bold text-uppercase">
                          {orderDone.length}
                        </h3>
                        <p className="text-center text-white fw-bold text-uppercase">
                          Completed Orders
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to={"customer-orders"}>
                      <div
                        className="card p-3 "
                        style={{ backgroundColor: "#0d6efd" }}
                      >
                        <h3 className="text-center text-white fw-bold text-uppercase">
                          {orderDone.length}
                        </h3>
                        <p className="text-center text-white fw-bold text-uppercase">
                          Commission
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 ">
                    <div
                      className="card p-3 text-center"
                      style={{ backgroundColor: "#DAA520" }}
                    >
                      <Link to="/distributors/distributor-purchase-plan-data">
                        <h4 className="text-white">Plan Status</h4>
                        {purachePack &&
                          purachePack.map((item) => (
                            <h4 className="text-white">
                              <i className="fa fa-gem"></i> {item.status}
                            </h4>
                          ))}
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="row VendorDiv">
                {/* <div className="col-lg-4">
                    <Link to={"/allproducts"}>
                      <div className="card p-3 bg-info">
                        <h3 className="text-center text-white fw-bold text-uppercase">
                          {products.length}
                        </h3>
                        <p className="text-center text-white fw-bold text-uppercase">
                          All Product
                        </p>
                      </div>
                    </Link>
                  </div> */}
                <div className="col-lg-4">
                  <Link to={"customer-orders"}>
                    <div className="card p-3 bg-danger">
                      <h3 className="text-center text-white fw-bold text-uppercase">
                        {allOrder.length}
                      </h3>
                      <p className="text-center text-white fw-bold text-uppercase">
                        All Orders
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-4">
                  <Link to={"customer-orders"}>
                    <div className="card p-3 bg-warning">
                      <h3 className="text-center text-dark fw-bold text-uppercase">
                        {prod.length}
                      </h3>
                      <p className="text-center text-dark fw-bold text-uppercase">
                        Pending Orders
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-4">
                  <Link to={"customer-orders"}>
                    <div className="card p-3 bg-primary">
                      <h3 className="text-center text-white fw-bold text-uppercase">
                        {orderDone.length}
                      </h3>
                      <p className="text-center text-white fw-bold text-uppercase">
                        Completed Orders
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-4 mt-3">
                  <Link to={"all-commission-data"}>
                    <div className="card p-3 bg-info">
                      <h3 className="text-center text-white fw-bold text-uppercase">
                        {orderDone.length}
                      </h3>
                      <p className="text-center text-white fw-bold text-uppercase">
                        Commission
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-4 mt-3">
                  <Link to={"enquiry-form"}>
                    <div className="card p-3 bg-secondary h-100">
                      <h3 className="text-center text-white fw-bold text-uppercase">
                        {" "}
                      </h3>
                      <p className="text-center text-white fw-bold text-uppercase">
                        Complaint / Enquiry
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-4">
                  <div
                    className="card p-3 text-center"
                    style={{ backgroundColor: "#DAA520" }}
                  >
                    <Link to="/distributors/distributor-purchase-plan-data">
                      <h4 className="text-white">Plan Status</h4>
                      {purachePack &&
                        purachePack.map((item) => (
                          <h4 className="text-white">
                            <i className="fa fa-gem"></i> {item.status}
                          </h4>
                        ))}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Dialog
          header="Packages"
          visible={modal}
          style={{ width: "20vw" }}
          onHide={() => setModal(false)}
        >
          <div className="row">
            {filterData.map((item) =>
              item.status === "Active" ? (
                <div className="col-lg-12 m-auto">
                  <div className="card h-100 shadow">
                    <div className="card-body p-0 productImage">
                      <img
                        src={`https://krushimitr.in/upload/${item.image}`}
                        style={{ margin: "auto" }}
                        width={"100%"}
                        alt={item.image}
                      />
                    </div>
                    <div className="px-2 py-3 text-center">
                      <h4 className="text-dark mb-0 text-center fw-bold">
                        {item.package_name}
                      </h4>
                      <small className="text-center">{item.description}</small>
                      <p className="text-success mb-1">
                        Price : <i className="fa fa-rupee"></i> {item.price}
                      </p>
                      <p className="text-danger mb-1">
                        Duration : {item.duration} Months
                      </p>
                      <div className="btn-action d-flex justify-content-center pb-3">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => getSessionId(item)}
                        >
                          Purchase Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
}

export default DistributorDashboard;
