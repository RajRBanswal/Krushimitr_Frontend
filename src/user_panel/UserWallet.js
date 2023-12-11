import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

function UserWallet() {
  let userId = "";
  const navigate = useNavigate();
  userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name");
  const [walletData, setWalletData] = useState([]);

  const [showTransaction, setShowTransaction] = useState(false);

  const getWalletData = async () => {
    const response = await fetch("https://krushimitr.in/users/wallet", {
      method: "post",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status == "201") {
      setWalletData(data.result);
    } else {
      setWalletData([]);
    }
  };
  const getTotal = () => {
    let total = 0;
    walletData.map((item) => {
      if (item.status == "Credit") {
        total += parseInt(item.amount);
      } else if (item.status == "Debit") {
        total -= parseInt(item.amount);
      }
    });
    return total;
  };
  const ref = useRef(null);

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getWalletData();
  });
  return (
    <div className="">
      <div className="iphone">
        <div className="header">
          <div className="header-summary w-50 ps-5">
            <div className="summary-text">My Balance</div>
            <div className="summary-balance">
              <i className="fa fa-rupee"></i> -{getTotal()}.00
            </div>
          </div>
          <div className="user-profile w-50 text-end pe-5">
            <h3 className="text-white">{userName}</h3>
          </div>
        </div>
        <div className="content">
          <div className="card">
            <div className="upper-row">
              <div className="card-item">
                <span>Active Balance</span>
                <span>
                  <i className="fa fa-rupee"></i> {getTotal()}
                </span>
              </div>
              <div className="card-item">
                <span>My Save it</span>
                <span>
                  <i className="fa fa-rupee"></i> {getTotal()}
                </span>
              </div>
              <div className="card-item">
                <span>Transaction</span>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleClick();
                    setShowTransaction(true);
                  }}
                >
                  <i className="fa fa-eye"></i>
                </button>
              </div>
            </div>
            <div className="lower-row">
              <button className="icon-item btn btn-outline-warning">
                <div className="icon">
                  <i className="fas fa-upload"></i>
                </div>
                <div className="icon-text">Top-up</div>
              </button>
              <button className="icon-item btn btn-outline-danger">
                <div className="icon">
                  <i className="fas fa-money-check-alt"></i>
                </div>
                <div className="icon-text">Withdraw</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={"row " + (showTransaction ? "d-block" : "d-none")}
        ref={ref}
      >
        <div className="col-lg-10 m-auto">
          <div className="card p-5 ">
            <div className="card-body">
              <h5 className="card-title d-flex   justify-content-between">
                History{" "}
                <i
                  className="fa fa-close"
                  onClick={() => {
                    setShowTransaction(false);
                  }}
                ></i>
              </h5>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Date</th>
                      <th scope="col">Type</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-end">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.createdDate}</td>
                        <td>{item.type}</td>
                        <td>{item.status}</td>
                        <td className="text-success text-end">
                          + <i className="fa fa-rupee"></i> {item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserWallet;
