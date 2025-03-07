import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import MainScene from "./scenes/MainScene";
import HomeScene from "./scenes/HomeScene";
import GameScene from "./scenes/GameScene";
import BestScoreScene from "./scenes/BestScoreScene";
import ConfigurationScene from "./scenes/ConfigurationScene";
import PauseScene from "./scenes/PauseScene";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 288,
  height: 512,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  scene: [
    BootScene,
    MainScene,
    HomeScene,
    GameScene,
    BestScoreScene,
    ConfigurationScene,
    PauseScene,
  ],
};

new Phaser.Game(config);
