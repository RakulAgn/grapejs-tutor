import create from "zustand";

export const usePageManager = create((set) => ({
  pageid: "",
  setPageId: (data) =>
    set({
      pageid: data,
    }),
}));
