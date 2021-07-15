import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { login, showLogin, showSignup } from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import spinner from '../../img/spinner.gif';
import leftArrow from '../../img/Vector.png';

import './auth.css';

const Login = ({ login, isAuthenticated, showSignup, showLogin }) => {
  const [showGif, setShowGif] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setShowGif(true);
    await login(email, password, setShowGif);
  };

  useEffect(() => {
    const wrapper = document.querySelector('#root');
    const portal = document.querySelector('#login');
    const body = document.querySelector('body');
    portal.style.display = 'flex';
    // portal.style.width = '100vw';
    portal.style.background = 'rgba(0,0,0,0.24)';
    portal.style.margin = '0 20px 20px 0';
    body.style.overflow = 'hidden';
    portal.style.zIndex = '1000';
    portal.style.top = `${window.scrollY}px`;
    portal.style.minHeight = '100vh';

    return () => {
      portal.style.background = '';
      portal.style.margin = '';
      portal.style.minHeight = '';
      wrapper.style.pointerEvents = 'auto';
      body.style.overflow = '';
      portal.style.zIndex = '-1';
      portal.style.display = 'none';
    };
  }, []);

  // Redirect if logged in
  // if (isAuthenticated) return <Redirect to="/" />;
  return ReactDOM.createPortal(
    <div className="form">
      <p
        className="remove"
        onClick={() => {
          showLogin(false);
        }}
      >
        X
      </p>
      <h3 className="form-title">Sign In</h3>

      <form className="myform" onSubmit={(e) => onSubmit(e)}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Log In
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {showGif ? (
            <img
              src={spinner}
              alt="spinner"
              style={{
                marginLeft: '7px',
                width: '35px',
                height: '35px',
              }}
            />
          ) : (
            <img
              src={leftArrow}
              alt="spinner"
              style={{
                marginLeft: '7px',
                width: '15px',
                height: '15px',
              }}
            />
          )}
        </button>
      </form>
      <p
        className="my-1"
        onClick={() => {
          showLogin(false);
          showSignup(true);
        }}
      >
        Create an account here
      </p>
    </div>,
    document.getElementById('login')
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
Login.prototypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

export default connect(mapStateToProps, { login, showLogin, showSignup })(
  Login
);
