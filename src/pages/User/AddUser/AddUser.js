import React, { useState } from "react";
import "./adduser.scss";
import avatar3 from "../../../images/avatar3.png";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import { useFriendStore } from "../../../lib/friendStore";

export const AddUser = (props) => {
  const { openAddUSer, setOpenAddUser } = props;
  const [search, setSearch] = useState("");
  const [userFound, setUserFound] = useState(null);
  const { user } = useUserStore();
  const { friends } = useFriendStore();
  const handleChildClick = (e) => {
    e.stopPropagation();
  };
  const handleFindFriend = async (search) => {
    const searchText = search.trim();
    if (searchText && searchText !== user.subId) {
      try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("subId", "==", search.trim()));
        const querySnapshot = await getDocs(q);
        console.log("query", querySnapshot.docs[0].data());
        setUserFound(querySnapshot.docs[0].data());
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleSendRequest = async (receiverId) => {
    if (receiverId) {
      try {
        const requestRef = doc(db, "friendRequest", receiverId);
        await updateDoc(requestRef, {
          friendRequestList: arrayUnion({ senderId: user.userId }),
        });
        setSearch("");
        setUserFound(null);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div
      className={`add_user ${openAddUSer ? "show" : ""}`}
      onClick={() => {
        setOpenAddUser(false);
        setSearch("");
        setUserFound(null);
      }}
    >
      <div className="add_user_wrapper" onClick={handleChildClick}>
        <div className="search">
          <input
            type="text"
            placeholder="Enter userId"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => handleFindFriend(search)}>Search</button>
        </div>
        <div className="content">
          {userFound && (
            <div className="item">
              <div className="avatar">
                <img src={userFound.avatar || avatar3} alt="" />
              </div>
              <div className="sub_info">
                <p className="username">{userFound.username}</p>
                <p className="desc">{userFound.description || ""}</p>
              </div>
              <button
                onClick={() => handleSendRequest(userFound.userId)}
                disabled={friends.find((f) => f.userId === userFound.userId)}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
