import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  logoUrl: string;
  outletName: string;
  userName: string;
  isLoaded: boolean;

  setDashboardData: (data: {
    logoUrl: string;
    outletName: string;
    userName: string;
  }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      logoUrl: "",
      outletName: "",
      userName: "",
      isLoaded: false,

      setDashboardData: (data) =>
        set({
          ...data,
          isLoaded: true,
        }),
    }),
    {
      name: "app-store",
    }
  )
);