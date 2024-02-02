import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

function ProductEdit() {
  const navigate = useNavigate();
  const productId = useParams().id;
  const [time, setTime] = useState(false);
  const [product, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCompany, setProductCompany] = useState("");
  const [productGuarantee, setProductGuarantee] = useState("");
  const [productWarranty, setProductWarranty] = useState("");
  const [productSize, setProductSize] = useState([]);
  const [defaultValue, setDefaultValue] = useState([]);
  const [image, setImage] = useState([]);
  const distributor_id = localStorage.getItem("distributor_id");
  const [commission, setCommission] = useState("");
  const [cod, setCOD] = useState("");
  const [link, setLink] = useState("");
  const [vCommission1, setVCommission1] = useState("");
  const [vCommissionPercent1, setVCommissionPercent1] = useState("");
  const getProductDatas = async () => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/get-product/",
      {
        method: "post",
        body: JSON.stringify({ id: productId }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const getProd = await all_products.json();
    if (getProd.status === 201) {
      setProducts(getProd.product_data);
      setCategory(getProd.product_data[0].category);
      setProductName(getProd.product_data[0].productName);
      setProductDescription(getProd.product_data[0].description);
      setProductCompany(getProd.product_data[0].company);
      // setGST(getProd.product_data[0].gst);
      setProductGuarantee(getProd.product_data[0].guarantee);
      setProductWarranty(getProd.product_data[0].warranty);
      setLink(getProd.product_data[0].link);
      setCOD(getProd.product_data[0].cod);
      setImage(getProd.product_data[0].image);
      setCommission(getProd.product_data[0].vCommissionId);
      setVCommission1(getProd.product_data[0].vCommission);
      setVCommissionPercent1(getProd.product_data[0].vCommissionPercent);
      let datas = getProd.product_data[0].size.map((item) => {
        let data = JSON.parse(item);
        return {
          size: data.size,
          unit: data.unit,
          selling_price: data.selling_price,
          buying_price: data.buying_price,
          gst: data.gst,
          quantity: data.quantity,
        };
      });

      setDefaultValue(datas);
      setProductSize(datas);
    } else {
      alert(getProd.result);
    }
  };

  const [formValues, setFormValues] = useState([
    {
      size: "",
      unit: "",
      selling_price: "",
      buying_price: "",
      gst: "",
      quantity: "",
    },
  ]);

  //Add More Fields
  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };
  let handleChanges = (i, e) => {
    let newFormValues = [...defaultValue];
    newFormValues[i][e.target.name] = e.target.value;
    setDefaultValue(newFormValues);
  };

  // console.log(defaultValue);

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
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  //Get All Category
  const [cate, setCate] = useState([]);
  const getCategoryData = async () => {
    let all_category = await fetch(
      "https://krushimitr.in/api/admin/all-category"
    );
    const getCat = await all_category.json();
    setCate(getCat.getCate);
  };

  useEffect(() => {
    getCategoryData();
    getProductDatas();
    setTime(false);
  }, []);
  //Get All Products

  //Add Products
  const updateProduct = async () => {
    let vCommission = "";
    let vCommissionPercent = 0;
    allCommission &&
      allCommission.map((item) => {
        if (item._id === commission) {
          vCommission = item.packageName;
          vCommissionPercent = item.companyCommission;
        }
      });
    let arr = [];
    Object.values(defaultValue).forEach((item) => {
      arr.push(item);
    });
    Object.values(formValues).forEach((item) => {
      arr.push(item);
    });

    const formData = new FormData();
    formData.append("id", productId);
    formData.append("vendor_id", distributor_id);
    formData.append("category", category);
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productCompany", productCompany);
    formData.append("productGuarantee", productGuarantee);
    formData.append("productWarranty", productWarranty);
    formData.append("vCommissionId", commission);
    formData.append("vCommission", vCommission);
    formData.append("vCommissionPercent", vCommissionPercent);
    formData.append("rewardPoints", "");
    formData.append("batchNo", "");
    formData.append("HSNNo", "");
    formData.append("mfd", "");
    formData.append("commission", "");
    formData.append("cod", cod);
    formData.append("link", link);
    Object.values(arr).forEach((item) => {
      if (item.size !== "") {
        formData.append("sizes", JSON.stringify(item));
      }
    });
    Object.values(image).forEach((file) => {
      formData.append("image", file);
    });

    let result = await fetch("https://krushimitr.in/api/admin/update-product", {
      method: "POST",
      body: formData,
    }).then((result) => result.json());
    if (result.status === 201) {
      alert(result.result);
      navigate("/distributors/allproducts");
    } else {
      alert(result.result);
    }
  };

  const [allCommission, setAllCommission] = useState([]);
  const getCommission = async (category_name) => {
    let all_commission = await fetch(
      "https://krushimitr.in/api/admin/get-allCommission"
    );
    const allComm = await all_commission.json();
    console.log(allComm);
    if (allComm.status === 201) {
      let arr = [];
      allComm.result.map((item) => {
        if (item.category == category_name) {
          arr.push(item);
        }
      });
      setAllCommission(arr);
    }
  };

  return (
    <div>
      <div className="modal-body p-4">
        <div className="row">
          <div className="col-lg-6">
            <h2 htmlFor="">Edit Product</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <label htmlFor="">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={(e) => {
                setCategory(e.target.value);
                getCommission(e.target.value);
              }}
              className="form-control form-select"
            >
              <option value={category}>{category}</option>
              {cate.map((cc) => (
                <option key={cc._id} value={cc.category_name}>
                  {cc.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-3">
            <label htmlFor="">Select Commission</label>
            <select
              name="category"
              onChange={(e) => setCommission(e.target.value)}
              className="form-control form-select"
            >
              <option value={commission}>
                {vCommission1} ({vCommissionPercent1}%)
              </option>
              {allCommission.map((ac) => (
                <option key={ac._id} value={ac._id}>
                  {ac.packageName + " (" + ac.companyCommission + "%)"}
                </option>
              ))}
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
              value={productName}
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
              value={productDescription}
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
              value={productCompany}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-11">
            {productSize.map((item, index) => (
              <div className="row mt-1" key={index}>
                <div className="col-lg-2">
                  <input
                    type="text"
                    name="size"
                    placeholder="Size"
                    className="form-control"
                    defaultValue={item.size}
                    onChange={(e) => handleChanges(index, e)}
                  />
                </div>
                <div className="col-lg-1">
                  <input
                    type="text"
                    name="unit"
                    placeholder="Unit"
                    className="form-control"
                    defaultValue={item.unit}
                    onChange={(e) => handleChanges(index, e)}
                  />
                </div>
                <div className="col-lg-2">
                  <input
                    type="text"
                    name="selling_price"
                    placeholder="Selling Price"
                    className="form-control"
                    defaultValue={item.selling_price}
                    onChange={(e) => handleChanges(index, e)}
                  />
                </div>
                <div className="col-lg-2">
                  <input
                    type="text"
                    name="buying_price"
                    placeholder="Buying Price"
                    className="form-control"
                    defaultValue={item.buying_price}
                    onChange={(e) => handleChanges(index, e)}
                  />
                </div>
                <div className="col-lg-2">
                  <select
                    name="gst"
                    className="form-control form-select"
                    defaultValue={item.gst || ""}
                    onChange={(e) => handleChanges(index, e)}
                  >
                    <option value={item.gst}>{item.gst} </option>
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
                    placeholder="Qty"
                    className="form-control"
                    defaultValue={item.quantity}
                    onChange={(e) => handleChanges(index, e)}
                  />
                </div>
              </div>
            ))}
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
          {/* <div className="col-lg-4">
            <label htmlFor="">GST</label>
            <select
              name="gst"
              onChange={(e) => setGST(e.target.value)}
              className="form-control form-select"
            >
              <option value={gst}>{gst}</option>
              <option value={"0"}>0%</option>
              <option value={"5"}>5%</option>
              <option value={"12"}>12%</option>
              <option value={"18"}>18%</option>
              <option value={"28"}>28%</option>
            </select>
          </div> */}
          <div className="col-lg-4">
            <label htmlFor="">Guarantee</label>
            <input
              type="text"
              name="Guarantee"
              onChange={(e) => setProductGuarantee(e.target.value)}
              placeholder="Guarantee"
              className="form-control"
              value={productGuarantee}
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
              value={productWarranty}
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
          <div className="col-lg-6 mt-2">
            <label htmlFor="">Video Link</label>
            <input
              type="text"
              name="link"
              onChange={(e) => setLink(e.target.value)}
              placeholder="Video Link"
              className="form-control"
              value={link}
            />
          </div>
          <div className="col-lg-6 mt-2">
            <p className="mb-1">Cash On Delivery</p>
            <div className="d-flex text-center">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value={"Yes"}
                  checked={cod === "Yes"}
                  onChange={(e) => setCOD(e.currentTarget.value)}
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  Yes
                </label>
              </div>
              <div class="form-check ms-5">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  value={"No"}
                  checked={cod === "No"}
                  onChange={(e) => setCOD(e.currentTarget.value)}
                />
                <label class="form-check-label" for="flexRadioDefault2">
                  No
                </label>
              </div>
            </div>
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
          onClick={() => updateProduct()}
          data-bs-dismiss="modal"
          className="btn btn-primary"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

export default ProductEdit;
