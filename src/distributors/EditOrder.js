import moment from "moment";
import { Image } from "primereact/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import loading from "../images/loading.gif";
import Select from "react-select";
function EditOrder() {
  const location = useSelector((state) => state.order);
  const navigate = useNavigate();
  const { order_id } = useParams();
  const datas = location.data;

  const [data, setData] = useState([]);
  // console.log(datas[0]);
  // let datas = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showOrderData = async () => {
    // alert(order_id);
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/get-orders",
      {
        method: "post",
        body: JSON.stringify({
          orderId: order_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setData(get_orders.result);
    } else {
      alert(get_orders.result);
    }
  };

  if (datas[0] === undefined || datas[0] === "" || datas[0] === null) {
    navigate("/distributors/customer-orders");
  }
  const [loadings, setLoadings] = useState(false);

  const [orderData, setOrderData] = useState(datas[0]);
  const [itemsData, setItemsData] = useState(JSON.parse(datas[0].itemsData));
  const [userData, setUserData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [UTRNo, setUTRNo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [tokenNo, setTokenNo] = useState("");
  const [vehicalNo, setVehicalNo] = useState("");
  const [driverMobileNo, setdriverMobileNo] = useState("");
  const [orderDistributor, setOrderDistributor] = useState("");
  const [selectDistributor, setSelectDistributor] = useState("");
  const [shippingStatus, setShippingStatus] = useState("");
  const [options, setOptions] = useState([]);

  const getAllDistributor = async () => {
    let aDistributor = [];
    let city = "";
    let state = "";
    let pincode = "";
    if (orderData.shippingAddress === undefined) {
    } else {
      let add = orderData.shippingAddress.split(",");
      city = add[add.length - 3].trim();
      state = add[add.length - 2].trim();
      pincode = add[add.length - 1].trim();
    }
    const all_users = await fetch(
      "https://krushimitr.in/api/admin/distributor-vendor"
    );
    const result = await all_users.json();
    if (result.status === 201) {
      result.distributor.map((item) => {
        if (
          item.type === "Distributor" &&
          item.status === "Active" &&
          item.pincode === pincode &&
          item.city === city &&
          item.state === state
        ) {
          aDistributor.push(item);
        } else if (
          item.type === "Distributor" &&
          item.status === "Active" &&
          item.pincode === pincode &&
          item.city === city
        ) {
          aDistributor.push(item);
        } else if (
          item.type === "Distributor" &&
          item.status === "Active" &&
          item.pincode === pincode
        ) {
          aDistributor.push(item);
        } else if (
          item.type === "Distributor" &&
          item.status === "Active" &&
          item.city === city
        ) {
          aDistributor.push(item);
        }
      });
      let data = [];
      aDistributor.map((item) => {
        data.push({
          value: item._id,
          label:
            item.name +
            " (" +
            item.mobile +
            ") " +
            item.city +
            " (" +
            item.pincode +
            ")",
        });
      });
      setOptions(data);
      setOrderDistributor(aDistributor);
    } else {
      alert(result.message);
    }
  };

  const [deliveryStatus, setDeliveryStatus] = useState("");
  const dates = new Date();
  const [deliveryDate, setDeliveryDate] = useState(
    moment(dates).format("DD-MM-YYYY")
  );
  let inputValues = [];

  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState([]);
  let distID = "";
  let distr = localStorage.getItem("distributor_id");
  distID = distr;
  const [distributor, setDistributor] = useState(distID);
  const [taxableTotal, setTaxableTotal] = useState("");
  const [InclTotal, setInclTotal] = useState("");

  window.onafterprint = function () {
    window.history.go(-1);
  };

  const getTotal = (price, quantity, gst) => {
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
    }
    return tot_price.toFixed(2);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDistributor = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/distributor/distributor-profile",
      {
        method: "post",
        body: JSON.stringify({ distributor_id: distID }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.status === 201) {
      setDistributor(data.distributor);
    } else {
      setDistributor("");
    }
  };

  useEffect(() => {
    showOrderData();
    setUserData(JSON.parse(datas[0].userData));
    getAllDistributor();

    getDistributor();
    if (orderData.userData.length === 0) {
      setCustomer(orderData.userData);
    } else {
      setCustomer(JSON.parse(orderData.userData));
    }
    let arr = [];
    orderData.itemsData.map((item) => {
      arr.push(item);
    });

    setProduct(JSON.parse(arr));
    let ddd = JSON.parse(arr);
    let ttl = 0;
    let InclTotal = 0;
    ddd.map((item) => {
      let exprice =
        getTotal(item.price, item.quantity, item.gst) * item.quantity;
      ttl = parseFloat(ttl) + parseFloat(exprice);

      let abc = item.price * item.quantity;
      InclTotal = parseInt(InclTotal) + parseInt(abc);
    });
    setTaxableTotal(ttl.toFixed(2));
    setInclTotal(InclTotal);
  }, []);
  const commissionCal = () => {
    let commi = 0;
    for (let i = 0; i < itemsData.length; i++) {
      commi += parseInt(itemsData[i].commission);
    }
    return commi;
  };

  const ConfirmOrder = async (Id) => {
    setLoadings(true);
    if (
      (deliveryMode === "Self" && deliveryStatus === "") ||
      (deliveryMode !== "Self" && selectDistributor === "") ||
      (deliveryMode !== "Self" && shippingStatus === "")
    ) {
      alert("Fill all mandatory fields");
      setLoadings(false);
    } else {
      if (orderData.paymentType === "COD" && deliveryMode === "Self") {
        if (!paymentMethod || !paymentStatus || !deliveryStatus) {
          alert("Please fill all the fields");
          setLoadings(false);
          return;
        }
      }
      let deliveryOption = {};
      if (deliveryMode === "Courier") {
        deliveryOption = { trackingLink: trackingLink, tokenNo: tokenNo };
      } else if (deliveryMode === "Vehical") {
        deliveryOption = {
          vehicalNo: vehicalNo,
          driverMobileNo: driverMobileNo,
        };
      }
      let selDistributorName = "";
      orderDistributor.map((item) => {
        if (selectDistributor.value === item._id) {
          selDistributorName = item.name;
        }
      });

      let htmlContent = `<div class="container mb-3 ">
          <div class="InvoiceBill" id="InvoiceBill">
            <div class="table-responsive overflow-auto">
              <table class="table OrderIDgstID ">
                <tbody>
                  <tr>
                    <th class="uppercase" style={{ width: "25%" }}>
                    ${
                      distributor.shopLogo === ""
                        ? `<Image src="https://krushimitr.in/logo.png" width="120" alt="" />`
                        : `<Image
                          src={https://krushimitr.in/upload/${distributor.shopLogo}}
                          width="120"
                          alt=""
                        />`
                    }
                    </th>
                    <th class="text-center" style={{ width: "25%" }}>
                      <span className="font-weight-bold" style={{ fontSize: 20 }}>
                        Invoice Bill
                      </span>
                    </th>
                    <th class="text-end" style={{ width: "50%" }}>
                      <p class="mb-0" style={{ fontSize: 13 }}>
                        ${
                          distributor.shopName === undefined
                            ? ""
                            : distributor.shopName
                        }
                      </p>
                      <p class="mb-0" style={{ fontSize: 13 }}>
                        ${
                          distributor.shopMobile === undefined
                            ? ""
                            : distributor.shopMobile
                        }
                      </p>
                      <p class="mb-0" style={{ fontSize: 13 }}>
                        ${distributor.email}
                      </p>
                      <p class="mb-0" style={{ fontSize: 13 }}>
                        ${distributor.address}, ${distributor.city}, ${
        distributor.state
      },${distributor.pincode}
                      </p>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr class="my-0" />
            <div class="table-responsive overflow-auto">
              <table class="table OrderIDgstID ">
                <tbody>
                  <tr>
                    <th class="uppercase" style={{ width: "33%" }}>
                      ORDER ID : ${orderData.orderNumber}
                    </th>
                    <th class="text-center" style={{ width: "33%" }}>
                      GST No : ${
                        distributor.gstNo === undefined ? "" : distributor.gstNo
                      }
                    </th>
                    <th class="text-end" style={{ width: "33%" }}>
                      License : ${
                        distributor.shopLicense === undefined
                          ? ""
                          : distributor.shopLicense
                      }
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive overflow-auto">
              <table class="table table-borderless mb-1">
                <tbody>
                  <tr class="add">
                    <td class="py-1">To</td>
                    <td class="text-end pe-3 py-1">
                      From <b>(${distributor.type})</b>
                    </td>
                  </tr>
                  <tr class="invoice_content">
                    <td class="py-1">
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${customer.name}
                      </p>
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${customer.mobile}
                      </p>
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${customer.email}
                      </p>
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${customer.address}, ${customer.city}, ${
        customer.state
      },
                        ${customer.pincode}
                      </p>
                    </td>
                    <td class="text-end py-1 pe-3">
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${
                          distributor.shopName === undefined
                            ? ""
                            : distributor.shopName
                        }
                      </p>
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${
                          distributor.shopMobile === undefined
                            ? ""
                            : distributor.shopMobile
                        }
                      </p>
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${distributor.email}
                      </p>
                      <p class="mb-0" style={{ fontSize: 14 }}>
                        ${distributor.address}, ${distributor.city},
                        ${distributor.state}, ${distributor.pincode}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr class="mb-3" />
            <div class="products table-responsive p-2 overflow-auto">
              <table class="table table-bordered mb-3">
                <thead>
                  <tr class="add">
                    <th>Name / Desc.</th>
                    <th class="">Size</th>
                    <th class="">BatchNo</th>
                    <th class="">HSNNo</th>
                    <th>Guar. / Warr.</th>
                    <th class="text-center">Rate</th>
                    <th class="text-center">Qty</th>
                    <th class="text-center">GST </th>
                    <th class="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                 ${product.map((item, index) => {
                   return `<tr class="invoice_content">
                       <td>${item.productName}</td>
                       <td>
                         ${item.size}
                         ${item.unit}
                       </td>
                       <td class="text-center">
                         ${item.batchNo !== undefined ? item.batchNo : ""}
                       </td>
                       <td class="text-center">
                         ${item.HSNNo !== undefined ? item.HSNNo : ""}
                       </td>
                       <td class="text-center">
                          ${
                            item.guarantee !== undefined ? item.guarantee : ""
                          } /
                          ${item.warranty !== undefined ? item.warranty : ""}
                        </td>
                       <td class="text-center">
                         ${getTotal(item.price, item.quantity, item.gst)}
                       </td>
                       <td class="text-center">${item.quantity}</td>
                       <td class="text-center">${item.gst}</td>
                       <td class="text-end">
                         ${
                           getTotal(item.price, item.quantity, item.gst) *
                           item.quantity
                         }
                       </td>
                     </tr>`;
                 })}
                </tbody>
                <thead>
                  <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  </tr>
                </thead>
                <thead class="">
                  <tr class="add">
                    <th colspan="8" class="">
                      Total
                    </th>

                    <th class=" text-end">${taxableTotal}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="add finalAdd">
                    <th rowspan="5" colspan="6" class="text-start">

                    </th>
                    <th>Subtotal</th>
                    <td class="w-15 text-nowrap">
                      <i class="fa fa-rupee"></i>&nbsp;
                      ${taxableTotal}
                    </td>
                  </tr>
                  <tr class="add finalAdd">
                    <th>GST</th>
                    <td class="w-15 text-nowrap">
                      <i class="fa fa-rupee"></i> &nbsp;
                      ${(InclTotal - taxableTotal).toFixed(2)}
                    </td>
                  </tr>
                  <tr class="add finalAdd">
                    <th class="fw-bold">Final Total</th>
                    <td class="w-15 text-nowrap fw-bold">
                      <i class="fa fa-rupee"></i>&nbsp;
                      ${InclTotal}.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr class="my-0" />
            <div class="address table-responsive overflow-auto">
              <table class="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td class="w-100">
                      <textarea
                        class="form-control"
                        rows={5}
                        placeholder="Notes - any relevant information not covered, additional terms and conditions"
                      ></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr class="my-0" />
            <div className="address p-3">
              <div className="row">
                <div className="col-lg-8 col-8">
                  <p class="mb-0 fw-bold">Powered By</p>
                  <h4 class="mb-0">Krushimitr</h4>
                  <p class="mb-0">Contact No. : </p>
                  <p class="mb-0">Account No. : </p>
                  <p class="mb-0">IFSC Code : </p>
                </div>
                <div className="col-lg-4 col-4">
                  <p className="text-center">Signature</p>
                  <textarea rows={4} className="form-control"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>`;

      const response = await fetch(
        "https://krushimitr.in/api/distributor/confirm",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            htmlContent: htmlContent,
            id: Id,
            orderId: orderData.orderNumber,
            transactionId: orderData.transactionId,
            paymentMethod:
              orderData.paymentType === "COD" && paymentMethod === ""
                ? "Pending"
                : paymentMethod,
            paymentStatus:
              orderData.paymentType === "COD" && paymentStatus === ""
                ? "Pending"
                : paymentStatus,
            UTRNo: UTRNo ? UTRNo : "",
            deliveryStatus: deliveryStatus,
            deliveryDate: deliveryDate,
            deliveryMode: deliveryMode,
            deliveryOption: deliveryOption,
            inputValues: inputValues,
            VType: orderData.VType !== undefined ? orderData.VType : "",
            VId: orderData.VId !== undefined ? orderData.VId : "",
            vendorId: distr,
            distName: distributor.name,
            distMobile: distributor.mobile,
            commission: commissionCal(),
            finalAmount: orderData.finalAmount,
            shippingDistId: selectDistributor.value,
            shippingDistName: selDistributorName,
            shippingStatus: shippingStatus,
            itemsData: itemsData,
            paymentType: orderData.paymentType,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.status === 201) {
        setLoadings(false);
        alert(data.result);
        navigate("/distributors/customer-orders");
      } else if (data.status === 507) {
        alert(data.result);
        navigate("/distributors/stock-management");
      } else {
        alert(data.result);
        navigate("/distributors/customer-orders");
      }
    }
  };

  // const getDataForDeliveryOPtion = (value) => {
  //   setDeliveryMode(value);
  //   // if (value === "Courier") {
  //   // }
  // };

  return (
    <div className={"px-3 py-2 mb-5 " + (loadings ? "disabledbutton" : "")}>
      <img
        src={loading}
        className={"loader " + (loadings ? "d-block" : "d-none")}
        alt=""
      />
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
            placeholder="Name"
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
            placeholder="Email"
            value={userData.email}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="mb-0">Mobile Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="MObile"
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
            value={orderData.orderNumber}
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
      {itemsData.map((ele, index) => {
        // let productId = ele._id;
        inputValues.push({
          productId: ele._id,
          quantity: ele.quantity,
          productName: ele.productName,
          productSize: ele.size,
          productUnit: ele.unit,
        });
        // editedValues.push({
        //   _id: ele._id,
        //   productName: ele.productName,
        //   company: ele.company,
        //   description: ele.description,
        //   category: ele.category,
        //   price: ele.price,
        //   image: ele.image,
        //   size: ele.size,
        //   unit: ele.unit,
        //   quantity: ele.quantity,
        //   gst: ele.gst,
        //   commission: ele.commission,
        //   vCommissionPercent: ele.vCommissionPercent,
        //   guarantee: ele.guarantee,
        //   warranty: ele.warranty,
        //   updatedAt: ele.updatedAt,
        //   createdAt: ele.createdAt,
        //   productVendor: ele.productVendor,
        //   rewardPoints: ele.rewardPoints,
        //   referenceId: ele.referenceId,
        //   referenceProductId: ele.referenceProductId,
        // });
        // setInputValues({ ...inputValues, [productId]: productId });
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
                  placeholder="Guarantee"
                  value={ele.guarantee}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">Warranty</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Warranty"
                  value={ele.warranty}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">Batch No.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Batch No."
                  value={ele.batchNo}
                  onChange={(e) => {
                    ele.batchNo = e.target.value;
                    setItemsData([...itemsData]);
                  }}
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">HSN No. </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="HSN No."
                  value={ele.HSNNo}
                  onChange={(e) => {
                    ele.HSNNo = e.target.value;
                    setItemsData([...itemsData]);
                  }}
                />
              </div>
              <div className="col-md-2">
                <label className="mb-0">Manufacturing Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Manufacturing Date"
                  value={ele.mfd}
                  onChange={(e) => {
                    ele.mfd = e.target.value;
                    setItemsData([...itemsData]);
                  }}
                />
              </div>
            </div>
          </>
        );
      })}
      <hr className="bg-success mb-1" />
      <div className="row">
        <div className="col-lg-4 col-12">
          <h5 className="mb-0">Others Details</h5>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="mb-0">Delivery Mode</label>
          <select
            className="form-select form-control"
            onChange={(e) => setDeliveryMode(e.target.value)}
          >
            <option value={""}>Select Mode</option>
            <option value={"Self"}>Self</option>
            <option value={"Courier"}>Courier</option>
            <option value={"Vehical"}>Vehical</option>
          </select>
        </div>
        <div
          className={`col-md-3 ${
            deliveryMode === "Courier" ? "d-block" : "d-none"
          }`}
        >
          <label className="mb-0">Tracking Link</label>
          <input
            type="text"
            placeholder="Tracking Link"
            className="form-control"
            onChange={(e) => setTrackingLink(e.target.value)}
          />
        </div>
        <div
          className={`col-md-3 ${
            deliveryMode === "Courier" ? "d-block" : "d-none"
          }`}
        >
          <label className="mb-0">Token No</label>
          <input
            type="text"
            placeholder="Token No"
            className="form-control"
            onChange={(e) => setTokenNo(e.target.value)}
          />
        </div>
        <div
          className={`col-md-3 ${
            deliveryMode === "Vehical" ? "d-block" : "d-none"
          }`}
        >
          <label className="mb-0">Vehical No.</label>
          <input
            type="text"
            placeholder="Vehical No."
            className="form-control"
            onChange={(e) => setVehicalNo(e.target.value)}
          />
        </div>
        <div
          className={`col-md-3 ${
            deliveryMode === "Vehical" ? "d-block" : "d-none"
          }`}
        >
          <label className="mb-0">Driver Mobile No.</label>
          <input
            type="number"
            placeholder="Driver Mobile No."
            className="form-control"
            onChange={(e) => setdriverMobileNo(e.target.value)}
          />
        </div>
        {/* {orderData.paymentType === "COD" ? (
          <>
            <div className="col-md-3">
              <label className="mb-0">Delivery Date</label>
              <input
                type="text"
                className="form-control"
                name="delivery_date"
                value={deliveryDate}
                readOnly
              />
            </div>
            <div className="col-md-3">
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
            <div
              className={`col-md-3 ${
                paymentMethod === "UPI" || paymentMethod === "Others"
                  ? "d-block"
                  : "d-none"
              }`}
            >
              <label className="mb-0">UTR No. / Txn Id</label>
              <input
                type="text"
                className="form-control"
                placeholder="UTR No. / Txn Id"
                onChange={(e) => setUTRNo(e.target.value)}
              />
            </div>
            <div className="col-md-3">
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
          </>
        ) : (
          ""
        )} */}
        {deliveryMode === "Self" && orderData.paymentType === "COD" ? (
          <>
            <div className="col-md-3">
              <label className="mb-0">Delivery Date</label>
              <input
                type="text"
                className="form-control"
                name="delivery_date"
                value={deliveryDate}
                readOnly
              />
            </div>
            <div className="col-md-3">
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
            <div
              className={`col-md-3 ${
                paymentMethod === "UPI" || paymentMethod === "Others"
                  ? "d-block"
                  : "d-none"
              }`}
            >
              <label className="mb-0">UTR No. / Txn Id</label>
              <input
                type="text"
                className="form-control"
                placeholder="UTR No. / Txn Id"
                onChange={(e) => setUTRNo(e.target.value)}
              />
            </div>
            <div className="col-md-3">
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
            <div className="col-md-3">
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
        ) : deliveryMode === "Self" ? (
          <div className="col-md-3">
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
        ) : (
          ""
        )}
        {deliveryMode !== "Self" ? (
          <>
            <div className="col-md-3">
              <label className="mb-0">Select Distributor</label>
              <Select
                defaultValue={selectDistributor}
                onChange={(text) => setSelectDistributor(text)}
                options={options}
              />
              {/* <select
                className="form-select form-control"
                onChange={(e) => setSelectDistributor(e.target.value)}
              >
                <option value={""}>Select Distributor</option>
                {orderDistributor &&
                  orderDistributor.map((item) => (
                    <option value={item._id}>
                      {item.name +
                        " (" +
                        item.address +
                        " " +
                        item.pincode +
                        ")"}
                    </option>
                  ))}
              </select> */}
            </div>
            <div className="col-md-3">
              <label className="mb-0">Shipping Status</label>
              <select
                className="form-select form-control"
                onChange={(e) => setShippingStatus(e.target.value)}
              >
                <option value={""}>Select Status</option>
                <option value={"Shipped"}>Shipped</option>
              </select>
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      <div className="row mt-4">
        <div className="col-md-2 m-auto">
          <button
            disabled={loadings === true ? true : false}
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
