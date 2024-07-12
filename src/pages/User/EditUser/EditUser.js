import { FaChevronDown } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import React, { useState } from "react";
import "./edituser.scss";
import avatar1 from "../../../images/avatar1.png";
import avatar2 from "../../../images/avatar2.png";
import avatar3 from "../../../images/avatar3.png";
import avatar4 from "../../../images/avatar4.png";
import { useUserStore } from "../../../lib/userStore";
import { uploadImage } from "../../../lib/uploadImage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// const listImage = [
//   { id: 1, img: avatar1 },
//   { id: 2, img: avatar2 },
//   { id: 3, img: avatar3 },
//   { id: 4, img: avatar4 },
// ];
export const EditUser = (props) => {
  const { openEdit, setOpenEdit } = props;
  const { user, fetchUserInfo } = useUserStore();
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  // console.log(avatar);
  const [formError, setFormError] = useState({
    username: "",
    description: "",
  });
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // const setImageLocal = (e) => {
  //   setAvatar({
  //     file: null,
  //     url: e.img,
  //     idImageLocal: e.id,
  //   });
  // };

  const handleChangeInfo = async (e) => {
    e.preventDefault();
    setFormError({
      username: "",
      description: "",
    });
    const formData = new FormData(e.target);
    let { username, description } = Object.fromEntries(formData);
    let hasError = false;

    username = username.trim();
    description = description.trim();

    if (username && username.length > 20) {
      setFormError((prev) => ({
        ...prev,
        username: "username must be between 1 and 20 characters long",
      }));
      hasError = true;
    }
    if (description.length > 30) {
      setFormError((prev) => ({
        ...prev,
        description: "description must be less than 31 characters",
      }));
      hasError = true;
    }
    if (!hasError) {
      try {
        let imgUrl = await uploadImage(avatar.file);

        const userRef = doc(db, "users", user.userId);

        const updateData = {
          ...user,
          description,
          avatar: imgUrl,
        };

        if (username) {
          updateData.username = username;
        }
        await updateDoc(userRef, updateData);

        await fetchUserInfo(user.userId);
        setOpenEdit(false);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className={`edit_user ${openEdit ? "show" : ""}`}>
      <div className="container ">
        <div className="scroll-down">
          <FaChevronDown
            size="40px"
            color="#5E5E5E"
            onClick={() => setOpenEdit(false)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="wrapper">
          <form action="" onSubmit={handleChangeInfo}>
            <label htmlFor="file" className="image">
              <div className="sub_image">
                <img
                  src={
                    avatar.url
                      ? avatar.url
                      : user.avatar
                      ? user.avatar
                      : avatar3
                  }
                  alt=""
                />
              </div>
              <div className="icon">
                <MdModeEditOutline color="#fff" size="20px" />
              </div>
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <div className="group_input">
              <input
                type="text"
                placeholder={user.username ? user.username : "Enter username"}
                maxLength={35}
                name="username"
                className={`${formError.username && "error"}`}
              />
              <span>{formError.username}</span>
            </div>
            <div className="group_input">
              <input
                type="text"
                placeholder={
                  user.description ? user.description : "Enter description"
                }
                maxLength={35}
                name="description"
                className={`${formError.description && "error"}`}
              />
              <span>{formError.description}</span>
            </div>
            {/* <div className="choose_image">
              <p>Choose image:</p>
              <div className="list_image">
                {listImage.map((e) => (
                  <div
                    className="img"
                    key={e.id}
                    onClick={() => setImageLocal(e)}
                  >
                    <img src={e.img} alt="" />
                  </div>
                ))}
              </div>
            </div> */}
            <button className="save">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};
