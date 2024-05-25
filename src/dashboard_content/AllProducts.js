import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

function AllProducts() {
  const navigate = useNavigate();
  const proSize = useRef(null);
  const [time, setTime] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const [products, setProducts] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterPendingVendorProduct, setFilterPendingVendorProduct] = useState(
    []
  );
  const [filterActiveVendorProduct, setFilterActiveVendorProduct] = useState(
    []
  );

  const [adminCommission, setAdminCommission] = useState(10);
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
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCompany, setProductCompany] = useState("");
  // const [gst, setGST] = useState("");
  const [productGuarantee, setProductGuarantee] = useState("");
  const [productWarranty, setProductWarranty] = useState("");
  const [image, setImage] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [batchNo, setBatchNo] = useState("");
  const [HSNNo, setHSNNo] = useState("");
  const [mfd, setMFD] = useState("");
  const [commission, setCommission] = useState(0);
  const [cod, setCOD] = useState("Yes");
  const [link, setLink] = useState("");
  const [hamali, setHamali] = useState("");
  const [keyword, setKeyword] = useState("");
  const [productCode, setProductCode] = useState("");

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
  const [productData, setProductData] = useState([]);
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
      const formData = new FormData();
      formData.append("category", category);
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("productCompany", productCompany);
      formData.append("rewardPoints", rewardPoints);
      formData.append("productGuarantee", productGuarantee);
      formData.append("productWarranty", productWarranty);
      formData.append("commission", commission);
      formData.append("vCommission", "");
      formData.append("vCommissionPercent", adminCommission);
      formData.append("batchNo", batchNo);
      formData.append("HSNNo", HSNNo);
      formData.append("mfd", mfd);
      formData.append("vendor_id", "");
      formData.append("cod", cod);
      formData.append("link", link);
      formData.append("slug", "");
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
    ).then((resultDel) => resultDel.json());
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
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-products"
    );
    const getProd = await all_products.json();
    if (getProd.status === 201) {
      let vendorActive = [];
      let vendorPending = [];
      let adminActive = [];
      getProd.product_data.map((item) => {
        if (item.vendor_id !== "" && item.status === "Active") {
          vendorActive.push(item);
        }
        if (item.vendor_id !== "" && item.status === "Pending") {
          vendorPending.push(item);
        }
        if (
          (item.vendor_id === "" || item.vendor_id === undefined) &&
          item.status === "Active"
        ) {
          adminActive.push(item);
        }
      });
      setFilterActiveVendorProduct(vendorActive);
      setFilterPendingVendorProduct(vendorPending);
      setFilterData(adminActive);
      setProducts(getProd.product_data);
    } else {
      setProducts(getProd.result);
    }
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

  const [imageURLS, setImageURLs] = useState([]);

  const onImageChange = (event) => {
    if (event.target.files) {
      setImage([...image, ...event.target.files]);
    }
  };
  const [activeVendor, setActiveVendor] = useState([]);
  const getVendorData = async () => {
    let aVendor = [];
    const all_users = await fetch(
      "https://krushimitr.in/api/admin/distributor"
    );
    const result = await all_users.json();
    if (result.status === 201) {
      result.distributor.map((item) => {
        if (item.type === "Vendor" && item.status === "Active") {
          aVendor.push(item);
        }
      });
      setActiveVendor(aVendor);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    getCategoryData();
    getProductData();
    getVendorData();
    setTime(false);
    if (image.length < 1) return;
    const newImageUrls = [];
    image.forEach((items) => newImageUrls.push(URL.createObjectURL(items)));
    setImageURLs(newImageUrls);
  }, [products]);

  //Add More Fields
  let handleChange = (i, e) => {
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

  const changeStatus = async (status, Ids) => {
    const vendorStatus = await fetch(
      "https://krushimitr.in/api/admin/product-status",
      {
        method: "post",
        body: JSON.stringify({ status: status, pId: Ids }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await vendorStatus.json();
    if (result.status === 201) {
      alert(result.result);
    } else {
      alert(result.message);
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

  const filterApplyTemplate = (options) => {
    return options.status === "Pending" ? (
      <>
        <button
          type="button"
          className="btn btn-success btn-sm me-1"
          onClick={() => changeStatus("Active", options._id)}
        >
          <i className="fas fa-eye" /> Accept
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm me-1"
          onClick={() => changeStatus("Reject", options._id)}
        >
          <i className="fas fa-close" /> Reject
        </button>
      </>
    ) : (
      <div className="row">
        <div className="col-lg-6">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/admin/edit-product/" + options._id)}
          >
            <i className="fas fa-edit" />
          </button>
        </div>
        <div className="col-lg-6">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => DeleteOne(options._id)}
          >
            <i className="fa fa-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  };
  const showVendorDetails = (rowData) => {
    return activeVendor.map((item) => {
      if (rowData.vendor_id === item._id) {
        return (
          <>
            <p className="mb-0">
              <span>{item.name}</span> <span>{item.mobile}</span>{" "}
              <small className="text-secondary">
                ({item.shopName === undefined ? "" : item.shopName})
              </small>
            </p>
          </>
        );
      }
    });
  };

  return (
    <div className="card p-3">
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            All Products
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Vendor Pending Products
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
            Vendor Active Products
          </button>
        </li>
      </ul>

      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <DataTable
            value={filterData}
            dataKey="id"
            paginator
            rows={20}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Products"
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
          {/* <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Size - Price</th>
                  <th scope="col">Image</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) =>
                  (product.vendor_id === "" ||
                    product.vendor_id === undefined) &&
                  product.status === "Active" ? (
                    <tr key={product._id}>
                      <td>{product.category}</td>
                      <td>{product.productName}</td>
                      <td>
                        <ul className="list-group list-group-numbered">
                          {product.size !== "" ||
                          product.size !== null ||
                          product.size !== undefined
                            ? product.size.map((item) => {
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
                      </td>
                      <td>
                        <img
                          src={`https://krushimitr.in/upload/${
                            Array.isArray(product.image) && product.image[0]
                          }`}
                          width={"100px"}
                          height={"100px"}
                          alt={product.category_image}
                        />
                      </td>
                      <td>
                        {product.status === "Active" ? (
                          <b className="text-success">{product.status}</b>
                        ) : (
                          <b className="text-danger">{product.status}</b>
                        )}
                      </td>
                      <td>
                        {product.status === "Pending" ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm me-1"
                              onClick={() => {}}
                            >
                              <i className="fas fa-eye" /> Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm me-1"
                              onClick={() => {}}
                            >
                              <i className="fas fa-close" /> Reject
                            </button>
                          </>
                        ) : (
                          <div className="row">
                            <div className="col-lg-6">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm me-1"
                                onClick={() =>
                                  navigate("/admin/edit-product/" + product._id)
                                }
                              >
                                <i className="fas fa-edit" />
                              </button>
                            </div>
                            <div className="col-lg-6">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => DeleteOne(product._id)}
                              >
                                <i className="fa fa-trash" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )
                )}
              </tbody>
            </table> */}
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <DataTable
            value={filterPendingVendorProduct}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Products"
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
            <Column
              field={showVendorDetails}
              header="Vendor Details"
              body={showVendorDetails}
              bodyStyle={{ fontSize: 14 }}
              filterElement={showVendorDetails}
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
          {/* <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Size - Price</th>
                  <th scope="col">Image</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) =>
                  product.vendor_id !== "" && product.status === "Pending" ? (
                    <tr key={product._id}>
                      <td>{product.category}</td>
                      <td>{product.productName}</td>
                      <td>
                        <ul className="list-group list-group-numbered">
                          {product.size !== "" || product.size !== null
                            ? product.size.map((item) => {
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
                      </td>
                      <td>
                        <img
                          src={`https://krushimitr.in/upload/${
                            Array.isArray(product.image) && product.image[0]
                          }`}
                          width={"100px"}
                          height={"100px"}
                          alt={product.category_image}
                        />
                      </td>
                      <td>
                        {product.status === "Active" ? (
                          <b className="text-success">{product.status}</b>
                        ) : (
                          <b className="text-danger">{product.status}</b>
                        )}
                      </td>
                      <td>
                        {product.status === "Pending" ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm me-1"
                              data-bs-toggle="modal"
                              data-bs-target={"#ProductViewModal" + product._id}
                              onClick={() => setProductData(product)}
                            >
                              <i className="fas fa-eye" /> View
                            </button>
                          </>
                        ) : (
                          <div className="row">
                            <div className="col-lg-6">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm me-1"
                                onClick={() =>
                                  navigate("/admin/edit-product/" + product._id)
                                }
                              >
                                <i className="fas fa-edit" />
                              </button>
                            </div>
                            <div className="col-lg-6">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => DeleteOne(product._id)}
                              >
                                <i className="fa fa-trash" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      {productData && productData.productName ? (
                        <div
                          className="modal fade"
                          id={"ProductViewModal" + product._id}
                          tabIndex="-1"
                          aria-labelledby="ProductViewLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                              <div className="modal-header py-2">
                                <h5
                                  className="modal-title"
                                  id="ProductViewLabel"
                                >
                                  Product Details
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <b>Name:</b> {productData.productName}
                                  </div>
                                  <div className="col-lg-6">
                                    <b>Company:</b> {productData.company}
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-lg-6">
                                    <b>Category:</b> {productData.category}
                                  </div>
                                  <div className="col-lg-6">
                                    <b>Status:</b> {productData.status}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <b>Date:</b>{" "}
                                    {moment(productData.createdAt).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </div>
                                  <div className="col-lg-6">
                                    <b>Guarantee / Warranty:</b>{" "}
                                    {productData.guarantee +
                                      " / " +
                                      productData.warranty}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12">
                                    <b>Date:</b> {productData.description}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <p>
                                      <b>Sizes:</b>
                                    </p>
                                    <ol className="list-group list-group-numbered">
                                      {(Array.isArray(productData.size) &&
                                        productData.size !== "") ||
                                      productData.size !== null
                                        ? productData.size.map((item) => {
                                            let items = JSON.parse(item);
                                            return (
                                              <li className="my-0  py-0 list-group-item list-group-item-warning">
                                                {items.size}
                                                {items.unit} -{" "}
                                                {items.selling_price}
                                                rs
                                              </li>
                                            );
                                          })
                                        : ""}
                                    </ol>
                                  </div>
                                  <div className="col-lg-6 text-center ">
                                    <p>
                                      <b>Images:</b>
                                    </p>

                                    <img
                                      className=""
                                      src={`https://krushimitr.in/upload/${
                                        Array.isArray(productData.image) &&
                                        productData.image[0]
                                      }`}
                                      width={"100px"}
                                      height={"100px"}
                                      alt={productData.image[0]}
                                    />
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-12 text-center">
                                    <button
                                      type="button"
                                      className="btn btn-success btn-sm me-1"
                                      onClick={() =>
                                        changeStatus("Active", productData._id)
                                      }
                                      data-bs-dismiss="modal"
                                    >
                                      <i className="fas fa-check" /> Accept
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm me-1"
                                      onClick={() =>
                                        changeStatus(
                                          "Deactived",
                                          productData._id
                                        )
                                      }
                                      data-bs-dismiss="modal"
                                    >
                                      <i className="fas fa-close" /> Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </tr>
                  ) : (
                    ""
                  )
                )}
              </tbody>
            </table> */}
        </div>
        <div
          className="tab-pane fade"
          id="pills-activeVendorProduct"
          role="tabpanel"
          aria-labelledby="pills-activeVendorProduct-tab"
        >
          <DataTable
            value={filterActiveVendorProduct}
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
            <Column
              field={showVendorDetails}
              header="Vendor Details"
              body={showVendorDetails}
              bodyStyle={{ fontSize: 14 }}
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
          {/* <div className="table-responsive" style={{ overflow: "auto" }}>
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Size - Price</th>
                  <th scope="col">Image</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) =>
                  product.vendor_id !== "" && product.status === "Active" ? (
                    <tr key={product._id}>
                      <td>{product.category}</td>
                      <td>{product.productName}</td>
                      <td>
                        <ul className="list-group list-group-numbered">
                          {product.size !== "" || product.size !== null
                            ? product.size.map((item) => {
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
                      </td>
                      <td>
                        <img
                          src={`https://krushimitr.in/upload/${
                            Array.isArray(product.image) && product.image[0]
                          }`}
                          width={"100px"}
                          height={"100px"}
                          alt={product.category_image}
                        />
                      </td>
                      <td>
                        {product.status === "Active" ? (
                          <b className="text-success">{product.status}</b>
                        ) : (
                          <b className="text-danger">{product.status}</b>
                        )}
                      </td>
                      <td>
                        {product.status === "Pending" ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm me-1"
                              data-bs-toggle="modal"
                              data-bs-target={"#ProductViewModal" + product._id}
                              onClick={() => setProductData(product)}
                            >
                              <i className="fas fa-eye" /> View
                            </button>
                          </>
                        ) : (
                          <div className="row">
                            <div className="col-lg-6">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm me-1"
                                onClick={() =>
                                  navigate("/admin/edit-product/" + product._id)
                                }
                              >
                                <i className="fas fa-edit" />
                              </button>
                            </div>
                            <div className="col-lg-6">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => DeleteOne(product._id)}
                              >
                                <i className="fa fa-trash" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      {productData && productData.productName ? (
                        <div
                          className="modal fade"
                          id={"ProductViewModal" + product._id}
                          tabIndex="-1"
                          aria-labelledby="ProductViewLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                              <div className="modal-header py-2">
                                <h5
                                  className="modal-title"
                                  id="ProductViewLabel"
                                >
                                  Product Details
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <b>Name:</b> {productData.productName}
                                  </div>
                                  <div className="col-lg-6">
                                    <b>Company:</b> {productData.company}
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-lg-6">
                                    <b>Category:</b> {productData.category}
                                  </div>
                                  <div className="col-lg-6">
                                    <b>Status:</b> {productData.status}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <b>Date:</b>{" "}
                                    {moment(productData.createdAt).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </div>
                                  <div className="col-lg-6">
                                    <b>Guarantee / Warranty:</b>{" "}
                                    {productData.guarantee +
                                      " / " +
                                      productData.warranty}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12">
                                    <b>Date:</b> {productData.description}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <p>
                                      <b>Sizes:</b>
                                    </p>
                                    <ol className="list-group list-group-numbered">
                                      {productData.size !== "" ||
                                      productData.size !== null
                                        ? productData.size.map((item) => {
                                            let items = JSON.parse(item);
                                            return (
                                              <li className="my-0  py-0 list-group-item list-group-item-warning">
                                                {items.size}
                                                {items.unit} -{" "}
                                                {items.selling_price}
                                                rs
                                              </li>
                                            );
                                          })
                                        : ""}
                                    </ol>
                                  </div>
                                  <div className="col-lg-6 text-center ">
                                    <p>
                                      <b>Images:</b>
                                    </p>

                                    <img
                                      className=""
                                      src={`https://krushimitr.in/upload/${
                                        Array.isArray(productData.image) &&
                                        productData.image[0]
                                      }`}
                                      width={"100px"}
                                      height={"100px"}
                                      alt={productData.image[0]}
                                    />
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-12 text-center">
                                    <button
                                      type="button"
                                      className="btn btn-success btn-sm me-1"
                                      onClick={() =>
                                        changeStatus("Active", productData._id)
                                      }
                                      data-bs-dismiss="modal"
                                    >
                                      <i className="fas fa-check" /> Accept
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm me-1"
                                      onClick={() =>
                                        changeStatus(
                                          "Deactived",
                                          productData._id
                                        )
                                      }
                                      data-bs-dismiss="modal"
                                    >
                                      <i className="fas fa-close" /> Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </tr>
                  ) : (
                    ""
                  )
                )}
              </tbody>
            </table>
          </div> */}
        </div>
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
                <div className="col-lg-4">
                  <label htmlFor="">
                    Category
                    <span className="text-danger" style={{ fontSize: 18 }}>
                      *
                    </span>
                  </label>
                  <select
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control form-select"
                  >
                    <option value="">Select Category </option>
                    {cate.map((cc) => (
                      <option key={cc._id} value={cc.category_name}>
                        {cc.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-5">
                  <label htmlFor="">
                    Products Name
                    <span className="text-danger" style={{ fontSize: 18 }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    onChange={(e) => mekeCode(e.target.value)}
                    placeholder="Products Name"
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-lg-3">
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

                <div className="col-lg-4">
                  <label htmlFor="">Description</label>
                  <textarea
                    name="desc"
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Description"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="">
                    Product Company
                    <span className="text-danger" style={{ fontSize: 16 }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    onChange={(e) => setProductCompany(e.target.value)}
                    placeholder="Product Company"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-2">
                  <label htmlFor="">Reward Points</label>
                  <input
                    type="number"
                    name="reward_pointd"
                    onChange={(e) => setRewardPoints(e.target.value)}
                    placeholder="Reward Points"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-lg-11">
                  {formValues.map((element, index) => (
                    <div className="row mt-1 position-relative" key={index}>
                      <div className="col-lg-2">
                        <input
                          ref={proSize}
                          type="text"
                          name="size"
                          placeholder="Size*"
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
                          type="number"
                          name="selling_price"
                          placeholder="Selling Price*"
                          className="form-control"
                          value={element.selling_price || ""}
                          onChange={(e) => handleChange(index, e)}
                          readOnly
                        />
                      </div>
                      <div className="col-lg-2">
                        <input
                          type="number"
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
                          <option value={""}>Select GST*</option>
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
                <div className="col-lg-2 mt-2">
                  <label htmlFor="">Dist. Commission</label>
                  <input
                    type="text"
                    name="commission"
                    className="form-control"
                    placeholder="Commission"
                    onChange={(e) => setCommission(e.target.value)}
                  />
                </div>
                <div className="col-lg-2 mt-2">
                  <label htmlFor="">Admin Commission</label>
                  <input
                    type="number"
                    name="Admin_Commission"
                    defaultValue={adminCommission}
                    onChange={(e) => setAdminCommission(e.target.value)}
                    placeholder="Admin Commission"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-3 mt-2">
                  <label htmlFor="">Guarantee (No. of Months)</label>
                  <input
                    type="number"
                    name="Guarantee"
                    onChange={(e) => setProductGuarantee(e.target.value)}
                    placeholder="Guarantee"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-3 mt-2">
                  <label htmlFor="">Warranty (No. of Months)</label>
                  <input
                    type="number"
                    name="warranty"
                    onChange={(e) => setProductWarranty(e.target.value)}
                    placeholder="Warranty"
                    className="form-control"
                  />
                </div>
                <div className="col-md-2 mt-2">
                  <label className="mb-0">Batch No</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Batch No"
                    onChange={(e) => setBatchNo(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mt-2">
                  <label className="mb-0">HSN No.</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="HSN No"
                    onChange={(e) => setHSNNo(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mt-2">
                  <label className="mb-0">Maf. Date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Manufacturing Date"
                    onChange={(e) => setMFD(e.target.value)}
                  />
                </div>
                <div className="col-lg-4 mt-2">
                  <label htmlFor="">Products Image</label>
                  <input
                    type="file"
                    name="product_img"
                    multiple
                    accept="image/*"
                    // onChange={(e) => setImage(e.target.files)}
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
                <div className="col-lg-6 mt-2">
                  <label htmlFor="">Video Link</label>
                  <input
                    type="text"
                    name="link"
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Video Link"
                    className="form-control"
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

export default AllProducts;
