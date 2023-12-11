import React from "react";
import mobileApp from '../images/mobile-app.png';
import cservice from '../images/customer-service.png';
import homedelivery from '../images/food-delivery.png';
import logos from "../images/logo.png";
import techn from '../images/technician.png';
function Services() {
  return (
    <>
      <div className="container-fluid py-5">
        <div className="container">
          <div
            className="mx-auto text-center mb-5"
            style={{ maxWidth: "500px" }}
          >
            {/* <h6 className="text-primary text-uppercase">Services</h6> */}
            <h1 className="display-5">Services</h1>
          </div>
          <div className="row ">
            <div className="col-lg-4">
              <img src={logos} alt="" width={"80%"} />
            </div>
            <div className="col-lg-8">
              <p>
                Shivneri Business is a state-of-the-art agri technology company,
                we help millions of farmers across the country to live a happy
                life, and strive to grow new farming technologies, increase
                productivity, and grow safe and sustainable food.
              </p>
              <p>Billing and Stock Management Software </p>
              <p>
                Sophisticated billing and stock management software for
                merchants to manage their shops, our billing software services
                facilitate the tasks of merchants, digitally transferring bills
                to their customers, managing their payments, etc. through
                billing software.
              </p>
            </div>
          </div>
        </div>
        <div className="row mt-5 p-5">
          <div className="col-lg-3">
            <div className="card px-2 py-5 text-center">
              <img
                src={mobileApp}
                className="m-auto mainService"
                alt=""
              />
              <h4 className="mb-3 mt-3">Krishimitr Mobile App</h4>
              <p className="mb-0">
                Krishimitr Mobile App is a state-of-the-art mobile app for
                farmers to buy and sell agricultural commodities and provide
                other agricultural information.
              </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card px-2 py-5 text-center">
              <img
                src={homedelivery}
                className="m-auto mainService"
                alt=""
              />
              <h4 className="mb-3 mt-3">Courier Service</h4>
              <p className="mb-0">
                We will have courier service to deliver the material to be sold
                by farmers. In this we are dealing with Indian Postal Service
                and other private companies
              </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card px-2 py-5 text-center">
              <img
                src={cservice}
                className="m-auto mainService"
                alt=""
              />
              <h4 className="mb-3 mt-3">Help Center</h4>
              <p className="mb-0">
                Our help center is open 24*7 for farmers and merchants. In that,
                the customer can get help through both our mail service and call
                service
              </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card px-2 py-5 text-center">
              <img
                src={techn}
                className="m-auto mainService"
                alt=""
              />
              <h4 className="mb-3 mt-3">Mechanic Services</h4>
              <p className="mb-0">
                We have started this facility for farmers. In case of any
                technical failure in the farmers' machinery, our mechanical
                service will be available 24*7
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
