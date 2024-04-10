import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { cashfree } from "../cashfree/util";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  let userId = "";

  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [orderDone, setOrderDone] = useState([]);
  const [orderCancel, setOrderCancel] = useState([]);
  const [modal, setModal] = useState(false);

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

  const [purachePack, setPurachePack] = useState([]);
  const getPurchasePackages = async () => {
    let success = [];
    let user_package = await fetch(
      "https://krushimitr.in/api/users/users-purchage_package_data",
      {
        method: "post",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const allPack = await user_package.json();
    console.log(allPack);
    if (allPack.status === 201) {
      allPack.result.map((item) => {
        console.log(item);
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    userId = localStorage.getItem("user_id");
    getAllUsers();
    getProductData();
    getPackages();
    getPurchasePackages();
  }, []);
  const [users, setUsers] = useState("");
  const getAllUsers = async () => {
    const all_users = await fetch(
      "https://krushimitr.in/api/users/user-profile",
      {
        method: "post",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const uu = await all_users.json();
    setUsers(uu.user_data);
  };

  const [filterData, setFilterData] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPackages = async () => {
    let success = [];
    let all_package = await fetch(
      "https://krushimitr.in/api/admin/users-packages"
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

  const [sessionIds, setSessionIds] = useState("");
  let version = cashfree.version();

  const getSessionId = async (item) => {
    await axios
      .post("https://krushimitr.in/api/users/user-purchase-package", {
        user_id: users._id,
        price: item.price,
        phone: users.mobile,
        name: users.name,
        duration: item.duration,
        packageName: item.package_name,
        packageId: item._id,
        data: item,
      })
      .then((res) => {
        console.log(res.data);
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
          <div className="card bg-info p-3 text-center">
            <h4 className="text-dark">Cancel Orders</h4>
            <h4 className="text-dark">{orderCancel}</h4>
          </div>
        </div>
        <div className="col-lg-3 mt-3">
          <div
            className="card p-3 text-center"
            style={{ backgroundColor: "#DAA520" }}
          >
            <Link to="/users/purchase-plan">
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

      <Dialog
        header="Packages"
        visible={modal}
        style={{ width: "40vw" }}
        onHide={() => setModal(false)}
      >
        <div className="row">
          {filterData.map((item) =>
            item.status === "Active" ? (
              <div className="col-lg-6 my-3 m-auto">
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
  );
}

export default Dashboard;
