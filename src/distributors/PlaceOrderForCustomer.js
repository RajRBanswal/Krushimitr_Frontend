import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { City, State } from "country-state-city";
const PlaceOrderForCustomer = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  let distr = localStorage.getItem("distributor_id");
  let distrName = localStorage.getItem("distributor_name");

  const [productSize, setProductSize] = useState("");
  const [sizeData, setSizeData] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedGST, setSelectedGST] = useState("");
  const [selectedCommission, setSelectedCommission] = useState("");

  const [distributor, setDistributor] = useState(distr);
  const [distributorData, setDistributorData] = useState([]);
  const [usersId, setUsersId] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [cityCode, setCityCode] = useState([]);
  const onChangeHandler = (e) => {
    setCityCode("");
    setState("");
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const cityCode = el.getAttribute("id");
    setCityCode(cityCode);
    setState(el.getAttribute("value"));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async (e) => {
    const result = await axios
      .get("https://krushimitr.in/api/admin/all-products")
      .then((result) => {
        setAllProducts(
          result.data.product_data.filter((item) => {
            if (distr !== item.vendor_id) {
              return item;
            }
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getOrderData = async () => {
    let data = [];
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (distributor === item.vendorId) {
          data.push(item.userId);
        }
      });
      setUsersId(uniq(data));
      getAllUsers();
    } else {
      console.log(all_orders.result);
    }
  };
  function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }

  const [users, setUsers] = useState([]);
  const getAllUsers = async () => {
    let abc = [];
    const all_users = await fetch("https://krushimitr.in/api/admin/all-users");
    const uu = await all_users.json();
    uu.map((item) => {
      if (distributor === item.vdId) {
        abc.push(item);
      }
    });
    setUsers(abc);
  };

  const getProfile = async () => {
    let result = await fetch(
      "https://krushimitr.in/api/distributor/distributor-profile",
      {
        method: "post",
        body: JSON.stringify({ distributor_id: distributor }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let res = await result.json();
    if (res.status === 201) {
      setDistributorData(res.distributor);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    getProductData();
    getOrderData();
    getProfile();
  }, []);

  const qtyCalculation = (_id) => {
    if (_id === "" || _id === null) {
      setSelectedProducts("");
    }
    setSelectedSize("");
    setSelectedUnit("");
    setSelectedPrice("");
    setSelectedGST("");
    setProductSize("");
    allProducts.map((item) => {
      if (_id === item._id) {
        let datas = [];
        item.size.map((item, index) => {
          if (index === 0) {
            let itmess = JSON.parse(item);
            setSelectedSize(itmess.size);
            setSelectedUnit(itmess.unit);
            setSelectedPrice(itmess.selling_price);
            setSelectedGST(itmess.gst);
            setProductSize(item);
            datas.push(JSON.parse(item));
          } else {
            datas.push(JSON.parse(item));
          }
        });
        setSizeData(datas);
        return setSelectedProducts(item);
      }
    });
  };

  const changePrice = (item) => {
    setSelectedSize(item.size);
    setSelectedUnit(item.unit);
    setSelectedPrice(item.selling_price);
    setSelectedGST(item.gst);
  };

  const getTotal = () => {
    return selectedPrice * quantity;
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const getUserData = (id) => {
    users.map((item) => {
      if (item._id === id) {
        setSelectedUser(item);
      }
    });
  };
  const placeOrder = async () => {
    let newaddress =
      distributorData.address +
      ", " +
      distributorData.city +
      ", " +
      distributorData.state +
      ", " +
      distributorData.pincode;
    let product = [
      {
        _id: selectedProducts._id,
        productName: selectedProducts.productName,
        company:
          selectedProducts.company === "" ? "NA" : selectedProducts.company,
        quantity: quantity,
        image: selectedProducts.image,
        description: selectedProducts.description,
        category: selectedProducts.category,
        price: selectedPrice,
        size: selectedSize,
        unit: selectedUnit,
        gst: selectedGST,
        commission: selectedProducts.commission,
        vCommissionPercent: selectedProducts.vCommissionPercent,
        guarantee: productSize.guarantee,
        warranty: productSize.warranty,
        updatedAt: productSize.updatedAt,
        createdAt: productSize.createdAt,
        productVendor: selectedProducts.vendor_id,
        rewardPoints: selectedProducts.rewardPoints,
        batchNo: selectedProducts.batchNo ? selectedProducts.batchNo : "",
        HSNNo: selectedProducts.HSNNo ? selectedProducts.HSNNo : "",
        mfd: selectedProducts.mfd ? selectedProducts.mfd : "",
        referenceId: "",
        referenceProductId: "",
      },
    ];
    let data = {
      vdName: distrName,
      vdId: distributor,
      address: newaddress,
      items: JSON.stringify(product), //cartItems,
      amount: getTotal(),
      walletAmount: 0,
      orderDate: "",
      paymentType: "",
      referenceId: "",
      referenceProductId: "",
      rewardPoints: selectedProducts.rewardPoints,
    };
    // console.log(data);
    const result = await fetch(
      "https://krushimitr.in/api/vendor/place-customer-order",
      {
        method: "post",
        body: JSON.stringify({
          customerName: customerName === "" ? selectedUser.name : customerName,
          mobile: mobile === "" ? selectedUser.mobile : mobile,
          state: state === "" ? selectedUser.state : state,
          city: city === "" ? selectedUser.city : city,
          address: address === "" ? selectedUser.address : address,
          pincode: pincode === "" ? selectedUser.pincode : pincode,
          password: password === "" ? selectedUser.password : password,
          selectUser: selectUser === 0 ? "ExistingUser" : "NewUser",
          selectU: selectedUser,
          price: getTotal(),
          data: data,
          type: distributorData.type,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let response = await result.json();
    if (response.status === 201) {
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: response.result,
        life: 3000,
      });
      navigate("/distributors/customer-orders");
    } else {
      toast.current.show({
        severity: "danger",
        summary: "Not Successful",
        detail: response.result,
        life: 3000,
      });
    }
  };

  const [selectUser, setSelectUser] = useState(0);

  return (
    <div className="">
      <div className="UserCardReports">
        <Toast ref={toast} />
        <h3 className="px-3 py-2">Place Order for Customer</h3>
        <div className="card card-body p-3 bg-white">
          <div className="row">
            <div className="col-lg-4 col-12">
              <label>Vendor Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Vendor Name"
                value={distrName}
                readOnly
              />
            </div>
            <div className="col-lg-4 col-12">
              <label>Customer Name</label>
              <div className="d-flex justify-content-between">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    onChange={() => {
                      setSelectUser(0);
                      getAllUsers();
                    }}
                  />
                  <label class="form-check-label" for="flexRadioDefault1">
                    Existing User
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    onChange={() => setSelectUser(1)}
                  />
                  <label class="form-check-label" for="flexRadioDefault2">
                    New User
                  </label>
                </div>
              </div>
            </div>
          </div>
          {selectUser === 1 ? (
            <>
              <div className="row">
                <div className="col-lg-4 col-12">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="col-lg-4 col-6">
                  <label>Customer Mobile No.</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile No."
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="col-lg-4 col-6">
                  <label htmlFor="name" className="form-label mb-0">
                    State<span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-control"
                    onChange={onChangeHandler}
                  >
                    {State.getStatesOfCountry("IN").map((state) => (
                      <option id={state.isoCode} value={state.name}>
                        {state.name}{" "}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-6">
                  <label htmlFor="name" className="form-label mb-0">
                    City<span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-control"
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {City.getCitiesOfState("IN", cityCode).map((city) => (
                      <option value={city.name}> {city.name} </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-4 col-6">
                  <label>
                    Address<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="Address"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="col-lg-2 col-6">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pincode"
                    placeholder="Pincode"
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <div className="col-lg-4 col-6">
                  <label>
                    Password <small>(Website use only)</small>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="address"
                    placeholder="Password for Website"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="row">
              <div className="col-lg-4">
                <label>Select User</label>
                <select
                  className="from-control form-select"
                  onChange={(e) => getUserData(e.target.value)}
                >
                  <option value={""}>Select User</option>
                  {users &&
                    users.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} ({item.mobile})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-6">
              <label>Select Product </label>
              <select
                className="form-select form-select"
                onChange={(e) => qtyCalculation(e.target.value)}
              >
                <option value={""}>Select Product </option>
                {allProducts &&
                  allProducts.map((item) => (
                    <option value={item._id}>{item.productName}</option>
                  ))}
              </select>
            </div>
          </div>
          <section
            className={`py-5 container ${
              selectedProducts !== null ? "d-block" : "d-none"
            }`}
          >
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="row">
                      <div
                        className="col-md-4"
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <div id="carouselExample" className="carousel slide">
                          <div
                            className="carousel-inner"
                            style={{ height: "100% !important" }}
                          >
                            {selectedProducts &&
                              Array.isArray(selectedProducts.image) &&
                              selectedProducts.image.map((item, index) => {
                                if (index === 0) {
                                  return (
                                    <div className="carousel-item active">
                                      <img
                                        src={
                                          "https://krushimitr.in/upload/" + item
                                        }
                                        className="d-block"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                        }}
                                        alt="..."
                                      />
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div className="carousel-item">
                                      <img
                                        src={
                                          "https://krushimitr.in/upload/" + item
                                        }
                                        className="d-block"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                        }}
                                        alt="..."
                                      />
                                    </div>
                                  );
                                }
                              })}
                          </div>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="prev"
                          >
                            <span
                              className="carousel-control-prev-icon"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="next"
                          >
                            <span
                              className="carousel-control-next-icon"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">Next</span>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-8 p-3">
                        <div className="row">
                          <div className="col-md-8">
                            <h3>
                              {selectedProducts && selectedProducts.productName}
                            </h3>
                          </div>
                          <div className="col-md-4">
                            <p>
                              {selectedProducts &&
                              selectedProducts.company !== undefined
                                ? ""
                                : selectedProducts.company}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <p>
                              {selectedProducts && selectedProducts.description}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="card p-2">
                              <p className="fw-bold mb-0">Product Details</p>
                              <hr className="my-2" />
                              <div className="row">
                                <div className="col-md-8 ">
                                  <p className="fw-bold mb-0 ps-2">
                                    Size & Price
                                  </p>
                                  <hr className="my-1" />
                                  <div className="row px-3">
                                    <div className="col-md-6 col-6">
                                      <p>
                                        <span className="text-success fw-bold">
                                          Size
                                        </span>{" "}
                                        :{" "}
                                        <span className="text-success">
                                          {selectedSize}
                                          {selectedUnit}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-md-6 col-6">
                                      <p>
                                        <span className="text-success fw-bold">
                                          Price
                                        </span>{" "}
                                        :{" "}
                                        <span className="text-success">
                                          {selectedPrice}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 px-4">
                                  <p className="fw-bold mb-0">Quantity</p>
                                  <hr className="my-1" />
                                  <div className="qty-input m-auto">
                                    <button
                                      className="qty-count qty-count--minus btn"
                                      data-action="minus"
                                      type="button"
                                      onClick={() =>
                                        quantity > 1 &&
                                        setQuantity(parseInt(quantity) - 1)
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      className="product-qty"
                                      type="number"
                                      name="product-qty"
                                      min="0"
                                      max="10"
                                      onChange={(e) =>
                                        setQuantity(e.target.value)
                                      }
                                      value={quantity}
                                    />
                                    <button
                                      className="qty-count qty-count--add btn"
                                      data-action="add"
                                      type="button"
                                      onClick={() =>
                                        quantity > 0 &&
                                        setQuantity(parseInt(quantity) + 1)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                  <br />
                                  <p>Total Amount : {getTotal()}</p>
                                </div>
                              </div>
                              <hr className="my-2" />
                              <div className="row">
                                <div className="col-md-12 ">
                                  <p className="fw-bold mb-0 ps-2">
                                    Other Sizes
                                  </p>
                                  <hr className="my-1" />
                                  <div className="row px-3 my-3">
                                    {sizeData &&
                                      sizeData.map((item, index) => {
                                        return (
                                          <div className="col-md-3 col-3">
                                            <button
                                              className="btn btn-success w-100 btn-sm"
                                              type="button"
                                              onClick={() => changePrice(item)}
                                            >
                                              {item.size}
                                              {item.unit}
                                            </button>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                                {/* <div className="col-md-12 mt-3 px-3">
                                  <p style={{ fontSize: 14 }}>
                                    Notes :{" "}
                                    <span className="text-danger">
                                      "The customer was notified that delivery
                                      charges not applied to their order.
                                      Delivery charges will be charged at the
                                      time of delivery"
                                    </span>
                                  </p>
                                </div> */}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="card p-2">
                              <div className="row">
                                <div className="col-md-12 text-center">
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => placeOrder()}
                                  >
                                    Place Order
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderForCustomer;
