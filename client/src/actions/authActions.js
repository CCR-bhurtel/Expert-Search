import setAuthToken from '../Utils/setAuthToken';

const {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOG_OUT,
  TOGGLE_LOGIN,
  TOGGLE_SIGNUP,
} = require('./types');
const { setAlert } = require('./alertAction');

const axios = require('axios').default;

export const showLogin = (bool) => (dispatch) => {
  dispatch({
    type: TOGGLE_LOGIN,
    payload: bool,
  });
};

export const showSignup = (bool) => (dispatch) => {
  dispatch({
    type: TOGGLE_SIGNUP,
    payload: bool,
  });
};
// Load User
export const loaduser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data.data.user,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// REGISTER A USER
export const register =
  (name, email, password, passwordConfirm, setShowGif) => async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      name,
      email,
      password,
      passwordConfirm,
    });
    console.log(body);

    try {
      const res = await axios.post('/api/users', body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data.token,
      });
      setAuthToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      dispatch(setAlert('User Registered Successfully', 'success'));
      const wrapper = document.querySelector('#root');

      const portal = document.querySelector('#signup');
      portal.style.background = '';
      portal.style.margin = '';
      portal.style.height = '';
      wrapper.style.pointerEvents = 'auto';
      dispatch(showSignup(false));
      dispatch(loaduser());
      setShowGif(false);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.message, 'danger')));
      }
      dispatch(setAlert(err.response.data.message, 'danger'));
      setShowGif(false);
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login a user
export const login = (email, password, setShowGif) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    dispatch(loaduser());
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.token,
    });
    dispatch(setAlert('User Logged In Successfully', 'success'));

    dispatch(showLogin(false));
    const wrapper = document.querySelector('#root');

    const portal = document.querySelector('#login');
    portal.style.background = '';
    portal.style.margin = '';
    portal.style.height = '';
    wrapper.style.pointerEvents = 'auto';
    setShowGif(false);
  } catch (err) {
    if (err.response) {
      console.log(err);
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.message, 'danger')));
      }
      dispatch(setAlert(err.response.data.message, 'danger'));
      dispatch({
        type: LOGIN_FAIL,
      });
      setShowGif(false);
    }
  }
};

// LOGOUT / clear profile

export const logout = () => (dispatch) => {
  dispatch({
    type: LOG_OUT,
  });
};
