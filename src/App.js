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
import ScrollToTop from "./website/ScrollToTop";
import TermsAndCondition from "./website/TermsAndCondition";

function App() {
  const ref = React.useRef();
  const handleScroll = () => {
    if(!ref.current) return
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
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service" element={<Contact />} />
          <Route path="/product" element={<Contact />} />
          <Route path="/blog" element={<Contact />} />
          <Route path="/terms-and-condition" element={<TermsAndCondition />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/products/:name" element={<Products />} />
          <Route path="/apply-ekrushimitr" element={<ApplyEKrushimitr />} />
          <Route path="/user_login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/product-details" element={<ProductDetials />} />
        </Route>
        <Route path="cart" index element={<Cart />} />
        <Route path="/users" element={<UserPanel />}>
          {/* <Route index element={<UserPanel />} /> */}
          <Route path="user-dashboard" index element={<DashboardU />} />
        </Route>
        <Route path="/admin_login" element={<Login />} />
        <Route path="/admin" element={<MainContent />}>
          <Route index element={<Dashboard />} />
          <Route
            path="all-services"
            name="All-Services"
            element={<AllServices />}
          />
          <Route
            path="all-categories"
            name="All-Categories"
            element={<AllCategories />}
          />
          <Route path="all-users" name="All-Users" element={<AllUsers />} />
          <Route
            path="all-products"
            name="All-Products"
            element={<AllProducts />}
          />
          <Route
            path="edit-product/:id"
            name="Edit-Product"
            element={<EditProduct />}
          />
          <Route path="all-slider" name="All-Slider" element={<AllSlider />} />
          <Route path="all-news" name="All-News" element={<News />} />
          <Route
            path="all-application-form"
            name="All-Application-Form"
            element={<AllApplicationForm />}
          />
          <Route
            path="all-sarkari-yojna"
            name="All-Sarkari-Yojna"
            element={<AllSarkariYojna />}
          />

all-sarkari-yojna
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
