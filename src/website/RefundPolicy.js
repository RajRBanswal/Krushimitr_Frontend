import React from 'react'
import { Link } from 'react-router-dom'

function RefundPolicy() {
  return (
    <>
    {/* <!-- Hero Start --> */}
    <div className="container-fluid bg-primary py-5 bg-hero mb-3">
      <div className="container py-3">
        <div className="row justify-content-start">
          <div className="col-lg-8 text-center text-lg-start">
            <h1 className="display-1 text-white mb-md-4">Refund Policy</h1>
            <Link to="" className="btn btn-primary py-md-2 px-md-3 me-3">Home</Link>
            <Link to="" className="btn btn-secondary py-md-2 px-md-3">Refund Policy</Link>
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
              <h5 className="text-primary text-uppercase">Refund Policy</h5>
            </div>
            <p className="mb-4">When you make a transaction, or make a purchase, on our website, you need to exchange payment. At some point during the payment transaction your transaction failed for some reason or you purchased and returned a product. And reduced payments from your bank accounts, credit cards,</p>
            <p className="mb-4">In that case you inform us at shivaneribusiness@gmail.com, after we receive your mail we will process your payment within 5 to 7 working days and the payment will be refunded to the method you used to make the payment. Or the payment can also be refunded in Krishimatra app wallet as per your consent.</p>

            <p className="mb-4">You can use wallet payments for transactions within the Krishimatra app</p>
            <p className="mb-4">You need to have Full KYC to activate Krishimatra Wallet</p>
            <p className="mb-4">If you need immediate help regarding refund, you can contact our team at 9322192188.</p>
            
          </div>
        </div>
      </div>
    </div>
    {/* <!-- About End --> */}
  </>
  )
}

export default RefundPolicy