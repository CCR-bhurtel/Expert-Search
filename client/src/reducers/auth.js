import setAuthToken from '../Utils/setAuthToken';

const {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT,
  TOGGLE_LOGIN,
  TOGGLE_SIGNUP,
} = require('../actions/types');

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  setting: null,
  showLogin: false,
  showSignup: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload);
      return {
        ...state,
        token: payload,
      };

    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload);
      return {
        ...state,
        token: payload,
      };

    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOG_OUT:

    // eslint-disable-next-line no-fallthrough
    case AUTH_ERROR:
      setAuthToken(null);
      localStorage.removeItem('token');

      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };

    case TOGGLE_LOGIN:
      return { ...state, showLogin: action.payload };

    case TOGGLE_SIGNUP:
      return { ...state, showSignup: action.payload };
    default:
      return state;
  }
}
