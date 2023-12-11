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
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [paymentType, setPaymentType] = useState("");
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

  const SaveAddress = async () => {
    const address = addressAdd;
    const userId = userLoggedIn;
    if (!type || !addressAdd || !city || !state) {
      alert("Please Fill all Feilds");
    }
    const response = await fetch("https://krushimitr.in/users/add-address", {
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
    });
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

  useEffect(() => {
    let user = localStorage.getItem("user_id");
    let username = localStorage.getItem("user_name");
    setProducts(cart.data);
    setUserName(username);
    setUserLoggedIn(user);
    getUserData();

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

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    setCurrentDate(date + "-" + month + "-" + year);
  }, [cart]);

  useEffect(() => {
    getUserAddress();
  });

  const getTotal = () => {
    let total = 0;
    product.map((item) => {
      total = total + item.quantity * item.price;
    });
    return total.toFixed(0);
  };

  const [userData, setUserData] = useState([]);
  const getUserData = async () => {
    const data = await fetch("https://krushimitr.in/users/user-profile", {
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
    const response = await fetch("https://krushimitr.in/users/address", {
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

  const orderPlace = async () => {
    console.log(referenceId, referenceProductId);
    if (!selectedAddress) {
      textAddress.current?.focus();
    }
    if (!paymentType) {
      textInput.current?.focus();
    }
    let paymentStatus = "Pending";
    let paymentMethod = paymentType;
    if (paymentType === "COD") {
      paymentStatus = "Pending";
      paymentMethod = "COD";
    } else {
      paymentStatus = "Success";
      paymentMethod = "Online";
    }
    let data = {
      userName: userName,
      userId: userLoggedIn,
      address: selectedAddress,
      userData: JSON.stringify(userData),
      items: JSON.stringify(product), //cartItems,
      amount: getTotal(),
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      orderDate: currentDate,
      paymentType: paymentType,
      referenceId: referenceId,
      referenceProductId: referenceProductId,
    };
    const response = await fetch("https://krushimitr.in/users/place-order", {
      method: "post",
      body: JSON.stringify({ data: data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const getCat = await response.json();
    if (getCat.status === 201) {
      dispatch(emptyCart([]));
      alert("Order placed successfully");
      navigate("/users/user-orders");
    } else {
      alert(getCat.result);
    }
  };

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
                  <th>Product / Size / Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
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
                          <div className="product-price">
                            <p className="mb-0 fw-bold text-success ">
                              ₹ {item.price}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold">{item.quantity}</td>
                      <td>
                        <p className="mb-0 fw-bold text-success ">
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
                  <td className="fw-bold text-success">Total : </td>
                  <td>
                    <p className="fw-bold text-success">₹ {getTotal()}</p>
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
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addressModal"
                  >
                    Add
                  </button>
                </h5>
                {address &&
                  address.map((item, index) => {
                    return (
                      <div className="form-check ps-5" key={(item) => item._id}>
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
                  tabindex="-1"
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
                <div className="form-check ps-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    ref={textInput}
                    id="exampleRadios1"
                    onChange={() => setPaymentType("Credit Card")}
                  />
                  <label className="form-check-label" for="exampleRadios1">
                    Credit Card
                  </label>
                </div>
                <div className="form-check ps-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    id="exampleRadios2"
                    onChange={() => setPaymentType("Debit Card")}
                  />
                  <label className="form-check-label" for="exampleRadios2">
                    Debit Card
                  </label>
                </div>
                <div className="form-check ps-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    id="exampleRadios3"
                    onChange={() => setPaymentType("UPI")}
                  />
                  <label className="form-check-label" for="exampleRadios3">
                    UPI
                  </label>
                </div>
                <div className="form-check ps-5 mb-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    id="exampleRadios4"
                    onChange={() => setPaymentType("COD")}
                  />
                  <label className="form-check-label" for="exampleRadios4">
                    Cash on Delivery
                  </label>
                </div>
                <button
                  className="btn btn-warning"
                  type="button"
                  onClick={() => {
                    orderPlace();
                  }}
                >
                  Pay & Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
