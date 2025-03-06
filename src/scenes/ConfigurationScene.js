import {
  AUDIO_KEY,
  IMAGE_KEY,
  SPRITE_SHEETS_KEY,
} from "../constants/assets-key";
import { STYLE_TEXT } from "../constants/common";
import { BIRD_COLOR, DIFFICULTY, THEME } from "../constants/configuration";
import { STORAGE_KEY } from "../constants/storage-key";
import { getLocalStorage, setLocalStorage } from "../utils/storage";

class ConfigurationScene extends Phaser.Scene {
  constructor() {
    super("ConfigurationScene");
    this.configurationContainer = null;
    this.selectedBirdColor = null;
    this.selectedDifficulty = null;
    this.selectedTheme = null;
    this.background = null;
    this.bird = null;
  }

  create() {
    // Get saved configurations or use defaults
    const theme = getLocalStorage(STORAGE_KEY.THEME) || THEME.DAY;
    this.selectedTheme = theme;
    this.selectedBirdColor =
      getLocalStorage(STORAGE_KEY.BIRD_COLOR) || BIRD_COLOR.BLUE;
    this.selectedDifficulty =
      getLocalStorage(STORAGE_KEY.DIFFICULTY) || DIFFICULTY.NORMAL;

    this.input.setDefaultCursor("pointer");
    this.configurationContainer = this.add.container(0, 0);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const backgroundKey =
      theme === THEME.DAY
        ? IMAGE_KEY.BACKGROUND_DAY
        : IMAGE_KEY.BACKGROUND_NIGHT;
    this.background = this.add
      .image(width / 2, height / 2, backgroundKey)
      .setOrigin(0.5);
    this.configurationContainer.add(this.background);

    // Text
    const messageStartImage = this.add
      .image(width / 2, 50, IMAGE_KEY.MESSAGE_START)
      .setOrigin(0.5);
    this.configurationContainer.add(messageStartImage);

    // Title
    const container = this.add.container(width / 2, height / 2 - 130);
    const menuBox = this.add
      .image(0, 0, IMAGE_KEY.MENU_BOX)
      .setScale(0.7)
      .setOrigin(0.5);
    const menuText = this.add
      .text(0, 3, "Configuration", STYLE_TEXT)
      .setOrigin(0.5);
    container.add([menuBox, menuText]);
    this.configurationContainer.add(container);

    // Configuration options
    this.createThemeSelection(width / 2, height / 2 - 80);
    this.createBirdColorSelection(width / 2, height / 2 + 10);
    this.createDifficultySelection(width / 2, height / 2 + 110);

    // Save button with animation
    const saveButton = this.add
      .image(width / 2, height / 2 + 220, IMAGE_KEY.MENU_BOX)
      .setOrigin(0.5)
      .setScale(0.7)
      .setInteractive({ useHandCursor: true });

    const saveText = this.add
      .text(width / 2, height / 2 + 223, "Save", STYLE_TEXT)
      .setOrigin(0.5);

    this.configurationContainer.add([saveButton, saveText]);

    // Button animations
    this.setupButtonAnimations(saveButton);

    saveButton.on("pointerdown", () => {
      if (this.sound.get(AUDIO_KEY.BUTTON)) {
        this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
      }

      // Save animation
      this.tweens.add({
        targets: saveButton,
        scale: 0.65,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          setLocalStorage(STORAGE_KEY.THEME, this.selectedTheme);
          setLocalStorage(STORAGE_KEY.BIRD_COLOR, this.selectedBirdColor);
          setLocalStorage(STORAGE_KEY.DIFFICULTY, this.selectedDifficulty);
          this.cameras.main.fade(300, 0, 0, 0);
          this.time.delayedCall(300, () => {
            this.scene.start("GameScene");
          });
        },
      });
    });

    // Back button with animation
    const backButton = this.add
      .image(width - 25, height - 25, IMAGE_KEY.BACK_BUTTON)
      .setOrigin(0.5)
      .setScale(1.5)
      .setInteractive({ useHandCursor: true });

    this.configurationContainer.add(backButton);
    this.setupButtonAnimations(backButton);

