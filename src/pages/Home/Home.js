import { LuUserCircle2, LuMessageCircle } from "react-icons/lu";
import { MdOutlineAddReaction } from "react-icons/md";
import { GrAppsRounded } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import "./home.scss";
import { Link } from "react-router-dom";
import imgPlaceholder from "../../images/img_placeholder.png";
// import avatar1 from "../../images/avatar1.png";
import { usePostStore } from "../../lib/postStore";
import { useUserStore } from "../../lib/userStore";
import { useFriendStore } from "../../lib/friendStore";
import { CaculateTime } from "../../components/Utils/CaculateTime";
import { ListReact } from "../../components/ListReact/ListReact";
import { ListEmoji } from "./ListEmoji/ListEmoji";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
export const Home = () => {
  const [open, setOpen] = useState("");
  // const [comment, setComment] = useState("");
  const [openReact, setOpenReact] = useState(false);
  const { posts, fetchPostInfo, isSuccessLoading } = usePostStore();
  const { user } = useUserStore();
  const { friends, fetchFriendInfo, fetchFriendRequestInfo, fetchSuccess } =
    useFriendStore();

  useEffect(() => {
    const fetchDataFriend = async (userId) => {
      await fetchFriendInfo(userId);
      await fetchFriendRequestInfo(userId);
    };
    fetchDataFriend(user.userId);
  }, [fetchFriendInfo, fetchFriendRequestInfo, user.userId]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (user && fetchSuccess) {
          console.log("fetch post input: ", [user, ...friends]);
          await fetchPostInfo(user.userId, [user, ...friends]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPostData();
  }, [user, friends, fetchPostInfo]);

  const handleShowReact = (post) => {
    const listReacts = post.reactions;
    // console.log(listReacts);
    if (listReacts.length > 0) {
      setOpenReact(post.id);
    }
  };
  const handleOpenEmoji = (postId) => {
    setOpen((prev) => {
      return prev === postId ? "" : postId;
    });
  };
  const handleSendEmoji = async (e, post) => {
    try {
      if (e.emoji) {
        const data = {
          userId: user.userId,
          emoji: e.emoji,
        };
        const postRef = doc(db, "posts", post.id);

        await updateDoc(postRef, {
          reactions: arrayUnion(data),
        });
        setOpen("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendComment = async (e, post) => {
    const inputValue = e.target.value.trim();
    const receiverId = post.senderId;
    if (e.key === "Enter" && inputValue) {
      const userChatsRef = doc(db, "userChats", user.userId);
      const userChatsSnap = await getDoc(userChatsRef);
      if (userChatsSnap.exists()) {
        const userChatFound = userChatsSnap
          .data()
          .chats.find((f) => f.receiverId === receiverId);
        const chatRef = doc(db, "chats", userChatFound.chatId);
        await updateDoc(chatRef, {
          chats: arrayUnion({
            senderId: user.userId,
            text: inputValue,
            image: post.image,
            createdAt: Date.now(),
          }),
        });

        //update lastMessage in user chats

        let userChatsData = userChatsSnap.data();
        const userChatsIndex = userChatsData.chats.findIndex(
          (f) => f.chatId === userChatFound.chatId
        );
        userChatsData.chats[userChatsIndex].lastMessage = inputValue;
        userChatsData.chats[userChatsIndex].updatedAt = Date.now();

        await updateDoc(userChatsRef, {
          chats: userChatsData.chats,
        });
        //update lastMessage in receiver chats
        const receiverChatRef = doc(db, "userChats", receiverId);
        const receiverChatSnap = await getDoc(receiverChatRef);

        if (receiverChatSnap.exists()) {
          let receiverChatData = receiverChatSnap.data();
          const receiverChatIndex = receiverChatData.chats.findIndex(
            (f) => f.chatId === userChatFound.chatId
          );
          receiverChatData.chats[receiverChatIndex].lastMessage = inputValue;
          receiverChatData.chats[receiverChatIndex].updatedAt = Date.now();

          await updateDoc(receiverChatRef, {
            chats: receiverChatData.chats,
          });
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No such document!");
      }
      e.target.value = "";
    }
  };
  console.log(posts);
  return (
    <div className="home">
      <div className="top">
        <Link to="/user" className="icon">
          <LuUserCircle2 size="45px" color="white" />
        </Link>
        <Link to="/addpost" className="btn_add_post">
          Add Post
        </Link>
        <Link to="/chats" className="icon">
          <LuMessageCircle size="45px" color="white" />
        </Link>
      </div>
      <div className="wrapper ">
        <div className="content">
          {isSuccessLoading &&
            posts.map((post) => (
              <div className="item" key={post?.id}>
                <div className="image">
                  <img src={post?.image || imgPlaceholder} alt="" />
                  <p className="text">{post?.text}</p>
                </div>
                <p className="info">
                  {post.senderId === user.userId
                    ? "You"
                    : post.userInfo.username}{" "}
                  <span>{CaculateTime(post.createdAt, "timestamp")}</span>
                </p>
                {post.senderId === user.userId ? (
                  <div className="reacts" onClick={() => handleShowReact(post)}>
                    {post.reactions.length > 0 ? (
                      <>
                        <p className="activate">activate</p>
                        <ListReact reacts={post.reactions} />
                      </>
                    ) : (
                      <>
                        <p className="activate">no activate</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="send_image">
                    <input
                      onKeyDown={(e) => handleSendComment(e, post)}
                      type="text"
                      placeholder="Enter message..."
                    />
                    <div
                      className="icon"
                      onClick={() => handleOpenEmoji(post.id)}
                    >
                      <MdOutlineAddReaction size="45px" color="white" />
                    </div>
                    <div className="list_emoji">
                      <EmojiPicker
                        open={post.id === open}
                        onEmojiClick={(e) => handleSendEmoji(e, post)}
                      />
                    </div>
                  </div>
                )}
                <ListEmoji
                  openReact={openReact}
                  setOpenReact={setOpenReact}
                  post={post}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="bottom">
        <Link to="/allshortcut" className="icon">
          <GrAppsRounded size="50px" color="#8FD9F7" />
        </Link>
      </div>
    </div>
  );
};
