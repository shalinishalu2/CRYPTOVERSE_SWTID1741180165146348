import React, { useState, useEffect } from "react";
import { Button, Menu, Typography, Avatar, Switch } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  MoneyCollectOutlined,
  BulbOutlined,
  FundOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import icon from "../assets/cryptocurrency.png";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(() => {
    // Toggle dark mode class on document body
    document.body.classList.toggle('dark-mode', darkMode);
    // Store the preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Load dark mode preference on initial render
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className={`nav-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="logo-container">
        <Avatar src={icon} size="large" />
        <Typography.Title level={4} className="logo">
          <Link to="/dashboard">Cryptoverse</Link>
        </Typography.Title>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            type="text"
            style={{ color: darkMode ? '#fff' : '#000' }}
          >
            Logout
          </Button>
          <Button
            className="menu-control-container"
            onClick={() => setActiveMenu(!activeMenu)}
          >
            <MenuOutlined />
          </Button>
        </div>
      </div>

      {activeMenu && (
        <ul className="menu">
          <li className="menu-item">
            <HomeOutlined className="menu-icon" />
            <Link className="link" to="/">
              Home
            </Link>
          </li>
          <li className="menu-item">
            <FundOutlined className="menu-icon" />
            <Link className="link" to="/cryptocurrencies">
              Cryptocurrencies
            </Link>
          </li>
          <li className="menu-item">
            <MoneyCollectOutlined className="menu-icon" />
            <Link className="link" to="/portfolio">
              Portfolio
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
