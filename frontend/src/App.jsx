import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import FingerCricket from "./pages/Finger-Cricket/Finger-cricket";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/finger-cricket" element={<FingerCricket/>} />
      </Routes>
    </Router>
  );
}

export default App;
