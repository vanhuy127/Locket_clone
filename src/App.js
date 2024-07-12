import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../src/pages/Home/Home";
import { User } from "../src/pages/User/User";
import { Chats } from "../src/pages/Chats/Chats";
import { Login } from "../src/pages/Login/Login";
import { AddPost } from "../src/pages/AddPost/AddPost";
import { Authentication } from "../src/pages/Authentication/Authentication";
import { Register } from "../src/pages/Register/Register";
import { Chat } from "./pages/Chat/Chat";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useEffect } from "react";
import { useUserStore } from "./lib/userStore";
import { AllShotCut } from "./pages/AllShortCut/AllShotCut";

function App() {
  const { user, fetchUserInfo } = useUserStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      await fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);
  console.log("current user", user);
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/allshortcut" element={<AllShotCut />} />
              <Route path="/user" element={<User />} />
              <Route path="/addpost" element={<AddPost />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chats/:roomId" element={<Chat />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Authentication />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
