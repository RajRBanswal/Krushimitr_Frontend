import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slice/CartSlice";
import OwlCarousel from "react-owl-carousel";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import "../../node_modules/owl.carousel/dist/assets/owl.carousel.min.css";
import "../../node_modules/owl.carousel/dist/owl.carousel.min";
import "./../styles.css";

function ProductDetials() {
  const { pid, name } = useParams();
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
  const [product, setProduct] = useState([]);
  const [data, setData] = useState([]);
  const [sizeData, setSizeData] = useState([]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedGST, setSelectedGST] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  // const [product, setProduct] = useState(location.state.item);
  const getProductDatas = async () => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/get-product/",
      {
        method: "post",
        body: JSON.stringify({ id: pid }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const getProd = await all_products.json();
    if (getProd.status === 201) {
      setProduct(getProd.product_data[0]);
      let main = getProd.product_data[0].size.map((item) => {
        return JSON.parse(item);
      });
      setSizeData(main);
      setSelectedSize(main[0].size);
      setSelectedUnit(main[0].unit);
      setSelectedPrice(main[0].selling_price);
      setSelectedGST(main[0].gst);
      setSelectedDiscount(
        main[0].discount === undefined ? 0 : main[0].discount
      );
    } else {
      alert(getProd.result);
    }
  };
  // console.log(sizeData);
  const [productSize, setProductSize] = useState("");

  // const [sizeData, setSizeData] = useState(
  //   product.size === undefined || product.size.length === 0
  //     ? []
  //     : product.size.map((item) => {
  //         JSON.parse(item);
  //       })
  // );

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
    getProductDatas();
    getProductData();
    sizeData.map((item, index) => {
      let datas = JSON.parse(item);
      if (index === 0) {
        setProductSize(datas);
      }
    });
  }, [location]);

  const changePrice = (item) => {
    setSelectedSize(item.size);
    setSelectedUnit(item.unit);
    setSelectedPrice(item.selling_price);
    setSelectedGST(item.gst);
    setSelectedDiscount(item.discount === undefined ? 0 : item.discount);
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
                        <h4 className="text-success">
                          {product && product.company === undefined
                            ? ""
                            : "(" + product.company + ")"}
                        </h4>
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
                            Size & Price & Discount
                          </p>
                          <hr className="my-1" />
                          <div className="row px-3">
                            <div className="col-md-4 col-4">
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
                            <div className="col-md-4 col-4">
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
                              "The customer was notified that delivery charges
                              not applied to their order.{" "}
                              <b>₹{product.hamali}</b> Delivery charges will be
                              charged at the time of delivery"
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
                                  cod: product.cod ? product.cod : "",
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
                                  cod: product.cod ? product.cod : "",
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
                        navigate(
                          `/product-details/${
                            item._id
                          }/${item.productName.replace(/\//g, "")}`
                        )
                      }
                      // onClick={() =>
                      //   navigate("/product-details", {
                      //     state: { item: item },
                      //   })
                      // }
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
