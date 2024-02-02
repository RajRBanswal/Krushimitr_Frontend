import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slice/CartSlice";
import OwlCarousel from "react-owl-carousel";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../node_modules/owl.carousel/dist/assets/owl.carousel.min.css";
import "../../node_modules/owl.carousel/dist/owl.carousel.min";
import "./../styles.css";

function ProductDetials() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const options = {
    margin: 30,
    responsiveClass: true,
    nav: true,
    dots: false,
    autoplay: true,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      600: {
        items: 2,
      },
      700: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  };

  const [product, setProduct] = useState(location.state.item);
  const [productSize, setProductSize] = useState("");
  let data = product.size;
  const [sizeData, setSizeData] = useState(
    data === undefined ? [] : data.map((item) => JSON.parse(item))
  );

  const [selectedSize, setSelectedSize] = useState(
    sizeData !== "" ? sizeData[0].size : ""
  );
  const [selectedUnit, setSelectedUnit] = useState(
    sizeData !== "" ? sizeData[0].unit : ""
  );
  const [selectedPrice, setSelectedPrice] = useState(
    sizeData !== "" ? sizeData[0].selling_price : ""
  );
  const [selectedGST, setSelectedGST] = useState(
    sizeData !== "" ? sizeData[0].gst : ""
  );

  const [cate, setCate] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async () => {
    let result = await fetch(
      "https://krushimitr.in/api/admin/all-products"
    ).then((result) => result.json());
    // const getProd = await all_products.json();
    if (result.status === 201) {
      setCate(result.product_data);
    } else {
      setCate(result.result);
    }
  };

  useEffect(() => {
    getProductData();
    data.map((item, index) => {
      let datas = JSON.parse(item);
      if (index === 0) {
        setProductSize(datas);
      }
    });
  }, [data, getProductData]);

  const changePrice = (item) => {
    setSelectedSize(item.size);
    setSelectedUnit(item.unit);
    setSelectedPrice(item.selling_price);
    setSelectedGST(item.gst);
  };

  const [quantity, setQuantity] = useState(1);

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
                          product.image &&
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
                        <h4>{product && product.productName}</h4>
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
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card p-2">
                      <p className="fw-bold mb-0">Product Details</p>
                      <hr className="my-2" />
                      <div className="row">
                        <div className="col-md-8 ">
                          <p className="fw-bold mb-0 text-center">
                            Size & Price
                          </p>
                          <hr className="my-1" />
                          <div className="row px-3">
                            <div className="col-md-6 col-6">
                              <p className="mb-0">
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
                              <p className="mb-0">
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
                          <p className="fw-bold mb-0  text-center">Quantity</p>
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
                              onChange={(e) => setQuantity(e.target.value)}
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
                        </div>
                      </div>
                      <hr className="my-2" />
                      <div className="row">
                        <div className="col-md-12 ">
                          <p className="fw-bold mb-0 ps-2">Other Sizes</p>
                          <hr className="my-1" />
                          <div className="row px-3">
                            {data &&
                              data.map((item, index) => {
                                let datas = JSON.parse(item);
                                return (
                                  <div className="col-md-2 col-2">
                                    <button
                                      className="btn btn-success w-100 btn-sm"
                                      type="button"
                                      onClick={() => changePrice(datas)}
                                    >
                                      {datas.size}
                                      {datas.unit}
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
                              "The customer was notified that delivery charges
                              not applied to their order. Delivery charges will
                              be charged at the time of delivery"
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="card p-3">
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
                                  description: product.description,
                                  category: product.category,
                                  price: selectedPrice,
                                  image: product.image,
                                  size: selectedSize,
                                  unit: selectedUnit,
                                  quantity: quantity,
                                  gst: selectedGST,
                                  commission: product.commission,
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
                                  referenceId: "",
                                  referenceProductId: "",
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
                                  commission: product.commission,
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
                                  referenceId: "",
                                  referenceProductId: "",
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
      </section>

      <section className="py-5 container productDetailsPage">
        <OwlCarousel className="owl-theme" loop margin={10} nav {...options}>
          {cate.map((item) =>
            item.status === "Active" ? (
              <div className="item card shadow " key={item._id}>
                <div
                  className="product-item position-relative bg-white d-flex text-center"
                  style={{ flexDirection: "column" }}
                >
                  <div className="card-header">
                    <img
                      src={`https://krushimitr.in/upload/${
                        Array.isArray(item.image) && item.image[0]
                      }`}
                      style={{ margin: "auto", width: 100, height: 150 }}
                      alt={item.image}
                    />
                  </div>
                  <div className="card-body text-center p-3">
                    <p className="mb-1 fw-bold">{item.productName}</p>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      className="btn btn-primary btn-sm w-50 m-auto"
                      onClick={() =>
                        navigate("/product-details", { state: { item: item } })
                      }
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </OwlCarousel>
      </section>
    </div>
  );
}

export default ProductDetials;
