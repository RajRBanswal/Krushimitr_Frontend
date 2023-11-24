import React from 'react'
import { Link } from 'react-router-dom'

function ShipingPolicy() {
  return (
    <>
    {/* <!-- Hero Start --> */}
    <div className="container-fluid bg-primary py-5 bg-hero mb-3">
      <div className="container py-3">
        <div className="row justify-content-start">
          <div className="col-lg-8 text-center text-lg-start">
            <h1 className="display-1 text-white mb-md-4">Shipping Policy</h1>
            <Link to="" className="btn btn-primary py-md-2 px-md-3 me-3">Home</Link>
            <Link to="" className="btn btn-secondary py-md-2 px-md-3">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </div>
    {/* <!-- Hero End --> */}


    {/* <!-- About Start --> */}
    <div className="container-fluid about pt-5">
      <div className="container">
        <div className="row gx-5">
          <div className="col-lg-12 pb-5">
            <div className="mb-3 pb-2">
              <h5 className="text-primary text-uppercase">Shipping Policy</h5>
            </div>
            <p className="mb-4">After purchasing the product online, you will be sent the complete information of your order to your mobile number and mail. </p>
            <p className="mb-4">The payment options of your product will be decided by the dealer like COD/upi/credit/debit card etc.</p>

            <p className="mb-4">After purchasing the product online, your order is sent to the nearest dealer, the dealer gives you two options to reach your product on time, from which you can choose the option according to your convenience.</p>
            <p className="mb-4">Alternatively, you can get the product yourself from your nearest dealer.</p>
            <p className="mb-4">Another option would be if dealer can send it to you by third party courier (courier charges to be paid by customer) but if courier is not available to your location then you have to choose option one.</p>
            
          </div>
        </div>
      </div>
    </div>
    {/* <!-- About End --> */}
  </>
  )
}

export default ShipingPolicy