import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useFriendStore = create((set) => ({
  friends: [],
  friendRequest: [],
  fetchSuccess: false,
  setFriends: (friends) => {
    set((prev) => ({
      ...prev,
      friends: friends,
    }));
  },
  setFriendRequest: (friendRequest) => {
    set((prev) => ({
      ...prev,
      friendRequest: friendRequest,
    }));
  },
  fetchFriendInfo: async (userId) => {
    if (!userId) return set((prev) => ({ ...prev, friends: [] }));

    set((prev) => ({
      ...prev,
      fetchSuccess: false,
    }));

    try {
      set((prev) => ({ ...prev, friends: [] }));
      const friendSnap = await getDoc(doc(db, "friend", userId));
      if (friendSnap.exists()) {
        friendSnap.data().friendList.forEach(async (element) => {
          const userSnap = await getDoc(doc(db, "users", element.friendId));
          set((prev) => ({
            ...prev,
            friends: [...prev.friends, userSnap.data()],
          }));
        });
        set((prev) => ({
          ...prev,
          fetchSuccess: true,
        }));
      }
    } catch (error) {
      console.log(error.message);
      return set((prev) => ({ ...prev, friends: [] }));
    }
  },
  fetchFriendRequestInfo: async (userId) => {
    if (!userId) return set((prev) => ({ ...prev, friendRequest: [] }));

    try {
      set((prev) => ({ ...prev, friendRequest: [] }));
      const friendRequestSnap = await getDoc(doc(db, "friendRequest", userId));
      if (friendRequestSnap.exists()) {
        friendRequestSnap.data().friendRequestList.forEach(async (element) => {
          const userSnap = await getDoc(doc(db, "users", element.senderId));
          set((prev) => ({
            ...prev,
            friendRequest: [...prev.friendRequest, userSnap.data()],
          }));
        });
      }
    } catch (error) {
      console.log(error.message);
      return set((prev) => ({ ...prev, friendRequest: [] }));
    }
  },
}));
