import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🎪</span>
        <span className="brand-text">EventAdmin</span>
      </div>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add-event"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">➕</span>
            Add Event
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
