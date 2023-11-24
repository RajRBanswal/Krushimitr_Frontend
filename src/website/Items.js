import React from "react";

function Items({ props }) {
  console.log(props);
  return (
    <>
      <div className="items-info">
        <div className="product-img">
          <img src={`https://krushimitr.in/upload/`} alt="product" />
        </div>
        <div className="title"></div>
        <div className="add-minus-quantity">
          <i className="fa fa-solid fa-minus minus"></i>
          <input type="text" value="1" />
          <i className="fa fa-solid fa-plus add"></i>
        </div>
        <div className="price"></div>
        <div className="remove-item">
          <i className="fa fa-solid fa-trash trash text-danger"></i>
        </div>
      </div>
      <hr />
    </>
  );
}

export default Items;
