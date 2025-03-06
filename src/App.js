import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Toolshed from "./pages/authPages/Toolshed";
import TranHist from "./pages/authPages/TranHist";
import AddTool from "./pages/authPages/AddTool";
import { AuthProvider } from "./contexts/AuthContext";
import AuthRoutes from "./components/AuthRoutes";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
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
              </Route>
              <Route path="transaction-history" element={<TranHist />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
