import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import NavigationBar from "./components/NavBar";
import Home from "./pages/Home";
// import Footer from "./components/Footer";
import Login from "./pages/userAuth/Login";
import Dashboard from "./pages/authPages/Dashboard";
import "./styles/bulma-custom-styles.css";
import DashMain from "./pages/authPages/DashMain";
import UserProfile from "./pages/authPages/UserProfile";
import LocalBiz from "./pages/authPages/LocalBusiness/LocalBiz";
import Balance from "./pages/authPages/Balance";
import Listings from "./pages/authPages/Listings";
import Toolshed from "./pages/authPages/Tools/Toolshed";
import TranHist from "./pages/authPages/TranHist";
import AddTool from "./pages/authPages/Tools/AddTool";
import { AuthProvider } from "./contexts/AuthContext";
import { ToolProvider } from "./contexts/ToolContext";
import AuthRoutes from "./components/AuthRoutes";
import EditTool from "./pages/authPages/Tools/EditTool";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  return (
    <AuthProvider>
      <ToolProvider>
        <Elements stripe={stripePromise}>
          <Router>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route element={<AuthRoutes />}>
                <Route path="dashboard" element={<Dashboard />}>
                  <Route index element={<DashMain />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="local-biz" element={<LocalBiz />} />
                  <Route path="balance" element={<Balance />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="toolshed">
                    <Route index element={<Toolshed />} />
                    <Route path="new" element={<AddTool />} />
                    <Route path="edit/:toolId" element={<EditTool />} />
                  </Route>
                  <Route path="transaction-history" element={<TranHist />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </Elements>
      </ToolProvider>
    </AuthProvider>
  );
};

export default App;
