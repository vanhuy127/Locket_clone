import React, { useEffect, useRef, useState } from "react";
import "./chat.scss";
import { Link, useParams } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import avatar from "../../images/avatar3.png";
import imgplh from "../../images/img_placeholder.png";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatsStore } from "../../lib/chatsStore";
import { useUserStore } from "../../lib/userStore";
import { ConvertTime } from "../../components/Utils/ConvertTime";
export const Chat = () => {
  const { roomId } = useParams();
  const { chats } = useChatsStore();
  const { user } = useUserStore();
  const [chat, setChat] = useState([]);
  const [receiverInfo, setReceiverInfo] = useState({});
  const [text, setText] = useState("");

  const endRef = useRef(null);

  // console.log(endRef);
  // useEffect(() => {
  //   endRef.current.scrollIntoView({ behavior: "smooth" });
  // }, []);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", roomId), (res) => {
      setChat(res.data().chats.sort((a, b) => a.updatedAt - b.updatedAt));
    });

    const receiverFound = chats.find((chat) => chat.chatId === roomId);
    setReceiverInfo(receiverFound.userInfo);

    return () => {
      unsub();
    };
  }, [roomId, chats]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const message = text.trim();
    if (message) {
      try {
        const chatRef = doc(db, "chats", roomId);
        await updateDoc(chatRef, {
          chats: arrayUnion({
            senderId: user.userId,
            text: message,
            createdAt: Date.now(),
          }),
        });
        //update lastMessage in user chats
        const userChatRef = doc(db, "userChats", user.userId);
        const userChatSnap = await getDoc(userChatRef);

        if (userChatSnap.exists()) {
          console.log("Document data:", userChatSnap.data());
          let userChatData = userChatSnap.data();
          const userChatIndex = userChatData.chats.findIndex(
            (f) => f.chatId === roomId
          );
          userChatData.chats[userChatIndex].lastMessage = message;
          userChatData.chats[userChatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        } else {
          console.log("No such document!");
        }
        //update lastMessage in receiver chats
        const receiverChatRef = doc(db, "userChats", receiverInfo.userId);
        const receiverChatSnap = await getDoc(receiverChatRef);

        if (receiverChatSnap.exists()) {
          console.log("Document data:", receiverChatSnap.data());
          let receiverChatData = receiverChatSnap.data();
          const receiverChatIndex = receiverChatData.chats.findIndex(
            (f) => f.chatId === roomId
          );
          receiverChatData.chats[receiverChatIndex].lastMessage = message;
          receiverChatData.chats[receiverChatIndex].updatedAt = Date.now();

          await updateDoc(receiverChatRef, {
            chats: receiverChatData.chats,
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      setText("");
    }
  };

  return (
    <div className="chat bg-second">
      <Link to="/chats" className="back">
        <FaAngleLeft />
        back
      </Link>
      <div className="wrapper">
        <div className="chat_wrapper">
          <div className="receiver">
            <div className="avatar">
              <img src={receiverInfo.avatar || avatar} alt="" />
            </div>
            <p className="username">{receiverInfo.username}</p>
          </div>
          <div className="chat_box">
            {chat.map((c) => (
              <div
                className={`chat_item ${user.userId === c.senderId && "own"}`}
                key={c.createdAt}
              >
                {user.userId === c.senderId || (
                  <div className="avatar">
                    <img src={receiverInfo.avatar || avatar} alt="" />
                  </div>
                )}
                <div className="chat_info">
                  {c.image && (
                    <div className="img">
                      <img src={c.image || imgplh} alt="" />
                    </div>
                  )}
                  <div className="message">{c.text}</div>
                  <div className="time">{ConvertTime(c.createdAt)}</div>
                </div>
              </div>
            ))}
            <div ref={endRef}></div>
          </div>
          <form className="send_btn" onSubmit={handleSendMessage}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Enter message..."
              name="message"
            />
            <button>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};
