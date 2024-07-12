import { Link } from "react-router-dom";
import { FaAngleLeft, FaUserEdit } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { GrSearch } from "react-icons/gr";
import { TiDelete } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";

import avatar1 from "../../images/avatar3.png";
import React, { useEffect, useState } from "react";
import "./user.scss";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { EditUser } from "./EditUser/EditUser";
import { AddUser } from "./AddUser/AddUser";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useFriendStore } from "../../lib/friendStore";
import { usePostStore } from "../../lib/postStore";

const navigation = [
  { id: 1, name: "Friend list" },
  { id: 2, name: "Friend request" },
];
export const User = () => {
  const { user } = useUserStore();
  const { setPosts } = usePostStore();
  const {
    friends,
    friendRequest,
    fetchFriendInfo,
    fetchFriendRequestInfo,
    setFriends,
    setFriendRequest,
  } = useFriendStore();
  const [tab, setTab] = useState(1);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAddUSer, setOpenAddUser] = useState(false);
  const [friendFilter, setFriendFilter] = useState([]);

  useEffect(() => {
    const fetchDataOnTabChange = async () => {
      if (tab === 1) {
        await fetchFriendInfo(user.userId);
        setFriendFilter(friends);
      } else if (tab === 2) {
        await fetchFriendRequestInfo(user.userId);
      }
    };
    fetchDataOnTabChange();
  }, [fetchFriendInfo, fetchFriendRequestInfo, user.userId, tab]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "friend", user.userId), {
        friendList: arrayUnion({ friendId: requestId }),
      });

      await updateDoc(doc(db, "friend", requestId), {
        friendList: arrayUnion({ friendId: user.userId }),
      });
      const friendRequestRef = doc(db, "friendRequest", user.userId);
      const friendRequestSnap = await getDoc(friendRequestRef);

      if (friendRequestSnap.exists()) {
        console.log(friendRequestSnap.data());
        const objectToRemove = friendRequestSnap
          .data()
          .friendRequestList.find((item) => item.senderId === requestId);

        if (objectToRemove) {
          await updateDoc(friendRequestRef, {
            friendRequestList: arrayRemove(objectToRemove),
          });
        }
      }

      const newFriendRequestList = friendRequest.filter(
        (ele) => ele.userId !== requestId
      );
      setFriendRequest(newFriendRequestList);

      // kiểm tra nếu requestId đã tồn tại trong userchat khi không cần add
      const userChatsRef = doc(db, "userChats", user.userId);
      const userChatsSnap = await getDoc(userChatsRef);
      if (userChatsSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        const userChatsData = userChatsSnap.data();
        const userChatsFound = userChatsData.chats.find(
          (f) => f.receiverId === requestId
        );
        if (!userChatsFound) {
          const chatRef = await addDoc(collection(db, "chats"), {
            chats: [],
            createdAt: serverTimestamp(),
          });
          await updateDoc(userChatsRef, {
            chats: arrayUnion({
              chatId: chatRef.id,
              receiverId: requestId,
              lastMessage: "",
              updatedAt: Date.now(),
            }),
          });

          await updateDoc(doc(db, "userChats", requestId), {
            chats: arrayUnion({
              chatId: chatRef.id,
              receiverId: user.userId,
              lastMessage: "",
              updatedAt: Date.now(),
            }),
          });
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error.message);
      console.log(error);
    }
  };

  const handleRefuseRequest = async (requestId) => {
    try {
      const friendRequestRef = doc(db, "friendRequest", user.userId);
      const friendRequestSnap = await getDoc(friendRequestRef);

      if (friendRequestSnap.exists()) {
        console.log(friendRequestSnap.data());
        const objectToRemove = friendRequestSnap
          .data()
          .friendRequestList.find((item) => item.senderId === requestId);

        if (objectToRemove) {
          await updateDoc(friendRequestRef, {
            friendRequestList: arrayRemove(objectToRemove),
          });
        }
      }

      const newFriendRequestList = friendRequest.filter(
        (ele) => ele.userId !== requestId
      );
      setFriendRequest(newFriendRequestList);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      // delete friendid in user collection
      const userFriendRef = doc(db, "friend", user.userId);
      const userFriendSnap = await getDoc(userFriendRef);

      if (userFriendSnap.exists()) {
        // console.log(userFriendSnap.data());
        const objectToRemove = userFriendSnap
          .data()
          .friendList.find((item) => item.friendId === friendId);

        if (objectToRemove) {
          await updateDoc(userFriendRef, {
            friendList: arrayRemove(objectToRemove),
          });
        }
      }

      // delete friendid in receiver collection
      const receiverFriendRef = doc(db, "friend", friendId);
      const receiverFriendSnap = await getDoc(receiverFriendRef);

      if (receiverFriendSnap.exists()) {
        console.log(receiverFriendSnap.data());
        const objectToRemove = receiverFriendSnap
          .data()
          .friendList.find((item) => item.friendId === user.userId);

        if (objectToRemove) {
          await updateDoc(receiverFriendRef, {
            friendList: arrayRemove(objectToRemove),
          });
        }
      }

      const newFriendList = friends.filter((ele) => ele.userId !== friendId);
      setFriends(newFriendList);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleFilerFriend = (e) => {
    const inputValue = e.target.value;
    if (e.key === "Enter") {
      if (inputValue) {
        const Filtered = friends.filter((f) =>
          f.username.toLowerCase().includes(inputValue.trim().toLowerCase())
        );
        setFriendFilter(Filtered);
      } else {
        setFriendFilter(friends);
      }
    }
  };

  return (
    <div className="user">
      <Link to="/" className="back">
        <FaAngleLeft />
        back
      </Link>
      <div className="wrapper">
        <div className="info">
          <div className="avatar">
            <img src={user.avatar || avatar1} alt="" />
          </div>
          <div className="sub_info">
            <p className="username">
              {user.username} <span>#{user.subId}</span>
            </p>
            <p className="desc">
              {user.description || "You should update description"}
            </p>
          </div>
        </div>
        <div className="edit" onClick={() => setOpenEdit(true)}>
          <span className="icon">
            <FaUserEdit size="25px" />
          </span>
          <p>edit</p>
        </div>
        <div className="friends">
          <div className="nav">
            {navigation.map((e) => (
              <p
                key={e.id}
                className={`nav_item ${e.id === tab ? "active" : ""}`}
                onClick={() => setTab(e.id)}
              >
                {e.name}
              </p>
            ))}
            {friendRequest.length > 0 && (
              <span className="notify">{friendRequest.length}</span>
            )}
          </div>
          {tab === 1 && (
            <div className="tools">
              <div className="search">
                <GrSearch size="30px" color="#B8B8B8" />
                <input
                  type="text"
                  placeholder="Search friend"
                  onKeyDown={(e) => handleFilerFriend(e)}
                />
              </div>
              <div className="icon" onClick={() => setOpenAddUser(true)}>
                <HiUserAdd size="30px" color="#5E5E5E" />
              </div>
            </div>
          )}
          <div className="friend_list">
            {tab === 1 ? (
              <>
                {friendFilter.map((friend) => (
                  <div className="item" key={friend.userId}>
                    <div className="avatar">
                      <img src={friend?.avatar || avatar1} alt="" />
                    </div>
                    <div className="sub_info">
                      <p className="username">{friend?.username}</p>
                      <p className="desc">{friend?.description}</p>
                    </div>
                    <div className="icons">
                      <div
                        className="icon"
                        onClick={() => handleDeleteFriend(friend.userId)}
                      >
                        <TiDelete color="#CE735F" size="35px" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {friendRequest.map((friend) => (
                  <div className="item" key={friend.userId}>
                    <div className="avatar">
                      <img src={friend?.avatar || avatar1} alt="" />
                    </div>
                    <div className="sub_info">
                      <p className="username">{friend?.username}</p>
                      <p className="desc">{friend?.description}</p>
                    </div>
                    <div className="icons">
                      <div
                        className="icon"
                        onClick={() => handleAcceptRequest(friend.userId)}
                      >
                        <FaCheckCircle color="#3FA563" size="25px" />
                      </div>
                      <div
                        className="icon"
                        onClick={() => handleRefuseRequest(friend.userId)}
                      >
                        <TiDelete color="#CE735F" size="35px" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <button
          className="logout"
          onClick={() => {
            setPosts([]);
            setFriends([]);
            setFriendRequest([]);
            auth.signOut();
          }}
        >
          Logout
        </button>
      </div>
      <EditUser openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <AddUser openAddUSer={openAddUSer} setOpenAddUser={setOpenAddUser} />
    </div>
  );
};
