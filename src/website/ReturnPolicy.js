import React from 'react'
import { Link } from 'react-router-dom'

function ReturnPolicy() {
  return (
    <>
    {/* <!-- Hero Start --> */}
    <div className="container-fluid bg-primary py-5 bg-hero mb-3">
      <div className="container py-3">
        <div className="row justify-content-start">
          <div className="col-lg-8 text-center text-lg-start">
            <h1 className="display-1 text-white mb-md-4">Return Policy</h1>
            <Link to="" className="btn btn-primary py-md-2 px-md-3 me-3">Home</Link>
            <Link to="" className="btn btn-secondary py-md-2 px-md-3">Return Policy</Link>
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
              <h5 className="text-primary text-uppercase">Return Policy</h5>
            </div>
            <p className="mb-4">If you are not satisfied with our design, you can return the item to us within the given period.</p>
            <p className="mb-4 fw-bold">Following are the reasons for returning an item.</p>

            <p className="mb-4">1. Any technical defect in the product</p>
            <p className="mb-4">2. Product failure within the warranty period provided.</p>
            <p className="mb-4">3. You can place return order through our Krushimitr app.</p>
            <p className="mb-4">4. After placing the return order, our dealer will contact you and pick up your product within 3 to 4 days.</p>
            <p className='mb-4'>5. If the order is a replacement, the dealer will arrange the transport by third party courier or according to your product size and weight.</p>
            
          </div>
        </div>
      </div>
    </div>
    {/* <!-- About End --> */}
  </>
  )
}

export default ReturnPolicy