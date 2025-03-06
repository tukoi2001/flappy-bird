import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import MainScene from "./scenes/MainScene";
import HomeScene from "./scenes/HomeScene";
import GameScene from "./scenes/GameScene";
import BestScoreScene from "./scenes/BestScoreScene";
import ConfigurationScene from "./scenes/ConfigurationScene";

const config = {
  type: Phaser.AUTO,
  width: 288,
  height: 512,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300,
      },
    },
  },
  scene: [
    BootScene,
    MainScene,
    HomeScene,
    GameScene,
    BestScoreScene,
    ConfigurationScene,
  ],
};

new Phaser.Game(config);
