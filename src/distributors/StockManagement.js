import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const StockManagement = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const [products, setProducts] = useState([]);
  const distributor_id = localStorage.getItem("distributor_id");

  const [distributor, setDistributor] = useState([]);
  const getDistributor = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/distributor/distributor-profile",
      {
        method: "post",
        body: JSON.stringify({ distributor_id }),
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

  //Get All Products
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async () => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-products"
    );
    const getProd = await all_products.json();
    if (getProd.status === 201) {
      setProducts(getProd.product_data);
      // console.log(getProd.product_data);
    } else {
      setProducts(getProd.result);
    }
  };

  //Get All Category
  const [cate, setCate] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCategoryData = async () => {
    let all_category = await fetch(
      "https://krushimitr.in/api/admin/all-category"
    );
    const getCat = await all_category.json();
    setCate(getCat.getCate);
  };

  useEffect(() => {
    getCategoryData();
    getProductData();
    getDistributor();
    setTime(false);
  }, []);

  return (
    <div className="card p-3">
      <div className="row">
        <div className="col-lg-8">
          <h2 className="text-uppercase">Stock Management</h2>
        </div>
        <div className="col-lg-4"></div>
      </div>
      <hr />
      <div className="table-responsive" style={{ overflow: "auto" }}>
        <table className="table table-bordered stockMgmt">
          <thead className="table-dark">
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Product Name</th>
              <th scope="col">Sizes</th>
              <th scope="col">Image</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) =>
              distributor_id === product.vendor_id ? (
                <tr key={product._id}>
                  <td>{product.category}</td>
                  <td>{product.productName}</td>
                  <td>
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Price</th>
                          <th>Buying Rate</th>
                          <th>GST</th>
                          <th>Quantity</th>
                          <th>Rem. Qty.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.size === ""
                          ? ""
                          : product.size.map((item) => {
                              item = JSON.parse(item);
                              return (
                                <tr>
                                  <td>
                                    {item.size}
                                    {item.unit}
                                  </td>
                                  <td>{item.selling_price}rs</td>
                                  <td>{item.buying_price}rs</td>
                                  <td>{item.gst}</td>
                                  <td>{item.quantity}</td>
                                  <td>
                                    {item.remQuantity === 0
                                      ? item.quantity
                                      : item.remQuantity}
                                  </td>
                                </tr>
                                //   <li className="my-0  py-0 list-group-item list-group-item-primary">
                                //     {item.size}
                                //     {item.unit} - {item.selling_price}rs
                                //   </li>
                              );
                            })}
                      </tbody>
                    </table>
                  </td>
                  <td>
                    <img
                      src={`https://krushimitr.in/upload/${product.image[0]}`}
                      width={"80px"}
                      height={"80px"}
                      alt={product.category_image}
                    />
                  </td>
                  <td></td>
                </tr>
              ) : (
                ""
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;
