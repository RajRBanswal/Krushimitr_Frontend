import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

function EditOrder() {
  const location = useSelector((state) => state.order);
  const navigate = useNavigate();
  const data = location.data;
  const [orderData, setOrderData] = useState(data[0]);
  const [userData, setUserData] = useState(data[0].userData);
  const [itemsData, setItemsData] = useState(JSON.parse(data[0].itemsData));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const dates = new Date();
  const [deliveryDate, setDeliveryDate] = useState(
    moment(dates).format("DD-MM-YYYY")
  );

  const [orderId, setorderId] = useState(
    "KRUSHIMITR" + Math.floor(100000 + Math.random() * 900000)
  );

  useEffect(() => {
    console.log(moment(dates).format("DD-MM-YYYY"));
  }, []);

  const ConfirmOrder = async (Id) => {
    if (orderData.paymentType === "COD") {
      if (!paymentMethod || !paymentStatus || !deliveryStatus) {
        alert("Please fill all the fields");
        return;
      }
    }
    const response = await fetch("https://krushimitr.in/distributor/confirm", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Id,
        orderId: orderId,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        deliveryStatus: deliveryStatus,
        deliveryDate: deliveryDate,
      }),
    });
    const data = await response.json();
    if (data.status === 201) {
      alert(data.result);
      navigate("/distributors/customer-orders");
    } else {
      alert(data.result);
    }
  };

  return (
    <div className="px-3 py-2 mb-5">
      <h4>Edit Order</h4>
      <div className="row">
        <div className="col-lg-4 col-12">
          <h5 className="mb-0">Customer Details</h5>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <label className="mb-0">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Order Id"
            value={userData.name}
            readOnly
          />
          <input type="hidden" className="form-control" value={userData._id} />
        </div>
        <div className="col-md-4">
          <label className="mb-0">Email</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={userData.email}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="mb-0">Mobile Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={userData.mobile}
            readOnly
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-4">
          <label className="mb-0">Shipping Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Order Id"
            value={orderData.shippingAddress}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="mb-0">Transfer Date</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={orderData.transferToVendorDate}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="mb-0">Payment Status</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={orderData.paymentType}
            readOnly
          />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-4">
          <label className="mb-0">Order Id</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Order Id"
            value={orderId}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="mb-0">Order Date</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={orderData.orderDate}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="mb-0">Amount</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={orderData.finalAmount}
            readOnly
          />
        </div>
      </div>
      <hr className="text-success" />
      <div className="row">
        <div className="col-lg-4 col-12">
          <h5 className="mb-0">Order Details</h5>
        </div>
      </div>
      {itemsData.map((ele) => {
        return (
          <>
            <div className="row mt-2">
              <div className="col-md-4">
                <label className="mb-0">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Order Id"
                  value={ele.productName}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={ele.category}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">Size</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Order Id"
                  value={ele.size}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">Amount</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={ele.price}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={ele.quantity}
                  readOnly
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-2">
                <label className="mb-0">Guarantee</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={ele.guarantee}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">warranty</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={ele.price}
                  readOnly
                />
              </div>
            </div>
          </>
        );
      })}

      <div className="row my-3">
        {orderData.paymentType === "COD" ? (
          <>
            <div className="col-md-4">
              <label className="mb-0">Payment Method</label>
              <select
                className="form-select form-control"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value={""}>Select Method</option>
                <option value={"UPI"}>UPI</option>
                <option value={"Cash"}>Cash</option>
                <option value={"Others"}>Others</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="mb-0">Payment Status</label>
              <select
                className="form-select form-control"
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value={""}>Select Status</option>
                <option value={"Paid"}>Paid</option>
                <option value={"Pending"}>Pending</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="mb-0">Delivery Status</label>
              <select
                className="form-select form-control"
                onChange={(e) => setDeliveryStatus(e.target.value)}
              >
                <option value={""}>Select Status</option>
                <option value={"Delivered"}>Delivered</option>
                <option value={"Not Delivered"}>Not Delivered</option>
              </select>
            </div>
          </>
        ) : (
          <div className="col-md-4">
            <label className="mb-0">Delivery Status</label>
            <select
              className="form-select form-control"
              onChange={(e) => setDeliveryStatus(e.target.value)}
            >
              <option value={""}>Select Status</option>
              <option value={"Delivered"}>Delivered</option>
              <option value={"Not Delivered"}>Not Delivered</option>
            </select>
          </div>
        )}
      </div>
      <div className="row mt-4">
        <div className="col-md-2 m-auto">
          <button
            className="btn btn-primary w-100"
            onClick={() => ConfirmOrder(orderData._id)}
          >
            Confirm
          </button>
        </div>
        {/* <div className="col-md-2">
          <button className="btn btn-danger w-100">Reject</button>
        </div> */}
      </div>
    </div>
  );
}

export default EditOrder;
