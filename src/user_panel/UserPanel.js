import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "./index.css";
function UserPanel() {
  let userId = "";
  const navigate = useNavigate();
  userId = localStorage.getItem("user_id");
  if (!userId) {
    navigate("/login");
  }
  const Logout = () => {
    localStorage.clear("");
    navigate("/login");
  };
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
              <img src={"/assets/logo.png"}
                alt="..."
                width={80}
              />
            </Link>
            {/* <!-- User menu (mobile) --> */}
            <div className="navbar-user d-lg-none">
              {/* <!-- Dropdown --> */}
              <div className="dropdown">
                {/* <!-- Toggle --> */}
                <Link
                  to="#"
                  id="sidebarAvatar"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div className="avatar-parent-child">
                    <span className="avatar-child avatar-badge bg-success"></span>
                  </div>
                </Link>
                {/* <!-- Menu --> */}
                <div
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="sidebarAvatar"
                >
                  <Link to="#" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="#" className="dropdown-item">
                    Settings
                  </Link>
                  <Link to="#" className="dropdown-item">
                    Billing
                  </Link>
                  <hr className="dropdown-divider" />
                  <Link to="#" className="dropdown-item">
                    Logout
                  </Link>
                </div>
              </div>
            </div>
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
                  <Link className="nav-link" to="#">
                    <i className="bi bi-bar-chart"></i> Analitycs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <i className="bi bi-chat"></i> Messages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <i className="bi bi-bookmarks"></i> Collections
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <i className="bi bi-people"></i> Users
                  </Link>
                </li>
              </ul>
              {/* <!-- User (md) --> */}
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <i className="bi bi-person-square"></i> Account
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#" onClick={Logout}>
                    <i className="bi bi-box-arrow-left"></i> Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* <!-- Main content --> */}
        <div className="h-screen flex-grow-1 overflow-y-lg-auto d-lg-block d-none">
          {/* <!-- Header --> */}
          <header className="bg-surface-primary border-bottom py-2">
            <div className="container-fluid">
              <div className="mb-npx">
                <div className="row align-items-center">
                  {/* <!-- Actions --> */}
                  <div className="col-sm-12 col-12 text-sm-end">
                    <div className="mx-n1">
                      <ul class="navbar-nav float-right">
                        <li class="nav-item dropdown">
                          <a
                            class="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDarkDropdownMenuLink"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img src={"/assets/logo.png"} alt="" width={"50"} />
                            <Link className="ps-3">Rajesh Ramji Banswal</Link>
                          </a>
                          <ul
                            class="dropdown-menu w-100"
                            aria-labelledby="navbarDarkDropdownMenuLink"
                          >
                            <li>
                              <Link class="dropdown-item" to="/">
                                Home
                              </Link>
                            </li>
                            <hr className="my-0" />
                            <li>
                              <Link class="dropdown-item" to="">
                                Profile
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* <!-- Main --> */}
          <main className="py-6 bg-surface-secondary">
            <div className="container-fluid">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