    backButton.on("pointerdown", () => {
      if (this.sound.get(AUDIO_KEY.BUTTON)) {
        this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
      }

      this.tweens.add({
        targets: backButton,
        scale: 1.3,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.cameras.main.fade(300, 0, 0, 0);
          this.time.delayedCall(300, () => {
            this.scene.start("HomeScene");
          });
        },
      });
    });

    // Entry animation for the whole UI
    this.configurationContainer.setAlpha(0);
    this.tweens.add({
      targets: this.configurationContainer,
      alpha: 1,
      duration: 400,
      ease: "Power2",
    });
  }

  setupButtonAnimations(button) {
    button.on("pointerover", () => {
      this.tweens.add({
        targets: button,
        scale: button.scaleX * 1.1,
        duration: 100,
      });
    });

    button.on("pointerout", () => {
      this.tweens.add({
        targets: button,
        scale: button.scaleX / 1.1,
        duration: 100,
      });
    });
  }

  createThemeSelection(x, y) {
    // Title theme
    const titleText = this.add
      .text(x, y, "Theme", { ...STYLE_TEXT, fontSize: "22px" })
      .setOrigin(0.5);
    this.configurationContainer.add(titleText);

    // Options container
    const optionsContainer = this.add.container(x, y + 40);

    // Create slider background
    const sliderTrack = this.add.graphics();
    sliderTrack.fillStyle(0xdddddd, 0.6);
    sliderTrack.fillRoundedRect(-80, -15, 160, 30, 15);
    optionsContainer.add(sliderTrack);

    // Theme options
    const dayButton = this.createToggleButton(
      -40,
      0,
      "Day",
      this.selectedTheme === THEME.DAY,
      () => {
        this.updateTheme(THEME.DAY, daySlider, nightText);
      }
    );

    const nightButton = this.createToggleButton(
      40,
      0,
      "Night",
      this.selectedTheme === THEME.NIGHT,
      () => {
        this.updateTheme(THEME.NIGHT, nightSlider, dayText);
      }
    );

    const dayText = dayButton.text;
    const nightText = nightButton.text;

    // Slider indicator
    const sliderX = this.selectedTheme === THEME.DAY ? -40 : 40;
    const daySlider = this.add.graphics();
    daySlider.fillStyle(0x3498db, 1);
    daySlider.fillRoundedRect(sliderX - 40, -15, 80, 30, 15);
    daySlider.setAlpha(0.9);

    const nightSlider = daySlider;

    optionsContainer.add([
      daySlider,
      dayButton.container,
      nightButton.container,
    ]);
    this.configurationContainer.add(optionsContainer);

    if (this.selectedTheme === THEME.DAY) {
      dayText.setColor("#FFFFFF");
    } else {
      nightText.setColor("#FFFFFF");
    }
  }

  createBirdColorSelection(x, y) {
    // Title bird color
    const titleContainer = this.add.container(x, y);
    // BIRD
    const birdKey =
      this.selectedBirdColor === BIRD_COLOR.BLUE
        ? SPRITE_SHEETS_KEY.BIRD_BLUE
        : this.selectedBirdColor === BIRD_COLOR.RED
        ? SPRITE_SHEETS_KEY.BIRD_RED
        : SPRITE_SHEETS_KEY.BIRD_YELLOW;
    this.bird = this.add.sprite(55, -5, birdKey).setOrigin(0.5);

    const titleText = this.add
      .text(-20, 0, "Bird Color", { ...STYLE_TEXT, fontSize: "22px" })
      .setOrigin(0.5);

    titleContainer.add([this.bird, titleText]);
    this.configurationContainer.add(titleContainer);

    // Options
    const optionsContainer = this.add.container(x, y + 50);

    // Color indicators
    const blueColor = this.add.graphics();
    blueColor.fillStyle(0x3498db, 1);
    blueColor.fillCircle(-80, 0, 15);

    const redColor = this.add.graphics();
    redColor.fillStyle(0xe74c3c, 1);
    redColor.fillCircle(0, 0, 15);

    const yellowColor = this.add.graphics();
    yellowColor.fillStyle(0xf1c40f, 1);
    yellowColor.fillCircle(80, 0, 15);

    // Selection rings
    const blueRing = this.createSelectionRing(
      -80,
      0,
      this.selectedBirdColor === BIRD_COLOR.BLUE
    );
    const redRing = this.createSelectionRing(
      0,
      0,
      this.selectedBirdColor === BIRD_COLOR.RED
    );
    const yellowRing = this.createSelectionRing(
      80,
      0,
      this.selectedBirdColor === BIRD_COLOR.YELLOW
    );

    // Make colors interactive
    blueColor.setInteractive(
      new Phaser.Geom.Circle(-80, 0, 15),
      Phaser.Geom.Circle.Contains
    );
    redColor.setInteractive(
      new Phaser.Geom.Circle(0, 0, 15),
      Phaser.Geom.Circle.Contains
    );
    yellowColor.setInteractive(
      new Phaser.Geom.Circle(80, 0, 15),
      Phaser.Geom.Circle.Contains
    );

    optionsContainer.add([
      blueColor,
      redColor,
      yellowColor,
      blueRing,
      redRing,
      yellowRing,
    ]);
    this.configurationContainer.add(optionsContainer);

    // Add interactions
    this.setupColorInteraction(
      blueColor,
      blueRing,
      [redRing, yellowRing],
      BIRD_COLOR.BLUE
    );
    this.setupColorInteraction(
      redColor,
      redRing,
      [blueRing, yellowRing],
      BIRD_COLOR.RED
    );
    this.setupColorInteraction(
      yellowColor,
      yellowRing,
      [blueRing, redRing],
      BIRD_COLOR.YELLOW
    );
  }

  createDifficultySelection(x, y) {
    // Title
    const titleText = this.add
      .text(x, y, "Difficulty", { ...STYLE_TEXT, fontSize: "22px" })
      .setOrigin(0.5);
    this.configurationContainer.add(titleText);

    // Options container
    const optionsContainer = this.add.container(x, y + 40);

    const buttonWidth = 80;
    const buttonHeight = 36;
    const buttonSpacing = 10;
    const totalWidth = buttonWidth * 3 + buttonSpacing * 2;
    const startX = -(totalWidth / 2) + buttonWidth / 2 - 50;

    const buttonsData = [
      {
        key: DIFFICULTY.NORMAL,
        text: "Normal",
        xOffset: startX,
        fillColorSelected: 0x27ae60,
        fillColorDefault: 0xdddddd,
      },
      {
        key: DIFFICULTY.MEDIUM,
        text: "Medium",
        xOffset: startX + buttonWidth + buttonSpacing,
        fillColorSelected: 0x27ae60,
        fillColorDefault: 0xdddddd,
      },
      {
        key: DIFFICULTY.HARD,
        text: "Hard",
        xOffset: startX + buttonWidth * 2 + buttonSpacing * 2,
        fillColorSelected: 0x27ae60,
        fillColorDefault: 0xdddddd,
      },
    ];

    this.difficultyButtons = {};

    buttonsData.forEach((buttonData) => {
      const buttonBg = this.add.graphics();
      buttonBg.fillStyle(
        this.selectedDifficulty === buttonData.key
          ? buttonData.fillColorSelected
          : buttonData.fillColorDefault,
        1
      );
      buttonBg.fillRoundedRect(
        -(buttonWidth / 2),
        -(buttonHeight / 2),
        buttonWidth,
        buttonHeight,
        10
      );

      const buttonText = this.add
        .text(0, 0, buttonData.text, {
          ...STYLE_TEXT,
          fontSize: "16px",
          color:
            this.selectedDifficulty === buttonData.key ? "#FFFFFF" : "#000000",
        })
        .setOrigin(0.5);

      const buttonContainer = this.add.container(buttonData.xOffset + 50, 0);
      buttonContainer.add([buttonBg, buttonText]);

      this.difficultyButtons[buttonData.key] = {
        bg: buttonBg,
        text: buttonText,
        container: buttonContainer,
      };

      optionsContainer.add(buttonContainer);

      buttonContainer
        .setInteractive(
          new Phaser.Geom.Rectangle(
            -(buttonWidth / 2),
            -(buttonHeight / 2),
            buttonWidth,
            buttonHeight
          ),
          Phaser.Geom.Rectangle.Contains
        )
        .on("pointerdown", () => {
          this.updateDifficultySelection(buttonData.key);
        });
    });

    this.configurationContainer.add(optionsContainer);
  }

  updateDifficultySelection(difficulty) {
    if (this.sound.get(AUDIO_KEY.BUTTON)) {
      this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
    }

    this.selectedDifficulty = difficulty;

    for (const key in this.difficultyButtons) {
      const button = this.difficultyButtons[key];
      const isSelected = key === difficulty;
      const fillColor = isSelected ? 0x27ae60 : 0xdddddd;
      const textColor = isSelected ? "#FFFFFF" : "#000000";

      button.bg.clear();
      button.bg.fillStyle(fillColor, 1);
      button.bg.fillRoundedRect(-(80 / 2), -(36 / 2), 80, 36, 10);

      this.tweens.add({
        targets: button.text,
        color: textColor,
        duration: 200,
      });

      if (isSelected) {
        this.tweens.add({
          targets: button.bg,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100,
          yoyo: true,
        });
      } else {
        button.bg.setScale(1);
      }
    }
  }

  createToggleButton(x, y, text, isSelected, callback) {
    const container = this.add.container(x, y);
    const buttonText = this.add
      .text(0, 0, text, {
        ...STYLE_TEXT,
        fontSize: "16px",
        color: isSelected ? "#FFFFFF" : "#000000",
      })
      .setOrigin(0.5);
    container.add(buttonText);
    container
      .setInteractive(
        new Phaser.Geom.Rectangle(-40, -15, 80, 30),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerdown", callback);
    return { container, text: buttonText };
  }

  createSelectionRing(x, y, isSelected) {
    const ring = this.add.graphics();
    ring.lineStyle(3, 0xffffff, 1);
    ring.strokeCircle(x, y, 20);
    ring.setVisible(isSelected);

    // Add pulse animation if selected
    if (isSelected) {
      this.tweens.add({
        targets: ring,
        alpha: { from: 0.5, to: 1 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    }

    return ring;
  }

  setupColorInteraction(colorObj, ring, otherRings, colorValue) {
    colorObj.on("pointerdown", () => {
      if (this.sound.get(AUDIO_KEY.BUTTON)) {
        this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
      }

      // Show selection ring
      ring.setVisible(true);

      // Add pulse animation
      this.tweens.add({
        targets: ring,
        alpha: { from: 0.5, to: 1 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      // Hide other rings
      otherRings.forEach((otherRing) => {
        otherRing.setVisible(false);
      });

      // Update selected color
      this.selectedBirdColor = colorValue;
    });
  }

  updateTheme(themeValue, slider, textToHighlight) {
    const theme = getLocalStorage(STORAGE_KEY.THEME) || THEME.DAY;
    // Play click sound if available
    if (this.sound.get(AUDIO_KEY.BUTTON)) {
      this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
    }

    // Animate slider
    let targetX = themeValue === THEME.DAY ? -80 : 0;
    if (theme === THEME.DAY) {
      targetX = themeValue === THEME.DAY ? 0 : 80;
    }

    this.tweens.add({
      targets: slider,
      x: targetX,
      duration: 200,
      ease: "Power2",
    });

    // Update text colors
    this.tweens.add({
      targets: textToHighlight,
      color: "#FFFFFF",
      duration: 200,
    });

    // Update other text
    const otherText =
      themeValue === THEME.DAY
        ? this.children.getByName("nightText")
        : this.children.getByName("dayText");

    if (otherText) {
      this.tweens.add({
        targets: otherText,
        color: "#000000",
        duration: 200,
      });
    }

    // Update selected theme
    this.selectedTheme = themeValue;
  }

  update() {
    // Background
    const backgroundKey =
      this.selectedTheme === THEME.DAY
        ? IMAGE_KEY.BACKGROUND_DAY
        : IMAGE_KEY.BACKGROUND_NIGHT;
    this.background.setTexture(backgroundKey);

    // Bird
    const birdKey =
      this.selectedBirdColor === BIRD_COLOR.BLUE
        ? SPRITE_SHEETS_KEY.BIRD_BLUE
        : this.selectedBirdColor === BIRD_COLOR.RED
        ? SPRITE_SHEETS_KEY.BIRD_RED
        : SPRITE_SHEETS_KEY.BIRD_YELLOW;
    this.bird.setTexture(birdKey);
  }
}

export default ConfigurationScene;
