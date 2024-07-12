import React from "react";
import "./authentication.scss";
import { Link } from "react-router-dom";
export const Authentication = () => {
  return (
    <div className="wrapper wrapper-center">
      <div className="auth">
        <Link to="/register" className="button signUp">
          Sign Up
        </Link>
        <Link to="/login" className="button login">
          Login
        </Link>
      </div>
    </div>
  );
};
