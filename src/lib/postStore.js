import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const usePostStore = create((set) => ({
  posts: [],
  isSuccessLoading: false,
  setPosts: (newPosts) => {
    set((prev) => ({
      ...prev,
      posts: newPosts,
    }));
  },
  fetchPostInfo: async (userId, friendList) => {
    if (!userId) return set({ posts: [], isSuccessLoading: false });
    try {
      set({ posts: [], isSuccessLoading: false });
      const friendIdList = [];
      friendList.forEach((f) => {
        friendIdList.push(f.userId);
      });
      // console.log(friendIdList);
      const q = query(
        collection(db, "posts"),
        where("senderId", "in", friendIdList),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const newPosts = [];
      for (const res of querySnapshot.docs) {
        // lấy data tương ứng với mỗi người đăng

        const posterSnap = await getDoc(doc(db, "users", res.data().senderId));

        // thêm thông tin người thả react
        const reacts = res.data().reactions;
        let updatedReacts = [];
        if (reacts.length > 0 && res.data().senderId === userId) {
          updatedReacts = reacts.map(async (react) => {
            const userRef = doc(db, "users", react.userId);
            const userSnap = await getDoc(userRef);
            return { ...react, userInfo: userSnap.data() };
          });
        }
        const newUpdatedReacts = await Promise.all(updatedReacts);
        newPosts.push({
          ...res.data(),
          reactions: newUpdatedReacts,
          userInfo: posterSnap.data(),
          id: res.id,
        });
      }
      // console.log("New posts", newPosts);
      // Cập nhật trạng thái posts với mảng mới
      set({ posts: newPosts, isSuccessLoading: true });
    } catch (error) {
      console.log(error.message);
      return set({ posts: [], isSuccessLoading: false });
    }
  },
}));
