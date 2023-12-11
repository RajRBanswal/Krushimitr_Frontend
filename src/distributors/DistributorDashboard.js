import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DistributorDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <div className="row">
        <ToastContainer />
        <div className="col-lg-12">
          <div className="card p-3">
            <h2 className="d-flex justify-content-between">
              Distributor Dashboard{" "}
              <Link
                to={"/distributors/shop-details"}
                className="btn btn-primary"
              >
                Shop Profile
              </Link>
            </h2>
            <hr />
            <div className="row">
              <div className="col-lg-4">
                <div className="card p-3 bg-primary">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    69
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Total Customer
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-warning">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    15
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Total Partners
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-success">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    309
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Total Services
                  </p>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-4">
                <div className="card p-3 bg-danger">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    99
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Completed Services
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-primary">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    157
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Pending Services
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 bg-warning">
                  <h3 className="text-center text-white fw-bold text-uppercase">
                    53
                  </h3>
                  <p className="text-center text-white fw-bold text-uppercase">
                    Cancelled Services
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

export default DistributorDashboard;
