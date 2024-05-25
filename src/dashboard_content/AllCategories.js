import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import moment from "moment";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

function AllCategories() {
  const [editDialog, setEditDialog] = useState(false);
  const [category_name, setCategory] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryEnglish, setCategoryEnglish] = useState("");
  const [isSet, setIsSet] = useState(false);
  const [quote, setQuote] = useState(false);
  const [update_name, setUpdateCategory] = useState("");
  const [image, setImage] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category_code: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    category_name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    category_en_name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    getCatName: {
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

  const storeCategory = async () => {
    const formData = new FormData();
    formData.append("category_name", category_name);
    formData.append("category_en_name", categoryEnglish);
    formData.append("category_code", categoryCode);

    formData.append("image", image);
    let results = await fetch("https://krushimitr.in/api/admin/add-category", {
      method: "post",
      body: formData,
    });
    let result = await results.json();

    if (result.status === 201) {
      alert(result.result);
      setIsSet(false);
      setCategory("");
      setQuote(true);
      window.location.reload();
    } else {
      alert(result.result);
    }
  };
  const refresh = () => window.location.reload(true);
  const updateCategory = async () => {
    const formData = new FormData();
    formData.append("update_name", update_name);
    formData.append("category_en_name", categoryEnglish);
    formData.append("category_code", categoryCode);
    formData.append("image", image);
    formData.append("id", editCategory._id);
    let resultUpdate = await fetch(
      "https://krushimitr.in/api/admin/update-category",
      {
        method: "POST",
        body: formData,
      }
    );
    let result = await resultUpdate.json();
    if (result.status === 201) {
      setCategory("");
      setCategoryCode("");
      setCategoryEnglish("");
      refresh();
      hideEditDialog();
      alert(result.result);
      setQuote(true);
    } else {
      alert(result.result);
    }
  };
  const DeleteOne = async (id) => {
    let resultDel = await fetch(
      "https://krushimitr.in/api/admin/delete-category",
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
      setQuote(true);
    } else {
      alert(resultDel.result);
    }
  };

  const [cate, setCate] = useState([]);
  const getCategoryData = async () => {
    let all_category = await fetch(
      "https://krushimitr.in/api/admin/all-category"
    );
    const getCat = await all_category.json();
    setFilterData(getCat.getCate);
    setCate(getCat.getCate);
  };
  useEffect(() => {
    getCategoryData();
    setQuote(false);
  }, [quote]);

  const getCategoryCode = (value) => {
    setCategoryEnglish(value);
    let code = value.slice(0, 3);
    if (code.length === 3) {
      let name = code.toUpperCase();
      let val = Math.floor(1000 + Math.random() * 9000);
      let finalCode = name + "-" + val;
      setCategoryCode(finalCode);
    }
  };

  const openNew = () => {
    setEditDialog(true);
  };
  const hideEditDialog = () => {
    setEditDialog(false);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onGlobalFilterChangeDate = (e) => {
    let dates = moment(e.target.value).format("DD-MM-YYYY");
    let _filters = { ...filters };
    _filters["global"].value = dates;
    setFilters(_filters);
    setGlobalFilterValue(dates);
  };

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-5 d-flex">
          <h4 className="m-0">ALL CATEGORIES</h4>
        </div>
        <div className="col-lg-5">
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
        <div className="col-lg-2">
          <button
            type="button"
            className="btn btn-primary float-end"
            data-bs-toggle="modal"
            onClick={() => setIsSet(true)}
            data-bs-target="#exampleModal"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
  const getCatName = (rowData) => {
    return (
      <p>
        {rowData.category_name} / {rowData.category_en_name}
      </p>
    );
  };
  const ImagesShow = (rowData) => (
    <img
      src={`https://krushimitr.in/upload/${rowData.category_image}`}
      width={"100px"}
      alt={rowData.category_image}
    />
  );
  const filterApplyTemplate = (options) => (
    <>
      <button
        type="button"
        className="btn btn-primary me-1"
        data-bs-toggle="modal"
        onClick={() => {
          setCategoryCode("");
          setEditCategory(options);
          setEditDialog(true);
        }}
        // data-bs-target={`#editModal` + options._id}
      >
        <i className="fas fa-edit"></i>
      </button>
      <button
        type="button"
        onClick={() => DeleteOne(options._id)}
        className="btn btn-danger"
      >
        <i className="fa fa-trash" aria-hidden="true"></i>
      </button>
    </>
  );
  const EditPriceDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideEditDialog}
      />
      <Button
        label="Update"
        icon="pi pi-check"
        className="ms-1"
        onClick={updateCategory}
      />
    </>
  );

  return (
    <>
      <div className="card p-3">
        <div className="table-responsive" style={{ overflow: "auto" }}>
          <DataTable
            value={filterData}
            dataKey="_id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Categories"
            globalFilter={globalFilter}
            header={headerComplete}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "category_code",
              "getCatName",
              "category_name",
              "category_en_name",
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
              field="category_code"
              header="Category Code"
              bodyStyle={{ fontWeight: "bold" }}
              sortable
            ></Column>
            <Column
              field="category_name"
              header="Category Code"
              style={{ display: "none" }}
              sortable
            ></Column>
            <Column
              field="category_en_name"
              header="Category Code"
              style={{ display: "none" }}
              sortable
            ></Column>
            <Column
              field={getCatName}
              header="Category Name"
              body={getCatName}
              sortable
            ></Column>
            <Column field="status" header="Image" body={ImagesShow}></Column>
            <Column
              header="Action"
              bodyStyle={{ width: "30%" }}
              body={filterApplyTemplate}
            ></Column>
          </DataTable>
        </div>
        <Dialog
          visible={editDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header={"Edit Package"}
          modal
          className="p-fluid"
          footer={EditPriceDialogFooter}
          onHide={hideEditDialog}
        >
          <div className="row">
            <label htmlFor="">
              Category Code :{" "}
              <strong>
                {editCategory.category_code === undefined ||
                editCategory.category_code === ""
                  ? categoryCode
                  : editCategory.category_code}
              </strong>
            </label>
          </div>
          <div className="row mt-3">
            <label htmlFor="">Category Name</label>
            <input
              type="text"
              defaultValue={editCategory.category_name}
              onChange={(e) => setUpdateCategory(e.target.value)}
              name="category"
              className="form-control"
            />
          </div>
          <div className="row mt-3">
            <label htmlFor="">
              Category Name{" "}
              <small className="text-danger">(English only)* </small>
            </label>
            <input
              type="text"
              name="category_name"
              defaultValue={editCategory.category_en_name}
              onChange={(e) => getCategoryCode(e.target.value)}
              placeholder="Category Name in English"
              className="form-control"
            />
          </div>
          <div className="row mt-3">
            <label htmlFor="">Category Image (Size : 100 * 100)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="form-control"
            />
          </div>
        </Dialog>
        <div
          className={`modal fade ${isSet ? "show" : ""} `}
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add Category
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <label htmlFor="">Category Name</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Category Name"
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="row mt-3">
                  <label htmlFor="">
                    Category Name{" "}
                    <small className="text-danger">(English only)* </small>
                  </label>
                  <input
                    type="text"
                    name="category_code"
                    onChange={(e) => getCategoryCode(e.target.value)}
                    placeholder="Category Code"
                    className="form-control"
                  />
                </div>
                <div className="row mt-3">
                  <label htmlFor="">Category Image (Size : 100 * 100)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={storeCategory}
                  className="btn btn-primary"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllCategories;
