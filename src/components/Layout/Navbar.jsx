import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          GNV HOHO
        </Link>

        {token ? (
          // Logged in user navigation - All logged in users get dashboard
          <div className={styles.navItems}>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
            <Link to="/all-events" className={styles.navLink}>
              All Events
            </Link>
            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <div className={styles.userInfo}>
              <span className={styles.welcomeText}>
                Hi, {user?.name || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        ) : (
          // Public/Non-authenticated Navigation
          <div className={styles.navItems}>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
            <Link to="/all-events" className={styles.navLink}>
              All Events
            </Link>

            {/* Login/Signup Dropdown */}
            <div className={styles.dropdown} ref={dropdownRef}>
              <button
                className={styles.dropdownBtn}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                Login / Sign Up
              </button>
              <div
                className={`${styles.dropdownMenu} ${dropdownOpen ? styles.show : ''}`}
              >
                <Link 
                  to="/login" 
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
