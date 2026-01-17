import React from "react";
import { useEffect } from "react";
import "./App.css";
import Home from "./pages/shared/HomeRedesigned";
import Wishlist from "./pages/user/Wishlist";
import Signup from "./pages/auth/SignupEnhanced";
import Login from "./pages/auth/LoginEnhanced";
import AuthCallback from "./pages/auth/AuthCallback";
import ProductPage from "./pages/user/ProductPage";
import CategoriesPage from "./pages/user/CategoriesPage";
import AllCategoriesPage from "./pages/user/AllCategoriesPage";
import AllProductsPage from "./pages/user/AllProductsPage";
import NewArrivalsPage from "./pages/user/NewArrivalsPage";
import Profile from "./pages/user/Profile";
import SearchResults from "./pages/user/SearchResults";
import ProductModal from "./components/product/ProductModal";
import SellerDashboard from "./layout/SellerDashboardEnhanced";
import UpdateProduct from "./pages/seller/UpdateProduct";
import Footer from "./layout/FooterEnhanced";
import Navbar from "./layout/NavbarEnhanced";
import LanguageManager from "./components/LanguageManager";
// Static pages
import AboutPage from "./pages/shared/AboutPage";
import ContactPage from "./pages/shared/ContactPage";
import FAQPage from "./pages/shared/FAQPage";
import PrivacyPolicyPage from "./pages/shared/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/shared/TermsOfServicePage";
import CookiePolicyPage from "./pages/shared/CookiePolicyPage";
import AccessibilityPage from "./pages/shared/AccessibilityPage";
import { Route, Routes } from "react-router-dom";
import {
  CustomerRoute,
  PublicCustomerRoute,
  SellerRoute,
} from "./utils/routes";
import Dashboard from "./pages/seller/DashboardEnhanced";
import Products from "./pages/seller/ProductsEnhanced";
import OrderList from "./pages/seller/OrderListEnhanced";
import AddProduct from "./pages/seller/AddProductEnhanced";
import { Toaster } from "./components/ui/sonner";
import Cart from "./pages/user/CartEnhanced";
import useAuth from "./store/authStore";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useWishlistStore from "./store/wishlistStore";
import Checkout from "./pages/user/Checkout";

function App() {
  const { isAuthenticated, user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { setWishlist } = useWishlistStore();

  const fetchWishlist = async () => {
    try {
      const res = await axiosPrivate.get("/wishlist?onlyIDs=true");
      setWishlist(res.data.wishlist);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user.role === "customer") {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  return (
    <>
      <LanguageManager />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PublicCustomerRoute>
              <Home />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <CustomerRoute>
              <Wishlist />
            </CustomerRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <CustomerRoute>
              <Cart />
            </CustomerRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <CustomerRoute>
              <Checkout />
            </CustomerRoute>
          }
        />
        <Route
          path="/Profile/:userId"
          element={
            <CustomerRoute>
              <Profile />
            </CustomerRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PublicCustomerRoute>
              <AllProductsPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PublicCustomerRoute>
              <AllCategoriesPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/new-arrivals"
          element={
            <PublicCustomerRoute>
              <NewArrivalsPage />
            </PublicCustomerRoute>
          }
        />
        {/* Static Pages */}
        <Route
          path="/about"
          element={
            <PublicCustomerRoute>
              <AboutPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicCustomerRoute>
              <ContactPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <PublicCustomerRoute>
              <FAQPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicCustomerRoute>
              <PrivacyPolicyPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicCustomerRoute>
              <TermsOfServicePage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/cookies"
          element={
            <PublicCustomerRoute>
              <CookiePolicyPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/accessibility"
          element={
            <PublicCustomerRoute>
              <AccessibilityPage />
            </PublicCustomerRoute>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <PublicCustomerRoute>
              <ProductPage />
            </PublicCustomerRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/products/categories/:category"
          element={
            <CustomerRoute>
              <CategoriesPage />
            </CustomerRoute>
          }
        />
        <Route
          path="/search/searched/:query"
          element={
            <CustomerRoute>
              <SearchResults />
            </CustomerRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          }
        >
          <Route
            index
            element={
              <SellerRoute>
                <Dashboard />
              </SellerRoute>
            }
          />
          <Route
            path="products"
            element={
              <SellerRoute>
                <Products />
              </SellerRoute>
            }
          />
          <Route
            path="products/add"
            element={
              <SellerRoute>
                <AddProduct />
              </SellerRoute>
            }
          />
          <Route
            path="orders"
            element={
              <SellerRoute>
                <OrderList />
              </SellerRoute>
            }
          />
          <Route
            path="products/update/:productId"
            element={
              <SellerRoute>
                <UpdateProduct />
              </SellerRoute>
            }
          />
        </Route>
      </Routes>
      <Footer />
      <ProductModal />
      <Toaster position="top-center" closeButton richColors />
    </>
  );
}

export default App;
