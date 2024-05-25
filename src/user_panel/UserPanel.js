import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "./index.css";
function UserPanel() {
  let userId = "";
  const navigate = useNavigate();
  userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name");
  if (!userId) {
    navigate("/login");
  }
  const Logout = () => {
    localStorage.clear("");
    navigate("/login");
  };

  const [walletData, setWalletData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getWalletData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/users/rupee-wallet",
      {
        method: "post",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.status === "201") {
      setWalletData(data.result);
    } else {
      setWalletData([]);
    }
  };
  const getTotal = () => {
    let total = 0;
    walletData.map((item) => {
      if (item.type === "Credit") {
        total += item.amount;
      } else if (item.type === "Debit") {
        total -= item.amount;
      }
    });
    return total;
  };
  useEffect(() => {
    getWalletData();
  }, [getWalletData, userId]);

  return (
    <div>
      <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary userPanel ">
        {/* <!-- Vertical Navbar --> */}
        <nav
          className="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg"
          id="navbarVertical"
        >
          <div className="container-fluid">
            {/* <!-- Toggler --> */}
            <button
              className="navbar-toggler ms-n2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarCollapse"
              aria-controls="sidebarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* <!-- Brand --> */}
            <Link
              className="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0 text-center"
              to="#"
            >
              <img src={"/assets/logo.png"} alt="..." width={80} />
            </Link>
            {/* <!-- User menu (mobile) --> */}
            <ul className="float-right navbar-user d-lg-none">
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDarkDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Link className="ps-3">{userName}</Link>
                </Link>
                <ul
                  className="dropdown-menu w-100"
                  aria-labelledby="navbarDarkDropdownMenuLink"
                >
                  <li>
                    <Link className="dropdown-item" to="/">
                      Home
                    </Link>
                  </li>
                  <hr className="my-0" />
                  <li>
                    <Link className="dropdown-item" to="">
                      Profile
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            {/* <!-- Collapse --> */}
            <div className="collapse navbar-collapse" id="sidebarCollapse">
              {/* <!-- Navigation --> */}
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="user-dashboard">
                    <i className="bi bi-house"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="user-orders">
                    <i className="bi bi-bar-chart"></i> All Orders
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <i className="bi bi-chat"></i> Messages
                  </Link>
                </li>
                <li className="nav-item has-submenu">
                  <Link className="nav-link" href="#">
                    <i className="bi bi-list"></i>
                    More menus{" "}
                  </Link>
                  <ul className="submenu collapse">
                    <li>
                      <Link className="nav-link" href="#">
                        Submenu item 4{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link" href="#">
                        Submenu item 5{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link" href="#">
                        Submenu item 6{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link" href="#">
                        Submenu item 7{" "}
                      </Link>
                    </li>
                  </ul>
                </li> */}
              </ul>
              {/* <!-- User (md) --> */}
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="user-wallet">
                    <i className="bi bi-wallet"></i> Wallet
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="users-profile">
                    <i className="bi bi-person-square"></i> User Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="" onClick={Logout}>
                    <i className="bi bi-box-arrow-left"></i> Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* <!-- Main content --> */}
        <div className="h-screen flex-grow-1 overflow-y-lg-auto ">
          {/* <!-- Header --> */}
          <header className="bg-surface-primary border-bottom d-lg-block d-none py-2 ">
            <div className="container-fluid">
              <div className="mb-npx">
                <div className="row align-items-center">
                  {/* <!-- Actions --> */}
                  <div className="col-lg-8 col-12 text-sm-end"></div>
                  {/* <div className="mx-n1"> */}
                  <div className="col-lg-2 col-6 text-end">
                    <Link
                      to={"user-wallet"}
                      class="btn btn-outline-info position-relative"
                    >
                      <i class="fa fa-solid fa-wallet"></i>
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {getTotal()}
                      </span>
                    </Link>
                  </div>
                  <div className="col-lg-2 col-6 text-end">
                    <ul className="navbar-nav ">
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle"
                          to="#"
                          id="navbarDarkDropdownMenuLink"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {/* <img src={"/assets/logo.png"} alt="" width={"50"} /> */}
                          <Link className="ps-3">{userName}</Link>
                        </Link>
                        <ul
                          className="dropdown-menu w-100"
                          aria-labelledby="navbarDarkDropdownMenuLink"
                        >
                          <li>
                            <Link className="dropdown-item" to="/">
                              Home
                            </Link>
                          </li>
                          <hr className="my-0" />
                          <li>
                            <Link className="dropdown-item" to="users-profile">
                              Profile
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </header>
          {/* <!-- Main --> */}
          <main className="py-3 bg-surface-secondary">
            <div className="p-1">
              <div className="card p-3">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
