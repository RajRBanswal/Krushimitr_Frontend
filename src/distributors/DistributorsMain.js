import { event } from "jquery";
import { Image } from "primereact/image";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
// import allRoutes from '../allRoutes'
// const logo = "./assets/logo.png";

function DistributorsMain() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isToken, setIsToken] = useState(
    localStorage.getItem("distributor_token")
  );
  // const [isDToken, setIsDToken] = useState("");

  const toogle = (e) => {
    e.preventDefault();
    setIsActive((current) => !current);
  };
  const [distData, setDistData] = useState("");

  const distributor_id = localStorage.getItem("distributor_id");
  const distributorName = localStorage.getItem("distributor_name");
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const [walletData, setWalletData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTotal = () => {
    let total = 0;
    walletData.map((item) => {
      if (item.type === "Credit") {
        total += parseInt(item.amount);
      } else if (item.type === "Debit") {
        total -= parseInt(item.amount);
      }
    });
    return total;
  };

  useEffect(() => {
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
        let tokens =
          res.distributor.tokens[res.distributor.tokens.length - 1].token;
        if (tokens !== "" && isToken !== null && tokens === isToken) {
          setIsAuth(true);
          setDistData(res.distributor);
        } else {
          setIsAuth(false);
          navigate("/login");
        }
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
          if (item.dvId === distributor_id) {
            datas.push(item);
          }
        });

        setWalletData(datas);
      } else {
        setWalletData([]);
      }
    };
    getWalletData();

    project(event, "defalut");
    if (distributor_id === null) {
      navigate("/login");
    }
  }, [distributor_id]);

  const Logout = () => {
    setIsAuth(false);
    localStorage.clear("");
    navigate("/login");
  };
  const [first, setFirst] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [five, setFive] = useState(false);
  const project = (event, ids) => {
    // event.preventDefault();
    switch (ids) {
      case "first":
        return (
          first ? setFirst(false) : setFirst(true),
          setTwo(false),
          setThree(false),
          setFour(false),
          setFive(false)
        );
      case "two":
        return (
          setFirst(false),
          two ? setTwo(false) : setTwo(true),
          setThree(false),
          setFour(false),
          setFive(false)
        );
      case "three":
        return (
          setFirst(false),
          setTwo(false),
          three ? setThree(false) : setThree(true),
          setFour(false),
          setFive(false)
        );
      case "four":
        return (
          setFirst(false),
          setTwo(false),
          setThree(false),
          four ? setFour(false) : setFour(true),
          setFive(false)
        );
      case "five":
        return (
          setFirst(false),
          setTwo(false),
          setThree(false),
          setFour(false),
          five ? setFive(false) : setFive(true)
        );

      default:
        return setFirst(false), setTwo(false), setThree(false), setFour(false);
    }
  };
  return (
    <>
      <div
        className={`page-wrapper chiller-theme ${isActive ? "toggled" : ""}`}
      >
        <nav className="navbar navbar-expand-lg bg-dark" style={{ zIndex: 99 }}>
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <Link
                id="show-sidebar"
                className="btn btn-sm btn-dark"
                to="#"
                onClick={toogle}
              >
                <i className="fas fa-bars"></i>
              </Link>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            </div>
            <div className="me-3">
              <Link
                to={"vd-wallet"}
                class="btn btn-outline-warning position-relative"
              >
                <i class="fa fa-solid fa-wallet"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {getTotal()}
                </span>
              </Link>
            </div>
            <div className="d-flex" role="search">
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {distributorName}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <Link className="dropdown-item" to="" onClick={Logout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <Link
          id="show-sidebar"
          className="btn btn-sm btn-dark d-lg-block d-none"
          to="#"
          onClick={toogle}
          style={{ zIndex: 999, fontSize: 25 }}
        >
          <i className="fas fa-bars"></i>
        </Link>

        <nav id="sidebar" className="sidebar-wrapper">
          <div className="sidebar-content">
            <div className="sidebar-brand">
              <Link to="#" className="text-white text-center">
                {distData.type}
              </Link>
              <div id="close-sidebar">
                <i className="fas fa-times" onClick={toogle}></i>
              </div>
            </div>
            <div className="sidebar-header bg-white border-2 border-dark">
              <div className="user-pic">
                <Image
                  className="img-responsive img-rounded"
                  src="../assets/logo.png"
                  alt=""
                />
              </div>
            </div>
            <div className="sidebar-menu">
              <ul>
                <li className="header-menu">
                  <span>General</span>
                </li>
                <li>
                  <Link to="/distributors">
                    <i className="fa fa-book"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className={`sidebar-dropdown ${first ? "active" : ""}`}>
                  <Link to="#" onClick={(event) => project(event, "first")}>
                    <i className="fa fa-tachometer-alt itemMenu"></i>
                    <span className="itemMenu">Customers</span>
                  </Link>
                  <div className={`sidebar-submenu ${first ? "active" : ""}`}>
                    <ul>
                      <li>
                        <Link to="allusers">All Customers</Link>
                      </li>
                    </ul>
                  </div>
                </li>
                {distData.type === "Vendor" ? (
                  <li>
                    {distData && distData.status === "Active" ? (
                      <Link to="allproducts">
                        <i className="fa fa-book"></i>
                        <span>All Products</span>
                      </Link>
                    ) : (
                      <Link
                        to=""
                        onClick={() => {
                          alert("Update shop details and wait for KYC");
                          navigate("/distributors/shop-details");
                        }}
                      >
                        <i className="fa fa-book"></i>
                        <span>All Products</span>
                      </Link>
                    )}
                  </li>
                ) : (
                  ""
                )}

                <li className={`sidebar-dropdown ${three ? "active" : ""}`}>
                  <Link to="#" onClick={(event) => project(event, "three")}>
                    <i className="far fa-gem"></i>
                    <span>Customer Orders</span>
                  </Link>
                  <div className={`sidebar-submenu ${three ? "active" : ""}`}>
                    <ul>
                      <li>
                        <Link to="customer-orders">
                          <i className="fa-solid fa-shop"></i>
                          <span>All Orders </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                {distData.type !== "Vendor" ? (
                  <li className={`sidebar-dropdown ${four ? "active" : ""}`}>
                    <Link to="#" onClick={(event) => project(event, "four")}>
                      <i className="fa fa-chart-line"></i>
                      <span>Orders</span>
                    </Link>
                    <div className={`sidebar-submenu ${four ? "active" : ""}`}>
                      <ul>
                        <li>
                          <Link to="all-orders">All Orders</Link>
                        </li>
                        <li>
                          <Link to="place-orders">Place Order</Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  ""
                )}
                <li className={`sidebar-dropdown ${five ? "active" : ""}`}>
                  <Link to="#" onClick={(event) => project(event, "five")}>
                    <i className="fa fa-chart-line"></i>
                    <span>Reports</span>
                  </Link>
                  <div className={`sidebar-submenu ${five ? "active" : ""}`}>
                    <ul>
                      <li>
                        <Link to="all_orders_reports">All Reports</Link>
                      </li>
                      <li>
                        <Link to="orders_complate_reports">
                          Completed Orders Reports
                        </Link>
                      </li>
                      <li>
                        <Link to="orders_pending_reports">
                          Pending Orders Reports
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* <li className="header-menu">
                                    <span>Extra</span>
                                </li> */}
                {/* <li>
                  <Link to="all-application-form">
                    <i className="fa fa-book"></i>
                    <span>All Applications</span>
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>
        <main className="page-content">
          <div className="">
            <div className="card bg-light">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default DistributorsMain;
