import { event } from 'jquery';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
// import allRoutes from '../allRoutes'
const logo = "./assets/logo.png"

function MainContent() {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isToken, setIsToken] = useState(localStorage.getItem('admin_token'));
    const [isDToken, setIsDToken] = useState("");

    const toogle = (e) => {
        e.preventDefault();
        setIsActive(current => !current);
    }
    console.log(isToken);
    const admin_id = localStorage.getItem('admin_id');
    const getProfile = async () => {
        let result = await fetch("https://krushimitr.in/admin/admin_profile", {
            method: "post",
            body: JSON.stringify({ admin_id }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((result) => result.json());
        let tokens = result.admins.tokens[result.admins.tokens.length - 1].token;
        // setIsDToken(tokens);
        if (tokens !== "" && isToken !== null && tokens === isToken) {
            setIsAuth(true)
        } else {
            setIsAuth(false)
            navigate("/admin_login");

        }
    }
    console.log(isDToken + " main" + isToken);
    useEffect(() => {
        getProfile();
        project(event, "defalut");
    }, []);
    const Logout = () => {
        setIsAuth(false)
        localStorage.clear("");
        navigate("/admin_login")
    }
    const [first, setFirst] = useState(false);
    const [two, setTwo] = useState(false);
    const [three, setThree] = useState(false);
    const [four, setFour] = useState(false);
    const project = (event, ids) => {
        // event.preventDefault();
        switch (ids) {

            case "first":
                return (
                    first ? setFirst(false) : setFirst(true),
                    setTwo(false),
                    setThree(false),
                    setFour(false)
                );
            case "two":
                return (
                    setFirst(false),
                    two ? setTwo(false) : setTwo(true),
                    setThree(false),
                    setFour(false)
                );
            case "three":
                return (
                    setFirst(false),
                    setTwo(false),
                    three ? setThree(false) : setThree(true),
                    setFour(false)
                );
            case "four":
                return (
                    setFirst(false),
                    setTwo(false),
                    setThree(false),
                    four ? setFour(false) : setFour(true)
                );

            default:
                return (
                    setFirst(false),
                    setTwo(false),
                    setThree(false),
                    setFour(false)
                )
        }
    }
    return (
        <>
            <div className={`page-wrapper chiller-theme ${isActive ? 'toggled' : ''}`}>
                <nav class="navbar navbar-expand-lg bg-dark" style={{ zIndex: 99 }}>
                    <div class="container-fluid">

                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <Link id="show-sidebar" className="btn btn-sm btn-dark" to="#" onClick={toogle}>
                                <i className="fas fa-bars"></i>
                            </Link>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                            </ul>
                        </div>
                        <div class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button type='button' className='btn btn-primary' onClick={Logout}>Logout</button>
                        </div>
                    </div>
                </nav>
                <Link id="show-sidebar" className="btn btn-sm btn-dark d-lg-block d-none" to="#" onClick={toogle} style={{ zIndex: 999, fontSize: 25 }}>
                    <i className="fas fa-bars"></i>
                </Link>


                <nav id="sidebar" className="sidebar-wrapper">
                    <div className="sidebar-content">
                        <div className="sidebar-brand">
                            <Link to="#" className='text-white'>Krushimitr</Link>
                            <div id="close-sidebar">
                                <i className="fas fa-times" onClick={toogle}></i>
                            </div>
                        </div>
                        <div className="sidebar-header bg-white border-2 border-dark">
                            <div className="user-pic">
                                <img className="img-responsive img-rounded" src={`./assets/logo.png`} alt="User picture" />
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
                                <li className={`sidebar-dropdown ${first ? 'active' : ''}`}>
                                    <Link to="#" onClick={(event) => project(event, "first")}>
                                        <i className="fa fa-tachometer-alt itemMenu"></i>
                                        <span className='itemMenu'>Admin</span>
                                    </Link>
                                    <div className={`sidebar-submenu ${first ? 'active' : ''}`}>
                                        <ul>
                                            <li>
                                                <Link to="all-users">Users</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className={`sidebar-dropdown ${two ? 'active' : ''}`}>
                                    <Link to="#" onClick={(event) => project(event, "two")}>
                                        <i className="fa fa-cog"></i>
                                        <span>Components</span>
                                    </Link>
                                    <div className={`sidebar-submenu ${two ? 'active' : ''}`}>
                                        <ul>
                                            <li>
                                                <Link to="all-categories">All Categories

                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="all-products">All Products</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className={`sidebar-dropdown ${three ? 'active' : ''}`}>
                                    <Link to="#" onClick={(event) => project(event, "three")}>
                                        <i className="far fa-gem"></i>
                                        <span>Settings</span>
                                    </Link>
                                    <div className={`sidebar-submenu ${three ? 'active' : ''}`}>
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
                                                <Link to="#">Tables</Link>
                                            </li>
                                            <li>
                                                <Link to="#">Icons</Link>
                                            </li>
                                            <li>
                                                <Link to="#">Forms</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className={`sidebar-dropdown ${four ? 'active' : ''}`}>
                                    <Link to="#" onClick={(event) => project(event, "four")}>
                                        <i className="fa fa-chart-line"></i>
                                        <span>Charts</span>
                                    </Link>
                                    <div className={`sidebar-submenu ${four ? 'active' : ''}`}>
                                        <ul>
                                            <li>
                                                <Link to="#">Pie chart</Link>
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
                            </ul>
                        </div>
                    </div>
                </nav>
                <main className="page-content">
                    <div className="">
                        <div className='card bg-light'>
                            <Outlet />
                        </div>
                    </div>

                </main>
            </div>
        </>
    )
}

export default MainContent