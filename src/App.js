import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import NavigationBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/userAuth/Login";
import Dashboard from "./pages/authPages/Dashboard";
import "./styles/bulma-custom-styles.css";
import DashMain from "./pages/authPages/DashMain";
import UserProfile from "./pages/authPages/UserProfile";
import LocalBiz from "./pages/authPages/LocalBusiness/LocalBiz";
import Balance from "./pages/authPages/Balance";
import Listings from "./pages/authPages/Listings";
import NeighborhoodRequests from "./pages/authPages/NeighborhoodRequests";
import Toolshed from "./pages/authPages/Tools/Toolshed";
import TranHist from "./pages/authPages/TranHist";
import AddTool from "./pages/authPages/Tools/AddTool";
import Inbox from "./pages/authPages/Messaging/Inbox";
import { AuthProvider } from "./contexts/AuthContext";
import { ToolProvider } from "./contexts/ToolContext";
import { ChatProvider } from "./contexts/ChatContext";
import { BookingProvider } from "./contexts/BookingContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AuthRoutes from "./components/AuthRoutes";
import EditTool from "./pages/authPages/Tools/EditTool";
import NeighborhoodActivity from "./pages/authPages/NeighborhoodActivity";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <ToolProvider>
          <ChatProvider>
            <NotificationProvider>
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
                        <Route path="inbox" element={<Inbox />} />
                        <Route path="local-biz" element={<LocalBiz />} />
                        <Route path="balance" element={<Balance />} />
                        <Route path="listings" element={<Listings />} />
                        <Route path="requests" element={<NeighborhoodRequests />} />
                        <Route path="activity" element={<NeighborhoodActivity />} />
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
            </NotificationProvider>
          </ChatProvider>
        </ToolProvider>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
