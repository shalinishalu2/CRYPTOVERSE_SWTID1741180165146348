import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import { Navbar, CryptoDetails, Cryptocurrencies, Home, Portfolio, Login, Signup } from "./components";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('currentUser');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app">
              <div className="navbar">
                <Navbar />
              </div>
              <div className="main">
                <Layout>
                  <div className="routes">
                    <Routes>
                      <Route path="/dashboard" element={<Home />} />
                      <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
                      <Route path="/crypto/:coinId" element={<CryptoDetails />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </div>
                </Layout>
                <div className="footer">
                  <h1 className="footer-heading">
                    Beyond the Banks: The Rise of Cryptocurrency <br />
                  </h1>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
