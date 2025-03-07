import { ANIMATION_KEY } from "../constants/animation-key";
import {
  AUDIO_KEY,
  IMAGE_KEY,
  SPRITE_SHEETS_KEY,
} from "../constants/assets-key";
import { THEME } from "../constants/configuration";
import { STORAGE_KEY } from "../constants/storage-key";
import { getLocalStorage } from "../utils/storage";

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.loadingContainer = null;
  }

  preload() {
    const theme = getLocalStorage(STORAGE_KEY.THEME) || THEME.DAY;
    this.input.setDefaultCursor("pointer");
    // Container
    this.loadingContainer = this.add.container(0, 0);

    // Background
    const backgroundKey =
      theme === THEME.DAY
        ? IMAGE_KEY.BACKGROUND_DAY
        : IMAGE_KEY.BACKGROUND_NIGHT;
    const background = this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        backgroundKey
      )
      .setOrigin(0.5)
      .setAlpha(0.5);
    this.loadingContainer.add(background);

    // Loading Text
    const loadingText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 40,
        "Loading...",
        {
          fill: "#ffffff",
          fontSize: "16px",
        }
      )
      .setOrigin(0.5);
    this.loadingContainer.add(loadingText);

    // Animation
    this.loadingTextTween = this.tweens.add({
      targets: loadingText,
      alpha: { from: 1, to: 0.2 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Progress Bar
    const progressBar = this.add.graphics();
    this.loadingContainer.add(progressBar);

    // Progress Box
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x444444, 0.8);
    progressBox.fillRoundedRect(
      this.cameras.main.width / 2 - 100,
      this.cameras.main.height / 2 - 20,
      200,
      40,
      20
    );
    this.loadingContainer.add(progressBox);

    const percentText = this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2, "0%", {
        fill: "#ffffff",
        fontSize: "16px",
        fontFamily: "Roboto",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.loadingContainer.add(percentText);

    this.load.on("progress", (value) => {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0x98fb98, 1);
      progressBar.fillRoundedRect(
        this.cameras.main.width / 2 - 90,
        this.cameras.main.height / 2 - 10,
        180 * value,
        20,
        10
      );
    });

    this.load.on("complete", () => {
      this.tweens.killTweensOf(progressBar);
      this.tweens.killTweensOf(percentText);
      this.loadingContainer.destroy();
      this.loadingContainer = null;
    });

    //   Images
    this.load.image(IMAGE_KEY.EIGHT, "assets/images/eight.png");
    this.load.image(IMAGE_KEY.FIVE, "assets/images/five.png");
    this.load.image(IMAGE_KEY.FOUR, "assets/images/four.png");
    this.load.image(IMAGE_KEY.GAME_OVER, "assets/images/game-over.png");
    this.load.image(
      IMAGE_KEY.MESSAGE_INITIAL,
      "assets/images/message-initial.png"
    );
    this.load.image(IMAGE_KEY.MESSAGE_START, "assets/images/message-start.png");
    this.load.image(IMAGE_KEY.NINE, "assets/images/nine.png");
    this.load.image(IMAGE_KEY.ONE, "assets/images/one.png");
    this.load.image(IMAGE_KEY.PAUSE_BUTTON, "assets/images/pause-button.png");
    this.load.image(
      IMAGE_KEY.PIPE_GREEN_BOTTOM,
      "assets/images/pipe-green-bottom.png"
    );
    this.load.image(
      IMAGE_KEY.PIPE_GREEN_TOP,
      "assets/images/pipe-green-top.png"
    );
    this.load.image(
      IMAGE_KEY.PIPE_RED_BOTTOM,
      "assets/images/pipe-red-bottom.png"
    );
    this.load.image(IMAGE_KEY.PIPE_RED_TOP, "assets/images/pipe-red-top.png");
    this.load.image(
      IMAGE_KEY.RESTART_BUTTON,
      "assets/images/restart-button.png"
    );
    this.load.image(IMAGE_KEY.SEVEN, "assets/images/seven.png");
    this.load.image(IMAGE_KEY.SIX, "assets/images/six.png");
    this.load.image(IMAGE_KEY.THREE, "assets/images/three.png");
    this.load.image(IMAGE_KEY.TWO, "assets/images/two.png");
    this.load.image(IMAGE_KEY.ZERO, "assets/images/zero.png");
    this.load.image(IMAGE_KEY.MENU_BOX, "assets/images/menu-box.png");
    this.load.image(IMAGE_KEY.BACK_BUTTON, "assets/images/back-button.png");

    // Sprite sheets
    this.load.spritesheet(
      SPRITE_SHEETS_KEY.GROUND,
      "assets/spritesheets/ground.png",
      {
        frameWidth: 336,
        frameHeight: 112,
      }
    );
    // BIRD
    this.load.spritesheet(
      SPRITE_SHEETS_KEY.BIRD_RED,
      "assets/spritesheets/bird-red.png",
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
    this.load.spritesheet(
      SPRITE_SHEETS_KEY.BIRD_BLUE,
      "assets/spritesheets/bird-blue.png",
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
    this.load.spritesheet(
      SPRITE_SHEETS_KEY.BIRD_YELLOW,
      "assets/spritesheets/bird-yellow.png",
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );

    //   Audio
    this.load.audio(AUDIO_KEY.BUTTON, "/assets/audios/button.mp3");
    this.load.audio(AUDIO_KEY.DIE, "/assets/audios/die.mp3");
    this.load.audio(AUDIO_KEY.HIT, "/assets/audios/hit.mp3");
    this.load.audio(AUDIO_KEY.POINT, "/assets/audios/point.mp3");
    this.load.audio(AUDIO_KEY.TOUCH, "/assets/audios/touch.mp3");
  }

  create() {
    //   Animations
    this.createAnimations();
    // Start
    this.scene.start("HomeScene");
  }

  createAnimations() {
    // Ground animations
    this.anims.create({
      key: ANIMATION_KEY.GROUND_MOVING,
      frames: this.anims.generateFrameNumbers(SPRITE_SHEETS_KEY.GROUND, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ANIMATION_KEY.GROUND_STOP,
      frames: [{ key: SPRITE_SHEETS_KEY.GROUND, frame: 0 }],
      frameRate: 20,
    });

    // Red Bird Animations
    this.anims.create({
      key: ANIMATION_KEY.BIRD_RED_CLAP_WINGS,
      frames: this.anims.generateFrameNumbers(SPRITE_SHEETS_KEY.BIRD_RED, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ANIMATION_KEY.BIRD_RED_STOP,
      frames: [{ key: SPRITE_SHEETS_KEY.BIRD_RED, frame: 1 }],
      frameRate: 20,
    });

    // Blue Bird animations
    this.anims.create({
      key: ANIMATION_KEY.BIRD_BLUE_CLAP_WINGS,
      frames: this.anims.generateFrameNumbers(SPRITE_SHEETS_KEY.BIRD_BLUE, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ANIMATION_KEY.BIRD_BLUE_STOP,
      frames: [{ key: SPRITE_SHEETS_KEY.BIRD_BLUE, frame: 1 }],
      frameRate: 20,
    });

    // Yellow Bird animations
    this.anims.create({
      key: ANIMATION_KEY.BIRD_YELLOW_CLAP_WINGS,
      frames: this.anims.generateFrameNumbers(SPRITE_SHEETS_KEY.BIRD_YELLOW, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ANIMATION_KEY.BIRD_YELLOW_STOP,
      frames: [{ key: SPRITE_SHEETS_KEY.BIRD_YELLOW, frame: 1 }],
      frameRate: 20,
    });
  }
}

export default MainScene;
