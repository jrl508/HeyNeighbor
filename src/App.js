import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // If you're using React Router for navigation.
import NavigationBar from "./components/NavBar";
import Home from "./components/Home"; // Import your other components/pages.

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
