import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import moment from "moment";
function AllOrders() {
  let emptyProduct = {
    _id: null,
    name: "",
    email: null,
    mobile: "",
    address: null,
    city: 0,
    state: 0,
    pincode: 0,
  };
  const [products, setProducts] = useState([]);
  const [prod, setProd] = useState([]);
  const [compOrders, setCompOrders] = useState([]);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [user, setUser] = useState(emptyProduct);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);
  const orderCmplt = useRef(null);
  let data = [];
  let datas = [];
  let datass = [];
  const getProductData = async () => {
    let all_products = await fetch("https://krushimitr.in/admin/all-orders");
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        if (item.vendorId === "") {
          data.push(item);
        } else if (item.vendorId !== "" && item.orderStatus === "Done") {
          datass.push(item);
        } else if (item.orderStatus === "Pending") {
          datas.push(item);
        }
      });
      setProducts(data);
      setProd(datas);
      setCompOrders(datass);
    } else {
      setProducts(all_orders.result);
    }
  };
  useEffect(() => {
    getProductData();
    setIsLoading(false);
  }, [isLoading]);

  const filterApplyTemplate = (options) => {
    return (
      <div className="row">
        {/* <div className="col-lg-4">
          <Button
            type="button"
            icon="pi pi-pencil"
            onClick={() => alert(options.productName)}
            severity="primary"
          ></Button>
        </div> */}
        <div className="col-lg-4">
          <Button
            type="button"
            icon="pi pi-eye"
            onClick={() => getOrderData(options._id)}
            severity="success"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          ></Button>
        </div>
      </div>
    );
  };

  const [singleData, setSingleData] = useState("");
  const getOrderData = async (Id) => {
    let all_products = await fetch("https://krushimitr.in/admin/get-orders", {
      method: "post",
      body: JSON.stringify({
        orderId: Id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setSingleData(get_orders.result);
      console.log(get_orders.result);
    } else {
      alert(get_orders.result);
    }
  };

  const [distributor, setDistributor] = useState([]);
  const getAddressWiseVender = async (address) => {
    let add = address.split(",");
    console.log(add);
    let state = add[3].trim();
    let city = add[2].trim();
    let all_products = await fetch(
      "https://krushimitr.in/admin/get-address-wise-vender",
      {
        method: "post",
        body: JSON.stringify({
          state: state,
          city: city,
          pincode: add[4],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setDistributor(get_orders.result);
      console.log(get_orders.result);
    } else {
      alert(get_orders.result);
    }
  };

  const [selected, setSelected] = useState("");
  const sendToVendor = async (vendorData, item, id) => {
    setSelected(vendorData);
    let orderTransferDate = moment().format("DD-MM-YYYY");
    const adminId = localStorage.getItem("admin_id");
    const adminName = localStorage.getItem("admin_name");

    const distAddress =
      vendorData.address +
      ", " +
      vendorData.city +
      ", " +
      vendorData.state +
      ", " +
      vendorData.pincode +
      ".";
    const distName = vendorData.name;
    const distMobile = vendorData.mobile;
    let all_products = await fetch(
      "https://krushimitr.in/admin/send-to-vendor",
      {
        method: "post",
        body: JSON.stringify({
          vendorId: vendorData._id,
          distName: distName,
          distMobile: distMobile,
          distAddress: distAddress,
          orderId: id,
          adminId: adminId,
          adminName: adminName,
          orderData: item,
          orderTransferDate: orderTransferDate,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setIsLoading(true);
      alert(get_orders.result);
    } else {
      alert(get_orders.result);
    }
  };

  const [venderdata, setVendorData] = useState([]);
  const getVendorData = async (options) => {};

  const [distributors, setDistributors] = useState([]);

  const getDistributor = async (id) => {
    let all_products = await fetch(
      "https://krushimitr.in/distributor/distributor-profile",
      {
        method: "post",
        body: JSON.stringify({ distributor_id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setDistributors(get_orders.distributor);
    } else {
      alert(get_orders.message);
    }
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <div className="row">
        <div className="col-lg-12">
          <Button
            type="button"
            onClick={() => getDistributor(rowData.vendorId)}
            severity="success"
            className="btn btn-sm btn-primary"
            style={{ fontSize: "0px" }}
          >
            <i className="fa fa-eye" style={{ fontSize: "14px" }}></i>
          </Button>
          {distributors && (
            <>
              <p className="mb-0" style={{ fontSize: "14px" }}>
                {distributors.name}
              </p>
              <p className="mb-0" style={{ fontSize: "14px" }}>
                {distributors.mobile}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const deleteProduct = async () => {
    let user_id = user._id;
    const delete_users = await fetch(
      "https://krushimitr.in/admin/delete-user",
      {
        method: "POST",
        body: JSON.stringify({ user_id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await delete_users.json();
    console.log(response);
    if (response.status === 201) {
      setDeleteUserDialog(false);
      setUser(emptyProduct);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: response.result,
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "danger",
        summary: "Not Successful",
        detail: response.result,
        life: 3000,
      });
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportCSVS = () => {
    orderCmplt.current.exportCSV();
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const rightToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Excel"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
        <Button
          label="Pdf"
          icon="pi pi-file-pdf"
          className="ms-1 p-button-primary"
          onClick={exportPdf}
        />
      </>
    );
  };

  const rightToolbarTemplateCompleted = () => {
    return (
      <>
        <Button
          label="Excel"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSVS}
        />
        <Button
          label="Pdf"
          icon="pi pi-file-pdf"
          className="ms-1 p-button-primary"
          onClick={exportPdf}
        />
      </>
    );
  };

  const cols = [
    { field: "orderNumber", header: "Order No." },
    { field: "userName", header: "Name" },
    { field: "orderDate", header: "Date" },
    { field: "finalAmount", header: "Amount" },
    { field: "paymentStatus", header: "Pay Status" },
    { field: "paymentMethod", header: "Pay Method" },
    { field: "shippingAddress", header: "Shipping Address" },
    { field: "distName", header: "Distributor Name" },
    { field: "distAddress", header: "Distributor Address" },
    { field: "orderStatus", header: "Order Status" },
    { field: "deliveryStatus", header: "Delivery Status" },
    { field: "deliveryDate", header: "Delivery Date" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, compOrders);
        doc.save("users.pdf");
      });
    });
  };

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        className="ms-2"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">All Orders</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
      <Toolbar className="p-0" right={rightToolbarTemplate}></Toolbar>
    </div>
  );
  const headerComplete = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Completed Orders Users</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
      <Toolbar className="p-0 " right={rightToolbarTemplateCompleted}></Toolbar>
    </div>
  );

  const getItemData = (rowData) => {
    let xyz = JSON.parse(rowData.itemsData);
    let arr = [];
    for (let index = 0; index < xyz.length; index++) {
      let rr =
        index +
        1 +
        "). Name: " +
        xyz[index].productName +
        ", Price: " +
        xyz[index].price +
        ", Qty: " +
        xyz[index].quantity +
        ", Total: " +
        xyz[index].price * xyz[index].quantity +
        "\n";
      arr.push(rr);
    }
    return arr;
    // rowData.itemsData.map((item) => {
    // return xyz[0].productName;
    //  (
    //   <>
    //     <p className="mb-0">
    //       {item[0].productName} ({item[0].size + "" + item[0].unit})
    //     </p>
    //     <p className="mb-0">{item[0].price}</p>
    //     <p className="mb-0">{item[0].quantity}</p>
    //     <p className="mb-0">{item[0].price * item[0].quantity}</p>
    //   </>
    // );
    // });
  };

  return (
    <div className="p-3">
      <Toast ref={toast} />
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active "
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            <h5 className="mb-0">All Orders</h5>
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
            <h5 className="mb-0">All Sending to Distributor</h5>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-contact-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-contact"
            type="button"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
          >
            <h5 className="mb-0">Completed Orders</h5>
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
          <div className="card px-3 UserCard">
            <DataTable
              ref={dt}
              value={products}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
              globalFilter={globalFilter}
              header={header}
            >
              <Column
                field="orderNumber"
                header="Order No."
                bodyStyle={{ color: "green",fontSize:14}}
              ></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column
                field={getItemData}
                header="Purchase Item / Price / Qty / Total"
                body={getItemData}
                style={{ display: "none" }}
              ></Column>

              <Column
                field="finalAmount"
                header="Amount"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentMethod"
                header="Pay Status"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
              ></Column>
              <Column
                field="orderStatus"
                header="Order Status"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                header="Action"
                field="_id"
                style={{ minWidth: "4rem" }}
                body={filterApplyTemplate}
                severity="success"
              ></Column>
            </DataTable>
          </div>

          <Dialog
            visible={deleteUserDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirm"
            modal
            footer={deleteUserDialogFooter}
            onHide={hideDeleteUserDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  Are you sure you want to delete <b>{user.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <DataTable
            value={prod}
            sortMode="multiple"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "100%", boxShadow: "0 0 5px" }}
          >
            <Column field="userName" header="Name" sortable></Column>
            <Column field="orderDate" header="Date" sortable></Column>
            <Column field="paymentStatus" header="Pay Status" sortable></Column>
            <Column
              field="shippingAddress"
              header="Shipping Address"
              sortable
            ></Column>
            <Column
              field={"distName"}
              header="VenderDetails"
              // body={verifiedBodyTemplate}
              bodyStyle={{ color: "green" }}
            ></Column>
            <Column
              field="orderStatus"
              header="Status"
              bodyStyle={{ color: "green", fontWeight: "bold" }}
            ></Column>
          </DataTable>
        </div>
        <div
          className="tab-pane fade"
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <div className="card px-3 UserCard">
            <DataTable
              ref={orderCmplt}
              value={compOrders}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
              globalFilter={globalFilter}
              header={headerComplete}
            >
              <Column
                field="orderNumber"
                header="Order No."
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column
                field={getItemData}
                header="Purchase Item / Price / Qty / Total"
                body={getItemData}
                style={{ display: "none" }}
              ></Column>

              <Column
                field="finalAmount"
                header="Amount"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentMethod"
                header="Pay Status"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="paymentStatus"
                header="Pay Status"
                sortable
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="shippingAddress"
                header="Shipping Address"
                sortable
              ></Column>
              <Column
                field={"distName"}
                header="Distributor Name"
                // body={verifiedBodyTemplate}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="distAddress"
                header="Distributor Address"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="orderStatus"
                header="Order Status"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="deliveryStatus"
                header="Deli. Status"
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                field="deliveryDate"
                header="Deli Date"
                style={{ display: "none" }}
                bodyStyle={{ color: "green", fontWeight: "bold" }}
              ></Column>
              <Column
                header="Action"
                style={{ minWidth: "4rem" }}
                body={filterApplyTemplate}
                severity="success"
              ></Column>
            </DataTable>
          </div>

          <Dialog
            visible={deleteUserDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirm"
            modal
            footer={deleteUserDialogFooter}
            onHide={hideDeleteUserDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  Are you sure you want to delete <b>{user.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>

      <div
        className="modal fade "
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Order Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body orderData">
              {singleData &&
                singleData.map((item) => {
                  let orderSize = JSON.parse(item.itemsData);
                  return (
                    <table className="table table-stripped table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Name : </td>
                          <td>{item.userName}</td>
                          <td className="fw-bold text-nowrap">
                            Total Amount :{" "}
                          </td>
                          <td>{item.orderDate}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-nowrap">
                            Payment Status :
                          </td>
                          <td>{item.paymentStatus}</td>
                          <td className="fw-bold text-nowrap">
                            Shipping Address :
                          </td>
                          <td>{item.shippingAddress}</td>
                        </tr>
                        <tr>
                          <td colSpan={4}>
                            <h5>Products Details</h5>
                          </td>
                        </tr>

                        {orderSize &&
                          orderSize.map((item, index) => {
                            return (
                              <>
                                <tr>
                                  <td className="fw-bold text-nowrap">
                                    Product{" "}
                                    <span className="text-primary">
                                      {index + 1}
                                    </span>{" "}
                                    :
                                  </td>
                                  <td colSpan={2}>{item.productName}</td>
                                  <td className="fw-bold text-nowrap">
                                    {" "}
                                    Quantity : {item.quantity}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold text-nowrap">Price</td>
                                  <td>{item.price * item.quantity}</td>
                                  <td className="fw-bold text-nowrap">Size</td>
                                  <td>
                                    {item.size} {item.unit ? item.unit : ""}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        <tr>
                          <td className="text-danger fw-bold">Total Amount</td>
                          <td className="text-danger fw-bold">
                            {item.finalAmount}
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <div className="btn-group">
                              <button
                                type="button"
                                className="btn btn-warning dropdown-toggle btn-sm"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                onClick={() => {
                                  getAddressWiseVender(item.shippingAddress);
                                }}
                              >
                                Shipped to Distributor
                              </button>
                              <ul className="dropdown-menu">
                                {distributor &&
                                  distributor.map((ele) => {
                                    return (
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          to=""
                                          style={{
                                            borderBottom: "0.5px solid #b8b8b8",
                                          }}
                                          onClick={() => {
                                            sendToVendor(ele, item, item._id);
                                          }}
                                          data-bs-dismiss="modal"
                                        >
                                          {ele.name} ( {ele.address}, {ele.city}
                                          , {ele.pincode} )
                                        </Link>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                            {selected ? (
                              <label className="text-success">
                                {selected.name} ( {selected.address},
                                {selected.city}, {selected.pincode} )
                              </label>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                            >
                              Dispatch
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllOrders;
