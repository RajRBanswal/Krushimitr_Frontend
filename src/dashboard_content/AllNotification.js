import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
function AllNotification() {
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const orderCmplt = useRef(null);
  const adminId = localStorage.getItem("admin_id");
  let success = [];
  const [filterData, setFilterData] = useState([]);
  const [editNotification, setEditNotification] = useState("");

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [notiId, setNotiId] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getNotificationData = async () => {
    let all_notification = await fetch(
      "https://krushimitr.in/api/admin/all-notifications"
    );
    const allNotification = await all_notification.json();
    if (allNotification.status === 201) {
      allNotification.result.map((item) => {
        success.push(item);
      });
      setFilterData(allNotification.result);
    } else {
      alert(allNotification.result);
    }
  };

  useEffect(() => {
    getNotificationData();
  }, [getNotificationData]);

  const openNew = () => {
    setAddDialog(true);
  };

  const deleteNotification = async (id) => {
    const response = await fetch(
      "https://krushimitr.in/api/admin/delete-notification",
      {
        method: "post",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      alert(result.result);
    } else {
      alert(result.result);
    }
  };
  const filterApplyTemplate = (options) => {
    // console.log(options);
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => deleteNotification(options._id)}
        >
          <i className="pi pi-trash"></i>
        </button>
        <button
          type="button"
          className="btn btn-outline-info btn-sm ms-1"
          onClick={() => {
            setEditNotification(options);
            setNotiId(options._id);
            setEditDialog(true);
          }}
        >
          <i className="pi pi-pencil"></i>
        </button>
      </>
    );
  };

  const headerComplete = (
    <div className="py-2">
      <div className="row">
        <div className="col-lg-6 d-flex">
          <h4 className="m-0">All Notifications</h4>
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
            <i className="pi pi-plus"></i> Add
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
      "https://krushimitr.in/api/admin/add-notification",
      {
        method: "post",
        body: JSON.stringify({ date, title, subject, message, link, adminId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
      alert(result.result);
      hideDialog();
      setDate("");
      setTitle("");
      setSubject("");
      setMessage("");
      setLink("");
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
      "https://krushimitr.in/api/admin/update-notification",
      {
        method: "post",
        body: JSON.stringify({ notiId, date, title, subject, message, link }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.status === 201) {
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

      <div className="card px-3 UserCardReports">
        <DataTable
          ref={orderCmplt}
          value={filterData}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
          globalFilter={globalFilter}
          header={headerComplete}
        >
          <Column field="noti_date" header="Date" sortable></Column>
          <Column field="user_name" header="Name" sortable></Column>
          <Column field="noti_title" header="Title" sortable></Column>
          <Column field="noti_subject" header="Subject" sortable></Column>
          <Column field="noti_message" header="Message" sortable></Column>
          <Column
            header="Action"
            body={filterApplyTemplate}
            severity="success"
          ></Column>
        </DataTable>
      </div>
      <Dialog
        visible={addDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Add Notification"}
        modal
        className="p-fluid"
        footer={AddPriceDialogFooter}
        onHide={hideDialog}
      >
        <div className="row">
          <div className="col-lg-4">
            <label>Date</label>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              dateFormat="dd-mm-yy"
              placeholder="Date"
            />
          </div>

          <div className="col-lg-8">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-12">
            <label>Subject</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Subject"
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-12">
            <label>Message</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Enter Subject"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-12">
            <label>
              Link <small>(Optional)</small>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Link"
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={editDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={"Edit Notification"}
        modal
        className="p-fluid"
        footer={EditPriceDialogFooter}
        onHide={hideEditDialog}
      >
        <div className="row">
          <div className="col-lg-4">
            <label>Date</label>
            <Calendar
              value={editNotification.noti_date}
              onChange={(e) => setDate(e.value)}
              dateFormat="dd-mm-yy"
              placeholder={editNotification.noti_date}
            />
          </div>

          <div className="col-lg-8">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
              defaultValue={editNotification.noti_title}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-12">
            <label>Subject</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Subject"
              onChange={(e) => setSubject(e.target.value)}
              defaultValue={editNotification.noti_subject}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-12">
            <label>Message</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Enter Subject"
              onChange={(e) => setMessage(e.target.value)}
            >
              {editNotification.noti_message}
            </textarea>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-12">
            <label>
              Link <small>(Optional)</small>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Link"
              onChange={(e) => setLink(e.target.value)}
              defaultValue={editNotification.noti_link}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default AllNotification;
