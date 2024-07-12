import { FaAngleLeft } from "react-icons/fa";

import React, { useState } from "react";
import "./login.scss";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
export const Login = () => {
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError({
      email: "",
      password: "",
    });
    const formData = new FormData(e.target);
    let { email, password } = Object.fromEntries(formData);

    email = email.trim();
    password = password.trim();

    let hasError = false;

    if (password.length < 6) {
      setFormError((prev) => ({
        ...prev,
        password: "password must have at least 6 characters",
      }));
      hasError = true;
    }
    if (email.length === 0) {
      setFormError((prev) => ({ ...prev, email: "email must be not null" }));
      hasError = true;
    }
    if (password.length === 0) {
      setFormError((prev) => ({
        ...prev,
        password: "password must be not null",
      }));
      hasError = true;
    }
    if (!hasError) {
      try {
        signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="wrapper-center">
      <form className="form" onSubmit={handleLogin}>
        <div className="group_item">
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            className={`${formError.email && "error"}`}
          />
          <span>{formError.email}</span>
        </div>
        <div className="group_item">
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            className={`${formError.password && "error"}`}
          />
          <span>{formError.password}</span>
        </div>
        <button>Login</button>
      </form>
      <Link to="/" className="back">
        <FaAngleLeft />
        back
      </Link>
    </div>
  );
};
