import React from 'react';
import { connect } from 'react-redux';
import { logout, showLogin, showSignup } from '../../actions/authActions';
import './navbar.css';

function Navbar({
  auth: { isAuthenticated, loading, user },
  showLogin,
  showSignup,
  logout,
}) {
  const guestLinks = (
    <nav>
      <ul className="nav-collection">
        <li
          onClick={() => {
            showSignup(true);
            showLogin(false);
          }}
          className="nav-item"
        >
          <p className="nav-link">Register an account</p>
        </li>
        <li
          onClick={() => {
            showLogin(true);
            showSignup(false);
          }}
          className="nav-item"
        >
          <p className="nav-link">Sign in</p>
        </li>
      </ul>
    </nav>
  );
  const authLinks = (
    <nav>
      <ul className="nav-collection">
        <li id="username" className="nav-item">
          {user ? user.name : 'Shishir'}
        </li>
        <li onClick={logout} className="nav-item">
          <p  className="nav-link"> Logout</p>
        </li>
      </ul>
    </nav>
  );

  return (
    <div id="simplenav" className="container">
      <>{isAuthenticated ? authLinks : guestLinks}</>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { showLogin, showSignup, logout })(
  Navbar
);
