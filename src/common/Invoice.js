import { Image } from "primereact/image";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

function Invoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const route = location.state.goback;
  const [orderData, setOrderData] = useState(location.state.data);
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState([]);
  let distID = "";
  let distr = localStorage.getItem("distributor_id");
  console.log(orderData.vendorId);
  if (distr) {
    distID = distr;
  } else {
    distID = orderData.vendorId;
  }
  const [distributor, setDistributor] = useState(distID);

  const [taxableTotal, setTaxableTotal] = useState("");
  const [InclTotal, setInclTotal] = useState("");

  useEffect(() => {
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
  }, [route]);

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

  const realPrice = (price, gst) => {
    let gstTtl = (price * gst) / 100;
    return price - gstTtl;
  };
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

  const Print = () => {
    let printContents = document.getElementById("InvoiceBill").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  return (
    <>
      <div className="container mb-3 ">
        <div className="row">
          <div className="col-1">
            <button
              className="btn btn-outline-danger w-100 btn-sm"
              onClick={() => {
                route === "distributor"
                  ? navigate("/distributors/customer-orders")
                  : route === "admin"
                  ? navigate("/admin/all-orders")
                  : route === "users"
                  ? navigate("/users/user-orders")
                  : route === "distributors"
                  ? navigate("/distributors/all-customer-orders")
                  : navigate("");
              }}
            >
              <i class="fa fa-solid fa-arrow-left"></i>
            </button>
          </div>
          <div className="col-10"></div>
          <div className="col-1">
            <button
              className="btn btn-outline-info btn-sm w-100"
              onClick={() => Print()}
            >
              <i class="fa fa-print"></i>
            </button>
          </div>
        </div>
        <div className="InvoiceBill" id="InvoiceBill">
          <div className="row p-3 afterPrint">
            <div className="col-lg-4 col-4 col-md-6 textStart">
              {distributor.shopLogo === "" ? (
                <Image src="../logo.png" width="120" alt="" />
              ) : (
                <Image
                  src={`https://krushimitr.in/upload/${distributor.shopLogo}`}
                  width="120"
                  alt=""
                />
              )}
              <span
                className="font-weight-bold d-lg-none d-block"
                style={{ fontSize: 20 }}
              >
                Invoice Bill
              </span>
            </div>
            <div className="col-lg-4 col-4 col-md-4 d-none d-lg-block  d-lg-flex justify-content-center align-items-center ">
              <span className="font-weight-bold" style={{ fontSize: 20 }}>
                Invoice Bill
              </span>
            </div>
            <div className="col-lg-4 col-8 col-md-6 text-end">
              <p className="mb-0" style={{ fontSize: 14 }}>
                {distributor.shopName}
              </p>
              <p className="mb-0" style={{ fontSize: 14 }}>
                {distributor.shopMobile}
              </p>
              <p className="mb-0" style={{ fontSize: 14 }}>
                {distributor.email}
              </p>
              <p className="mb-0" style={{ fontSize: 14 }}>
                {distributor.address}, {distributor.city}, {distributor.state},{" "}
                {distributor.pincode}
              </p>
            </div>
          </div>
          <hr className="my-0" />
          <div className="table-responsive overflow-auto">
            <table className="table OrderIDgstID ">
              <tbody>
                <tr>
                  <th className="uppercase" style={{ width: "33%" }}>
                    ORDER ID : {orderData.orderNumber}
                  </th>
                  <th className="text-center" style={{ width: "33%" }}>
                    GST No : {distributor.gstNo}
                  </th>
                  <th className="text-end" style={{ width: "33%" }}>
                    License : {distributor.shopLicense}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table-responsive overflow-auto">
            <table className="table table-borderless mb-1">
              <tbody>
                <tr className="add">
                  <td className="py-1">To</td>
                  <td className="text-end pe-3 py-1">
                    From <b>({distributor.type})</b>
                  </td>
                </tr>
                <tr className="invoice_content">
                  <td className="py-1">
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {customer.name}
                    </p>
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {customer.mobile}
                    </p>
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {customer.email}
                    </p>
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {customer.address}, {customer.city}, {customer.state},
                      {customer.pincode}
                    </p>
                  </td>
                  <td className="text-end py-1 pe-3">
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {distributor.name} ({distributor.shopName})
                    </p>
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {distributor.shopMobile}
                    </p>
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {distributor.email}
                    </p>
                    <p className="mb-0" style={{ fontSize: 14 }}>
                      {distributor.address}, {distributor.city},
                      {distributor.state}, {distributor.pincode}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr className="mb-3" />
          <div className="products table-responsive p-2">
            <table className="table table-bordered mb-3">
              <thead>
                <tr className="add">
                  <th>Name / Desc</th>
                  <th className="">Size</th>
                  <th className="">BtcNo</th>
                  <th>HsnNo</th>
                  <th>Guar. </th>
                  <th> Warr.</th>

                  <th className="text-center">Rate</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">GST </th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {product.map((item, index) => {
                  return (
                    <tr className="invoice_content" key={(ele) => ele._id}>
                      <td>{item.productName}</td>
                      <td>
                        {item.size}
                        {item.unit}
                      </td>
                      <td className="text-center">
                        {item.batchNo !== undefined ? item.batchNo : ""}
                      </td>
                      <td class="text-center">
                        {item.HSNNo !== undefined ? item.HSNNo : ""}
                      </td>
                      <td class="text-center">
                        {item.guarantee !== undefined
                          ? item.guarantee + "m"
                          : "NA"}
                      </td>
                      <td class="text-center">
                        {item.warranty !== undefined
                          ? item.warranty + "m"
                          : "NA"}
                      </td>
                      <td className="text-center">
                        {getTotal(item.price, item.quantity, item.gst)}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.gst}%</td>
                      <td className="text-end">
                        {getTotal(item.price, item.quantity, item.gst) *
                          item.quantity}
                      </td>
                    </tr>
                  );
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
                  <th></th>
                </tr>
              </thead>
              <thead className="table-dark">
                <tr className="add">
                  <th colSpan={9} className="text-white">
                    Total
                  </th>

                  <th className="text-white text-end">{taxableTotal}</th>
                </tr>
              </thead>

              <tbody>
                <tr className="add finalAdd">
                  <th rowSpan={5} colSpan={7} className="text-start"></th>
                  <th colSpan={2}>Subtotal</th>
                  <td className="w-15 text-nowrap">
                    <i className="fa fa-rupee"></i>&nbsp;
                    {taxableTotal}
                  </td>
                </tr>
                <tr className="add finalAdd">
                  <th colSpan={2}>GST</th>
                  <td className="w-15 text-nowrap">
                    <i className="fa fa-rupee"></i> &nbsp;
                    {(InclTotal - taxableTotal).toFixed(2)}
                  </td>
                </tr>
                <tr className="add finalAdd">
                  <th colSpan={2} className="fw-bold">
                    Final Total
                  </th>
                  <td className="w-15 text-nowrap fw-bold">
                    <i className="fa fa-rupee"></i>&nbsp;
                    {InclTotal}.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr className="my-0" />
          <div className="address table-responsive overflow-auto">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <td className="w-100">
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Notes - any relevant information not covered, additional terms and conditions"
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr className="my-0" />
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
      </div>
    </>
  );
}

export default Invoice;
