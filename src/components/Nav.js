import React from 'react'
import { useNavigate } from 'react-router';
// import { Link } from 'react-router-dom';


function Nav() {
    const wrapper = document.getElementById('wrapper');
        // const toogle = (e) => {
        //     e.preventDefault();
            // wrapper.classList.toggle('toggled');
        // }
        // const navigate = useNavigate();
        // const Logout = ()=>{
        //     localStorage.clear();
        //     navigate("/")
        // }
    return (
        <>
          <section className="home-section">

          </section>
            {/* <div id="navbar-wrapper">
                <nav className="navbar navbar-inverse navbar-expand navbar-light navbar-bg"> */}
                    {/* <Link className="sidebar-toggle js-sidebar-toggle">
                        <i className="hamburger align-self-center"></i>
                    </Link> */}
                    {/* <div className="container-fluid">
                        <div className="navbar-header">
                            <Link to="#" className="navbar-brand" id="sidebar-toggle" onClick={toogle}><i className="fa fa-bars"></i></Link>
                        </div>


                        <div className="navbar-collapse collapse ">
                            <ul className="navbar-nav navbar-align m-auto me-0">
                                <li className="nav-item dropdown">
                                    <Link className="nav-icon dropdown-toggle d-inline-block d-none" href="#"
                                        data-bs-toggle="dropdown">
                                        <i className="align-middle" data-feather="settings"></i>
                                    </Link>

                                    <Link className="nav-link dropdown-toggle d-sm-inline-block" href="#"
                                        data-bs-toggle="dropdown">
                                        <img src="./logo192.png" style={{ width: 30+"px" }} className="avatar img-fluid rounded me-1"
                                            alt="Charles Hall" /> <span className="text-dark">{localStorage.getItem("admin_name").replace(/['"]+/g, '')}</span>
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <Link className="dropdown-item" href="pages-profile.html"><i className="align-middle me-1"
                                            data-feather="user"></i> Profile</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" onClick={Logout} href="#">Log out</Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div> */}
        </>
    )
}

export default Nav