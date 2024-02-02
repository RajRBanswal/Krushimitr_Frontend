import React from "react";
import { Navigate, useNavigate, useParams } from "react-router";

const VDPaymentStatus = () => {
  let { status, txnId } = useParams();
  const navigate = useNavigate();
  return (
    <div class="container py-5">
      <div class="row">
        {status === "Success" ? (
          <div class="col-lg-5 m-auto">
            <div class="card p-4 text-center">
              <img
                src="./assets/success.png"
                width="50%"
                class="zoom-in-out-box m-auto py-5"
                alt=""
              />
              <h3 class="text-danger mt-3 text-uppercase">Payment Success</h3>
              <h5 class="text-primary mt-3 text-uppercase">
                Transaction Id : {txnId}
              </h5>
              <button
                class="btn btn-primary mt-3"
                onClick={() => {
                  navigate("/distributors/vd-wallet");
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <div class="col-lg-5 m-auto">
            <div class="card p-4 text-center ">
              <img
                src="./assets/fail.png"
                width="50%"
                class="zoom-in-out-box m-auto py-5"
                alt=""
              />
              <h3 class="text-danger mt-3 text-uppercase">Payment Faild!</h3>
              <p>Try Again</p>
              <button
                class="btn btn-primary mt-3"
                onClick={() => {
                  navigate("/distributors/vd-wallet");
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VDPaymentStatus;
