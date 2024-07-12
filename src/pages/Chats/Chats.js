import React, { useEffect } from "react";
import "./chats.scss";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import avatar from "../../images/avatar3.png";
import { useUserStore } from "../../lib/userStore";
import { useChatsStore } from "../../lib/chatsStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { CaculateTime } from "../../components/Utils/CaculateTime";

export const Chats = () => {
  const { user } = useUserStore();
  const { chats, setChats } = useChatsStore();
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userChats", user.userId), async (res) => {
      const promises = res.data().chats.map(async (chat) => {
        const userRef = doc(db, "users", chat.receiverId);
        const userSnap = await getDoc(userRef);
        return { ...chat, userInfo: userSnap.data() };
      });
      const chatList = await Promise.all(promises);
      setChats(chatList.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unsub();
    };
  }, [user]);
  // console.log(chats);
  return (
    <div className="chats bg-second">
      <Link to="/" className="back">
        <FaAngleLeft />
        back
      </Link>
      <div className="wrapper">
        <div className="chats_wrapper">
          <h3 className="title">Tin nhắn</h3>
          <div className="chats_list">
            {chats.map((chat) => (
              <Link
                to={`/chats/${chat.chatId}`}
                className="chat_item"
                key={chat.chatId}
              >
                <div className="avatar">
                  <img src={chat.userInfo.avatar || avatar} alt="" />
                </div>
                <div className="chat_info">
                  <p className="username">
                    {" "}
                    {chat.userInfo.username}{" "}
                    <span>{CaculateTime(chat.updatedAt, "date")}</span>
                  </p>
                  <p className="last_message">{chat.lastMessage}</p>
                </div>
                <div className="icon">
                  <FaChevronRight size="20px" color="#5e5e5e" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
