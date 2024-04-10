import React, { useEffect, useState } from "react";

const DistPurchasePlan = () => {
  let userId = "";
  const [purachePack, setPurachePack] = useState([]);
  const getPurchasePackages = async () => {
    const distributor_id = localStorage.getItem("distributor_id");
    let success = [];
    let user_package = await fetch(
      "https://krushimitr.in/api/distributors/distributors-purchage_package_data",
      {
        method: "post",
        body: JSON.stringify({ distributor_id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const allPack = await user_package.json();
    console.log(allPack);
    if (allPack.status === 201) {
      setPurachePack(allPack.result);
    } else {
      // alert(allPack.result);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    userId = localStorage.getItem("user_id");
    getPurchasePackages();
  }, []);
  return (
    <div className="">
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            {purachePack.map((item, index) => (
              <>
                <tr>
                  <th className="py-1">Order Id</th>
                  <td className="py-1">: {item.order_id}</td>
                  <th className="py-1">Transaction Id</th>
                  <td className="py-1">: {item.transactionId}</td>
                </tr>
                <tr>
                  <th className="py-1">Package Name</th>
                  <td className="py-1">: {item.package_name}</td>
                  <th className="py-1">Price</th>
                  <td className="py-1">: {item.price}</td>
                </tr>
                <tr>
                  <th className="py-1">Duration</th>
                  <td className="py-1">: {item.duration}</td>
                  <th className="py-1">Status</th>
                  <td className="py-1">: {item.status}</td>
                </tr>
                <tr>
                  <th className="py-1">Purachse Date</th>
                  <td className="py-1">: {item.startDate}</td>
                  <th className="py-1">Expiry Date</th>
                  <td className="py-1">: {item.expiryDate}</td>
                </tr>
                <tr>
                  <th className="py-1">Payment Method</th>
                  <td className="py-1">: {item.paymentMethod}</td>
                  <th className="py-1" colSpan={2}>
                    {item.status === "Active" ? (
                      <span className="text-success">
                        <i className="fa fa-gem"></i> Prime Member
                      </span>
                    ) : (
                      "Renew Plan"
                    )}
                  </th>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistPurchasePlan;
