import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

function AllSarkariYojna() {
  const [time, setTime] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [allYojna, setAllYojna] = useState([]);
  const [link, setLink] = useState([]);

  const storeYojna = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("link", link);
    const result = await fetch(
      "https://krushimitr.in/admin/add-sarkari-yojna",
      {
        method: "POST",
        body: formData,
      }
    ).then((result) => result.json());
    if (result.status === 201) {
      setIsSet(true);
      setTime(true);
      alert(result.result);
    } else {
      alert(result.result);
    }
  };
  const DeleteOne = async (id) => {
    let resultDel = await fetch(
      "https://krushimitr.in/admin/delete-sarkari-yojna",
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
      setIsSet(true);
      setTime(true);
      alert(resultDel.result);
    } else {
      alert(resultDel.result);
    }
  };
  const getSYojnaData = async () => {
    const result = await fetch(
      "https://krushimitr.in/admin/get-sarkari-yojna"
    ).then((result) => result.json());
    setAllYojna(result.getSYojna);
  };
  useEffect(() => {
    getSYojnaData();
    setTime(false);
  }, [isSet]);
  return (
    <>
      <div className="card p-3">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="text-uppercase">All Sarkari Yojna</h2>
          </div>
          <div className="col-lg-4">
            <button
              type="button"
              className="btn btn-primary float-end"
              data-bs-toggle="modal"
              onClick={() => setIsSet(true)}
              data-bs-target="#exampleModal"
            >
              Add Sarkari Yojna
            </button>
          </div>
        </div>
        <hr />

        <div className="table-responsive" style={{ overflow: "auto" }}>
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">Yojna</th>
                <th scope="col">Description</th>
                <th scope="col">Link</th>
                <th scope="col">Image</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {allYojna.map((sy) => (
                <tr key={sy._id}>
                  <td>{sy.title}</td>
                  <td>{sy.description}</td>
                  <td>{sy.link}</td>
                  <td>
                    <img
                      src={`https://krushimitr.in/upload/${sy.image}`}
                      width={"100px"}
                      alt={sy.title}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-1"
                      data-bs-toggle="modal"
                      data-bs-target={`#editModal` + sy._id}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => DeleteOne(sy._id)}
                      className="btn btn-danger btn-sm me-1"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className={`modal fade ${isSet ? "show" : ""} `}
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-secondary py-2">
                <h1
                  className="modal-title fs-5 text-white"
                  id="exampleModalLabel"
                >
                  Add Sarkari Yojna
                </h1>
                <button
                  type="button"
                  className="btn-close text-white pt-4"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-lg-6">
                    <label htmlFor="">Title </label>
                    <input
                      type="text"
                      name="productName"
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-lg-6">
                    <label htmlFor=""> Link</label>
                    <input
                      type="text"
                      name="news_link"
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="News Link"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8">
                    <label htmlFor="">Description</label>
                    <textarea
                      name="desc"
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      className="form-control"
                    ></textarea>
                  </div>
                  <div className="col-lg-4">
                    <label htmlFor=""> Image</label>
                    <input
                      type="file"
                      name="product_img"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      placeholder="Product Image"
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
                  onClick={storeYojna}
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
    </>
  );
}

export default AllSarkariYojna;
