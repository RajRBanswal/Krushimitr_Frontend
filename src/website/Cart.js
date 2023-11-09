import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Items from "./Items";
import "./cart.css";

function Cart() {
  useEffect(() => {
    getProductData();
  });
  const [product, setProducts] = useState([]);

  const getProductData = async (e) => {
    let result = await fetch("https://krushimitr.in/admin/all-products").then(
      (result) => result.json()
    );
    // const getProd = await all_products.json();
    if (result.status === 201) {
      setProducts(result.product_data);
    } else {
      setProducts(result.result);
    }
  };
  return (
    <div className="container py-5">
      <header>
        <div className="continue-shopping">
          <img
            src="./images/back.png"
            alt="arrow"
            className="arrow-icon"
            width={20}
          />
          <h3>Continue Shopping</h3>
        </div>
        <div className="cart-icon">
          <img src="./images/cart.png" alt="cart" width={20} />
          <p>7</p>
        </div>
      </header>
      <section className="main-cart-section">
        <h1>Shopping Cart</h1>
        <p className="total-items">
          you have <span className="total-items-count">7</span> items in a carts{" "}
        </p>
        <div className="cart-items">
          <div className="cart-items-container">
            <Scrollbars>
              {product.map((item) => {
                return <Items key={item._id} {...item} />;
              })}
            </Scrollbars>
          </div>
        </div>
        <div className="card-total">
          <h3>
            Cart Total : <span>$300</span>
          </h3>
        </div>
      </section>
    </div>
  );
}

export default Cart;
