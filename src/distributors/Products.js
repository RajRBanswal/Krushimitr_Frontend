import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Products() {
  const navigate = useNavigate();
  const [time, setTime] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCompany, setProductCompany] = useState("");
  //   const [gst, setGST] = useState("");
  const [productGuarantee, setProductGuarantee] = useState("");
  const [productWarranty, setProductWarranty] = useState("");
  const [image, setImage] = useState([]);
  const distributor_id = localStorage.getItem("distributor_id");

  const [formValues, setFormValues] = useState([
    {
      size: "",
      unit: "",
      selling_price: "",
      buying_price: "",
      gst: "",
      quantity: "",
      commission: "",
    },
  ]);

  //Add Products
  const storeProducts = async () => {
    const formData = new FormData();
    formData.append("vendor_id", distributor_id);
    formData.append("category", category);
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productCompany", productCompany);
    formData.append("productGuarantee", productGuarantee);
    formData.append("productWarranty", productWarranty);
    Object.values(formValues).forEach((item) => {
      formData.append("sizes", JSON.stringify(item));
    });
    // formData.append ('sizes', JSON.stringify(formValues));
    Object.values(image).forEach((file) => {
      formData.append("image", file);
    });

    let result = await fetch("https://krushimitr.in/admin/add-product", {
      method: "POST",
      body: formData,
    }).then((result) => result.json());
    // console.log(result);

    if (result.status === 201) {
      setProductName("");
      setProductDescription("");
      setProductCompany("");
      setProductGuarantee("");
      setProductWarranty("");
      setImage("");
      alert(result.result);
      setTime(true);
      setIsSet(false);
    } else {
      alert(result.result);
    }
  };

  //Delete Product
  const DeleteOne = async (id) => {
    let resultDel = await fetch("https://krushimitr.in/admin/delete-product", {
      method: "post",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((resultDel) => resultDel.json());
    if (resultDel.status === 201) {
      alert(resultDel.result);
      setIsSet(false);
      setTime(true);
    } else {
      alert(resultDel.result);
    }
  };

  //Get All Products
  const getProductData = async () => {
    let all_products = await fetch("https://krushimitr.in/admin/all-products");
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
  const getCategoryData = async () => {
    let all_category = await fetch("https://krushimitr.in/admin/all-category");
    const getCat = await all_category.json();
    setCate(getCat.getCate);
  };

  useEffect(() => {
    getCategoryData();
    getProductData();
    setTime(false);
  }, [time]);

  //Add More Fields
  let handleChange = (i, e) => {
    // console.log(i, e.target.value);
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        size: "",
        unit: "",
        selling_price: "",
        buying_price: "",
        gst: "",
        quantity: "",
        commission: "",
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  return (
    <div className="card p-3">
      <div className="row">
        <div className="col-lg-8">
          <h2 className="text-uppercase">All Products</h2>
        </div>
        <div className="col-lg-4">
          <button
            type="button"
            className="btn btn-primary float-end"
            data-bs-toggle="modal"
            onClick={() => setIsSet(true)}
            data-bs-target="#exampleModal"
          >
            Add Product
          </button>
        </div>
      </div>
      <hr />
      <div className="table-responsive" style={{ overflow: "auto" }}>
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Product Name</th>
              <th scope="col">Size - Price</th>
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
                    <ul class="list-group list-group-numbered">
                      {product.size === ""
                        ? ""
                        : product.size.map((item) => {
                            item = JSON.parse(item);
                            return (
                              <li className="my-0  py-0 list-group-item list-group-item-primary">
                                {item.size}
                                {item.unit} - {item.selling_price}rs
                              </li>
                            );
                          })}
                    </ul>
                  </td>
                  <td>
                    <img
                      src={`https://krushimitr.in/upload/${product.image[0]}`}
                      width={"100px"}
                      height={"100px"}
                      alt={product.category_image}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-1"
                      onClick={() =>
                        navigate("/distributors/product-edit/" + product._id)
                      }
                    >
                      <i className="fas fa-edit" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => DeleteOne(product._id)}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ) : (
                ""
              )
            )}
          </tbody>
        </table>
      </div>
      <div
        className={`modal fade ${isSet ? "show" : ""} `}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-secondary py-2">
              <h1
                className="modal-title fs-5 text-white"
                id="exampleModalLabel"
              >
                Add Products
              </h1>
              <button
                type="button"
                className="btn-close text-white pt-4"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-4">
              <div className="row">
                <div className="col-lg-6">
                  <label htmlFor="">Category</label>
                  <select
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control form-select"
                  >
                    <option value="">Select Category</option>
                    {cate.map((cc) =>
                      distributor_id === cc.vendor_id ? (
                        <option key={cc._id} value={cc.category_name}>
                          {cc.category_name}
                        </option>
                      ) : (
                        ""
                      )
                    )}
                  </select>
                </div>
                <div className="col-lg-6">
                  <label htmlFor="">Products Name </label>
                  <input
                    type="text"
                    name="productName"
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Products Name"
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8">
                  <label htmlFor="">Description</label>
                  <textarea
                    name="desc"
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Description"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="">Product Company</label>
                  <input
                    type="text"
                    name="company"
                    onChange={(e) => setProductCompany(e.target.value)}
                    placeholder="Product Company"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-lg-11">
                  {formValues.map((element, index) => (
                    <div className="row mt-1 position-relative" key={index}>
                      <div className="col-lg-2">
                        <input
                          type="text"
                          name="size"
                          placeholder="Size"
                          className="form-control"
                          value={element.size || ""}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </div>
                      <div className="col-lg-1">
                        <input
                          type="text"
                          name="unit"
                          placeholder="Unit"
                          className="form-control"
                          value={element.unit || ""}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </div>
                      <div className="col-lg-2">
                        <input
                          type="text"
                          name="selling_price"
                          placeholder="Selling Price"
                          className="form-control"
                          value={element.selling_price || ""}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </div>
                      <div className="col-lg-2">
                        <input
                          type="text"
                          name="buying_price"
                          placeholder="Buying Price"
                          className="form-control"
                          value={element.buying_price || ""}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </div>
                      <div className="col-lg-2">
                        <select
                          name="gst"
                          className="form-control form-select"
                          value={element.gst || ""}
                          onChange={(e) => handleChange(index, e)}
                        >
                          <option value={""}>Select GST</option>
                          <option value={"0"}>0%</option>
                          <option value={"5"}>5%</option>
                          <option value={"12"}>12%</option>
                          <option value={"18"}>18%</option>
                          <option value={"28"}>28%</option>
                        </select>
                      </div>
                      <div className="col-lg-1">
                        <input
                          type="text"
                          name="quantity"
                          className="form-control"
                          placeholder="Qty"
                          value={element.quantity || ""}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </div>
                      <div className="col-lg-2">
                        <input
                          type="number"
                          name="commission"
                          className="form-control"
                          placeholder="Commission (in %)"
                          value={element.commission || ""}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </div>
                      {index ? (
                        <div className="col-lg-1 removeDiv">
                          <button
                            type="button"
                            className="button remove btn btn-danger"
                            onClick={() => removeFormFields(index)}
                          >
                            <i className="fa fa-minus text-white" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="col-lg-1 ">
                  <div className="button-section">
                    <button
                      className="button add btn btn-primary"
                      type="button"
                      onClick={() => addFormFields()}
                    >
                      <i className="fa fa-plus text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <label htmlFor="">Guarantee</label>
                  <input
                    type="text"
                    name="Guarantee"
                    onChange={(e) => setProductGuarantee(e.target.value)}
                    placeholder="Guarantee"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="">Warranty</label>
                  <input
                    type="text"
                    name="warranty"
                    onChange={(e) => setProductWarranty(e.target.value)}
                    placeholder="Warranty"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="">Products Image</label>
                  <input
                    type="file"
                    name="product_img"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files)}
                    placeholder="Product Image"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer py-1">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={storeProducts}
                data-bs-dismiss="modal"
                className="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
