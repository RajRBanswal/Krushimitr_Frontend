import { useParams } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
function SetCommission() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState([]);
  const [companyCommission, setCompanyCommission] = useState("");
  const [category, setCategory] = useState("");
  const [distributorCommission, setDistributorCommission] = useState("");
  const [vendorCommission, setVendorCommission] = useState("");

  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  const [filterData, setFilterData] = useState([]);
  const [editCommission, setEditCommission] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPackages = async () => {
    let all_package = await fetch(
      "https://krushimitr.in/api/admin/all-packages"
    );
    const allPack = await all_package.json();
    if (allPack.status === 201) {
      allPack.result.map((item) => {
        if (item._id === packageId) {
          setPackageData(item);
        }
      });
    } else {
      alert(allPack.result);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCommission = async () => {
    let all_commission = await fetch(
      "https://krushimitr.in/api/admin/all-commission/" + packageId
    );
    const allComm = await all_commission.json();
    if (allComm.status === 201) {
      setFilterData(allComm.result);
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
    getPackages();
    getCommission();
    getCategoryData();
  }, [getPackages, getCommission, getCategoryData]);

  const openNew = () => {
    setAddDialog(true);
  };

  const deletePackage = async (id) => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/delete-commission" + id
    );
    const result = await response.json();
    if (result.status === 201) {
      alert(result.result);
    } else {
      alert(result.result);
    }
  };
  const filterApplyTemplate = (options) => {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-info btn-sm "
          onClick={() => {
            setEditCommission(options);
            setEditDialog(true);
          }}
        >
          <i className="pi pi-pencil"></i>Edit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm ms-1"
          onClick={() => deletePackage(options._id)}
        >
          <i className="pi pi-trash"></i>Delete
        </button>
      </>
    );
  };
  const checkStatus = (rowData) => {
    if (rowData.status === "Active") {
      return <button className="btn btn-success btn-sm">Active</button>;
    } else {
      return <button className="btn btn-success btn-sm">Deactive</button>;
    }
  };

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-6">
          <div className="card px-3 py-1 bg-white">
            <p className="mb-0 fw-normal">
              <b className="text-primary">Package Name :</b>{" "}
              {packageData.package_name}{" "}
            </p>
            <p className="mb-0 fw-normal">
              <b className="text-primary">Package Price :</b>{" "}
              {packageData.price}{" "}
            </p>
            <p className="mb-0 fw-normal">
              <b className="text-primary">Package Date :</b> {packageData.date}{" "}
            </p>
          </div>
          <h4 className="my-1">All Commissions</h4>
        </div>
        <div className="col-lg-4">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="form-control ps-5"
            />
          </span>
        </div>
        <div className="col-lg-2">
          <button
            onClick={openNew}
            className="btn btn-outline-info btn-sm m-auto w-100"
          >
            {" "}
            Add Commission
          </button>
        </div>
      </div>
    </div>
  );
  const hideDialog = () => {
    setAddDialog(false);
  };
  const hideEditDialog = () => {
    setEditDialog(false);
  };

  const SaveData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/add-commission",
      {
        method: "post",
        body: JSON.stringify({
          packageId: packageData._id,
          packageName: packageData.package_name,
          packagePrice: packageData.price,
          category: category,
          companyCommission: companyCommission,
          // distributorCommission: distributorCommission,
          // vendorCommission: vendorCommission,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      setCompanyCommission("");
      // setDistributorCommission("");
      // setVendorCommission("");
      alert(result.result);
      hideDialog();
    } else {
      alert(result.result);
    }
  };
  const AddPriceDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="ms-1"
        onClick={SaveData}
      />
    </React.Fragment>
  );
  const UpdateData = async () => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/update-commission",
      {
        method: "post",
        body: JSON.stringify({
          id: editCommission._id,
          category: category,
          companyCommission: companyCommission,
          // distributorCommission: distributorCommission,
          // vendorCommission: vendorCommission,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      setCompanyCommission("");
      // setDistributorCommission("");
      // setVendorCommission("");
      hideEditDialog();
      alert(result.result);
    } else {
      alert(result.result);
    }
  };

  const EditPriceDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="me-1"
        outlined
        onClick={hideEditDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="ms-1"
        onClick={UpdateData}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />

      <div className="card px-3">
        <DataTable
          ref={orderCmplt}
          value={filterData}
          selection={successData}
          onSelectionChange={(e) => setSuccessData(e.value)}
          dataKey="_id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
          globalFilter={globalFilter}
          header={headerComplete}
        >
          <Column field="packageName" header="Package Name" sortable></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column field="category" header="Category" sortable></Column>
          <Column
            field="companyCommission"
            header="Company Comm (in %)"
            sortable
          ></Column>
          {/* <Column
            field="distributorCommission"
            header="Distributor Comm (in %)"
            sortable
          ></Column>
          <Column
            field="vendorCommission"
            header="Vendor Comm (in %)"
            sortable
          ></Column> */}
          <Column field="status" header="Status" body={checkStatus}></Column>
          <Column
            header="Action"
            bodyStyle={{ width: "30%" }}
            body={filterApplyTemplate}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        visible={addDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Add Package"}
        modal
        className="p-fluid"
        footer={AddPriceDialogFooter}
        onHide={hideDialog}
      >
        <div className="row">
          <div className="col-lg-12">
            <label>Category</label>
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
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
          <div className="col-lg-12 mt-2">
            <label>Package Name</label>
            <input
              type="text"
              className="form-control"
              value={packageData.package_name}
              readOnly
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              value={packageData.price}
              readOnly
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Company Commission (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Company Commission"
              onChange={(e) => setCompanyCommission(e.target.value)}
            />
          </div>
          {/* <div className="col-lg-12 mt-2">
            <label>Distributor Commission (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Distributor Commission"
              onChange={(e) => setDistributorCommission(e.target.value)}
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Vendor Commission (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Vendor Commission"
              onChange={(e) => setVendorCommission(e.target.value)}
            />
          </div> */}
        </div>
      </Dialog>
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
          <div className="col-lg-12">
            <label>Category</label>
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              className="form-control form-select"
            >
              <option value={editCommission && editCommission.category}>
                {editCommission && editCommission.category}
              </option>
              {cate.map((cc) => (
                <option key={cc._id} value={cc.category_name}>
                  {cc.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-12 mt-2">
            <label>Package Name</label>
            <input
              type="text"
              className="form-control"
              value={editCommission && editCommission.packageName}
              readOnly
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Price (in RS.)</label>
            <input
              type="number"
              className="form-control"
              value={editCommission && editCommission.packagePrice}
              readOnly
            />
          </div>

          <div className="col-lg-12 mt-2">
            <label>Company Commission (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Company Commission"
              onChange={(e) => setCompanyCommission(e.target.value)}
              defaultValue={editCommission && editCommission.companyCommission}
            />
          </div>
          {/* <div className="col-lg-12 mt-2">
            <label>Distributor Commission (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Distributor Commission"
              onChange={(e) => setDistributorCommission(e.target.value)}
              defaultValue={
                editCommission && editCommission.distributorCommission
              }
            />
          </div>
          <div className="col-lg-12 mt-2">
            <label>Vendor Commission (in %)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Vendor Commission"
              onChange={(e) => setVendorCommission(e.target.value)}
              defaultValue={editCommission && editCommission.vendorCommission}
            />
          </div> */}
        </div>
      </Dialog>
    </div>
  );
}

export default SetCommission;
