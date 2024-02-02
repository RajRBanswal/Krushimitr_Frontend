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

  useEffect(() => {
    let user = localStorage.getItem("user_id");
    let username = localStorage.getItem("user_name");
    setProducts(cart.data);
    setUserName(username);
    setUserLoggedIn(user);

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
    getUserData();
    getUserAddress();

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    setCurrentDate(date + "-" + month + "-" + year);
  }, [cart, navigate, userLoggedIn]);

  const getTotal = () => {
    let total = 0;
    product.map((item) => {
      total = total + item.quantity * item.price;
    });
    return total.toFixed(0);
  };

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
    const response = await fetch(
      "https://krushimitr.in/api/users/place-order",
      {
        method: "post",
        body: JSON.stringify({ data: data }),
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
    let data = {
      userName: userName,
      userId: userLoggedIn,
      address: selectedAddress,
      userData: JSON.stringify(userData),
      items: JSON.stringify(product), //cartItems,
      amount: getTotal(),
      orderDate: currentDate,
      paymentType: paymentType,
      referenceId: referenceId,
      referenceProductId: referenceProductId,
    };

    localStorage.setItem("ORDER_DATA", JSON.stringify(data));

    const response = await fetch(
      "https://krushimitr.in/api/users/make-payment",
      {
        method: "post",
        body: JSON.stringify({
          user_id: userData._id,
          price: getTotal(),
          phone: userData.mobile,
          name: userData.name,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          OPTIONS: "",
        },
      }
    );
    const getCat = await response.json();
    // console.log(getCat.result);
    // navigate(""+getCat.result)
    window.open(getCat.result, "_blank");
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
                {/* 
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
                </button> */}
                <div className="form-check ps-5">
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
                <div className="form-check ps-5 mb-5">
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

// if (response.data.success == true) {
//   let itemsData = JSON.parse(orderData.items);
//   let paymentMethod = "";
//   let paymentStatus = "Paid";
//   let paymentType = "Online";
//   let transactionData = JSON.stringify(response.data);
//   let dd = JSON.stringify(response.data.data.paymentInstrument);
//   let utrNo = "";
//   if (response.data.success == true) {
//     let userId = orderData.userId;
//     let userMobile = tempMobile;
//     let userName = orderData.userName;
//     let success = response.data.success;
//     let message = response.data.message;
//     paymentMethod = response.data.data.paymentInstrument.type;
//     utrNo = response.data.data.paymentInstrument.utr;
//     paymentStatus = "Paid";
//     paymentType = "Online";
//     let status = "Success";
//     await Transaction.create({
//       orderNo: orderNo,
//       user_id: userId,
//       user_name: userName,
//       user_mobile: userMobile,
//       success: success,
//       message: message,
//       data: transactionData,
//       paymentInstrument: dd,
//       status: status,
//     });
//   }

//   if (orderData.walletAmount > 0) {
//     const userWallet = await UserRupeeWallet.create({
//       userId: orderData.userId,
//       userName: orderData.userName,
//       userMobile: tempMobile,
//       amount: orderData.walletAmount,
//       type: "Debit",
//       status: "Success",
//       paymode: paymentMethod,
//       utrNo: utrNo,
//       transactionDetails: transactionData,
//       paymentInstrument: dd,
//       transactionDate: orderData.orderDate,
//     });
//   }
//   if (orderData.rewardPoints > 0) {
//     let rewardPointd = await UsersWallet.create({
//       orderId: orderNo,
//       userId: orderData.userId,
//       type: "Reward Points",
//       points: orderData.rewardPoints,
//       status: "Credit",
//       createdDate: orderData.orderDate,
//     });
//   }

//   let duplicatesId = [];
//   let duplicateVendor = [];

//   itemsData.map((item) => {
//     if (item.productVendor !== "") {
//       duplicateVendor.push(item.productVendor);
//     } else {
//       duplicateVendor.push("");
//     }
//     duplicatesId.push(item._id);
//   });

//   function removeDuplicates(abc) {
//     return abc.filter((value, index) => abc.indexOf(value) === index);
//   }
//   let cleanId = removeDuplicates(duplicatesId);
//   let beforeFilter = removeDuplicates(duplicateVendor);
//   let cleanVendor = beforeFilter.filter(function (el) {
//     return el != null;
//   });

//   let responseTrue = "";
//   let responseFalse = "";

//   for (let r = 0; r < cleanVendor.length; r++) {
//     let idwiseData = [];
//     let idWisePrice = 0;
//     for (let s = 0; s < itemsData.length; s++) {
//       if (
//         cleanVendor[r] === itemsData[s].productVendor &&
//         itemsData[s].productVendor !== ""
//       ) {
//         let dds = parseInt(itemsData[s].price) * parseInt(itemsData[s].quantity);
//         idWisePrice = idWisePrice + dds;
//         idwiseData.push(itemsData[s]);
//       }
//     }
//     if (idwiseData.length > 0) {
//       let datass = JSON.stringify(idwiseData);
//       let distData = await Distributor.findOne({ _id: cleanVendor[r] })
//         .select("-password")
//         .select("-tokens");
//       let distName = distData.name;
//       let distMobile = distData.mobile;
//       let distAddress =
//         distData.address +
//         ", " +
//         distData.city +
//         ", " +
//         distData.state +
//         ", " +
//         distData.pincode +
//         ".";

//       const placeorder = await Orders.create({
//         userId: orderData.userId,
//         userName: orderData.userName,
//         userData: orderData.userData,
//         itemsData: datass,
//         shippingAddress: orderData.address,
//         finalAmount: idWisePrice,
//         withWallet: orderData.walletAmount,
//         paymentMethod: paymentMethod,
//         paymentStatus: paymentStatus,
//         orderDate: orderData.orderDate,
//         orderNumber: orderNo,
//         paymentType: paymentType,
//         orderStatus: "Pending",
//         transferToVendorDate: orderData.orderDate,
//         vendorId: cleanVendor[r],
//         distName: distName,
//         distMobile: distMobile,
//         distAddress: distAddress,
//         referenceId: orderData.referenceId,
//         referenceProductId: orderData.referenceProductId,
//         rewardPoints: orderData.rewardPoints,
//         status: "Active",
//         reason: "",
//       });
//       if (placeorder) {
//         if (orderData.referenceId !== "") {
//           let referPoints = await PointsManagament.find({
//             type: "Refer Earn",
//           })
//             .sort({ $natural: -1 })
//             .limit(1);
//           const options = { ordered: true };
//           const docs = [
//             {
//               orderId: placeorder._id,
//               userId: orderData.referenceId,
//               type: "Refer Earn",
//               points: referPoints.points,
//               status: "Credit",
//               createdDate: orderData.orderDate,
//             },
//             {
//               orderId: placeorder._id,
//               userId: orderData.userId,
//               type: "Refer Earn",
//               points: referPoints.points,
//               status: "Credit",
//               createdDate: orderData.orderDate,
//             },
//           ];
//           let userWallet1 = await UsersWallet.insertMany(docs, options);
//           if (userWallet1) {
//             const url = "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//             const params = new URLSearchParams({
//               secret: "AMIK73UEFFiACG1Y0kuF",
//               sender: "KMITR",
//               receiver: userMobile,
//               route: "TA",
//               tempid: "1207170122653754184",
//               msgtype: 1,
//               sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//             });
//             const rr = await fetch(`${url}?${params}`);
//             let referenceIdData = await User.find({
//               referenceId: data.data.referenceId,
//             });
//             if (referenceIdData) {
//               const url =
//                 "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//               const params = new URLSearchParams({
//                 secret: "AMIK73UEFFiACG1Y0kuF",
//                 sender: "KMITR",
//                 receiver: referenceIdData.mobile,
//                 route: "TA",
//                 tempid: "1207170122653754184",
//                 msgtype: 1,
//                 sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//               });
//               await fetch(`${url}?${params}`);
//             }

//             responseTrue = "Done";
//           } else {
//             responseFalse = "Not Done";
//           }
//         } else {
//           responseTrue = "Done";
//         }
//       } else {
//         responseFalse = "Not Done";
//       }
//     }
//   }

//   let otherData = [];
//   let otherPrice = 0;
//   for (let s = 0; s < itemsData.length; s++) {
//     if (itemsData[s].productVendor === "" || itemsData[s].productVendor === undefined) {
//       let dds = parseInt(itemsData[s].price) * parseInt(itemsData[s].quantity);
//       otherPrice = otherPrice + dds;
//       otherData.push(itemsData[s]);
//     }
//   }
//   if (otherData.length > 0) {
//     let datass = JSON.stringify(otherData);
//     const placeorder = await Orders.create({
//       userId: orderData.userId,
//       userName: orderData.userName,
//       userData: orderData.userData,
//       itemsData: datass,
//       shippingAddress: orderData.address,
//       finalAmount: otherPrice,
//       withWallet: orderData.walletAmount,
//       paymentMethod: paymentMethod,
//       paymentStatus: paymentStatus,
//       orderDate: orderData.orderDate,
//       orderNumber: orderNo,
//       paymentType: paymentType,
//       orderStatus: "Pending",
//       transferToVendorDate: "",
//       vendorId: "",
//       referenceId: orderData.referenceId,
//       referenceProductId: orderData.referenceProductId,
//       rewardPoints: orderData.rewardPoints,
//       status: "Active",
//       reason: "",
//     });
//     if (placeorder) {
//       if (orderData.referenceId !== "") {
//         let referPoints = await PointsManagament.find({
//           type: "Refer Earn",
//         })
//           .sort({ $natural: -1 })
//           .limit(1);
//         const options = { ordered: true };
//         const docs = [
//           {
//             orderId: placeorder._id,
//             userId: orderData.referenceId,
//             type: "Refer Earn",
//             points: referPoints.points,
//             status: "Credit",
//             createdDate: orderData.orderDate,
//           },
//           {
//             orderId: placeorder._id,
//             userId: orderData.userId,
//             type: "Refer Earn",
//             points: referPoints.points,
//             status: "Credit",
//             createdDate: orderData.orderDate,
//           },
//         ];
//         let userWallet1 = await UsersWallet.insertMany(docs, options);
//         if (userWallet1) {
//           const url = "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//           const params = new URLSearchParams({
//             secret: "AMIK73UEFFiACG1Y0kuF",
//             sender: "KMITR",
//             receiver: userMobile,
//             route: "TA",
//             tempid: "1207170122653754184",
//             msgtype: 1,
//             sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//           });
//           await fetch(`${url}?${params}`);
//           let referenceIdData = await PointsManagament.find({
//             referenceId: data.data.referenceId,
//           });
//           if (referenceIdData) {
//             const url = "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//             const params = new URLSearchParams({
//               secret: "AMIK73UEFFiACG1Y0kuF",
//               sender: "KMITR",
//               receiver: referenceIdData.mobile,
//               route: "TA",
//               tempid: "1207170122653754184",
//               msgtype: 1,
//               sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//             });
//             await fetch(`${url}?${params}`);
//           }
//           responseTrue = "Done";
//         } else {
//           responseFalse = "Not Done";
//         }
//       } else {
//         responseTrue = "Done";
//       }
//     } else {
//       responseFalse = "Not Done";
//     }
//   }

//   if (responseTrue === "Done") {
//     res.redirect("https://krushimitr.in/responsePage/paymentSuccess.html");
//   } else {
//     res.redirect("https://krushimitr.in/responsePage/paymentSuccess.html");
//   }
// } else if (response.data.success === false) {
//   let userId = orderData.userId;
//   let userMobile = tempMobile;
//   let userName = orderData.userName;
//   let success = response.data.success;
//   let message = response.data.message;
//   let transactionData = JSON.stringify(response.data);
//   let dd = JSON.stringify(response.data.data.paymentInstrument);
//   let status = "";
//   if (success === false) {
//     status = "Failed";
//   }

//   let storeTransaction = await Transaction.create({
//     user_id: userId,
//     user_name: userName,
//     user_mobile: userMobile,
//     success: success,
//     message: message,
//     data: transactionData,
//     paymentInstrument: dd,
//     status: status,
//   });
//   if (storeTransaction) {
//     res.redirect("https://krushimitr.in/responsePage/paymentFailure.html");
//   } else {
//     res.redirect("https://krushimitr.in/responsePage/paymentFailure.html");
//   }
// }

//  for (let i = 0; i < cleanId.length; i++) {
//   let idwiseData = [];
//   let otherData = [];
//   let idWisePrice = 0;
//   let otherPrice = 0;
//   for (let j = 0; j < itemsData.length; j++) {
//      if (cleanId[i] == itemsData[j]._id) {
//       if (itemsData[j].productVendor === cleanVendor[i] && itemsData[j].productVendor !== "" ) {
//          let ddss =
//           parseInt(itemsData[j].price) * parseInt(itemsData[j].quantity);
//          idWisePrice = idWisePrice + ddss;
//          idwiseData.push(itemsData[j]);
//       } else {
//          let dds =
//           parseInt(itemsData[j].price) * parseInt(itemsData[j].quantity);
//          otherPrice = otherPrice + dds;
//          otherData.push(itemsData[j]);
//       }
//      }
//   }
//   if (idwiseData.length > 0) {
//      let datass = JSON.stringify(idwiseData);
//      let distData = await Distributor.findOne({ _id: cleanVendor[i] })
//       .select("-password")
//       .select("-tokens");
//      let distName = distData.name;
//      let distMobile = distData.mobile;
//      let distAddress =
//       distData.address +
//       ", " +
//       distData.city +
//       ", " +
//       distData.state +
//       ", " +
//       distData.pincode +
//       ".";

//      const placeorder = await Orders.create({
//       userId: orderData.userId,
//       userName: orderData.userName,
//       userData: orderData.userData,
//       itemsData: datass,
//       shippingAddress: orderData.address,
//       finalAmount: idWisePrice,
//       withWallet: orderData.walletAmount,
//       paymentMethod: paymentMethod,
//       paymentStatus: paymentStatus,
//       orderDate: orderData.orderDate,
//       orderNumber: orderNo,
//       paymentType: paymentType,
//       orderStatus: "Pending",
//       transferToVendorDate: orderData.orderDate,
//       vendorId: cleanVendor[i],
//       distName: distName,
//       distMobile: distMobile,
//       distAddress: distAddress,
//       referenceId: orderData.referenceId,
//       referenceProductId: orderData.referenceProductId,
//       rewardPoints: orderData.rewardPoints,
//       status: "Active",
//       reason: "",
//      });
//      if (placeorder) {
//       if (orderData.referenceId !== "") {
//          let referPoints = await PointsManagament.find({
//           type: "Refer Earn",
//          })
//           .sort({ $natural: -1 })
//           .limit(1);
//          const options = { ordered: true };
//          const docs = [
//           {
//              orderId: placeorder._id,
//              userId: orderData.referenceId,
//              type: "Refer Earn",
//              points: referPoints.points,
//              status: "Credit",
//              createdDate: orderData.orderDate,
//           },
//           {
//              orderId: placeorder._id,
//              userId: orderData.userId,
//              type: "Refer Earn",
//              points: referPoints.points,
//              status: "Credit",
//              createdDate: orderData.orderDate,
//           },
//          ];
//          let userWallet1 = await UsersWallet.insertMany(docs, options);
//          if (userWallet1) {
//           const url =
//              "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//           const params = new URLSearchParams({
//              secret: "AMIK73UEFFiACG1Y0kuF",
//              sender: "KMITR",
//              receiver: userMobile,
//              route: "TA",
//              tempid: "1207170122653754184",
//              msgtype: 1,
//              sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//           });
//           const rr = await fetch(`${url}?${params}`);
//           let referenceIdData = await User.find({
//              referenceId: data.data.referenceId,
//           });
//           if (referenceIdData) {
//              const url =
//               "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//              const params = new URLSearchParams({
//               secret: "AMIK73UEFFiACG1Y0kuF",
//               sender: "KMITR",
//               receiver: referenceIdData.mobile,
//               route: "TA",
//               tempid: "1207170122653754184",
//               msgtype: 1,
//               sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//              });
//              await fetch(`${url}?${params}`);
//           }

//           responseTrue = "Done";
//          } else {
//           responseFalse = "Not Done";
//          }
//       } else {
//          responseTrue = "Done";
//       }
//      } else {
//       responseFalse = "Not Done";
//      }
//   }
//       if (otherData.length > 0) {
//         let datass = JSON.stringify(otherData);
//         const placeorder = await Orders.create({
//           userId: orderData.userId,
//           userName: orderData.userName,
//           userData: orderData.userData,
//           itemsData: datass,
//           shippingAddress: orderData.address,
//           finalAmount: otherPrice,
//           withWallet: orderData.walletAmount,
//           paymentMethod: paymentMethod,
//           paymentStatus: paymentStatus,
//           orderDate: orderData.orderDate,
//           orderNumber: orderNo,
//           paymentType: paymentType,
//           orderStatus: "Pending",
//           transferToVendorDate: "",
//           vendorId: "",
//           referenceId: orderData.referenceId,
//           referenceProductId: orderData.referenceProductId,
//           rewardPoints: orderData.rewardPoints,
//           status: "Active",
//           reason: "",
//         });
//         if (placeorder) {
//           if (orderData.referenceId !== "") {
//             let referPoints = await PointsManagament.find({
//               type: "Refer Earn",
//             })
//               .sort({ $natural: -1 })
//               .limit(1);
//             const options = { ordered: true };
//             const docs = [
//               {
//                 orderId: placeorder._id,
//                 userId: orderData.referenceId,
//                 type: "Refer Earn",
//                 points: referPoints.points,
//                 status: "Credit",
//                 createdDate: orderData.orderDate,
//               },
//               {
//                 orderId: placeorder._id,
//                 userId: orderData.userId,
//                 type: "Refer Earn",
//                 points: referPoints.points,
//                 status: "Credit",
//                 createdDate: orderData.orderDate,
//               },
//             ];
//             let userWallet1 = await UsersWallet.insertMany(docs, options);
//             if (userWallet1) {
//               const url = "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//               const params = new URLSearchParams({
//                 secret: "AMIK73UEFFiACG1Y0kuF",
//                 sender: "KMITR",
//                 receiver: userMobile,
//                 route: "TA",
//                 tempid: "1207170122653754184",
//                 msgtype: 1,
//                 sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//               });
//               await fetch(`${url}?${params}`);
//               let referenceIdData = await PointsManagament.find({
//                 referenceId: data.data.referenceId,
//               });
//               if (referenceIdData) {
//                 const url = "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
//                 const params = new URLSearchParams({
//                   secret: "AMIK73UEFFiACG1Y0kuF",
//                   sender: "KMITR",
//                   receiver: referenceIdData.mobile,
//                   route: "TA",
//                   tempid: "1207170122653754184",
//                   msgtype: 1,
//                   sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
//                 });
//                 await fetch(`${url}?${params}`);
//               }
//               responseTrue = "Done";
//             } else {
//               responseFalse = "Not Done";
//             }
//           } else {
//             responseTrue = "Done";
//           }
//         } else {
//           responseFalse = "Not Done";
//         }
//       }
//  }

// if (response.data.success === true) {
//   let userId = temporaryData[0].userId;
//   let userMobile = temporaryData[0].phone;
//   let userName = temporaryData[0].landlordName;
//   let amount = temporaryData[0].amount;
//   let notes = temporaryData[0].notes;
//   let accountNo = temporaryData[0].accountNo;
//   let ifscCode = temporaryData[0].ifscCode;
//   let success = response.data.success;
//   let message = response.data.message;
//   let transactionData = JSON.stringify(response.data);
//   let dd = JSON.stringify(response.data.data.paymentInstrument);
//   let paymentMethod = response.data.data.paymentInstrument.type;
//   let utrNo = response.data.data.paymentInstrument.utr;
//   let status = "Success";

//   const rentPay = await RentPay.create({
//     userId: userId,
//     userName: userName,
//     amount: amount,
//     userMobile: userMobile,
//     accountNo: accountNo,
//     ifscCode: ifscCode,
//     notes: notes,
//     types: "Credit",
//     status: status,
//     paymode: paymentMethod,
//     utrNo: utrNo,
//     transactionDetails: transactionData,
//     paymentInstrument: dd,
//     transactionDate: date,
//   });
//   if (rentPay) {
//       const addAccountDetails = await AccDetails.find({ "accountNo": accountNo }).count();
//       if (addAccountDetails === 0) {
//           await AccDetails.create({
//             userId: userId,
//             userName: userName,
//             accountNo: accountNo,
//             ifscCode: ifscCode,
//           });
//       }
//     let storeTransaction = await Transaction.create({
//       orderNo: "Rent Pay",
//       user_id: userId,
//       user_name: userName,
//       user_mobile: userMobile,
//       success: success,
//       message: message,
//       data: transactionData,
//       paymentInstrument: dd,
//       status: status,
//     });
//       if (storeTransaction) {
//         res.redirect("krushimitruserapp");
//       } else {
//         res.redirect("krushimitruserapp");
//       }
//   }
//   res.redirect("krushimitruserapp");
// } else if (response.data.success === false) {
//   let status = "Failed";
//   let success = response.data.success;
//   let message = response.data.message;
//   let transactionData = JSON.stringify(response.data);
//   let dd = JSON.stringify(response.data.data.paymentInstrument);

//   let storeTransaction = await Transaction.create({
//       orderNo: "Rent Pay",
//       user_id: temporaryData[0].userId,
//       user_name: temporaryData[0].userName,
//       user_mobile: temporaryData[0].userMobile,
//       success: success,
//       message: message,
//       data: transactionData,
//       paymentInstrument: dd,
//       status: status,
//   });
//   if (storeTransaction) {
//       res.redirect("krushimitruserapp");
//   } else {
//       res.redirect("krushimitruserapp");
//   }
// }





      //   for (let i = 0; i < cleanId.length; i++) {
      //     let idwiseData = [];
      //     let otherData = [];
      //     let idWisePrice = 0;
      //     let otherPrice = 0;
      //     for (let j = 0; j < itemsData.length; j++) {
      //       if (cleanId[i] == itemsData[j]._id) {
      //         if (
      //           itemsData[j].productVendor === cleanVendor[i] &&
      //           itemsData[j].productVendor !== ""
      //         ) {
      //           let ddss =
      //             parseInt(itemsData[j].price) * parseInt(itemsData[j].quantity);
      //           idWisePrice = idWisePrice + ddss;
      //           idwiseData.push(itemsData[j]);
      //         } else {
      //           let dds =
      //             parseInt(itemsData[j].price) * parseInt(itemsData[j].quantity);
      //           otherPrice = otherPrice + dds;
      //           otherData.push(itemsData[j]);
      //         }
      //       }
      //     }
      //     if (idwiseData.length > 0) {
      //       let datass = JSON.stringify(idwiseData);
      //       let distData = await Distributor.findOne({ _id: cleanVendor[i] })
      //         .select("-password")
      //         .select("-tokens");
      //       let distName = distData.name;
      //       let distMobile = distData.mobile;
      //       let distAddress =
      //         distData.address +
      //         ", " +
      //         distData.city +
      //         ", " +
      //         distData.state +
      //         ", " +
      //         distData.pincode +
      //         ".";

      //       const placeorder = await Orders.create({
      //         userId: orderData.userId,
      //         userName: orderData.userName,
      //         userData: orderData.userData,
      //         itemsData: datass,
      //         shippingAddress: orderData.address,
      //         finalAmount: idWisePrice,
      //         withWallet: orderData.walletAmount,
      //         paymentMethod: paymentMethod,
      //         paymentStatus: paymentStatus,
      //         orderDate: orderData.orderDate,
      //         orderNumber: orderNo,
      //         paymentType: paymentType,
      //         orderStatus: "Pending",
      //         transferToVendorDate: orderData.orderDate,
      //         vendorId: cleanVendor[i],
      //         distName: distName,
      //         distMobile: distMobile,
      //         distAddress: distAddress,
      //         referenceId: orderData.referenceId,
      //         referenceProductId: orderData.referenceProductId,
      //         rewardPoints: orderData.rewardPoints,
      //         status: "Active",
      //         reason: "",
      //       });
      //       if (placeorder) {
      //         if (
      //           orderData.referenceId !== "" ||
      //           orderData.referenceId !== null
      //         ) {
      //           let referPoints = await PointsManagament.find({
      //             type: "Refer Earn",
      //           })
      //             .sort({ $natural: -1 })
      //             .limit(1);
      //           const options = { ordered: true };
      //           const docs = [
      //             {
      //               orderId: placeorder._id,
      //               userId: orderData.referenceId,
      //               type: "Refer Earn",
      //               points: referPoints.points,
      //               status: "Credit",
      //               createdDate: orderData.orderDate,
      //             },
      //             {
      //               orderId: placeorder._id,
      //               userId: orderData.userId,
      //               type: "Refer Earn",
      //               points: referPoints.points,
      //               status: "Credit",
      //               createdDate: orderData.orderDate,
      //             },
      //           ];
      //           let userWallet1 = await UsersWallet.insertMany(docs, options);
      //           if (userWallet1) {
      //             const url =
      //               "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
      //             const params = new URLSearchParams({
      //               secret: "AMIK73UEFFiACG1Y0kuF",
      //               sender: "KMITR",
      //               receiver: userMobile,
      //               route: "TA",
      //               tempid: "1207170122653754184",
      //               msgtype: 1,
      //               sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
      //             });
      //             const rr = await fetch(`${url}?${params}`);
      //             let referenceIdData = await User.find({
      //               referenceId: data.data.referenceId,
      //             });
      //             if (referenceIdData) {
      //               const url =
      //                 "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
      //               const params = new URLSearchParams({
      //                 secret: "AMIK73UEFFiACG1Y0kuF",
      //                 sender: "KMITR",
      //                 receiver: referenceIdData.mobile,
      //                 route: "TA",
      //                 tempid: "1207170122653754184",
      //                 msgtype: 1,
      //                 sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
      //               });
      //               await fetch(`${url}?${params}`);
      //             }

      //             responseTrue = "Done";
      //           } else {
      //             responseFalse = "Not Done";
      //           }
      //         } else {
      //           responseTrue = "Done";
      //         }
      //       } else {
      //         responseFalse = "Not Done";
      //       }
      //     }
      //     if (otherData.length > 0) {
      //       let datass = JSON.stringify(otherData);
      //       const placeorder = await Orders.create({
      //         userId: orderData.userId,
      //         userName: orderData.userName,
      //         userData: orderData.userData,
      //         itemsData: datass,
      //         shippingAddress: orderData.address,
      //         finalAmount: otherPrice,
      //         withWallet: orderData.walletAmount,
      //         paymentMethod: paymentMethod,
      //         paymentStatus: paymentStatus,
      //         orderDate: orderData.orderDate,
      //         orderNumber: orderNo,
      //         paymentType: paymentType,
      //         orderStatus: "Pending",
      //         transferToVendorDate: "",
      //         vendorId: "",
      //         referenceId: orderData.referenceId,
      //         referenceProductId: orderData.referenceProductId,
      //         rewardPoints: orderData.rewardPoints,
      //         status: "Active",
      //         reason: "",
      //       });
      //       if (placeorder) {
      //         if (
      //           orderData.referenceId !== "" ||
      //           orderData.referenceId !== null
      //         ) {
      //           let referPoints = await PointsManagament.find({
      //             type: "Refer Earn",
      //           })
      //             .sort({ $natural: -1 })
      //             .limit(1);
      //           const options = { ordered: true };
      //           const docs = [
      //             {
      //               orderId: placeorder._id,
      //               userId: orderData.referenceId,
      //               type: "Refer Earn",
      //               points: referPoints.points,
      //               status: "Credit",
      //               createdDate: orderData.orderDate,
      //             },
      //             {
      //               orderId: placeorder._id,
      //               userId: orderData.userId,
      //               type: "Refer Earn",
      //               points: referPoints.points,
      //               status: "Credit",
      //               createdDate: orderData.orderDate,
      //             },
      //           ];
      //           let userWallet1 = await UsersWallet.insertMany(docs, options);
      //           if (userWallet1) {
      //             const url =
      //               "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
      //             const params = new URLSearchParams({
      //               secret: "AMIK73UEFFiACG1Y0kuF",
      //               sender: "KMITR",
      //               receiver: userMobile,
      //               route: "TA",
      //               tempid: "1207170122653754184",
      //               msgtype: 1,
      //               sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
      //             });
      //             await fetch(`${url}?${params}`);
      //             let referenceIdData = await PointsManagament.find({
      //               referenceId: data.data.referenceId,
      //             });
      //             if (referenceIdData) {
      //               const url =
      //                 "http://dltsms.bigtgs.in/index.php/smsapi/httpapi/";
      //               const params = new URLSearchParams({
      //                 secret: "AMIK73UEFFiACG1Y0kuF",
      //                 sender: "KMITR",
      //                 receiver: referenceIdData.mobile,
      //                 route: "TA",
      //                 tempid: "1207170122653754184",
      //                 msgtype: 1,
      //                 sms: `Congratulation! Dear Krushimitra User , you are rewarded with ${referPoints.points} points as joining bonus - Thanks Krushimitra`,
      //               });
      //               await fetch(`${url}?${params}`);
      //             }
      //             responseTrue = "Done";
      //           } else {
      //             responseFalse = "Not Done";
      //           }
      //         } else {
      //           responseTrue = "Done";
      //         }
      //       } else {
      //         responseFalse = "Not Done";
      //       }
      //     }
      //   }