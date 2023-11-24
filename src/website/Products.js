import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

function Products() {
    const navigate = useNavigate();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const getProductData = async () => {
      let all_products = await fetch(
        "https://krushimitr.in/admin/all-products"
      );
      const getProd = await all_products.json();
      if (getProd.status === 201) {
        setProduct(getProd.product_data);
      } else {
        setProduct(getProd.result);
      }
    };
    getProductData();
  }, []);

  console.log(product);

  return (
    <>
      {/* <!-- Category Start --> */}
      <div className="container-fluid py-5">
        <div className="container">
          <div
            className="mx-auto text-center mb-5"
            style={{ maxWidth: "500px" }}
          >
            <h6 className="text-primary text-uppercase">Product</h6>
            <h1 className="display-5">Products</h1>
          </div>

          <div className="row">
            {product.map((item) => (
              <div className="col-lg-3 mt-3">
                <div className="card h-100">
                  <div className="card-body p-0 productImage">
                    <img
                      src={`https://krushimitr.in/upload/${item.image[0]}`}
                      style={{ margin: "auto" }}
                      width={"100%"}
                      alt={item.image}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-dark text-center fw-bold">
                      {item.productName}
                    </p>
                    {/* <p><label className="text-primary fw-bold mb-0"><i className='fa fa-rupee' ></i>{item.price}</label> &nbsp;  {item.oldPrice ? <del className=''><i className='fa fa-rupee' ></i>{item.oldPrice}</del> : ''}</p> */}
                  </div>
                  <div className="btn-action d-flex justify-content-center pb-3">
                    <button
                      className="btn bg-secondary py-2 px-3 mx-2 btn-sm"
                      onClick={() =>
                        navigate("/product-details", { state: { item: item } })
                      }
                    >
                      <i className="bi bi-eye text-white"></i>
                    </button>
                  </div>
                  <div className="productPercentage">
                    {item.discount ? (
                      <span>
                        {item.discount}
                        {item.percentSbl}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <!-- End Category --> */}
    </>
  );
}

export default Products;
