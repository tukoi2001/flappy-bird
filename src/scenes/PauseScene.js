import { AUDIO_KEY, IMAGE_KEY } from "../constants/assets-key";
import { STYLE_TEXT } from "../constants/common";
import { THEME } from "../constants/configuration";
import { STORAGE_KEY } from "../constants/storage-key";
import { getLocalStorage } from "../utils/storage";

class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
    this.pauseContainer = null;
    this.menuData = [
      { name: "continue", text: "Continue", yOffset: -25 },
      { name: "exit", text: "Exit", yOffset: 25 },
    ];
  }

  create() {
    const theme = getLocalStorage(STORAGE_KEY.THEME) || THEME.DAY;
    this.input.setDefaultCursor("default");
    this.pauseContainer = this.add.container(0, 0);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const backgroundKey =
      theme === THEME.DAY
        ? IMAGE_KEY.BACKGROUND_DAY
        : IMAGE_KEY.BACKGROUND_NIGHT;
    const background = this.add
      .image(width / 2, height / 2, backgroundKey)
      .setOrigin(0.5);
    this.pauseContainer.add(background);
    const messageStartImage = this.add
      .image(width / 2, 50, IMAGE_KEY.MESSAGE_START)
      .setOrigin(0.5);
    this.pauseContainer.add(messageStartImage);

    // Menu
    this.menuData.forEach((menuItemData) => {
      const container = this.createMenuItemContainer(
        menuItemData.name,
        menuItemData.text,
        menuItemData.yOffset
      );
      this.pauseContainer.add(container);

      const menuBox = container.getAt(0);
      container.setSize(menuBox.width, menuBox.height);
      container.setInteractive({ useHandCursor: true });

      const menuText = container.getAt(1);

      container.originalTextColor = STYLE_TEXT.color;

      container.on("pointerover", () => {
        menuText.setStyle({ ...STYLE_TEXT, color: "#ffff00" });
      });

      container.on("pointerout", () => {
        menuText.setStyle({
          ...STYLE_TEXT,
          color: container.originalTextColor,
        });
      });

      container.on("pointerdown", () => {
        this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.handleMenuItemClick(container.name);
        });
      });
    });
  }

  createMenuItemContainer(name, text, yOffset) {
    const container = this.add.container(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + yOffset
    );
    const menuBox = this.add
      .image(0, -17, IMAGE_KEY.MENU_BOX)
      .setScale(0.7)
      .setOrigin(0.5);
    const menuText = this.add.text(0, -14, text, STYLE_TEXT).setOrigin(0.5);

    container.add([menuBox, menuText]);
    container.name = name;
    return container;
  }

  handleMenuItemClick(name) {
    switch (name) {
      case "continue":
        this.scene.resume("GameScene");
        this.scene.stop();
        break;
      case "exit":
        this.scene.remove("GameScene");
        this.scene.start("HomeScene");
        this.scene.remove();
        break;
      default:
        break;
    }
  }
}

export default PauseScene;
