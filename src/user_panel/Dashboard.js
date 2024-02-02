import React, { useEffect, useState } from "react";

function Dashboard() {
  let userId = "";

  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const [orderCancel, setOrderCancel] = useState([]);
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
        if (userId === item.userId) {
          data.push(item);
        }
        if (
          item.userId === userId &&
          item.orderStatus === "Pending" &&
          item.status === "Active"
        ) {
          datas.push(item);
        }
        if (item.userId === userId && item.orderStatus === "Done") {
          datass.push(item);
        }
        if (item.userId === userId && item.status === "Cancel") {
          cancel.push(item);
        }
      });
      setProducts(data.length);
      setProd(datas.length);
      setOrderDone(datass.length);
      setOrderCancel(cancel.length);
    } else {
      setProducts(all_orders.result);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    userId = localStorage.getItem("user_id");
    getAllUsers();
    getProductData();
  }, []);
  const [users, setUsers] = useState("");
  const getAllUsers = async () => {
    const all_users = await fetch(
      "https://krushimitr.in/api/users/user-profile",
      {
        method: "post",
        body: JSON.stringify({userId}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const uu = await all_users.json();
    setUsers(uu.user_data);
  };

  return (
    <div>
      <div className="row mb-3">
        <div className="col-lg-3 mt-3   ">
          <div className="card bg-primary p-3 text-center">
            <h4>Total Orders</h4>
            <h4>{products}</h4>
          </div>
        </div>
        <div className="col-lg-3 mt-3">
          <div className="card bg-warning p-3 text-center">
            <h4>Complete Orders</h4>
            <h4>{orderDone}</h4>
          </div>
        </div>
        <div className="col-lg-3 mt-3">
          <div className="card bg-danger p-3 text-center">
            <h4 className="text-white">Pending Orders</h4>
            <h4 className="text-white">{prod}</h4>
          </div>
        </div>
        <div className="col-lg-3 mt-3">
          <div className="card bg-warning p-3 text-center">
            <h4 className="text-dark">Cancel Orders</h4>
            <h4 className="text-dark">{orderCancel}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
