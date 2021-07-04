import { atom } from "recoil";

export const campusIdState = atom<string | null>({
  key: "campusIdState",
  default: null,
});
