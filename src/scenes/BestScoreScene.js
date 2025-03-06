import { AUDIO_KEY, IMAGE_KEY } from "../constants/assets-key";
import { DEFAULT_SCORE, NUMBER_MAP, STYLE_TEXT } from "../constants/common";
import { DIFFICULTY, THEME } from "../constants/configuration";
import { STORAGE_KEY } from "../constants/storage-key";
import { getLocalStorage } from "../utils/storage";

class BestScoreScene extends Phaser.Scene {
  constructor() {
    super("BestScoreScene");
    this.bestScoreContainer = null;
  }

  create() {
    const theme = getLocalStorage(STORAGE_KEY.THEME) || THEME.DAY;
    this.input.setDefaultCursor("pointer");
    this.bestScoreContainer = this.add.container(0, 0);
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
    this.bestScoreContainer.add(background);

    // Text
    const messageStartImage = this.add
      .image(width / 2, 50, IMAGE_KEY.MESSAGE_START)
      .setOrigin(0.5);
    this.bestScoreContainer.add(messageStartImage);

    // Title
    const container = this.add.container(width / 2, height / 2 - 120);
    const menuBox = this.add
      .image(0, -17, IMAGE_KEY.MENU_BOX)
      .setScale(0.7)
      .setOrigin(0.5);
    const menuText = this.add
      .text(0, -14, "Best Score", STYLE_TEXT)
      .setOrigin(0.5);
    container.add([menuBox, menuText]);
    this.bestScoreContainer.add(container);

    // Back button
    const backButton = this.add
      .image(width - 25, height - 25, IMAGE_KEY.BACK_BUTTON)
      .setOrigin(0.5)
      .setScale(1.5)
      .setInteractive({ useHandCursor: true });
    this.bestScoreContainer.add(backButton);
    backButton.on("pointerdown", () => {
      if (this.sound.get(AUDIO_KEY.BUTTON)) {
        this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
      }
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start("HomeScene");
      });
    });

    // Score
    this.createScoreContainer();
  }

  createScoreDisplay(scoreValue, yPosition, group) {
    const scoreText = String(scoreValue);
    const charWidth = 40;
    const width = this.cameras.main.width;
    const centerX = width / 2 + 40;

    if (scoreText.length === 1) {
      group
        .create(centerX, yPosition, NUMBER_MAP[Number(scoreText)])
        .setOrigin(0.5);
    } else {
      let positionX = centerX - ((scoreText.length - 1) * charWidth) / 2;
      for (let i = 0; i < scoreText.length; i++) {
        group
          .create(positionX, yPosition, NUMBER_MAP[Number(scoreText[i])])
          .setOrigin(0.5);
        positionX += charWidth;
      }
    }
  }

  createScoreContainer() {
    // Score
    const score = getLocalStorage(STORAGE_KEY.BEST_SCORE) || DEFAULT_SCORE;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height / 2;
    const levelSpacing = 60;

    // Create score groups
    const normalScoreGroup = this.physics.add.staticGroup();
    const mediumScoreGroup = this.physics.add.staticGroup();
    const hardScoreGroup = this.physics.add.staticGroup();

    // Center container for all content
    const centerX = width / 2;

    const style = {
      fontFamily: "monospace",
      color: "#000",
      fontStyle: "600",
    };

    this.add
      .text(centerX - 40, height - levelSpacing, "NORMAL:", style)
      .setOrigin(0.5);
    this.add.text(centerX - 40, height, "MEDIUM:", style).setOrigin(0.5);
    this.add
      .text(centerX - 40, height + levelSpacing, "HARD:", style)
      .setOrigin(0.5);

    // Add score displays for each level
    this.createScoreDisplay(
      score[DIFFICULTY.NORMAL],
      height - levelSpacing,
      normalScoreGroup
    );
    this.createScoreDisplay(score[DIFFICULTY.MEDIUM], height, mediumScoreGroup);
    this.createScoreDisplay(
      score[DIFFICULTY.HARD],
      height + levelSpacing,
      hardScoreGroup
    );
  }
}

export default BestScoreScene;
