import { FaAngleLeft } from "react-icons/fa";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const Register = () => {
  const [formError, setFormError] = useState({
    username: "",
    email: "",
    password: "",
    cfpassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError({
      username: "",
      email: "",
      password: "",
      cfpassword: "",
    });
    const formData = new FormData(e.target);
    let { username, email, password, cfpassword } =
      Object.fromEntries(formData);

    username = username.trim();
    email = email.trim();
    password = password.trim();
    cfpassword = cfpassword.trim();

    let hasError = false;

    if (password.length < 6) {
      setFormError((prev) => ({
        ...prev,
        password: "password must have at least 6 characters",
      }));
      hasError = true;
    }
    if (password !== cfpassword) {
      setFormError((prev) => ({
        ...prev,
        cfpassword: "confirm password must match password",
      }));
      hasError = true;
    }
    if (username.length === 0 || username.length > 20) {
      setFormError((prev) => ({
        ...prev,
        username: "username must be between 1 and 20 characters long",
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
    if (cfpassword.length === 0) {
      setFormError((prev) => ({
        ...prev,
        cfpassword: "confirm password must be not null",
      }));
      hasError = true;
    }
    if (!hasError) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", res.user.uid), {
          userId: res.user.uid,
          subId: res.user.uid.slice(0, 5),
          username,
          avatar: "",
          email,
          description: "",
          createdAt: new Date(),
        });

        await setDoc(doc(db, "userChats", res.user.uid), {
          userId: res.user.uid,
          chats: [],
        });
        await setDoc(doc(db, "friendRequest", res.user.uid), {
          userId: res.user.uid,
          friendRequestList: [],
        });
        await setDoc(doc(db, "friend", res.user.uid), {
          userId: res.user.uid,
          friendList: [],
        });
        // toast.success("Account created! You can access now!");

        // setTimeout(() => {
        //   navigate("/");
        // }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="wrapper-center">
      <form className="form" onSubmit={handleRegister}>
        <div className="group_item">
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            minLength="1"
            className={`${formError.username && "error"}`}
          />
          <span>{formError.username}</span>
        </div>
        <div className="group_item">
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            className={`${formError.email && "error"}`}
          />
          <span>{formError.email}</span>
        </div>
        <div className="group_item">
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            // minLength="5"
            className={`${formError.password && "error"}`}
          />
          <span>{formError.password}</span>
        </div>

        <div className="group_item">
          <input
            type="password"
            placeholder="Enter confirm password"
            name="cfpassword"
            // minLength="5"
            className={`${formError.cfpassword && "error"}`}
          />
          <span>{formError.cfpassword}</span>
        </div>
        <button>Register</button>
      </form>
      <Link to="/" className="back">
        <FaAngleLeft />
        back
      </Link>
    </div>
  );
};
