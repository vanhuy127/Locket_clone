import React from "react";
import "./listemoji.scss";

import avatar3 from "../../../images/avatar3.png";

export const ListEmoji = (props) => {
  const { openReact, setOpenReact, post } = props;
  const handleChildClick = (e) => {
    e.stopPropagation();
  };
  const reacts = post.reactions;
  return (
    <div
      className={`list_emoji_tab ${post.id === openReact ? "show" : ""}`}
      onClick={() => setOpenReact("")}
    >
      <div className="list_emoji_tab_wrapper" onClick={handleChildClick}>
        {reacts.length > 0 ? (
          reacts.map((react, index) => (
            <div className="item_emoji" key={index}>
              <div className="user_react">
                <div className="image">
                  <img src={react?.userInfo?.avatar || avatar3} alt="" />
                </div>
                <p className="username">{react?.userInfo?.username}</p>
              </div>
              <div className="emoji">{react?.emoji}</div>
            </div>
          ))
        ) : (
          <p>No reactions found</p>
        )}
        {/* <div className="item_emoji">
          <div className="user_react">
            <div className="image">
              <img src={avatar3} alt="" />
            </div>
            <p className="username">lkfjslk</p>
          </div>
          <div className="emoji">😆</div> */}
        {/* </div>  */}
      </div>
    </div>
  );
};
