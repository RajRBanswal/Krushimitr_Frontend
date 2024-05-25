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
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
function AllReports() {
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

  const getProductData = async () => {
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/all-orders"
    );
    const all_orders = await all_products.json();
    if (all_orders.status === 201) {
      all_orders.result.map((item) => {
        datas.push(item);
      });
      setFilterData(datas);
      setCompOrders(datas);
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
    let all_products = await fetch(
      "https://krushimitr.in/api/admin/get-orders",
      {
        method: "post",
        body: JSON.stringify({
          orderId: Id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const get_orders = await all_products.json();
    if (get_orders.status === 201) {
      setSingleData(get_orders.result);
      console.log(get_orders.result);
    } else {
      alert(get_orders.result);
    }
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
    { field: "orderTime", header: "Time" },
    { field: "finalAmount", header: "Amount" },
    { field: "paymentStatus", header: "Pay Status" },
    { field: "paymentMethod", header: "Pay Method" },
    { field: "distName", header: "Distributor Name" },
    { field: "orderStatus", header: "Order Status" },
    { field: "deliveryStatus", header: "Delivery Status" },
    { field: "deliveryDate", header: "Delivery Date" },
  ];

  // { field: "shippingAddress", header: "Shipping Address" },
  // { field: "distAddress", header: "Distributor Address" },

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
          <h4 className="m-0">Report</h4>
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
                  showDateWiseData(e.target.value);
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
    if (date2 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      // alert(newDate1, newDate2);
      compOrders.map((item) => {
        let newDate3 = moment(item.orderDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3._d).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterData(Datas);
    } else {
      return;
    }
  };

  const getItemData = (rowData) => {
    let xyz = JSON.parse(rowData.itemsData);
    let arr = [];
    for (let index = 0; index < xyz.length; index++) {
      let rr = index + 1 + "). Product: " + xyz[index].productName + ",   ";
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

  const gstCalculation = (rowData) => {
    let gstamt = 0;
    let itemData = JSON.parse(rowData.itemsData);
    itemData.map((item) => {
      let qtyprice = item.price * item.quantity;
      let res = (qtyprice * item.gst) / 100;
      gstamt += res;
    });
    return gstamt / 2;
  };

  const IGST = (rowData) => {
    let gstamt = 0;
    let itemData = JSON.parse(rowData.itemsData);
    itemData.map((item) => {
      let qtyprice = item.price * item.quantity;
      let res = (qtyprice * item.gst) / 100;
      gstamt += res;
    });
    return gstamt;
  };
  const gstPercent = (rowData) => {
    let gstamt = 0;
    let itemData = JSON.parse(rowData.itemsData);
    itemData.map((item) => {
      gstamt = item.gst + "%";
    });
    return gstamt;
  };
  const Amount = (rowData) => {
    let gstamt = 0;
    let itemData = JSON.parse(rowData.itemsData);
    itemData.map((item) => {
      let qtyprice = item.price * item.quantity;
      gstamt += qtyprice;
    });
    return gstamt;
  };
  const [sales, setSales] = useState("");
  const lastYearTotal = () => {
    let total = 0;
    filterData.map((item) => {
      let itemData = JSON.parse(item.itemsData);
      itemData.map((ele) => {
        let qtyprice = ele.price * ele.quantity;
        total += qtyprice;
      });
    });

    return "₹" + total;
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totals:"
          colSpan={8}
          footerStyle={{ textAlign: "right" }}
        />
        <Column footer={lastYearTotal} />
      </Row>
    </ColumnGroup>
  );
  const getDateTime = (rowData) => {
    return (
      <p className="mb-0 fw-bold" style={{ fontSize: 12 }}>
        {rowData.orderDate}
        <br />
        {rowData.orderTime}
      </p>
    );
  };

  return (
    <div className="">
      <Toast ref={toast} />

      <div className=" px-3 UserCardReports">
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
          footerColumnGroup={footerGroup}
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
            field="orderNumber"
            header="Order No."
            bodyStyle={{ color: "green", fontSize: 12, fontWeight: "bold" }}
          ></Column>
          <Column field="userName" header="Name" sortable></Column>
          <Column
            field={getDateTime}
            header="Date/Time"
            body={getDateTime}
            sortable
          ></Column>
          {/* <Column field="orderTime" header="Time" sortable></Column> */}
          <Column
            field={getItemData}
            header="Purchase Item"
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
            header="Pay Method"
            style={{ display: "none" }}
            bodyStyle={{ color: "green", fontWeight: "bold" }}
          ></Column>
          <Column
            field="paymentStatus"
            header="Pay Status"
            sortable
            bodyStyle={{ color: "green" }}
          ></Column>
          {/* <Column field={"distName"} header="Vender Name"></Column> */}

          <Column field={gstPercent} header="GST" body={gstPercent}></Column>
          <Column
            field={gstCalculation}
            header="SGST"
            body={gstCalculation}
          ></Column>
          <Column
            field={gstCalculation}
            header="CGST"
            body={gstCalculation}
          ></Column>
          <Column field={IGST} header="IGST" body={IGST}></Column>
          <Column field={Amount} header="FinalAmount" body={Amount}></Column>
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
            field="paymentType"
            header="PayMethod"
            bodyStyle={{ fontSize: 13 }}
          ></Column>
          <Column
            field="utrNo"
            header="UtrNo."
            bodyStyle={{ fontSize: 13 }}
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
                  let orderUser = JSON.parse(item.userData);
                  return (
                    <table className="table table-stripped table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Name : </td>
                          <td colSpan={2}>{item.userName}</td>
                          <td className="fw-bold text-danger text-nowrap">
                            Order Date : {item.orderDate}
                          </td>
                        </tr>
                        {orderUser && (
                          <tr>
                            <td className="fw-bold">Mobile No. : </td>
                            <td>{orderUser.mobile}</td>
                            <td className="fw-bold text-nowrap">Email :</td>
                            <td>{orderUser.email}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="fw-bold text-nowrap">
                            Payment Status :
                          </td>
                          <td className="fw-bold text-warning">
                            {item.paymentStatus === "Paid" ? (
                              <p className="text-success">
                                {item.paymentStatus}
                              </p>
                            ) : (
                              <p className="text-warning">
                                {item.paymentStatus}
                              </p>
                            )}
                          </td>
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
                                  <td>
                                    {item.price - (item.price * item.gst) / 100}
                                  </td>
                                  <td className="fw-bold text-nowrap">Size</td>
                                  <td>
                                    {item.size} {item.unit ? item.unit : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold text-nowrap">GST</td>
                                  <td>{item.gst}</td>
                                  <td className="fw-bold text-nowrap">
                                    GST Amount
                                  </td>
                                  <td>
                                    {(item.price * item.quantity * item.gst) /
                                      100}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={4}> </td>
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
                          <td></td>
                          <td></td>
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

export default AllReports;
