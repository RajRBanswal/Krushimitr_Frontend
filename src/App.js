import React, { useEffect } from "react";
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

function App() {
  const ref = React.useRef();

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
      <Routes>
        <Route exact path="invoice" name="Invoice" element={<Invoice />} />
        <Route path="/" element={<Main />}>
          <Route exact index element={<Home />} />
          <Route exact path="/about-us" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/service" element={<Services />} />
          <Route exact path="/product" element={<Products />} />
          <Route exact path="/blog" element={<Contact />} />
          <Route
            exact
            path="/terms-and-condition"
            element={<TermsAndCondition />}
          />
          <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route exact path="/products/:name" element={<Products />} />
          <Route
            exact
            path="/apply-ekrushimitr"
            element={<ApplyEKrushimitr />}
          />
          <Route exact path="/login" element={<UserLogin />} />

          <Route exact path="/shipping-policy" element={<ShipingPolicy />} />
          <Route exact path="/refund-policy" element={<RefundPolicy />} />
          <Route exact path="/return-policy" element={<ReturnPolicy />} />
          <Route exact path="/user-register" element={<UserRegister />} />
          <Route exact path="/product-details" element={<ProductDetials />} />
          <Route exact path="/cart-details" element={<Cart />} />
          <Route exact path="/checkout" element={<Checkout />} />
          <Route exact path="/donation-form" element={<DonationForm />} />
          <Route
            exact
            path="/product-detail/:id/:user_id"
            element={<ProductDetail />}
          />
        </Route>
        <Route path="/users" element={<UserPanel />}>
          {/* <Route index element={<UserPanel />} /> */}
          <Route exact path="user-dashboard" element={<DashboardU />} />
          <Route exact path="user-orders" element={<UserAllOrders />} />
          <Route exact path="user-wallet" element={<UserWallet />} />
        </Route>
        <Route exact path="/admin_login" element={<Login />} />
        <Route exact path="/admin" element={<MainContent />}>
          <Route exact index element={<Dashboard />} />
          <Route
            exact
            path="all-services"
            name="All-Services"
            element={<AllServices />}
          />
          <Route
            exact
            path="all-categories"
            name="All-Categories"
            element={<AllCategories />}
          />
          <Route
            exact
            path="all-users"
            name="All-Users"
            element={<AllUsers />}
          />
          <Route
            exact
            path="all-products"
            name="All-Products"
            element={<AllProducts />}
          />
          <Route
            exact
            path="edit-product/:id"
            name="Edit-Product"
            element={<EditProduct />}
          />
          <Route
            exact
            path="all-slider"
            name="All-Slider"
            element={<AllSlider />}
          />
          <Route exact path="all-news" name="All-News" element={<News />} />
          <Route
            exact
            path="all-application-form"
            name="All-Application-Form"
            element={<AllApplicationForm />}
          />
          <Route
            exact
            path="all-sarkari-yojna"
            name="All-Sarkari-Yojna"
            element={<AllSarkariYojna />}
          />
          <Route
            exact
            path="all-orders"
            name="All-Orders"
            element={<AllOrders />}
          />
          <Route
            exact
            path="all-distributor"
            name="All-Distributor"
            element={<AllDistributors />}
          />
          <Route
            exact
            path="demo-products"
            name="All-Demo-Products"
            element={<ProductAll />}
          />
          <Route
            exact
            path="all-orders-reports"
            name="All-Orders-Reports"
            element={<AllReports />}
          />



          {/* all-sarkari-yojna */}
        </Route>
        <Route path="/distributors" element={<DistributorsMain />}>
          <Route exact index element={<DistributorDashboard />} />
          <Route
            exact
            path="allcategories"
            name="AllCategories"
            element={<Categories />}
          />
          <Route exact path="allusers" name="AllUsers" element={<AllUsers />} />
          <Route
            exact
            path="allproducts"
            name="AllProducts"
            element={<DProducts />}
          />
          <Route
            exact
            path="product-edit/:id"
            name="ProductEdit"
            element={<ProductEdit />}
          />
          <Route
            exact
            path="customer-orders"
            name="CustomersOrders"
            element={<CustomerOrders />}
          />
          <Route
            exact
            path="edit-orders"
            name="EditOrder"
            element={<EditOrder />}
          />
          <Route
            exact
            path="place-orders"
            name="PlaceOrders"
            element={<PlaceOrder />}
          />
          <Route
            exact
            path="all-orders"
            name="AllOrders"
            element={<DistributorOrders />}
          />
          <Route
            exact
            path="shop-details"
            name="ShopDetails"
            element={<DistributorProfile />}
          />
          {/* all-sarkari-yojna */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
