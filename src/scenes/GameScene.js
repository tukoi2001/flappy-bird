class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "Game Scene",
        {
          fontSize: "20px",
        }
      )
      .setOrigin(0.5);
  }
}

export default GameScene;
