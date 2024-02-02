import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import seedss from "../images/seeds.jpg";
import machinery from "../images/machinery.jpg";
import elect from "../images/electroninc.jpg";
import ferti from "../images/fertilizers.jpg";

function Products() {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductData = async () => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-products"
    );
    const getProd = await all_products.json();
    if (getProd.status === 201) {
      setProduct(getProd.product_data);
    } else {
      setProduct(getProd.result);
    }
  };
  useEffect(() => {
    getProductData();
  }, [getProductData]);

  // console.log(product);

  return (
    <>
      {/* <!-- Category Start --> */}
      <div className="container-fluid py-5">
        <div className="container">
          <div
            className="mx-auto text-center mb-5"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 text-primary text-uppercase">
              Categories
            </h1>
          </div>

          <div className="row">
            <div className="col-lg-3">
              <div className="card px-3 py-5 text-center h-100">
                <img src={machinery} width={100} className="m-auto" alt="" />
                <h4 className="mt-3">Machinery</h4>
                <p style={{ textAlign: "justify" }}>
                  The mechanical structures and tools used in farming and other
                  agricultural activities are referred to as agricultural
                  machinery. These instruments come in a variety of forms, from
                  power and hand tools to tractors and the innumerable varieties
                  of agricultural implements they drive or tow. Both organic and
                  nonorganic farming employ a wide range of equipment.
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card px-3 py-5 text-center h-100">
                <img src={ferti} width={100} alt="" className="m-auto" />
                <h4 className="mt-3">Fertilizers</h4>
                <p style={{ textAlign: "justify" }}>
                  The mechanical structures and tools used in farming and other
                  agricultural activities are referred to as agricultural
                  machinery. These instruments come in a variety of forms, from
                  power and hand tools to tractors and the innumerable varieties
                  of agricultural implements they drive or tow. Both organic and
                  nonorganic farming employ a wide range of equipment.
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card px-3 py-5 text-center h-100">
                <img src={seedss} width={100} alt="" className="mx-auto" />
                <h4 className="mt-3">Seeds</h4>
                <p style={{ textAlign: "justify" }}>
                  According to biology, a seed is a plant embryo and food source
                  that is encased in a seed coat, or outer layer of protection
                  (testa). In a broader sense, "seed" refers to anything that
                  can be sowed, including tubers or husks and seed. After sperm
                  from pollen fertilize the embryo sac to form a zygote, the
                  matured ovule produces seeds.
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card px-3 py-5 text-center h-100">
                <img src={elect} width={100} alt="" className="m-auto" />
                <h4 className="mt-3">Electronic</h4>
                <p style={{ textAlign: "justify" }}>
                  Abstract: The current situation of power outages and farmers
                  adopting automated systems to conserve water is the primary
                  focus of agro electronics. With the most recent technology,
                  these automated systems are more dependable, have critical
                  capabilities, are enlarged, and are little. The primary idea
                  is to remotely control agricultural equipment by utilizing GSM
                  to turn it on and off.
                </p>
              </div>
            </div>
          </div>

          <div
            className="mx-auto text-center my-5"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 text-primary text-uppercase">Products</h1>
          </div>

          <div className="row">
            {product.map((item) =>
              item.status === "Active" ? (
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
                          navigate("/product-details", {
                            state: { item: item },
                          })
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
              ) : (
                ""
              )
            )}
          </div>
        </div>
      </div>
      {/* <!-- End Category --> */}
    </>
  );
}

export default Products;
