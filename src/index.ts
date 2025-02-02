import GameRuntime from "./modules/GameRuntime.js";

const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = (3 * canvas.width) / 5;

// Start game after window loading
window.onload = () => {
  if (context) {
    const loopTimeout = 1000 / 60;

    GameRuntime.setup();

    setInterval(
      GameRuntime.loop,
      loopTimeout,
      context,
      canvas.width,
      canvas.height
    );
  }
};
