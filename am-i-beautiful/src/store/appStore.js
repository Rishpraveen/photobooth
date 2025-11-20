import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set) => ({
      currentPage: "landing", // landing, camera, result
      capturedImage: null,
      beautyDescription: "",
      isGenerating: false,
      cameraMode: "solo", // solo, friends
      apiKey: "",
      showApiKeyDialog: false,

      setPage: (page) => set({ currentPage: page }),
      setCapturedImage: (image) => set({ capturedImage: image }),
      setBeautyDescription: (desc) => set({ beautyDescription: desc }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setCameraMode: (mode) => set({ cameraMode: mode }),
      setApiKey: (key) => set({ apiKey: key }),
      setShowApiKeyDialog: (show) => set({ showApiKeyDialog: show }),

      reset: () => set({
        capturedImage: null,
        beautyDescription: "",
        isGenerating: false,
      }),
    }),
    {
      name: "photobooth-storage",
      partialize: (state) => ({ apiKey: state.apiKey }), // Only persist API key
    }
  )
);
