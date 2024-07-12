import React from "react";
import "./listReact.scss";
import avatar from "../../images/avatar3.png";
export const ListReact = (props) => {
  const { reacts } = props;

  const renderReacts = () => {
    if (reacts.length <= 2) {
      return reacts.map((react, index) => (
        <div className="react" key={index}>
          <img src={react?.userInfo?.avatar || avatar} alt="" />
        </div>
      ));
    } else {
      return (
        <>
          {reacts.slice(0, 2).map((react, index) => (
            <div className="react" key={index}>
              <img src={react?.userInfo?.avatar || avatar} alt="" />
            </div>
          ))}
          <div className="react">
            <span>+{reacts.length - 2}</span>
          </div>
        </>
      );
    }
  };
  return <div className="list_react">{renderReacts()}</div>;
};
