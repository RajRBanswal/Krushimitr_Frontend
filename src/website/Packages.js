import React, { useEffect, useState } from "react";

const Packages = () => {
  const [filterData, setFilterData] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPackages = async () => {
    let success = [];
    let all_package = await fetch(
      "https://krushimitr.in/api/admin/users-packages"
    );
    const allPack = await all_package.json();
    if (allPack.status === 201) {
      allPack.result.map((item) => {
        success.push(item);
      });
      setFilterData(allPack.result);
    } else {
      alert(allPack.result);
    }
  };

  useEffect(() => {
    getPackages();
  }, [getPackages]);
  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="mx-auto text-center mb-5" style={{ maxWidth: "500px" }}>
          <h6 className="text-primary text-uppercase">Package</h6>
          <h1 className="display-5">All Packages</h1>
        </div>
        <div className="row">
          {filterData.map((item) =>
            item.status === "Active" ? (
              <div className="col-lg-3 my-3">
                <div className="card h-100 shadow">
                  <div className="card-body p-0 productImage">
                    <img
                      src={`https://krushimitr.in/upload/${item.image}`}
                      style={{ margin: "auto" }}
                      width={"100%"}
                      alt={item.image}
                    />
                  </div>
                  <div className="px-2 py-3 text-center">
                    <h3 className="text-dark mb-0 text-center fw-bold">
                      {item.package_name}
                    </h3>
                    <p className="text-center">{item.description}</p>
                    <p className="text-success mb-1">Price : <i className="fa fa-rupee"></i> {item.price}</p>
                    <p className="text-danger mb-1">Duration :  {item.duration} Months</p>
                   
                  </div>
                  <div className="btn-action d-flex justify-content-center pb-3">
                    <button className="btn btn-outline-primary">Purchase Now</button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Packages;
