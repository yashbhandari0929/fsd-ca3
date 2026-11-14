import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-wrapper">
          <div className="brand-logo">AI</div>
          <div>
            <div className="brand-heading">
              ApexInventory <span>React 18</span>
            </div>
            <div className="brand-sub">Program 2: Component Architecture & Router</div>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Catalog
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Add Item
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Analytics
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Student Info
          </NavLink>
        </nav>

        <div className="student-tag">
          <span>Yash Bhandari</span>
          <strong>Roll 08</strong>
          <span>(D11ADA)</span>
        </div>
      </div>
    </header>
  );
}

