import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  user: null,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ user: null });

    try {
      set({ user: null });
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ user: docSnap.data() });
        // console.log("Document data:", docSnap.data());
      } else {
        set({ user: null });
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error.message);
      return set({ user: null });
    }
  },
}));
