import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavBar";
import Home from "./pages/Home";
// import Footer from "./components/Footer";
import Login from "./pages/userAuth/Login";
import Dashboard from "./pages/Dashboard";
import "./styles/custom-styles.css";
import "./fonts/Lobster-Regular.ttf";
import DashMain from "./pages/authPages/DashMain";
import UserProfile from "./pages/authPages/UserProfile";
import LocalBiz from "./pages/authPages/LocalBusiness/LocalBiz";
import Balance from "./pages/authPages/Balance";
import Listings from "./pages/authPages/Listings";
import Toolshed from "./pages/authPages/Toolshed";
import TranHist from "./pages/authPages/TranHist";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DashMain />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="local-biz" element={<LocalBiz />} />
            <Route path="balance" element={<Balance />} />
            <Route path="listings" element={<Listings />} />
            <Route path="toolshed" element={<Toolshed />} />
            <Route path="transaction-history" element={<TranHist />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
