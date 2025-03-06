import { IMAGE_KEY } from "./assets-key";
import { DIFFICULTY } from "./configuration";

export const STYLE_TEXT = {
  fontFamily: "fantasy",
  fontSize: "18px",
  color: "#ffffff",
};

export const NUMBER_MAP = {
  1: IMAGE_KEY.ONE,
  2: IMAGE_KEY.TWO,
  3: IMAGE_KEY.THREE,
  4: IMAGE_KEY.FOUR,
  5: IMAGE_KEY.FIVE,
  6: IMAGE_KEY.SIX,
  7: IMAGE_KEY.SEVEN,
  8: IMAGE_KEY.EIGHT,
  9: IMAGE_KEY.NINE,
  0: IMAGE_KEY.ZERO,
};

export const DEFAULT_SCORE = {
  [DIFFICULTY.NORMAL]: 0,
  [DIFFICULTY.MEDIUM]: 0,
  [DIFFICULTY.HARD]: 0,
};
