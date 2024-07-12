import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import upload from "../../images/upload-image.jpg";
import EmojiPicker from "emoji-picker-react";

import "./addpost.scss";
import { FaAngleLeft } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { GrSend } from "react-icons/gr";
import { MdOutlineAddReaction } from "react-icons/md";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { uploadImage } from "../../lib/uploadImage";

export const AddPost = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const { user } = useUserStore();

  const navigate = useNavigate();
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handlePostImage = (e) => {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleAddPost = async () => {
    const postText = text.trim();
    if (image.file && postText) {
      try {
        let imgUrl = await uploadImage(image.file);
        const docRef = await addDoc(collection(db, "posts"), {
          senderId: user.userId,
          text,
          image: imgUrl,
          reactions: [],
          createdAt: serverTimestamp(),
        });

        setImage({
          file: null,
          url: "",
        });
        setText("");
        navigate("/");
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="wrapper bg-second">
      <div className="add_post">
        <Link to="/" className="back">
          <FaAngleLeft />
          back
        </Link>
        <form>
          <h3 className="title">Send to...</h3>
          <label htmlFor="file" className="upload_image">
            <div className="image_placeholder">
              <img src={image.url || upload} alt="" />
            </div>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handlePostImage}
            />
          </label>
          <div className="send_image">
            <input
              type="text"
              placeholder="Enter message..."
              maxLength={30}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="icon" onClick={() => setOpen(!open)}>
              <MdOutlineAddReaction size="45px" color="white" />
            </div>
            {/* emojis */}
            <div className="list_emoji">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <div className="group_button">
            <div className="cancel" onClick={handleCancel}>
              <ImCancelCircle size="40px" color="#E08848" />
            </div>
            <div className="send" onClick={handleAddPost}>
              <GrSend size="50px" color="#8FD9F7" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
