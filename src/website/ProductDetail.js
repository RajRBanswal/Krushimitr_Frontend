import { useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addToCart } from "../redux/slice/CartSlice";
import { handelRightClick } from "./AppUtility";

function ProductDetail() {
  const { id, user_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [productSize, setProductSize] = useState("");
  const [sizeData, setSizeData] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [selectedGST, setSelectedGST] = useState("");
  const [selectedCommission, setSelectedCommission] = useState("");
  const [selectedMinQuantity, setSelectedMinQuantity] = useState(1);
  let datas = [];
  const [quantity, setQuantity] = useState(1);
  const getProducts = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/get-product/",
      {
        method: "post",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    if (data.status === 201) {
      setProduct(data.product_data[0]);
      data.product_data[0].size.map((item, index) => {
        if (index === 0) {
          let itmess = JSON.parse(item);
          setSelectedSize(itmess.size);
          setSelectedUnit(itmess.unit);
          setSelectedPrice(itmess.selling_price);
          setSelectedGST(itmess.gst);
          setSelectedCommission(itmess.commission);
          setSelectedDiscount(
            itmess.discount === undefined ? 0 : itmess.discount
          );
          setSelectedMinQuantity(
            itmess.minQuantity === undefined ? 1 : itmess.minQuantity
          );
          setQuantity(
            itmess.minQuantity === undefined ? 1 : itmess.minQuantity
          );
          setProductSize(item);
          datas.push(JSON.parse(item));
        } else {
          datas.push(JSON.parse(item));
        }
      });
      setSizeData(datas);
    } else {
      alert(data.result);
    }
  };
  useEffect(() => {
    setInterval(() => getProducts(), 5000);

    localStorage.setItem("PRODUCT_ID", id);
    localStorage.setItem("USERID", user_id);

  }, [id]);

  const changePrice = (item) => {
    setSelectedSize(item.size);
    setSelectedUnit(item.unit);
    setSelectedPrice(item.selling_price);
    setSelectedGST(item.gst);
    setSelectedCommission(item.commission);
    setSelectedDiscount(item.discount === undefined ? 1 : item.discount);
    setSelectedMinQuantity(
      item.minQuantity === undefined ? 1 : item.minQuantity
    );
  };

  return (
    <div className="container mt-3">
      <h1 className="text-center">Product Detials</h1>
      <section className="py-5 container">
        <div className="row justify-content-center">
          <div className="col-md-10">
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
                        {product &&
                          Array.isArray(product.image) &&
                          product.image.map((item, index) => {
                            if (index === 0) {
                              return (
                                <div className="carousel-item active">
                                  <img
                                    src={"https://krushimitr.in/upload/" + item}
                                    className="d-block"
                                    style={{ width: "100%", height: "100%" }}
                                    alt="..."
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <div className="carousel-item">
                                  <img
                                    src={"https://krushimitr.in/upload/" + item}
                                    className="d-block"
                                    style={{ width: "100%", height: "100%" }}
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
                        <h3>{product && product.productName}</h3>
                      </div>
                      <div className="col-md-4">
                        <p>
                          {product && product.company !== undefined
                            ? ""
                            : product.company}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <p>{product && product.description}</p>
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
                                Size & Price & Discount
                              </p>
                              <hr className="my-1" />
                              <div className="row px-3">
                                <div className="col-md-4 col-4">
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
                                <div className="col-md-4 col-4">
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
                                <div className="col-md-4 col-4">
                                  <p>
                                    <span className="text-success fw-bold">
                                      Discount
                                    </span>{" "}
                                    :{" "}
                                    <span className="text-success">
                                      {selectedDiscount}%
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 px-4">
                              <p className="fw-bold mb-0">Quantity</p>
                              <hr className="my-1" />
                              <div className="qty-input m-auto">
                                {selectedMinQuantity < quantity ? (
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
                                ) : (
                                  <button
                                    disabled={true}
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
                                )}
                                <input
                                  className="product-qty"
                                  type="number"
                                  name="product-qty"
                                  min={selectedMinQuantity}
                                  onChange={(e) => setQuantity(e.target.value)}
                                  defaultValue={quantity}
                                />
                                <button
                                  className="qty-count qty-count--add btn"
                                  data-action="add"
                                  type="button"
                                  onClick={() =>
                                    quantity > 0 && setQuantity(quantity + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <hr className="my-2" />
                          <div className="row">
                            <div className="col-md-12 ">
                              <p className="fw-bold mb-0 ps-2">Other Sizes</p>
                              <hr className="my-1" />
                              <div className="row px-3 my-3">
                                {sizeData &&
                                  sizeData.map((item, index) => {
                                    // let datas = JSON.parse(item);
                                    return (
                                      <div className="col-md-2 col-2">
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
                            <div className="col-md-12 mt-3 px-3">
                              <p style={{ fontSize: 14 }}>
                                Notes :{" "}
                                <span className="text-danger">
                                  "The customer was notified that delivery
                                  charges not applied to their order.{" "}
                                  <b>₹{product.hamali}</b> Delivery charges will
                                  be charged at the time of delivery"
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card p-2">
                          <div className="row">
                            <div className="col-md-12 text-center">
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  dispatch(
                                    addToCart({
                                      _id: product._id,
                                      productName: product.productName,
                                      company:
                                        product.company === ""
                                          ? "NA"
                                          : product.company,
                                      quantity: quantity,
                                      image: product.image,
                                      description: product.description,
                                      category: product.category,
                                      price: selectedPrice,
                                      size: selectedSize,
                                      unit: selectedUnit,
                                      gst: selectedGST,
                                      commission: selectedCommission,
                                      vCommissionPercent:
                                        product.vCommissionPercent,
                                      guarantee: productSize.guarantee,
                                      warranty: productSize.warranty,
                                      updatedAt: productSize.updatedAt,
                                      createdAt: productSize.createdAt,
                                      productVendor: product.vendor_id,
                                      rewardPoints: product.rewardPoints,
                                      batchNo: product.batchNo
                                        ? product.batchNo
                                        : "",
                                      HSNNo: product.HSNNo ? product.HSNNo : "",
                                      mfd: product.mfd ? product.mfd : "",
                                      cod: product.cod ? product.cod : "",
                                      referenceId: user_id,
                                      referenceProductId: id,
                                    })
                                  );
                                  navigate("/cart-details");
                                }}
                              >
                                Add To Cart
                              </button>
                              <button
                                className="btn btn-success ms-2"
                                onClick={() => {
                                  dispatch(
                                    addToCart({
                                      _id: product._id,
                                      productName: product.productName,
                                      company:
                                        product.company === ""
                                          ? "NA"
                                          : product.company,
                                      quantity: quantity,
                                      image: product.image,
                                      description: product.description,
                                      category: product.category,
                                      price: selectedPrice,
                                      size: selectedSize,
                                      unit: selectedUnit,
                                      gst: selectedGST,
                                      commission: selectedCommission,
                                      vCommissionPercent:
                                        product.vCommissionPercent,
                                      guarantee: productSize.guarantee,
                                      warranty: productSize.warranty,
                                      updatedAt: productSize.updatedAt,
                                      createdAt: productSize.createdAt,
                                      productVendor: product.vendor_id,
                                      rewardPoints: product.rewardPoints,
                                      batchNo: product.batchNo
                                        ? product.batchNo
                                        : "",
                                      HSNNo: product.HSNNo ? product.HSNNo : "",
                                      mfd: product.mfd ? product.mfd : "",
                                      cod: product.cod ? product.cod : "",
                                      referenceId: user_id,
                                      referenceProductId: id,
                                    })
                                  );
                                  navigate("/cart-details");
                                }}
                              >
                                Buy Now
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
  );
}

export default ProductDetail;
