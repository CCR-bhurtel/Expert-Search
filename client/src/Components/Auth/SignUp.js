import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { register, showLogin, showSignup } from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import spinner from '../../img/spinner.gif';
import './auth.css';
import { setAlert } from '../../actions/alertAction';
import leftArrow from '../../img/Vector.png';

const SignUp = ({
  login,
  isAuthenticated,
  showSignup,
  showLogin,
  register,
  setAlert,
}) => {
  const [showGif, setShowGif] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { name, email, password, passwordConfirm } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setShowGif(true);
    if (password !== passwordConfirm) {
      setShowGif(false);
      setAlert('Unmatched passwords', 'danger');
    } else {
      register(name, email, password, passwordConfirm, setShowGif);
    }
  };

  useEffect(() => {
    const wrapper = document.querySelector('#root');
    const body = document.querySelector('body');

    const portal = document.querySelector('#signup');
    portal.style.display = 'flex';

    portal.style.background = 'rgba(0, 0, 0, 0.24)';
    portal.style.margin = '0 20px 20px 0';
    portal.style.minHeight = '100vh';
    body.style.overflow = 'hidden';
    portal.style.zIndex = '1000';

    wrapper.style.pointerEvents = 'none';
    portal.style.top = `${window.scrollY}px`;

    return () => {
      portal.style.background = '';
      portal.style.margin = '';
      portal.style.minHeight = '';
      body.style.overflow = '';
      wrapper.style.pointerEvents = 'auto';
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
          showSignup(false);
        }}
      >
        X
      </p>
      <h3 className="form-title">Register an account</h3>

      <form className="myform" onSubmit={(e) => onSubmit(e)}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            minLength="3"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
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
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="passwordConfirm"
            minLength="6"
            value={passwordConfirm}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Register
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
          showSignup(false);
          showLogin(true);
        }}
      >
        Have an account? Log in
      </p>
    </div>,
    document.getElementById('signup')
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
SignUp.prototypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

export default connect(mapStateToProps, {
  register,
  showLogin,
  showSignup,
  setAlert,
})(SignUp);
