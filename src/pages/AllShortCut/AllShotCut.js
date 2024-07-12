import React from "react";
import "./allShortCut.scss";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { usePostStore } from "../../lib/postStore";
export const AllShotCut = () => {
  const { posts } = usePostStore();
  return (
    <div className="all_short_cut bg-second">
      <Link to="/" className="back">
        <FaAngleLeft />
        back
      </Link>
      <div className="all_short_cut_wrapper">
        {posts.map((p) => (
          <div className="shot_cut_item" key={p.id}>
            <img src={p.image} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};
