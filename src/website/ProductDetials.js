import React from "react";

function ProductDetials() {
  return (
    <div className="container mt-3">
      <h1 className="text-center">Product Detials</h1>
      <section className="py-5 container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      src="https://krushimitr.in/upload/1.jpg"
                      className="img-fluid"
                      alt="product"
                      width={{width:'100%'}}
                    />
                  </div>
                  <div className="col-md-8">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th scope="row">Product Name</th>
                          <td>: Product Name</td>
                          <th scope="row"></th>
                          <td></td>
                        </tr>
                        <tr>
                          <th scope="row">Price</th>
                          <td>: 2000</td>
                          <th scope="row">Weight</th>
                          <td>: 100g</td>
                        </tr>
                        <tr>
                          <th scope="row">Total</th>
                          <td>: 2000</td>
                          <th scope="row">Remove</th>
                          <td>: <i className="fa fa-trash text-danger"></i></td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <button className="btn btn-primary">-</button>
                            <input type="text" value="1" />
                            <button className="btn btn-primary">+</button>
                          </th>
                          <th scope="row" colSpan={2}></th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetials;
