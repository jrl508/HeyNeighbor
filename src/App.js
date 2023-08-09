import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // If you're using React Router for navigation.
import NavigationBar from "./components/NavBar";
import Home from "./pages/Home"; // Import your other components/pages.
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
