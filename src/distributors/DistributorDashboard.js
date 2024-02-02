import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DistributorDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const [distData, setDistData] = useState([]);
  useEffect(() => {
    const distributor_id = localStorage.getItem("distributor_id");
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
                      <div className="card p-3 " style={{backgroundColor:'#0d6efd'}}>
                        <h3 className="text-center text-white fw-bold text-uppercase">
                          {orderDone.length}
                        </h3>
                        <p className="text-center text-white fw-bold text-uppercase">
                          Commission
                        </p>
                      </div>
                    </Link>
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
                <div className="col-lg-4">
                  <Link to={"customer-orders"}>
                    <div className="card p-3 bg-primary">
                      <h3 className="text-center text-white fw-bold text-uppercase">
                        {orderDone.length}
                      </h3>
                      <p className="text-center text-white fw-bold text-uppercase">
                        Commission
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DistributorDashboard;
