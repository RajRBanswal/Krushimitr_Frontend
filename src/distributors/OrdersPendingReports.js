import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";
function OrdersPendingReports() {
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
      const [compOrders, setCompOrders] = useState([]);
      const [deleteUserDialog, setDeleteUserDialog] = useState(false);
      const [user, setUser] = useState(emptyProduct);
      const [selectedUsers, setSelectedUsers] = useState(null);
      const [globalFilter, setGlobalFilter] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const toast = useRef(null);
      const orderCmplt = useRef(null);
      let datas = [];
      const [filterData, setFilterData] = useState([]);
      let distr = localStorage.getItem("distributor_id");
      const [distributor, setDistributor] = useState(distr);
      const getProductData = async () => {
        let data = [];
        let all_products = await fetch("https://krushimitr.in/api/admin/all-orders");
        const all_orders = await all_products.json();
        if (all_orders.status === 201) {
          all_orders.result.map((item) => {
            if (distributor === item.vendorId && item.orderStatus === "Pending") {
              data.push(item);
            }
          });
          setFilterData(data);
          setCompOrders(data);
        } else {
          alert(all_orders.result);
        }
      };
    
      useEffect(() => {
        getProductData();
        setIsLoading(false);
      }, [isLoading]);
    
      const filterApplyTemplate = (options) => {
        return (
          <button
            type="button"
            className="btn btn-outline-primary w-100 btn-sm"
            onClick={() => {
              getOrderData(options._id);
              setSingleData("");
            }}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <i className="pi pi-eye"></i>
          </button>
        );
      };
    
      const [singleData, setSingleData] = useState("");
      const getOrderData = async (Id) => {
        let all_products = await fetch("https://krushimitr.in/api/admin/get-orders", {
          method: "post",
          body: JSON.stringify({
            orderId: Id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const get_orders = await all_products.json();
        setSingleData(get_orders.result);
      };
    
      const deleteProduct = async () => {
        let user_id = user._id;
        const delete_users = await fetch(
          "https://krushimitr.in/api/admin/delete-user",
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
    
      const exportCSVS = () => {
        orderCmplt.current.exportCSV();
      };
    
      const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
      };
    
      const rightToolbarTemplateCompleted = () => {
        return (
          <>
            <button
              //   label="Excel"
              //   icon="pi pi-file-excel"
              className="btn btn-outline-primary btn-sm"
              onClick={exportCSVS}
            >
              <i className="pi pi-file-excel"></i>{" "}
            </button>
            <button
              //   label="Pdf"
              //   icon="pi pi-file-pdf"
              className="ms-1 btn btn-outline-danger btn-sm"
              onClick={exportPdf}
            >
              <i className="pi pi-file-pdf"></i>{" "}
            </button>
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
      const [date1, setDate1] = useState(null);
      const headerComplete = (
        <div className="py-2">
          <div className="row">
            <div className="col-lg-4">
              <h4 className="m-0">Pending Report</h4>
            </div>
            <div className="col-lg-3">
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
            <div className="col-lg-3 ">
              <div className="row">
                <div className="col-lg-6">
                  <Calendar
                    value={date1}
                    onChange={(e) => setDate1(e.value)}
                    dateFormat="dd-mm-yy"
                    placeholder="From Date"
                  />
                </div>
                <div className="col-lg-6">
                  <Calendar
                    onChange={(e) => {
                      showDateWiseData(e.value);
                    }}
                    dateFormat="dd-mm-yy"
                    placeholder="To Date"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <Toolbar
                className="p-0 border-0"
                right={rightToolbarTemplateCompleted}
              ></Toolbar>
            </div>
          </div>
        </div>
      );
    
      const showDateWiseData = (date2) => {
        let newDate1 = new Date(date1);
        let newDate2 = new Date(date2);
        let Datas = [];
        // console.log(newDate1);
        compOrders.map((item) => {
          let newDate3 = moment(item.orderDate, "DD-MM-YYYY");
          let newDate4 = new Date(newDate3._d);
    
          if (newDate4 >= newDate1 && newDate4 <= newDate2) {
            Datas.push(item);
          }
        });
        setFilterData(Datas);
      };
    
      const getItemData = (rowData) => {
        let xyz = JSON.parse(rowData.itemsData);
        let arr = [];
        for (let index = 0; index < xyz.length; index++) {
          let rr =
            index +
            1 +
            "). Product: " +
            xyz[index].productName +
            ", Price: " +
            xyz[index].price +
            ", Qty: " +
            xyz[index].quantity +
            ", Total: " +
            xyz[index].price * xyz[index].quantity +
            "    ";
          arr.push(rr);
        }
        return arr;
      };
    
      const distrBodyTemplate = (rowData) => {
        return rowData.distName ? (
          <p className="mb-0" style={{ fontSize: 13 }}>
            {rowData.distName}, {rowData.distMobile},
            <br />
            {rowData.distAddress}
          </p>
        ) : (
          ""
        );
      };
    
      return (
        <div className="p-3">
          <Toast ref={toast} />
    
          <div className="card px-3 UserCardReports">
            <DataTable
              ref={orderCmplt}
              value={filterData}
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
              {/* <Column
                field="orderNumber"
                header="Order No."
                bodyStyle={{ color: "green", fontSize: 12, fontWeight: "bold" }}
              ></Column> */}
              <Column field="userName" header="Name" sortable></Column>
              <Column field="orderDate" header="Date" sortable></Column>
              <Column field="orderTime" header="Time" sortable></Column>
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
                bodyStyle={{ color: "green" }}
              ></Column>
              {/* <Column
                field="shippingAddress"
                header="Shipping Address"
                style={{ minWidth: "16rem" }}
                sortable
              ></Column>
              <Column
                field={distrBodyTemplate}
                header="Distributor Name"
                body={distrBodyTemplate}
                bodyStyle={{ color: "red", fontWeight: "bold" }}
              ></Column> */}
              {/* <Column
                        field="distAddress"
                        header="Distributor Address"
                        style={{ display: "none" }}
                        bodyStyle={{ color: "green", fontWeight: "bold" }}
                      ></Column> */}
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
                              <td colSpan={4}>
                                <h5 className="my-2 text-info">Customer Details</h5>{" "}
                              </td>
                            </tr>
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
                                <h5 className="my-2 text-info">Products Details</h5>
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
                              <td colSpan={4}>
                                <h5 className="my-2 text-info">
                                  Price & Delivery Details
                                </h5>{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-dark fw-bold">Total Amount</td>
                              <td className="text-danger fw-bold">
                                {item.finalAmount}
                              </td>
                              <td className="text-dark fw-bold">Order Status</td>
                              <td className="text-success fw-bold">
                                {item.orderStatus}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-dark fw-bold">Delivery Date</td>
                              <td className="text-danger fw-bold">
                                {item.deliveryDate}
                              </td>
                              <td className="text-dark fw-bold">Delivery Status</td>
                              <td className="text-success fw-bold">
                                {item.deliveryStatus}
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

export default OrdersPendingReports