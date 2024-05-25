import React, { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import UserLogin from "./auth/UserLogin";
import UserRegister from "./auth/UserRegister";
import MainContent from "./components/MainContent";
import AllApplicationForm from "./dashboard_content/AllApplicationForm";
import AllCategories from "./dashboard_content/AllCategories";
import AllProducts from "./dashboard_content/AllProducts";
import AllSarkariYojna from "./dashboard_content/AllSarkariYojna";
import AllServices from "./dashboard_content/AllServices";
import AllSlider from "./dashboard_content/AllSlider";
import AllUsers from "./dashboard_content/All_Users";
import Dashboard from "./dashboard_content/Dashboard";
import EditProduct from "./dashboard_content/EditProduct";
import News from "./dashboard_content/News";
import DistributorDashboard from "./distributors/DistributorDashboard";
import DistributorsMain from "./distributors/DistributorsMain";
import DashboardU from "./user_panel/Dashboard";
import UserPanel from "./user_panel/UserPanel";
import About from "./website/About";
import ApplyEKrushimitr from "./website/ApplyEKrushimitr";
import Cart from "./website/Cart";
import Contact from "./website/Contact";
import Home from "./website/Home";
import Main from "./website/Main";
import PrivacyPolicy from "./website/PrivacyPolicy";
import ProductDetials from "./website/ProductDetials";
import Products from "./website/Products";
import RefundPolicy from "./website/RefundPolicy";
import ReturnPolicy from "./website/ReturnPolicy";
import ScrollToTop from "./website/ScrollToTop";
import ShipingPolicy from "./website/ShipingPolicy";
import TermsAndCondition from "./website/TermsAndCondition";
import AllOrders from "./dashboard_content/AllOrders";
import EditOrder from "./distributors/EditOrder";
import AllDistributors from "./dashboard_content/AllDistributors";
import Services from "./website/Services";
import Checkout from "./website/Checkout";
import UserAllOrders from "./user_panel/UserAllOrders";
import PlaceOrder from "./distributors/PlaceOrder";
import CustomerOrders from "./distributors/CustomerOrders";
import DistributorOrders from "./distributors/DistributorOrders";
import DonationForm from "./website/DonationForm";
import ProductDetail from "./website/ProductDetail";
import UserWallet from "./user_panel/UserWallet";
import Invoice from "./common/Invoice";
import DistributorProfile from "./distributors/DistributorProfile";
import ProductAll from "./dashboard_content/ProductAll";
import Categories from "./distributors/Categories";
import DProducts from "./distributors/Products";
import ProductEdit from "./distributors/ProductEdit";
import AllReports from "./dashboard_content/AllReports";
import OrderCompletedReports from "./dashboard_content/OrderCompletedReports";
import AdminInvoice from "./common/AdminInvoice";
import PendingOrdersReports from "./dashboard_content/PendingOrdersReports";
import DVAllReports from "./distributors/DVAllReports";
import ComplateOrderReports from "./distributors/ComplateOrderReports";
import OrdersPendingReports from "./distributors/OrdersPendingReports";
import DAllUsers from "./distributors/DAllUsers";
import PaymentStatus from "./website/PaymentStatus";
import AllTransaction from "./dashboard_content/AllTransaction";
import WalletManagement from "./dashboard_content/WalletManagement";
import RewardPointsCalci from "./dashboard_content/RewardPointsCalci";
import RedeemRequest from "./dashboard_content/RedeemRequest";
import AllRentPayData from "./dashboard_content/AllRentPayData";
import AllNotification from "./dashboard_content/AllNotification";
import AllVendor from "./dashboard_content/AllVendor";
import RentPayCharges from "./dashboard_content/RentPayCharges";
import AllPackages from "./dashboard_content/AllPackages";
import SetCommission from "./dashboard_content/SetCommission";
import VDWallet from "./distributors/VDWallet";
import VDPaymentStatus from "./distributors/VDPaymentStatus";
import ForgotPassword from "./auth/ForgotPassword";
import AdminWallet from "./dashboard_content/AdminWallet";
import VDWalletManagement from "./dashboard_content/VDWalletManagement";
import UsersWalletReports from "./dashboard_content/UsersWalletReports";
import VendorDistributorWalletReports from "./dashboard_content/VendorDistributorWalletReports";
import AdminWalletReports from "./dashboard_content/AdminWalletReports";
import VDWalletsReports from "./distributors/VDWalletsReports";
import PlaceOrderForCustomer from "./distributors/PlaceOrderForCustomer";
import StockManagement from "./distributors/StockManagement";
import EnquiryForm from "./distributors/EnquiryForm";
import AllEnquiries from "./dashboard_content/AllEnquiries";
import OtherSettings from "./dashboard_content/OtherSettings";
import CommissionData from "./distributors/CommissionData";
import AllOrdersForCustomers from "./distributors/AllOrdersForCustomers";
import AllCustomerOrders from "./distributors/AllCustomerOrders";
import DistAllReport from "./distributors/DistAllReport";
import DistCompleteOrdersReports from "./distributors/DistCompleteOrdersReports";
import DistPendingOrderReports from "./distributors/DistPendingOrderReports";
import UserPackages from "./dashboard_content/UserPackages";
import DistributorsPackages from "./dashboard_content/DistributorsPackages";
import PurchasePlan from "./user_panel/PurchasePlan";
import AllPrimeMember from "./dashboard_content/AllPrimeMember";
import DistPurchasePlan from "./distributors/DistPurchasePlan";
import AllCustomers from "./distributors/AllCustomers";
import UserProfile from "./user_panel/UserProfile";
import AllSliderTwo from "./dashboard_content/AllSliderTwo";
import AllPrimeDistributors from "./dashboard_content/AllPrimeDistributors";
import AllPrimeVendors from "./dashboard_content/AllPrimeVendors";
import RequestAccountDelete from "./website/RequestAccountDelete";

function App() {
  const ref = React.useRef();

  const myRef = useRef(null);

  const handleScroll = () => {
    if (!ref.current) return;
    if (ref.current.getBoundingClientRect().y <= -1000 || null) {
      console.log(ref.current.getBoundingClientRect().y);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes ref={myRef}>
        <Route path="invoice" name="Invoice" Component={Invoice} />
        <Route
          path="admin-invoice"
          name="Admin-Invoice"
          Component={AdminInvoice}
        />
        <Route exact path="/" Component={Main}>
          <Route index Component={Home} />
          <Route path="/about-us" Component={About} />
          <Route path="/contact" Component={Contact} />
          <Route path="/service" Component={Services} />
          <Route path="/product" Component={Products} />
          <Route path="/blog" Component={Contact} />
          <Route path="/payment-status/:Ids" Component={PaymentStatus} />
          <Route path="/terms-and-condition" Component={TermsAndCondition} />
          <Route path="/privacy-policy" Component={PrivacyPolicy} />
          <Route path="/products/:name" Component={Products} />
          <Route path="/apply-ekrushimitr" Component={ApplyEKrushimitr} />
          <Route path="/login" Component={UserLogin} />

          <Route path="/shipping-policy" Component={ShipingPolicy} />
          <Route path="/refund-policy" Component={RefundPolicy} />
          <Route path="/return-policy" Component={ReturnPolicy} />
          <Route path="/user-register" Component={UserRegister} />
          <Route path="/product-details" Component={ProductDetials} />
          <Route path="/account-delete-request" Component={RequestAccountDelete} />
          <Route
            path="/product-details/:pid/:name"
            Component={ProductDetials}
          />
          <Route path="/cart-details" Component={Cart} />
          <Route path="/checkout" Component={Checkout} />
          <Route path="/donation-form" Component={DonationForm} />
          <Route
            path="/product-detail/:id/:user_id"
            Component={ProductDetail}
          />
        </Route>
        <Route path="/forgot-password/:userType" Component={ForgotPassword} />
        <Route path="/users" Component={UserPanel}>
          <Route path="user-dashboard" Component={DashboardU} />
          <Route path="user-orders" Component={UserAllOrders} />
          <Route path="user-wallet" Component={UserWallet} />
          <Route path="purchase-plan" Component={PurchasePlan} />
          <Route path="users-profile" Component={UserProfile} />
        </Route>
        <Route path="/admin_login" Component={Login} />
        <Route path="/admin" Component={MainContent}>
          <Route index Component={Dashboard} />
          <Route
            path="all-services"
            name="All-Services"
            Component={AllServices}
          />
          <Route
            path="all-categories"
            name="All-Categories"
            Component={AllCategories}
          />
          <Route path="all-users" name="All-Users" Component={AllUsers} />
          <Route
            path="all-products"
            name="All-Products"
            Component={AllProducts}
          />
          <Route
            path="edit-product/:id"
            name="Edit-Product"
            Component={EditProduct}
          />
          <Route path="all-slider" name="All-Slider" Component={AllSlider} />
          <Route
            path="all-slider-two"
            name="All-Slider-Two"
            Component={AllSliderTwo}
          />
          <Route path="all-news" name="All-News" Component={News} />
          <Route
            path="all-application-form"
            name="All-Application-Form"
            Component={AllApplicationForm}
          />
          <Route
            path="all-sarkari-yojna"
            name="All-Sarkari-Yojna"
            Component={AllSarkariYojna}
          />
          <Route path="all-orders" name="All-Orders" Component={AllOrders} />
          <Route
            path="all-distributor"
            name="All-Distributor"
            Component={AllDistributors}
          />
          <Route path="all-vendor" name="All-Vendor" Component={AllVendor} />
          <Route
            path="demo-products"
            name="All-Demo-Products"
            Component={ProductAll}
          />
          <Route
            path="all-orders-reports"
            name="All-Orders-Reports"
            Component={AllReports}
          />
          <Route
            path="orders-complated-reports"
            name="Orders-Complated-Reports"
            Component={OrderCompletedReports}
          />
          <Route
            path="orders-pending-reports"
            name="Orders-Pending-Reports"
            Component={PendingOrdersReports}
          />
          <Route
            path="all-transaction"
            name="All-Transaction"
            Component={AllTransaction}
          />
          <Route
            path="wallet-management"
            name="Wallet-Management"
            Component={WalletManagement}
          />
          <Route
            path="reward-points-calci"
            name="Reward-Points-Calci"
            Component={RewardPointsCalci}
          />
          <Route
            path="redeem-request"
            name="Redeem Request"
            Component={RedeemRequest}
          />
          <Route
            path="all-rent-pay-data"
            name="All Rent Pay Data"
            Component={AllRentPayData}
          />
          <Route
            path="all-notifications"
            name="All Notifications"
            Component={AllNotification}
          />
          <Route
            path="rent-pay-charges"
            name="Rent Pay Charges"
            Component={RentPayCharges}
          />
          <Route
            path="manage-packages"
            name="Manage Packages"
            Component={AllPackages}
          />
          <Route
            path="set-commission/:packageId"
            name="Set Commission"
            Component={SetCommission}
          />
          <Route
            path="admin-wallet"
            name="Admin Wallet"
            Component={AdminWallet}
          />
          <Route
            path="vd-wallet-management"
            name="Vendor/Distributor Wallet"
            Component={VDWalletManagement}
          />
          <Route
            path="admin-wallet-reports"
            name="Vendor/Distributor Wallet Reports"
            Component={AdminWalletReports}
          />
          <Route
            path="users-wallet-reports"
            name="Users Wallet Reports"
            Component={UsersWalletReports}
          />
          <Route
            path="vendor-distributor-wallet-reports"
            name="Vendor Distributor Wallet Reports"
            Component={VendorDistributorWalletReports}
          />
          <Route
            path="all-enquiries"
            name="All Enquiries"
            Component={AllEnquiries}
          />
          <Route
            path="other-settings"
            name="Other Settings"
            Component={OtherSettings}
          />
          <Route
            path="users-packages"
            name="Users Packages"
            Component={UserPackages}
          />
          <Route
            path="distributors-packages"
            name="Distributors Packages"
            Component={DistributorsPackages}
          />
          <Route
            path="all-prime_member"
            name="All-Prime-Member"
            Component={AllPrimeMember}
          />
          <Route
            path="all-prime_distributor"
            name="All-Prime-Distributor"
            Component={AllPrimeDistributors}
          />
          <Route
            path="all-prime_vendor"
            name="All-Prime-Vendor"
            Component={AllPrimeVendors}
          />

          {/* all-sarkari-yojna */}
        </Route>
        <Route path="/distributors" Component={DistributorsMain}>
          <Route index Component={DistributorDashboard} />
          <Route
            path="allcategories"
            name="AllCategories"
            Component={Categories}
          />
          <Route path="allusers" name="AllUsers" Component={DAllUsers} />
          <Route
            path="all-customers"
            name="AllCustomers"
            Component={AllCustomers}
          />
          <Route path="allproducts" name="AllProducts" Component={DProducts} />
          <Route
            path="product-edit/:id"
            name="ProductEdit"
            Component={ProductEdit}
          />
          <Route
            path="customer-orders"
            name="CustomersOrders"
            Component={CustomerOrders}
          />
          <Route
            path="edit-orders/:order_id"
            name="EditOrder"
            Component={EditOrder}
          />
          <Route
            path="place-orders"
            name="PlaceOrders"
            Component={PlaceOrder}
          />
          <Route
            path="all-orders"
            name="AllOrders"
            Component={DistributorOrders}
          />
          <Route
            path="all-customer-orders"
            name="AllCustomersOrders"
            Component={AllCustomerOrders}
          />
          <Route
            path="shop-details"
            name="ShopDetails"
            Component={DistributorProfile}
          />
          <Route
            path="orders_complate_reports"
            name="Orders_Complate_Reports"
            Component={ComplateOrderReports}
          />
          <Route
            path="all_orders_reports"
            name="All_Orders_Reports"
            Component={DVAllReports}
          />
          <Route
            path="distributors-orders-reports"
            name="Distributors Orders Reports"
            Component={DistAllReport}
          />
          <Route
            path="distributors-complete-orders-reports"
            name="Distributors Complete Orders Reports"
            Component={DistCompleteOrdersReports}
          />
          <Route
            path="distributors-pending-orders-reports"
            name="Distributors Pending Orders Reports"
            Component={DistPendingOrderReports}
          />

          <Route
            path="orders_pending_reports"
            name="Prders_Pending_Reports"
            Component={OrdersPendingReports}
          />
          <Route path="vd-wallet" name="VD Wallet" Component={VDWallet} />
          <Route
            path="payment-status/:status/:txnId"
            name="Payment Status"
            Component={VDPaymentStatus}
          />
          <Route
            path="vd-wallet-reports"
            name="VD Wallet Reports"
            Component={VDWalletsReports}
          />
          <Route
            path="place-order-for-customer"
            name="Place Order For Customer"
            Component={PlaceOrderForCustomer}
          />
          <Route
            path="stock-management"
            name="Stock Management"
            Component={StockManagement}
          />
          <Route
            path="enquiry-form"
            name="Enquiry Form"
            Component={EnquiryForm}
          />
          <Route
            path="all-commission-data"
            name="All Commission Data"
            Component={CommissionData}
          />
          <Route
            path="all-order-for-customer"
            name="All-Order-For-Customer"
            Component={AllOrdersForCustomers}
          />
          <Route
            path="distributor-purchase-plan-data"
            name="Distributor-Purchase-Plan-Data"
            Component={DistPurchasePlan}
          />

          {/* all-sarkari-yojna */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
