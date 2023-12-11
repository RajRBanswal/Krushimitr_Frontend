import React, { useEffect, useState } from "react";
import "./cart.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  reduceFromCart,
  removeFromCart,
} from "../redux/slice/CartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [product, setProducts] = useState([]);
  const dispatch = useDispatch();
  const [userLoggedIn, setUserLoggedIn] = useState(null);

  useEffect(() => {
    setProducts(cart.data);

    if (cart.data.length === 0) {
      navigate("/");
    }
    let user = localStorage.getItem("user_id");
    setUserLoggedIn(user);
  });
  const getTotal = () => {
    let total = 0;
    product.map((item) => {
      total = total + item.quantity * item.price;
    });
    return total.toFixed(0);
  };

  return (
    <div className="container py-5">
      <section className="main-cart-section">
        <h3>Shopping Cart</h3>
        <p className="total-items">
          you have{" "}
          <span className="total-items-count">{product && product.length}</span>{" "}
          items in a carts{" "}
        </p>
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
                      <td>
                        <div className="add-minus-quantity">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              if (item.quantity > 1) {
                                dispatch(reduceFromCart(item));
                              } else {
                                dispatch(removeFromCart(index));
                              }
                            }}
                          >
                            <i className="fa fa-solid fa-minus minus"></i>
                          </button>
                          <input type="text" value={item.quantity} />
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              dispatch(addToCart(item));
                            }}
                          >
                            <i className="fa fa-solid fa-plus add"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 fw-bold text-success ">
                          ₹ {item.price * item.quantity}
                        </p>
                      </td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <p className="fw-bold text-success">₹ {getTotal()}</p>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        if (userLoggedIn === null) {
                          navigate("/login", { state: { product } });
                        } else {
                          navigate("/checkout");
                        }
                      }}
                    >
                      Checkout
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
