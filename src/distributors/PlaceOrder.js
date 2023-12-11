import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSizes,
  deleteSize,
  emptyPlaceOrder,
} from "../redux/slice/PlaceOrderSlice";
import { useNavigate } from "react-router";

function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sData = useSelector((state) => state.placeorder.data);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [product, setProduct] = useState("");

  const [distData, setDistData] = useState("");
  const distributor_id = localStorage.getItem("distributor_id");
  const getProfile = async () => {
    let result = await fetch(
      "https://krushimitr.in/distributor/distributor-profile",
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

  useEffect(() => {
    getProfile();
    const fetchCategory = async () => {
      let result = await fetch("https://krushimitr.in/admin/all-category").then(
        (result) => result.json()
      );
      setCategories(result.getCate);
    };
    fetchCategory();
  }, []);

  const fetchProducts = async (cat) => {
    console.log(cat);
    let result = await fetch(`https://krushimitr.in/admin/products/${cat}`);
    let res = await result.json();
    setProducts(res.product_data);
  };
  const fetchProduct = async (pId) => {
    let result = await fetch("https://krushimitr.in/admin/get-product/", {
      method: "POST",
      body: JSON.stringify({
        id: pId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await result.json();
    setSelectedProduct(res.product_data);
    setProduct(res.product_data);
  };
  const [selSize, setSelSize] = useState([]);
  const getTotal = (item, qty) => {
    let gstamt = "";
    let finalAmount = item.selling_price * qty;
    if (item.gst === "28") {
      gstamt = finalAmount / 1.28;
    } else if (item.gst === "18") {
      gstamt = finalAmount / 1.18;
    } else if (item.gst === "12") {
      gstamt = finalAmount / 1.12;
    } else if (item.gst === "5") {
      gstamt = finalAmount / 1.05;
    } else if (item.gst === "0") {
      gstamt = finalAmount / 1;
    }
    let gstamount = finalAmount - gstamt;
    dispatch(
      addSizes({
        size: item.size,
        unit: item.unit,
        price: item.selling_price,
        quantity: qty,
        gst: item.gst,
        gsttotal: gstamount.toFixed(2),
        taxable: gstamt.toFixed(2),
        finalAmount: finalAmount,
      })
    );
  };

  const getFinalTotal = () => {
    let GrandTotal = 0;
    sData.map((item) => {
      GrandTotal = GrandTotal + item.finalAmount;
    });
    return GrandTotal.toFixed(2);
  };

  const OrderPlace = async () => {
    let GrandTotals = 0;
    sData.map((item) => {
      GrandTotals = GrandTotals + item.finalAmount;
    });

    const formData = {
      vendor_id: selectedProduct[0].vendor_id,
      distributor_id: distributor_id,
      productId: selectedProduct[0]._id,
      distributorData: distData,
      category: selectedProduct[0].category,
      productName: selectedProduct[0].productName,
      productSize: sData,
      discription: selectedProduct[0].description,
      company: selectedProduct[0].company,
      images: selectedProduct[0].image,
      guarantee: selectedProduct[0].guarantee,
      warranty: selectedProduct[0].warranty,
      totalAmount: GrandTotals,
    };

    let result = await fetch(
      "https://krushimitr.in/distributor/distributor-place-order",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((result) => result.json());
    console.log(result);
    // if (response.status === 201) {
    //   alert(response.result);
    //   navigate("/distributors");
    // } else {
    //   alert(response.result);
    // }
  };

  return (
    <div className="p-2">
      <h3 className="">Place Order</h3>
      <div className="card p-3">
        <div className="row">
          <div className="col-lg-4">
            <label>Categories</label>
            <select
              className="form-select"
              onChange={(e) => {
                setCategory(e.target.value);
                fetchProducts(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories &&
                categories.map((item) => {
                  return (
                    <option key={item.id} value={item.category_name}>
                      {item.category_name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="col-lg-4">
            <label>Products</label>
            <select
              className="form-select"
              onChange={(e) => {
                fetchProduct(e.target.value);
                dispatch(emptyPlaceOrder([]));
              }}
            >
              <option value="">Select Product</option>
              {products &&
                products.map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.productName}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="col-lg-4">
            <label>Product Company</label>
            <input
              type="text"
              className="form-control"
              value={
                product[0]
                  ? product[0].company === "undefined"
                    ? " "
                    : product[0].company
                  : ""
              }
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <label>Guarantee</label>
            <input
              type="text"
              className="form-control"
              value={product[0] ? product[0].guarantee : ""}
              readOnly
            />
          </div>
          <div className="col-lg-4">
            <label>Warranty</label>
            <input
              type="text"
              className="form-control"
              value={product[0] ? product[0].warranty : ""}
              readOnly
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-8">
            <h4>Select Size</h4>
            {product ? (
              <div className="row mt-2 ms-0">
                <div className="col-lg-3">
                  <label className="mb-0">Size</label>
                </div>
                <div className="col-lg-3">
                  <label className="mb-0">Incl. Price</label>
                </div>
                <div className="col-lg-3">
                  <label className="mb-0">GST</label>
                </div>
                <div className="col-lg-3">
                  <label className="mb-0 text-danger">Quantity</label>
                </div>
              </div>
            ) : (
              ""
            )}
            {product &&
              product[0].size.map((item, index) => {
                let sizeData = JSON.parse(item);
                return (
                  <div className="row mt-1 ms-0">
                    <div className="col-lg-3">
                      <input
                        type="text"
                        className="form-control-sm"
                        value={sizeData.size + "" + sizeData.unit}
                        readOnly
                      />
                    </div>
                    <div className="col-lg-3">
                      <input
                        type="text"
                        className="form-control-sm"
                        value={sizeData.selling_price}
                        readOnly
                      />
                    </div>
                    <div className="col-lg-3">
                      <input
                        type="text"
                        className="form-control-sm"
                        value={sizeData.gst + "%"}
                        readOnly
                      />
                    </div>
                    <div className="col-lg-3">
                      <input
                        type="text"
                        placeholder="Enter Quantity"
                        className="form-control-sm"
                        onChange={(e) => getTotal(sizeData, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <hr />
        {sData !== "" ? (
          <div className="table-responsive selectedSizes overflow-auto w-100">
            <h3>Selected Product Sizes</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Size</th>
                  <th className="text-center">Quantity</th>
                  <th>Taxable</th>
                  <th>GST (%)</th>
                  <th>GST Amount</th>
                  <th className="text-end">Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sData.map((item, index) => (
                  <tr>
                    <td>{item.size}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td>{item.taxable}</td>
                    <td>{item.gst + "%"}</td>
                    <td>{item.gsttotal}</td>
                    <td className="text-end">{item.finalAmount}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          dispatch(deleteSize(index));
                        }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-primary">
                <tr>
                  <th colSpan={5} className="text-end">
                    Total
                  </th>
                  <th colSpan={2} className="text-center">
                    {getFinalTotal()}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          ""
        )}
        <div className="row mt-3">
          <div className="col-lg-2 col-4 m-auto">
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                OrderPlace();
              }}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
