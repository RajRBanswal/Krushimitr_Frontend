import moment from "moment";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
function Dashboard() {
  let date = new Date();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const getProductData = async () => {
    let allData = [];
    let penData = [];
    let compData = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      setAllOrders(all_orders.result);
      all_orders.result.map((item) => {
        if (item.orderStatus === "Pending") {
          penData.push(item);
        } else if (item.orderStatus === "Done") {
          compData.push(item);
        }
      });
      setPendingOrders(penData);
      setCompletedOrders(compData);
    } else {
      alert(all_orders.result);
    }
  };
  const [distributor, setDistributor] = useState(0);
  const [vendor, setVendor] = useState(0);
  const [todaysVendor, setTodaysVendor] = useState(0);
  const getAllDistributor = async () => {
    let TodaysVendor = [];
    let vendor = [];
    let dist = [];
    const all_users = await fetch(
      "https://krushimitr.in/api/admin/distributor"
    );
    const uu = await all_users.json();
    if (uu.status === 201) {
      uu.distributor.map((item) => {
        if (item.type === "Vendor") {
          vendor.push(item);
        } else {
          dist.push(item);
        }
        if (
          item.type === "Vendor" &&
          moment(item.createdAt).format("YYYT-MM-DD") ===
            moment(date).format("YYYT-MM-DD")
        ) {
          TodaysVendor.push(item);
        }
      });
      setDistributor(dist);
      setVendor(vendor);
      setTodaysVendor(TodaysVendor);
    } else {
      alert(uu.message);
    }
  };
  const [users, setUsers] = useState([]);
  const getAllUsers = async () => {
    const all_users = await fetch("https://krushimitr.in/api/admin/all-users");
    const uu = await all_users.json();
    // console.log(uu);
    setUsers(uu);
  };

  useEffect(() => {
    getProductData();
    getAllDistributor();
    getAllUsers();
  }, []);
  return (
    <>
      <div className="row">
        <ToastContainer />
        <div className="col-lg-12">
          <div className="card p-3">
            <h2>Admin Dashboard</h2>
            <hr />
            <div className="row">
              <div className="col-lg-4">
                <div className="card p-3 bg-primary">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    {users.length}
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Total Customers
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-warning">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    {distributor.length}
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Total Distributors
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-success">
                  <div className="row">
                    <div className="col-lg-6">
                      <h3 className="text-center text-white fw-bold text-uppercase">
                        {vendor.length}
                      </h3>
                      <p className="text-center text-white fw-bold text-uppercase">
                        Total Vendors
                      </p>
                    </div>
                    <div className="col-lg-6">
                      <h3 className="text-center text-white fw-bold text-uppercase">
                        {todaysVendor.length}
                      </h3>
                      <Link
                        to="all-vendor"
                        className="text-center text-white fw-bold text-uppercase todaysData"
                      >
                        Todays Vendors
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-4">
                <div className="card p-3 bg-danger">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    {allOrders.length}
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Total Orders
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-primary">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    {pendingOrders.length}
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Pending Orders
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-warning">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    {completedOrders.length}
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Completed Orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
