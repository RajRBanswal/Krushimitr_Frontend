import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
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
  const [commission, setCommission] = useState("");
  const [productGuarantee, setProductGuarantee] = useState("");
  const [productWarranty, setProductWarranty] = useState("");
  const [image, setImage] = useState([]);
  const distributor_id = localStorage.getItem("distributor_id");
  const [cod, setCOD] = useState("Yes");
  const [link, setLink] = useState("");
  const [hamali, setHamali] = useState("");
  const [keyword, setKeyword] = useState("");
  const [productCode, setProductCode] = useState("");
  const [filterPendingProduct, setFilterPendingProduct] = useState([]);
  const [filterActiveProduct, setFilterActiveProduct] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    productCode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    keyword: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    productName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    category: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    showVendorDetails: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [formValues, setFormValues] = useState([
    {
      size: "",
      unit: "",
      selling_price: "",
      buying_price: "",
      discount: "",
      gst: "",
      minQuantity: "",
      quantity: "",
      remQuantity: "0",
    },
  ]);

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

  const refresh = () => window.location.reload(true);
  //Add Products
  const storeProducts = async () => {
    let saved = "Yes";
    Object.values(formValues).forEach((item) => {
      if (item.size === "" && item.selling_price === "" && item.gst === "") {
        saved = "No";
        return;
      }
    });
    if (saved === "Yes") {
      let slug = distributor.city + "" + distributor.pincode;
      let vCommission = "";
      let vCommissionPercent = "";
      allCommission &&
        allCommission.map((item) => {
          if (item._id === commission) {
            vCommission = item.packageName;
            vCommissionPercent = item.companyCommission;
          }
        });
      const formData = new FormData();
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
      formData.append("slug", slug);
      formData.append("hamali", hamali);
      formData.append("keyword", keyword);
      formData.append("productCode", productCode);
      Object.values(formValues).forEach((item) => {
        formData.append("sizes", JSON.stringify(item));
      });
      Object.values(image).forEach((file) => {
        formData.append("image", file);
      });

      let result = await fetch("https://krushimitr.in/api/admin/add-product", {
        method: "POST",
        body: formData,
      }).then((result) => result.json());

      if (result.status === 201) {
        setProductName("");
        setProductDescription("");
        setProductCompany("");
        setProductGuarantee("");
        setProductWarranty("");
        setImage("");
        alert(result.result);
        refresh();
        setTime(true);
        setIsSet(false);
      } else {
        alert(result.result);
      }
    } else {
      alert("Fill the size data proper");
      return;
    }
  };

  //Delete Product
  const DeleteOne = async (id) => {
    let resultDel = await fetch(
      "https://krushimitr.in/api/admin/delete-product",
      {
        method: "post",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    let result = await resultDel.json();
    if (result.status === 201) {
      alert(result.result);
      setIsSet(false);
      setTime(true);
      window.location.reload();
    } else {
      alert(result.result);
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
      let vendorActive = [];
      let vendorPending = [];
      getProd.product_data.map((item) => {
        if (item.vendor_id === distributor_id && item.status === "Active") {
          vendorActive.push(item);
        }
        if (item.vendor_id === distributor_id && item.status === "Pending") {
          vendorPending.push(item);
        }
      });
      setFilterActiveProduct(vendorActive);
      setFilterPendingProduct(vendorPending);
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

  const [imageURLS, setImageURLs] = useState([]);

  const onImageChange = (event) => {
    if (event.target.files) {
      setImage([...image, ...event.target.files]);
    }
  };
  useEffect(() => {
    getCategoryData();
    getProductData();
    getDistributor();
    setTime(false);
    if (image.length < 1) return;
    const newImageUrls = [];
    image.forEach((items) => newImageUrls.push(URL.createObjectURL(items)));
    setImageURLs(newImageUrls);
  }, [image]);

  console.log(imageURLS);
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
        minQuantity: "",
        quantity: "",
        remQuantity: "0",
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const [allCommission, setAllCommission] = useState([]);
  const getCommission = async (category_name) => {
    let all_commission = await fetch(
      "https://krushimitr.in/api/admin/get-allCommission"
    );
    const allComm = await all_commission.json();
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

  const updateSelingPrice = (index, e) => {
    const newArray = formValues.map((item, i) => {
      if (index === i) {
        let ff = item.buying_price - (item.buying_price * item.discount) / 100;
        return { ...item, selling_price: ff, [e.target.name]: e.target.value };
      } else {
        return item;
      }
    });
    setFormValues(newArray);
  };
  const deleteImage = (index) => {
    setImage(image.filter((x, i) => i !== index));

    setImageURLs(imageURLS.filter((x, i) => i !== index));
  };
  const mekeCode = (value) => {
    setProductName(value);
    if (value.length > 4) {
      return;
    }

    if (value.length === 4) {
      let code = value.slice(0, 4);
      let name = code.toUpperCase();
      let val = Math.floor(1000 + Math.random() * 9000);
      let finalCode = name + "-" + val;
      setProductCode(finalCode);
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-4">
          <h2 className="text-uppercase">All Products</h2>
        </div>
        <div className="col-lg-4">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              className="form-control ps-5"
            />
          </span>
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
    </div>
  );

  const getItemData = (rowData) => (
    <ul className="list-group list-group-numbered">
      {rowData.size !== "" ||
      rowData.size !== null ||
      rowData.size !== undefined
        ? rowData.size.map((item) => {
            let items = JSON.parse(item);
            return (
              <li className="my-0  py-0 list-group-item list-group-item-primary">
                {items.size}
                {items.unit} - {items.selling_price}rs
              </li>
            );
          })
        : ""}
    </ul>
  );
  const showImage = (rowData) => (
    <img
      src={`https://krushimitr.in/upload/${rowData.image[0]}`}
      style={{ maxWidth: "100px", maxHeight: "100px" }}
      alt={rowData.category_image}
    />
  );

  const filterApplyTemplate = (options) => (
    // <div className="row">
    //   <div className="col-lg-6">
    //     <button
    //       type="button"
    //       className="btn btn-primary btn-sm"
    //       onClick={() => navigate("/admin/edit-product/" + options._id)}
    //     >
    //       <i className="fas fa-edit" />
    //     </button>
    //   </div>
    //   <div className="col-lg-6">
    //     <button
    //       type="button"
    //       className="btn btn-danger btn-sm"
    //       onClick={() => DeleteOne(options._id)}
    //     >
    //       <i className="fa fa-trash" aria-hidden="true" />
    //     </button>
    //   </div>
    // </div>
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm me-1"
        onClick={() => navigate("/distributors/product-edit/" + options._id)}
      >
        <i className="fas fa-edit" />
      </button>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => DeleteOne(options._id)}
      >
        <i className="fa fa-trash" aria-hidden="true" />
      </button>
    </>
  );

  return (
    <div className="card p-3">
      {/* <table className="table table-hover table-bordered">
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
        </table> */}
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Pending Products
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-activeVendorProduct-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-activeVendorProduct"
            type="button"
            role="tab"
            aria-controls="pills-activeVendorProduct"
            aria-selected="false"
          >
            Active Products
          </button>
        </li>
      </ul>

      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <DataTable
            value={filterPendingProduct}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
            globalFilter={globalFilter}
            header={headerComplete}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "category",
              "productCode",
              "keyword",
              "productName",
              "showVendorDetails",
              "status",
            ]}
          >
            <Column
              field="#"
              header="Sr. No."
              bodyStyle={{
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center",
              }}
              body={(data, options) => options.rowIndex + 1}
            ></Column>
            <Column
              field="category"
              header="Category"
              bodyStyle={{ color: "green", fontSize: 16, fontWeight: "bold" }}
            ></Column>
            <Column
              field="productCode"
              header="Code"
              bodyStyle={{ color: "green", fontSize: 16, fontWeight: "bold" }}
            ></Column>
            <Column
              field="keyword"
              header="Keyword"
              style={{ display: "none" }}
            ></Column>
            <Column
              field="productName"
              header="Product Name"
              bodyStyle={{ fontSize: 16, fontWeight: "bold" }}
              sortable
            ></Column>
            <Column
              field={getItemData}
              header="Size - Price"
              body={getItemData}
              bodyStyle={{ fontSize: 16 }}
            ></Column>
            <Column field={showImage} header="Image" body={showImage}></Column>
            <Column
              field="status"
              header="Status"
              sortable
              bodyStyle={{ color: "green", fontSize: 16 }}
            ></Column>
            <Column
              header="Action"
              body={filterApplyTemplate}
              severity="success"
            ></Column>
          </DataTable>
        </div>
        <div
          className="tab-pane fade"
          id="pills-activeVendorProduct"
          role="tabpanel"
          aria-labelledby="pills-activeVendorProduct-tab"
        >
          <DataTable
            value={filterActiveProduct}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
            globalFilter={globalFilter}
            header={headerComplete}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "category",
              "productCode",
              "keyword",
              "productName",
              "status",
            ]}
          >
            <Column
              field="#"
              header="Sr. No."
              bodyStyle={{
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center",
              }}
              body={(data, options) => options.rowIndex + 1}
            ></Column>
            <Column
              field="category"
              header="Category"
              bodyStyle={{ color: "green", fontSize: 16, fontWeight: "bold" }}
            ></Column>
            <Column
              field="productCode"
              header="Code"
              bodyStyle={{ color: "green", fontSize: 16, fontWeight: "bold" }}
            ></Column>
            <Column
              field="keyword"
              header="Keyword"
              style={{ display: "none" }}
            ></Column>
            <Column
              field="productName"
              header="Product Name"
              bodyStyle={{ fontSize: 16, fontWeight: "bold" }}
              sortable
            ></Column>
            <Column
              field={getItemData}
              header="Size - Price"
              body={getItemData}
              bodyStyle={{ fontSize: 16 }}
            ></Column>
            <Column field={showImage} header="Image" body={showImage}></Column>
            <Column
              field="status"
              header="Status"
              sortable
              bodyStyle={{ color: "green", fontSize: 16 }}
            ></Column>
            <Column
              header="Action"
              body={filterApplyTemplate}
              severity="success"
            ></Column>
          </DataTable>
        </div>
      </div>

      {/* Add Product Form */}
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
                <div className="col-lg-3">
                  <label htmlFor="">Category</label>
                  <select
                    name="category"
                    onChange={(e) => {
                      setCategory(e.target.value);
                      getCommission(e.target.value);
                    }}
                    className="form-control form-select"
                  >
                    <option value="">Select Category</option>
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
                    {allCommission.map((ac) => (
                      <option key={ac._id} value={ac._id}>
                        {ac.packageName + " (" + ac.companyCommission + "%)"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-4">
                  <label htmlFor="">Products Name </label>
                  <input
                    type="text"
                    name="productName"
                    onChange={(e) => mekeCode(e.target.value)}
                    placeholder="Products Name"
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-lg-2">
                  <label htmlFor="">Keywords</label>
                  <input
                    type="text"
                    name="keyword"
                    onChange={(e) => setKeyword(e.target.value)}
                    className="form-control"
                    placeholder="Keyword"
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-lg-2 text-center">
                  <label htmlFor="">Product Code</label>
                  <p>
                    <strong>{productCode}</strong>
                  </p>
                </div>
                <div className="col-lg-6">
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
                          readOnly
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
                      <div className="col-lg-1">
                        <input
                          type="text"
                          name="discount"
                          placeholder="Discount in %"
                          className="form-control"
                          value={element.discount || ""}
                          onChange={(e) => {
                            handleChange(index, e);
                            updateSelingPrice(index, e);
                          }}
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
                          type="number"
                          name="quantity"
                          className="form-control"
                          placeholder="Qty"
                          value={element.quantity || ""}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </div>
                      <div className="col-lg-1">
                        <input
                          type="number"
                          name="minQuantity"
                          className="form-control"
                          placeholder="Min Quantity"
                          value={element.minQuantity || ""}
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
                  <label htmlFor="">Guarantee (No. of Months)</label>
                  <input
                    type="number"
                    name="Guarantee"
                    onChange={(e) => setProductGuarantee(e.target.value)}
                    placeholder="Guarantee"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="">Warranty (No. of Months)</label>
                  <input
                    type="number"
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
                    defaultValue={image}
                    onChange={onImageChange}
                    placeholder="Product Image"
                    className="form-control"
                  />
                  <div className="row">
                    {imageURLS.map((imageSrc, index) => (
                      <div className="col-3 position-relative">
                        <img
                          src={imageSrc}
                          alt="not fount"
                          className="m-1 p-1"
                          width={"80"}
                        />
                        <i
                          className="fa fa-trash text-danger deleteButton"
                          onClick={() => deleteImage(index)}
                        ></i>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-lg-4 mt-2">
                  <label htmlFor="">Video Link</label>
                  <input
                    type="text"
                    name="link"
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Video Link"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-4 mt-2">
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
                <div className="col-lg-4 mt-2">
                  <label htmlFor="">
                    Hamali / Delivery Charges{" "}
                    <small className="text-danger">(only rupees)</small>
                  </label>
                  <input
                    type="number"
                    name="link"
                    onChange={(e) => setHamali(e.target.value)}
                    placeholder="Hamali / Delivery Charges"
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
