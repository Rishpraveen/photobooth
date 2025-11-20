import { create } from "zustand";

export const useAppStore = create((set) => ({
  currentPage: "landing", // landing, camera, result
  capturedImage: null,
  beautyDescription: "",
  isGenerating: false,
  cameraMode: "solo", // solo, friends

  setPage: (page) => set({ currentPage: page }),
  setCapturedImage: (image) => set({ capturedImage: image }),
  setBeautyDescription: (desc) => set({ beautyDescription: desc }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setCameraMode: (mode) => set({ cameraMode: mode }),

  reset: () => set({
    capturedImage: null,
    beautyDescription: "",
    isGenerating: false,
  }),
}));
