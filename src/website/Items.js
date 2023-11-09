import React from "react";

function Items({description, discount, image, price, productName, weight}) {

  return (
    <>
      <div className="items-info">
        <div className="product-img">
          <img src={`https://krushimitr.in/upload/${image}`} alt="product" />
        </div>
        <div className="title">
          <h2>{productName}</h2>
          <p>{description}</p>
        </div>
        <div className="add-minus-quantity">
          <i className="fa fa-solid fa-minus minus"></i>
          <input type="text" value="1" />
          <i className="fa fa-solid fa-plus add"></i>
        </div>
        <div className="price">
          <h3>{price}</h3>
        </div>
        <div className="remove-item">
          <i className="fa fa-solid fa-trash trash text-danger"></i>
        </div>
      </div>
      <hr />
    </>
  );
}

export default Items;
