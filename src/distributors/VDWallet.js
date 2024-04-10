import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const VDWallet = () => {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState([]);
  const [showTransaction, setShowTransaction] = useState(false);
  const [distData, setDistData] = useState("");
  const [amount, setAmount] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    transactionDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    transactionId: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    orderId: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    type: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [globalFilter, setGlobalFilter] = useState(null);
  const distributor_id = localStorage.getItem("distributor_id");
  const distributorName = localStorage.getItem("distributor_name");

  const getTotal = () => {
    let total = 0;
    walletData.map((item) => {
      if (item.type === "Credit" && item.amountStatus === "Done") {
        total += parseInt(item.amount);
      } else if (item.type === "Debit" && item.amountStatus === "Done") {
        total -= parseInt(item.amount);
      }
    });
    return total;
  };
  const ref = useRef(null);

  const handleClick = () => {
    if (showTransaction === false) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
      setShowTransaction(true);
    } else {
      ref.current?.scrollIntoView({ behavior: "smooth" });
      setShowTransaction(false);
    }
  };

  const [date1, setDate1] = useState(null);
  const onGlobalFilterChange = (e) => {
    setDate1("");
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const showDateWiseData = (date2) => {
    if (date2 !== "") {
      let newDate1 = new Date(date1).toISOString();
      let newDate2 = new Date(date2).toISOString();
      let Datas = [];
      walletData.map((item) => {
        let newDate3 = moment(item.transactionDate, "DD-M-YYYY");
        let newDate4 = new Date(newDate3).toISOString();

        if (newDate4 >= newDate1 && newDate4 <= newDate2) {
          Datas.push(item);
        }
      });
      setFilterData(Datas);
    } else {
      return;
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      let result = await fetch(
        "https://krushimitr.in/api/distributor/distributor-profile",
        {
          method: "post",
          body: JSON.stringify({ distributor_id }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let res = await result.json();
      if (res.status === 201) {
        setDistData(res.distributor);
      } else {
        alert(res.message);
      }
    };
    getProfile();
    const getWalletData = async () => {
      const response = await fetch(
        "https://krushimitr.in/api/distributors/get-vendor-distributor-wallet"
      );
      const data = await response.json();
      if (data.status === 201) {
        let datas = [];
        data.result.map((item) => {
          if (item.dvId === distributor_id) {
            datas.push(item);
          }
        });
        setFilterData(datas);
        setWalletData(datas);
      } else {
        setWalletData([]);
      }
    };
    getWalletData();
  }, [distributor_id]);

  const TopupNow = async () => {
    const mobile = distData.mobile;
    const response = await fetch(
      "https://krushimitr.in/api/distributors/add-vendor-distributor-wallet",
      {
        method: "post",
        body: JSON.stringify({
          distId: distributor_id,
          distName: distributorName,
          price: amount,
          totalAmt: getTotal(),
          mobile: mobile,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    window.open(result.result, "_blank");
  };

  const getDateTime = (rowData) => {
    return (
      <p className="mb-0 fw-bold" style={{ fontSize: 12 }}>
        {rowData.transactionDate}
        <br />
        {rowData.transactionTime}
      </p>
    );
  };

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-3 d-flex">
          <h4 className="m-0">Wallet History</h4>
        </div>
        <div className="col-lg-4">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
        </div>
        <div className="col-lg-5 pe-2">
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
      </div>
    </div>
  );
  return (
    <div className="">
      <div className="iphone">
        <div className="header">
          <div className="header-summary w-50 ps-5">
            <div className="summary-text">My Balance</div>
            <div className="summary-balance">
              <i className="fa fa-rupee"></i> {getTotal()}.00
            </div>
          </div>
          <div className="user-profile w-50 text-end pe-5">
            <h3 className="text-white">{distributorName}</h3>
          </div>
        </div>
        <div className="content">
          <div className="card">
            <div className="row">
              {/* <div className="card-item">
                <span>Active Balance</span>
                <span>
                  <i className="fa fa-rupee"></i> {getTotal()}
                </span>
              </div>
              <div className="card-item">
                <span>My Save it</span>
                <span>
                  <i className="fa fa-rupee"></i> {getTotal()}
                </span>
              </div> */}
              <div className="col-lg-4 p-3">
                <div className="card-item text-center">
                  <div className="row">
                    <div className="col-lg-12">
                      <input
                        type="number"
                        className="form-control form-control-lg border-success rupeeText"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <i className="fas fa-rupee rupeeIcon"></i>
                    </div>
                    <div className="col-lg-12 mt-3">
                      <button
                        className="btn btn-outline-primary ms-1"
                        onClick={() => setAmount(1000)}
                      >
                        <i className="fas fa-rupee"></i>
                        1000
                      </button>
                      <button
                        className="btn btn-outline-primary ms-1"
                        onClick={() => setAmount(2000)}
                      >
                        <i className="fas fa-rupee"></i>
                        2000
                      </button>
                      <button
                        className="btn btn-outline-primary ms-1"
                        onClick={() => setAmount(5000)}
                      >
                        <i className="fas fa-rupee"></i>
                        5000
                      </button>
                    </div>
                    <div className="col-lg-12 mt-3">
                      <button
                        className="btn btn-outline-danger "
                        onClick={() => TopupNow()}
                      >
                        <i className="fas fa-upload"></i>
                        Top-up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4"></div>
              <div className="col-lg-4">
                <div className="card-item text-center">
                  <span>View Transaction</span>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleClick();
                    }}
                  >
                    <i className="fa fa-eye"></i> View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          "vendorWalletHistory " + (showTransaction ? "d-block" : "d-none")
        }
        ref={ref}
      >
        <div className=" px-2 ">
          <DataTable
            value={filterData}
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
              "orderId",
              "transactionDate",
              "transactionId",
              "type",
              "status",
            ]}
          >
            <Column
              field={getDateTime}
              header="Date/Time"
              body={getDateTime}
              sortable
            ></Column>
            <Column field="orderId" header="Order No." sortable></Column>
            <Column field="transactionId" header="TxnId" sortable></Column>
            <Column field="openingBalance" header="Ope.Amt" sortable></Column>
            <Column field="amount" header="Amount" sortable></Column>
            <Column
              field="type"
              header="Type"
              bodyStyle={{ fontWeight: "bold", color: "green" }}
              sortable
            ></Column>
            <Column field="reason" header="Reason" sortable></Column>
            <Column field="status" header="Status" sortable></Column>
          </DataTable>
          {/* <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">TransactionId</th>
                    <th scope="col">Date / Time</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">
                      Amount
                    </th>
                    <th scope="col" className="text-end">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {walletData.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <small className="text-success fw-bold">
                          {item.orderId}
                        </small>
                      </td>
                      <td>
                        <small className="text-success fw-bold">
                          {item.transactionId}
                        </small>
                      </td>
                      <td>
                        <small>
                          {item.transactionDate} /
                          {item.transactionDate !== undefined
                            ? item.transactionTime
                            : ""}
                        </small>
                      </td>
                      {item.type === "Credit" ? (
                        <td className="text-success">{item.type}</td>
                      ) : (
                        <td className="text-danger">{item.type}</td>
                      )}

                      <td>{item.amountStatus}</td>
                      {item.type === "Credit" ? (
                        <td className="text-end">
                          + <i className="fa fa-rupee"></i> {item.amount}
                        </td>
                      ) : (
                        <td className="text-danger text-end">
                          - <i className="fa fa-rupee"></i> {item.amount}
                        </td>
                      )}

                      <td className="">{item.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
        </div>
      </div>
    </div>
  );
};

export default VDWallet;
