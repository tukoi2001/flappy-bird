import Phaser from "phaser";
import { IMAGE_KEY } from "../constants/assets-key";

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image(
      IMAGE_KEY.BACKGROUND_DAY,
      "assets/images/background-day.png"
    );
    this.load.image(
      IMAGE_KEY.BACKGROUND_NIGHT,
      "assets/images/background-night.png"
    );
  }

  create() {
    this.scene.start("MainScene");
  }
}

export default BootScene;
