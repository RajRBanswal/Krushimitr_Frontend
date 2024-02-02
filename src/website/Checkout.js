import React, { useEffect, useRef, useState } from "react";
import "./cart.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart, emptyCart } from "../redux/slice/CartSlice";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [product, setProducts] = useState([]);
  const dispatch = useDispatch();
  let user = localStorage.getItem("user_id");
  let username = localStorage.getItem("user_name");

  const [userLoggedIn, setUserLoggedIn] = useState(user);
  const [currentDate, setCurrentDate] = useState("");
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [userName, setUserName] = useState(username);
  const [paymentType, setPaymentType] = useState("Online");
  const textInput = useRef(false);
  const textAddress = useRef(null);
  const [referenceId, setreferenceId] = useState("");
  const [referenceProductId, setreferenceProductId] = useState("");

  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [addressAdd, setAddressAdd] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const typeEmpty = useRef();
  const [selectedWallet, setSelectedWallet] = useState(false);

  const SaveAddress = async () => {
    const address = addressAdd;
    const userId = userLoggedIn;
    if (!type || !addressAdd || !city || !state) {
      alert("Please Fill all Feilds");
    }
    const response = await fetch(
      "https://krushimitr.in/api/users/add-address",
      {
        method: "post",
        body: JSON.stringify({
          area,
          address,
          city,
          state,
          pincode,
          type,
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const getCat = await response.json();
    if (getCat.status === 201) {
      alert(getCat.result);
      setType("");
      setArea("");
      setAddressAdd("");
      setCity("");
      setState("");
      setPincode("");
    } else {
      alert(getCat.result);
    }
  };
  const [userData, setUserData] = useState([]);

  const getTotal = () => {
    let total = 0;
    product.map((item) => {
      total = total + item.quantity * item.price;
    });
    return total.toFixed(0);
  };

  const getPointTotal = () => {
    let total = 0;
    product.map((item) => {
      total = total + parseInt(item.rewardPoints);
    });
    return total;
  };
  // console.log(product);
  const orderPlace = async () => {
    if (!selectedAddress) {
      alert("Select Address");
      textAddress.current?.focus();
    }
    if (!paymentType) {
      textInput.current?.focus();
    }
    let paymentStatus = "Pending";
    let paymentMethod = paymentType;
    let success = false;

    let finalTotal = 0;
    let walletAmount = 0;
    if (selectedWallet === true) {
      let wallet = getWalletTotal();
      let total = getTotal();
      if (wallet > total) {
        let dd = total;
        walletAmount = dd;
        finalTotal = 0;
      } else {
        walletAmount = wallet;
        finalTotal = total - wallet;
      }
    } else {
      finalTotal = getTotal();
    }

    let data = {
      userName: userName,
      userId: userLoggedIn,
      address: selectedAddress,
      userData: JSON.stringify(userData),
      items: JSON.stringify(product), //cartItems,
      amount: finalTotal,
      walletAmount: walletAmount,
      paymentMethod: paymentMethod,
      paymentStatus: finalTotal < 1 ? "Paid" : paymentStatus,
      orderDate: currentDate,
      paymentType: finalTotal < 1 ? "Wallet" : paymentType,
      referenceId: referenceId,
      referenceProductId: referenceProductId,
      rewardPoints: getPointTotal(),
    };
    const response = await fetch(
      "https://krushimitr.in/api/users/place-order",
      {
        method: "post",
        body: JSON.stringify({
          success: success,
          userMobile: userData.mobile,
          data: data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const getCat = await response.json();
    if (getCat.status === 201) {
      dispatch(emptyCart([]));
      alert("Order placed successfully");
      navigate("/users/user-orders");
    } else {
      alert(getCat.result);
    }
  };
  const payNow = async () => {
    if (!selectedAddress) {
      textAddress.current?.focus();
      alert("Select Address");
      return false;
    }
    if (!paymentType) {
      textInput.current?.focus();
      return false;
    }
    let success = false;
    let finalTotal = 0;
    let walletAmount = 0;
    if (selectedWallet === true) {
      let wallet = getWalletTotal();
      let total = getTotal();
      if (wallet > total) {
        let dd = total;
        walletAmount = dd;
        finalTotal = 0;
      } else {
        walletAmount = wallet;
        finalTotal = total - wallet;
      }
    } else {
      finalTotal = getTotal();
    }

    // localStorage.setItem("ORDER_DATA", JSON.stringify(data));
    if (finalTotal < 1) {
      let data = {
        userName: userName,
        userId: userLoggedIn,
        address: selectedAddress,
        userData: JSON.stringify(userData),
        items: JSON.stringify(product), //cartItems,
        amount: finalTotal,
        walletAmount: walletAmount,
        paymentMethod: "Online",
        paymentStatus: "Paid",
        orderDate: currentDate,
        paymentType: "Wallet",
        referenceId: referenceId,
        referenceProductId: referenceProductId,
        rewardPoints: getPointTotal(),
      };
      const response = await fetch(
        "https://krushimitr.in/api/users/place-order-using-wallat",
        {
          method: "post",
          body: JSON.stringify({
            success: success,
            userMobile: userData.mobile,
            data: data,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const getCat = await response.json();
      if (getCat.status === 201) {
        dispatch(emptyCart([]));
        alert("Order placed successfully");
        navigate("/users/user-orders");
      } else {
        alert(getCat.result);
      }
    } else {
      let data = {
        userName: userName,
        userId: userLoggedIn,
        address: selectedAddress,
        userData: JSON.stringify(userData),
        items: JSON.stringify(product), //cartItems,
        amount: finalTotal,
        walletAmount: walletAmount,
        orderDate: currentDate,
        paymentType: paymentType,
        referenceId: referenceId,
        referenceProductId: referenceProductId,
        rewardPoints: getPointTotal(),
      };
      const response = await fetch(
        "https://krushimitr.in/api/users/make-payment",
        {
          method: "post",
          body: JSON.stringify({
            user_id: userData._id,
            price: finalTotal,
            phone: userData.mobile,
            name: userData.name,
            data: data,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const getCat = await response.json();
      // console.log(getCat);
      window.open(getCat.result, "_blank");
    }
  };

  const withoutGst = (price, gst) => {
    let reeta = price;
    let tot_price = "";
    if (gst === "28") {
      tot_price = reeta / 1.28;
    } else if (gst === "18") {
      tot_price = reeta / 1.18;
    } else if (gst === "12") {
      tot_price = reeta / 1.12;
    } else if (gst === "5") {
      tot_price = reeta / 1.05;
    } else if (gst === "0") {
      tot_price = reeta / 1.0;
    } else if (gst === "" || gst === undefined) {
      tot_price = reeta / 1.0;
    }
    return parseInt(tot_price).toFixed(2);
  };

  const [rupeeWalletData, setRupeeWalletData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const getAfterWallet = () => {
    let finalTotal = 0;
    let wallet = getWalletTotal();
    let total = getTotal();
    if (wallet > total) {
      finalTotal = 0;
    } else {
      finalTotal = total - wallet;
    }
    return finalTotal.toFixed(2);
  };

  const getWalletTotal = () => {
    let total = 0;
    rupeeWalletData.map((item) => {
      if (item.type == "Credit") {
        total += parseInt(item.amount);
      } else if (item.type == "Debit") {
        total -= parseInt(item.amount);
      }
    });
    return total;
  };

  const getSelectWalletData = () => {
    if (selectedWallet === true) {
      setSelectedWallet(false);
    } else {
      setSelectedWallet(true);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserData = async () => {
    const data = await fetch("https://krushimitr.in/api/users/user-profile", {
      method: "post",
      body: JSON.stringify({ userId: userLoggedIn }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const getData = await data.json();
    if (getData.user_data !== "") {
      setUserData(getData.user_data);
    }
  };
  const getUserAddress = async () => {
    const response = await fetch("https://krushimitr.in/api/users/address", {
      method: "post",
      body: JSON.stringify({ user_id: userLoggedIn }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const getCat = await response.json();
    if (getCat.status === 200) {
      setAddress(getCat.result);
    } else {
      alert(getCat.result);
    }
  };
  const getRupeeWalletData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/users/rupee-wallet",
      {
        method: "post",
        body: JSON.stringify({ userId: userLoggedIn }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    // console.log(data.result);
    if (data.status == "201") {
      setRupeeWalletData(data.result);
    } else {
      setRupeeWalletData([]);
    }
  };
  useEffect(() => {
    setProducts(cart.data);

    if (cart.data.length === 0) {
      navigate("/");
    }

    cart.data.map((item) => {
      if (item.referenceId !== "") {
        setreferenceId(item.referenceId);
      }
      if (item.referenceProductId !== "") {
        setreferenceProductId(item.referenceProductId);
      }
    });

    getUserData();
    getUserAddress();
    getRupeeWalletData();

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    setCurrentDate(date + "-" + month + "-" + year);
  }, []);

  return (
    <div className="container py-5">
      <section className="main-cart-section">
        <h3>Checkout</h3>
        <div className="cart-items">
          <div className="cart-items-container">
            <table className="table table-stripped w-100">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product / Size</th>
                  <th>Price</th>
                  <th className="text-center">Qty</th>
                  <th>GST</th>
                  <th className="text-right">GST Amt</th>
                  <th className="text-right">Total Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {product.map((item, index) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={`https://krushimitr.in/upload/${item.image[0]}`}
                          alt="product"
                          width={50}
                        />
                      </td>
                      <td>
                        <div className="product-info">
                          <div className="product-title">
                            <p className="mb-0 fw-bold ">
                              {item.productName} ({item.size}
                              {item.unit})
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="product-price">
                          <p className="mb-0 fw-bold text-success ">
                            ₹ {withoutGst(item.price, item.gst)}
                          </p>
                        </div>
                      </td>
                      <td className="fw-bold text-center">{item.quantity}</td>
                      <td className="fw-bold text-danger">{item.gst} %</td>
                      <td className="fw-bold text-right">
                        ₹{" "}
                        {(
                          item.price * item.quantity -
                          withoutGst(item.price, item.gst) * item.quantity
                        ).toFixed(2)}
                      </td>
                      <td>
                        <p className="mb-0 fw-bold text-success text-right">
                          ₹ {item.price * item.quantity}
                        </p>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            dispatch(deleteFromCart(index));
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="fw-bold text-success">Total : </td>
                  <td>
                    <p className="fw-bold mb-0 text-success text-right">
                      {selectedWallet === true
                        ? getWalletTotal() > 0
                          ? "Total using Wallet :  ₹" + getAfterWallet()
                          : "₹" + getAfterWallet()
                        : "₹" + getTotal()}
                    </p>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="flexCheckDefault"
                        onChange={() => getSelectWalletData()}
                      />
                      <label class="form-check-label" for="flexCheckDefault">
                        Use Wallet
                      </label>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    {selectedWallet === true ? (
                      <p className="fw-bold mb-0 text-success text-right">
                        ₹{" "}
                        {getTotal() > getWalletTotal()
                          ? 0
                          : getWalletTotal() - getTotal()}
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <div className="row">
              <div className="col-lg-6">
                <h5 className="mb-2 ps-3 d-flex justify-content-between">
                  Address{" "}
                  <button
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#addressModal"
                  >
                    Add
                  </button>
                </h5>
                {address &&
                  address.map((item, index) => {
                    return (
                      <div className="form-check ps-5" key={item._id}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          ref={textAddress}
                          id={"exampleRadios5" + index}
                          onChange={() =>
                            setSelectedAddress(
                              item.area +
                                ", " +
                                item.address +
                                ", " +
                                item.city +
                                ", " +
                                item.state +
                                ", " +
                                item.pincode
                            )
                          }
                        />
                        <label className="mb-0" for={"exampleRadios5" + index}>
                          {item.area}, {item.address}, {item.city}, {item.state}
                          , {item.pincode}
                        </label>
                        <hr className="my-2" />
                      </div>
                    );
                  })}

                <div
                  className="modal fade"
                  id="addressModal"
                  tabIndex="-1"
                  aria-labelledby="addressModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="addressModalLabel">
                          Add Address
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Type</label>
                              <select
                                className="form-control form-select"
                                ref={typeEmpty}
                                onChange={(e) => setType(e.target.value)}
                              >
                                <option value="">Select One</option>
                                <option value="0">Home</option>
                                <option value="1">Office</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Area</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Area / Landmark"
                                onChange={(e) => setArea(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Address</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Village / Town"
                                onChange={(e) => setAddressAdd(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>City</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="City"
                                onChange={(e) => setCity(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>State</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="State"
                                onChange={(e) => setState(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Pincode</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Pincode"
                                onChange={(e) => setPincode(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            SaveAddress();
                          }}
                          data-bs-dismiss="modal"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h5 className="mb-2 ps-3">Payment Method</h5>
                <div
                  className={`form-check ps-5 ${
                    selectedWallet === true && getAfterWallet() === "0.00"
                      ? "d-none"
                      : "d-block"
                  }`}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    ref={textInput}
                    id="exampleRadios1"
                    onChange={() => setPaymentType("Online")}
                  />
                  <label className="form-check-label" for="exampleRadios1">
                    Online
                  </label>
                </div>
                <div
                  className={`form-check ps-5 mb-5 ${
                    selectedWallet === true && getAfterWallet() === "0.00"
                      ? "d-none"
                      : "d-block"
                  }`}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    id="exampleRadios2"
                    onChange={() => setPaymentType("COD")}
                  />
                  <label className="form-check-label" for="exampleRadios2">
                    Cash On Delivery
                  </label>
                </div>
                {paymentType === "COD" ? (
                  <button
                    className="btn btn-warning"
                    type="button"
                    onClick={() => {
                      orderPlace();
                    }}
                  >
                    Place Order
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    type="button"
                    onClick={() => {
                      payNow();
                    }}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;


