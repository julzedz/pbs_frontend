import { create } from "zustand";

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const useAppStore = create((set) => ({
  user: getUserFromStorage(),
  deletedPropertyIds: [],
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },
  markPropertyDeleted: (propertyId) =>
    set((state) => ({
      deletedPropertyIds: state.deletedPropertyIds.includes(propertyId)
        ? state.deletedPropertyIds
        : [...state.deletedPropertyIds, propertyId],
    })),
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, deletedPropertyIds: [] });
  },
}));

// Sync Zustand store with localStorage changes (cross-tab, manual clear)
window.addEventListener("storage", () => {
  const user = getUserFromStorage();
  useAppStore.setState({ user });
});
