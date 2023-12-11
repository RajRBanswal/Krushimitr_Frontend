import { event } from "jquery";
import { Image } from "primereact/image";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
// import allRoutes from '../allRoutes'
const logo = "./assets/logo.png";

function MainContent() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isToken, setIsToken] = useState(localStorage.getItem("admin_token"));
  const [isDToken, setIsDToken] = useState("");

  const toogle = (e) => {
    e.preventDefault();
    setIsActive((current) => !current);
  };
  // console.log(isToken);
  const admin_id = localStorage.getItem("admin_id");
  const adminName = localStorage.getItem("admin_name");
  const getProfile = async () => {
    let result = await fetch("https://krushimitr.in/admin/admin_profile", {
      method: "post",
      body: JSON.stringify({ admin_id }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => result.json());
    let tokens = result.admins.tokens[result.admins.tokens.length - 1].token;
    // setIsDToken(tokens);
    if (tokens !== "" && isToken !== null && tokens === isToken) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      navigate("/admin_login");
    }
  };
  // console.log(isDToken + " main" + isToken);
  useEffect(() => {
    getProfile();
    project(event, "defalut");
  }, []);
  const Logout = () => {
    setIsAuth(false);
    localStorage.clear("");
    navigate("/admin_login");
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
            <div className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />

              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {adminName}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="" onClick={Logout}>
                      Logout
                    </a>
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
              <Link to="#" className="text-white">
                Krushimitr
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
                  <Link to="/admin">
                    <i className="fa fa-book"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className={`sidebar-dropdown ${first ? "active" : ""}`}>
                  <Link to="#" onClick={(event) => project(event, "first")}>
                    <i className="fa fa-tachometer-alt itemMenu"></i>
                    <span className="itemMenu">Admin</span>
                  </Link>
                  <div className={`sidebar-submenu ${first ? "active" : ""}`}>
                    <ul>
                      <li>
                        <Link to="all-users">All Users</Link>
                      </li>
                      <li>
                        <Link to="all-distributor">All Distributor</Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className={`sidebar-dropdown ${two ? "active" : ""}`}>
                  <Link to="#" onClick={(event) => project(event, "two")}>
                    <i className="fa fa-cog"></i>
                    <span>Components</span>
                  </Link>
                  <div className={`sidebar-submenu ${two ? "active" : ""}`}>
                    <ul>
                      <li>
                        <Link to="all-categories">All Categories</Link>
                      </li>
                      <li>
                        <Link to="all-products">All Products</Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className={`sidebar-dropdown ${three ? "active" : ""}`}>
                  <Link to="#" onClick={(event) => project(event, "three")}>
                    <i className="far fa-gem"></i>
                    <span>Settings</span>
                  </Link>
                  <div className={`sidebar-submenu ${three ? "active" : ""}`}>
                    <ul>
                      <li>
                        <Link to="all-slider">
                          <i className="fa fa-book"></i>
                          <span>All Slider</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="all-news">
                          <i className="fa fa-newspaper"></i>
                          <span>All NEWS</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="all-sarkari-yojna">
                          <i className="fa fa-newspaper"></i>
                          <span>Sarkari Yojna</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
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
                    </ul>
                  </div>
                </li>
                <li className={`sidebar-dropdown ${five ? "active" : ""}`}>
                  <Link to="#" onClick={(event) => project(event, "five")}>
                    <i className="fa fa-chart-line"></i>
                    <span>Reports</span>
                  </Link>
                  <div className={`sidebar-submenu ${five ? "active" : ""}`}>
                    <ul>
                      <li>
                        <Link to="all-orders-reports">All Reports</Link>
                      </li>
                      <li>
                        <Link to="all-orders">Completed Orders Reports</Link>
                      </li>
                    </ul>
                  </div>
                </li>
                {/* <li className="header-menu">
                                    <span>Extra</span>
                                </li> */}
                <li>
                  <Link to="all-application-form">
                    <i className="fa fa-book"></i>
                    <span>All Applications</span>
                  </Link>
                </li>
                {/* <li>
                  <Link to="demo-products">
                    <i className="fa fa-book"></i>
                    <span>All Demo Products</span>
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

export default MainContent;
