import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import { connect } from "react-redux";
import Home from "./Components/Home/Home";
import Alert from "./Components/Alert/Alert";
import setAuthToken from "./Utils/setAuthToken";
import { loaduser } from "./actions/authActions";
import SignUp from "./Components/Auth/SignUp";
import Login from "./Components/Auth/Login";
import GetListed from "./Components/ListedAsExpert/GetListed";
import Navbar from "./Components/Layouts/Navbar";

if (localStorage.token) setAuthToken(localStorage.token);

function App({ auth, loaduser }) {
  useEffect(() => {
    loaduser();
  }, []);

  return (
    <div style={{ zIndex: "100" }}>
      <div
        style={{
          height: "120vh",
          width: "100%",
          background: "#000",
          opacity: "0.2",
          position: "absolute",
          top: "0",
          overflowX: "hidden",
          zIndex: "1001",
          pointerEvents: "none",
        }}
        className="overlay"
        id="overlay"
      ></div>
      <Alert />
      <Navbar />

      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/admin" component={AdminDashboard} />
        <Route exact path="/getlisted" component={GetListed} />
      </BrowserRouter>

      {auth.showLogin && <Login />}
      {auth.showSignup && <SignUp />}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loaduser })(App);
