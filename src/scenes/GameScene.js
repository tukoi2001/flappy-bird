import { ANIMATION_KEY } from "../constants/animation-key";
import {
  AUDIO_KEY,
  IMAGE_KEY,
  SPRITE_SHEETS_KEY,
} from "../constants/assets-key";
import { DEFAULT_SCORE, NUMBER_MAP, STYLE_TEXT } from "../constants/common";
import {
  BIRD_COLOR,
  DIFFICULTY,
  PIPE_COLOR,
  THEME,
} from "../constants/configuration";
import { STORAGE_KEY } from "../constants/storage-key";
import { getLocalStorage, setLocalStorage } from "../utils/storage";
import PauseScene from "./PauseScene";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.background = null;
    this.gapsGroup = null;
    this.pipesGroup = null;
    this.scoreboardGroup = null;
    this.ground = null;
    this.messageInitial = null;
    this.upButton = null;
    this.gameOverBanner = null;
    this.restartButton = null;
    this.pauseButton = null;
    this.player = null;
    this.width = null;
    this.height = null;
    this.gameOver = false;
    this.gameStarted = false;
    this.framesMoveUp = 0;
    this.nextPipes = 0;
    this.currentPipe = null;
    this.score = 0;
    this.backButton = null;
    this.birdName = SPRITE_SHEETS_KEY.BIRD_BLUE;
    this.theme = getLocalStorage(STORAGE_KEY.THEME) || THEME.DAY;
    this.birdColor = getLocalStorage(STORAGE_KEY.BIRD_COLOR) || BIRD_COLOR.BLUE;
    this.selectedDifficulty =
      getLocalStorage(STORAGE_KEY.DIFFICULTY) || DIFFICULTY.NORMAL;
    this.bestScore = getLocalStorage(STORAGE_KEY.BEST_SCORE) || DEFAULT_SCORE;
    this.pipeGapSize = 98;
    this.pipeFrequency = 130;
    this.isPaused = false;
    this.pauseEvent = null;
    this.createEvent = null;
    this.countDownText = null;
    this.initialTime = 0;
  }

  create() {
    this.birdColor = getLocalStorage(STORAGE_KEY.BIRD_COLOR) || BIRD_COLOR.BLUE;
    this.theme = getLocalStorage(STORAGE_KEY.THEME) || THEME.DAY;
    this.selectedDifficulty =
      getLocalStorage(STORAGE_KEY.DIFFICULTY) || DIFFICULTY.NORMAL;
    this.bestScore = getLocalStorage(STORAGE_KEY.BEST_SCORE) || DEFAULT_SCORE;
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
    // Create instance
    this.input.setDefaultCursor("pointer");
    this.gapsGroup = this.add.group();
    this.pipesGroup = this.physics.add.group();
    this.scoreboardGroup = this.physics.add.staticGroup();

    // Background
    const backgroundKey =
      this.theme === THEME.DAY
        ? IMAGE_KEY.BACKGROUND_DAY
        : IMAGE_KEY.BACKGROUND_NIGHT;
    this.background = this.add
      .image(this.width / 2, this.height / 2, backgroundKey)
      .setOrigin(0.5)
      .setInteractive();
    this.background.on("pointerdown", this.moveBird.bind(this));

    // Ground
    this.ground = this.physics.add
      .sprite(this.width / 2, 458, SPRITE_SHEETS_KEY.GROUND)
      .setOrigin(0.5);
    this.ground.setCollideWorldBounds(true);
    this.ground.setDepth(10);

    // Message
    this.messageInitial = this.add
      .image(this.width / 2, this.height / 2 - 50, IMAGE_KEY.MESSAGE_INITIAL)
      .setOrigin(0.5);
    this.messageInitial.setDepth(30);
    this.messageInitial.visible = false;

    // Up button
    this.upButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );
    this.listenToEvents();
    this.prepareGame();

    // Game over
    this.gameOverBanner = this.add.image(
      this.width / 2,
      206,
      IMAGE_KEY.GAME_OVER
    );
    this.gameOverBanner.setDepth(20);
    this.gameOverBanner.visible = false;

    // Restart button
    this.restartButton = this.add
      .image(this.width / 2, 300, IMAGE_KEY.RESTART_BUTTON)
      .setInteractive();
    this.restartButton.on("pointerdown", this.restartGame.bind(this));
    this.restartButton.setDepth(20);
    this.restartButton.visible = false;

    // Pause button
    this.pauseButton = this.add
      .image(0 + 25, this.height - 25, IMAGE_KEY.PAUSE_BUTTON)
      .setDepth(11)
      .setInteractive({ useHandCursor: true })
      .setScale(2.1)
      .setOrigin(0.5);
    this.pauseButton.visible = false;

    this.pauseButton.on("pointerdown", () => {
      this.pauseButton.disableInteractive();
      if (!this.scene.get("PauseScene")) {
        this.scene.add("PauseScene", PauseScene);
      }
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });

    // Back button
    this.backButton = this.add
      .image(this.width - 25, this.height - 25, IMAGE_KEY.BACK_BUTTON)
      .setOrigin(0.5)
      .setScale(1.5)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });
    this.backButton.on("pointerdown", () => {
      if (this.sound.get(AUDIO_KEY.BUTTON)) {
        this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
      }
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.stop();
        this.scene.start("HomeScene");
      });
    });
  }

  listenToEvents() {
    if (this.pauseEvent) return;
    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          this.width / 2,
          this.height / 2,
          "Fly in: " + this.initialTime,
          STYLE_TEXT
        )
        .setOrigin(0.5)
        .setDepth(30);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText("Fly in: " + this.initialTime);
    if (this.initialTime <= 0) {
      this.pauseButton.setInteractive({ useHandCursor: true });
      this.isPaused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  restartGame() {
    this.sound.play(AUDIO_KEY.BUTTON, { volume: 1 });
    this.pipesGroup.clear(true, true);
    this.gapsGroup.clear(true, true);
    this.scoreboardGroup.clear(true, true);
    this.player.destroy();
    this.gameOverBanner.visible = false;
    this.restartButton.visible = false;
    this.pauseButton.visible = false;
    this.backButton.visible = true;
    this.prepareGame();
    this.physics.resume();
  }

  prepareGame() {
    this.framesMoveUp = 0;
    this.nextPipes = 0;
    if (this.selectedDifficulty === DIFFICULTY.MEDIUM) {
      this.pipeFrequency = 110;
    } else if (this.selectedDifficulty === DIFFICULTY.HARD) {
      this.pipeFrequency = 90;
    } else {
      this.pipeFrequency = 130;
    }
    this.currentPipe =
      this.theme === THEME.DAY ? PIPE_COLOR.GREEN : PIPE_COLOR.RED;
    this.score = 0;
    this.gameOver = false;
    this.messageInitial.visible = true;
    this.birdName = this.getBirdName();
    this.player = this.physics.add.sprite(60, 265, this.birdName);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play(this.getAnimationBirdClapWings(), true);
    this.player.body.gravity.y = 600;
    this.player.body.allowGravity = false;
    this.physics.add.collider(
      this.player,
      this.ground,
      this.hitBird,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.pipesGroup,
      this.hitBird,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.gapsGroup,
      this.updateScore,
      null,
      this
    );
    this.ground.anims.play(ANIMATION_KEY.GROUND_MOVING, true);
  }

  hitBird(player) {
    this.sound.play(AUDIO_KEY.HIT, { volume: 1 });
    this.physics.pause();
    this.gameOver = true;
    this.gameStarted = false;
    player.anims.play(this.getAnimationBirdStop());
    this.ground.anims.play(ANIMATION_KEY.GROUND_STOP);
    this.sound.play(AUDIO_KEY.DIE, { volume: 1 });
    this.pauseButton.visible = false;
    this.gameOverBanner.visible = true;
    this.restartButton.visible = true;
    this.saveBestScore();
  }

  updateScore(_player, gap) {
    this.score++;
    gap.destroy();
    this.updateScoreboard();
  }

  updateScoreboard() {
    this.sound.play(AUDIO_KEY.POINT, { volume: 1 });
    this.scoreboardGroup.clear(true, true);
    const scoreText = String(this.score);
    const charWidth = 40;
    const centerX = this.width / 2;
    if (scoreText.length === 1) {
      this.scoreboardGroup
        .create(centerX, 30, NUMBER_MAP[Number(scoreText)])
        .setOrigin(0.5);
    } else {
      let positionX = centerX - ((scoreText.length - 1) * charWidth) / 2;
      for (let i = 0; i < scoreText.length; i++) {
        this.scoreboardGroup
          .create(positionX, 30, NUMBER_MAP[Number(scoreText[i])])
          .setOrigin(0.5);
        positionX += charWidth;
      }
    }
    this.scoreboardGroup.setDepth(15);
  }

  makePipes() {
    if (!this.gameStarted || this.gameOver) return;

    let minPipeY = -120;
    let maxPipeY = 120;

    if (this.selectedDifficulty === DIFFICULTY.MEDIUM) {
      minPipeY = -100;
      maxPipeY = 100;
    } else if (this.selectedDifficulty === DIFFICULTY.HARD) {
      minPipeY = -80;
      maxPipeY = 80;
    }

    const pipeTopY = Phaser.Math.Between(minPipeY, maxPipeY);

    // Adjust gap size based on difficulty
    let gapSize = 98;

    if (this.selectedDifficulty === DIFFICULTY.MEDIUM) {
      gapSize = 85;
    } else if (this.selectedDifficulty === DIFFICULTY.HARD) {
      gapSize = 70;
    }

    let pipeX = 400;

    if (this.selectedDifficulty === DIFFICULTY.MEDIUM) {
      pipeX = 350;
    } else if (this.selectedDifficulty === DIFFICULTY.HARD) {
      pipeX = 300;
    }

    const gap = this.add.line(pipeX + 12, pipeTopY + 210, 0, 0, 0, gapSize);
    this.physics.add.existing(gap);
    gap.body.allowGravity = false;
    gap.visible = false;
    this.gapsGroup.add(gap);

    // Pipe top
    const pipeTop = this.pipesGroup.create(pipeX, pipeTopY, this.getPipeTop());
    pipeTop.body.allowGravity = false;

    // Pipe bottom
    const pipeBottom = this.pipesGroup.create(
      pipeX,
      pipeTopY + 420 + gapSize - 98,
      this.getPipeBottom()
    );
    pipeBottom.body.allowGravity = false;
  }

  getPipeTop() {
    switch (this.currentPipe) {
      case PIPE_COLOR.GREEN:
        return IMAGE_KEY.PIPE_GREEN_TOP;
      default:
        return IMAGE_KEY.PIPE_RED_TOP;
    }
  }

  getPipeBottom() {
    switch (this.currentPipe) {
      case PIPE_COLOR.GREEN:
        return IMAGE_KEY.PIPE_GREEN_BOTTOM;
      default:
        return IMAGE_KEY.PIPE_RED_BOTTOM;
    }
  }

  startGame() {
    this.gameStarted = true;
    this.messageInitial.visible = false;
    this.scoreboardGroup
      .create(this.width / 2, 30, NUMBER_MAP[0])
      .setOrigin(0.5)
      .setDepth(20);
    this.makePipes();
  }

  moveBird() {
    if (this.gameOver || this.isPaused) return;
    if (!this.gameStarted) {
      this.startGame();
    }
    this.backButton.visible = false;
    this.pauseButton.visible = true;
    this.sound.play(AUDIO_KEY.TOUCH, { volume: 1 });
    this.player.body.velocity.y = -300;
    this.player.angle = -15;
    this.framesMoveUp = 5;
  }

  getAnimationBirdClapWings() {
    switch (this.birdColor) {
      case BIRD_COLOR.BLUE:
        return ANIMATION_KEY.BIRD_BLUE_CLAP_WINGS;
      case BIRD_COLOR.RED:
        return ANIMATION_KEY.BIRD_RED_CLAP_WINGS;
      default:
        return ANIMATION_KEY.BIRD_YELLOW_CLAP_WINGS;
    }
  }

  getAnimationBirdStop() {
    switch (this.birdColor) {
      case BIRD_COLOR.BLUE:
        return ANIMATION_KEY.BIRD_BLUE_STOP;
      case BIRD_COLOR.RED:
        return ANIMATION_KEY.BIRD_RED_STOP;
      default:
        return ANIMATION_KEY.BIRD_YELLOW_STOP;
    }
  }

  getBirdName() {
    switch (this.birdColor) {
      case BIRD_COLOR.BLUE:
        return SPRITE_SHEETS_KEY.BIRD_BLUE;
      case BIRD_COLOR.RED:
        return SPRITE_SHEETS_KEY.BIRD_RED;
      default:
        return SPRITE_SHEETS_KEY.BIRD_YELLOW;
    }
  }

  saveBestScore() {
    const currentBestScoreForDifficulty =
      this.bestScore[this.selectedDifficulty];
    if (this.score > currentBestScoreForDifficulty) {
      this.bestScore[this.selectedDifficulty] = this.score;
      setLocalStorage(STORAGE_KEY.BEST_SCORE, this.bestScore);
    }
  }

  update() {
    if (this.gameOver || !this.gameStarted || this.isPaused) return;
    if (this.framesMoveUp > 0) this.framesMoveUp--;
    else if (Phaser.Input.Keyboard.JustDown(this.upButton)) {
      this.moveBird();
    } else {
      this.player.setVelocityY(120);
      if (this.player.angle < 90) this.player.angle += 1;
    }
    this.pipesGroup.children.iterate((child) => {
      if (child == undefined) return;

      if (child.x < -50) child.destroy();
      else child.setVelocityX(-100);
    });

    this.gapsGroup.children.iterate((child) => {
      child.x -= 2;
    });

    this.nextPipes++;
    if (this.nextPipes === this.pipeFrequency) {
      this.makePipes();
      this.nextPipes = 0;
    }
  }
}

export default GameScene;
