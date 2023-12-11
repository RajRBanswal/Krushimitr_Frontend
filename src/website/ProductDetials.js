import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { addToCart } from "../redux/slice/CartSlice";

function ProductDetials() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [selectedCommission, setSelectedCommission] = useState(
    sizeData !== "" ? sizeData[0].commission : ""
  );

  useEffect(() => {
    data.map((item, index) => {
      let datas = JSON.parse(item);
      if (index === 0) {
        setProductSize(datas);
      }
    });
  }, []);

  const changePrice = (item) => {
    setSelectedSize(item.size);
    setSelectedUnit(item.unit);
    setSelectedPrice(item.selling_price);
    setSelectedGST(item.gst);
    setSelectedCommission(item.commission);
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
                              <p className="fw-bold mb-0 ps-2">Size & Price</p>
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
                                    quantity > 1 && setQuantity(quantity - 1)
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
                                  value={quantity}
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
                                      company: product.company,
                                      description: product.description,
                                      category: product.category,
                                      price: selectedPrice,
                                      image: product.image,
                                      size: selectedSize,
                                      unit: selectedUnit,
                                      quantity: quantity,
                                      gst: selectedGST,
                                      commission: selectedCommission,
                                      guarantee: productSize.guarantee,
                                      warranty: productSize.warranty,
                                      updatedAt: productSize.updatedAt,
                                      createdAt: productSize.createdAt,
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
                                      company: product.company,
                                      quantity: quantity,
                                      image: product.image,
                                      description: product.description,
                                      category: product.category,
                                      price: selectedPrice,
                                      size: selectedSize,
                                      unit: selectedUnit,
                                      gst: selectedGST,
                                      commission: selectedCommission,
                                      guarantee: productSize.guarantee,
                                      warranty: productSize.warranty,
                                      updatedAt: productSize.updatedAt,
                                      createdAt: productSize.createdAt,
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
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetials;
