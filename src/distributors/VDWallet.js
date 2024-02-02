import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const VDWallet = () => {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState([]);
  const [showTransaction, setShowTransaction] = useState(false);
  const [distData, setDistData] = useState("");
  const [amount, setAmount] = useState(0);

  const distributor_id = localStorage.getItem("distributor_id");
  const distributorName = localStorage.getItem("distributor_name");

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
  const ref = useRef(null);

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
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
        setDistData(res.distributor);
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
          console.log(item.dvId);
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
  }, [distributor_id]);

  const TopupNow = async () => {
    const mobile = distData.mobile;
    const response = await fetch(
      "https://krushimitr.in/api/distributors/add-vendor-distributor-wallet",
      {
        method: "post",
        body: JSON.stringify({
          distId: distributor_id,
          distName: distributorName,
          price: amount,
          totalAmt: getTotal(),
          mobile: mobile,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    window.open(result.result, "_blank");
  };
  return (
    <div className="">
      <div className="iphone">
        <div className="header">
          <div className="header-summary w-50 ps-5">
            <div className="summary-text">My Balance</div>
            <div className="summary-balance">
              <i className="fa fa-rupee"></i> {getTotal()}.00
            </div>
          </div>
          <div className="user-profile w-50 text-end pe-5">
            <h3 className="text-white">{distributorName}</h3>
          </div>
        </div>
        <div className="content">
          <div className="card">
            <div className="row">
              {/* <div className="card-item">
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
              </div> */}
              <div className="col-lg-4 p-3">
                <div className="card-item text-center">
                  <div className="row">
                    <div className="col-lg-12">
                      <input
                        type="number"
                        className="form-control form-control-lg border-success rupeeText"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <i className="fas fa-rupee rupeeIcon"></i>
                    </div>
                    <div className="col-lg-12 mt-3">
                      <button
                        className="btn btn-outline-primary ms-1"
                        onClick={() => setAmount(1000)}
                      >
                        <i className="fas fa-rupee"></i>
                        1000
                      </button>
                      <button
                        className="btn btn-outline-primary ms-1"
                        onClick={() => setAmount(2000)}
                      >
                        <i className="fas fa-rupee"></i>
                        2000
                      </button>
                      <button
                        className="btn btn-outline-primary ms-1"
                        onClick={() => setAmount(5000)}
                      >
                        <i className="fas fa-rupee"></i>
                        5000
                      </button>
                    </div>
                    <div className="col-lg-12 mt-3">
                      <button
                        className="btn btn-outline-danger "
                        onClick={() => TopupNow()}
                      >
                        <i className="fas fa-upload"></i>
                        Top-up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4"></div>
              <div className="col-lg-4">
                <div className="card-item text-center">
                  <span>View Transaction</span>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleClick();
                      setShowTransaction(true);
                    }}
                  >
                    <i className="fa fa-eye"></i> View
                  </button>
                </div>
              </div>
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
                      <th scope="col">Date / Time</th>
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
                        <td>
                          {item.transactionDate} /{" "}
                          {item.transactionDate !== undefined
                            ? item.transactionTime
                            : ""}
                        </td>
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
};

export default VDWallet;
