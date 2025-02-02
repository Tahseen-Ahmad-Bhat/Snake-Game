type Direction = "left" | "up" | "right" | "down";

type Position = {
  x: number;
  y: number;
};

type GameState = {
  playerSize: number;
  playerPosition: Position;
  playerSprite: HTMLImageElement;
  foodPosition: Position;
  direction: Direction;
  speed: number;
  gameOver: boolean;
  score: number;
  foodSize: number;
};

// Resources
const snakeUp = new Image();
snakeUp.src = "spriteImages/snake-up.png";
const snakeRight = new Image();
snakeRight.src = "spriteImages/snake-right.png";
const snakeDown = new Image();
snakeDown.src = "spriteImages/snake-down.png";
const snakeLeft = new Image();
snakeLeft.src = "spriteImages/snake-left.png";
const apple = new Image();
apple.src = "spriteImages/apple.png";

class GameRuntime {
  static gameState: GameState = {
    playerSize: 50,
    playerPosition: { x: 0, y: 0 },
    playerSprite: snakeRight,
    foodPosition: { x: 100, y: 100 },
    direction: "right",
    speed: 1,
    gameOver: false,
    score: 0,
    foodSize: 24,
  };

  static newPlayerPos = (
    posX: number,
    posY: number,
    direction: Direction,
    speed: number
  ): Position => {
    switch (direction) {
      case "left":
        return { x: posX - speed, y: posY };
      case "up":
        return { x: posX, y: posY - speed };
      case "right":
        return { x: posX + speed, y: posY };
      case "down":
        return { x: posX, y: posY + speed };
    }
  };

  static newPlayerSprite = (direction: Direction): HTMLImageElement => {
    switch (direction) {
      case "left":
        return snakeLeft;
      case "right":
        return snakeRight;
      case "up":
        return snakeUp;
      case "down":
        return snakeDown;
    }
  };

  static squaresOverlap = (
    p1: Position,
    s1: number,
    p2: Position,
    s2: number
  ): boolean => {
    const p1LeftOfp2 = p1.x + s1 < p2.x;
    const p1RightOfp2 = p1.x > p2.x + s2;
    const p1Abovep2 = p1.y + s1 < p2.y;
    const p1Belowp2 = p1.y > p2.y + s2;

    return !(p1LeftOfp2 || p1RightOfp2 || p1Abovep2 || p1Belowp2);
  };

  // Create new random food position
  static newFoodPos = (canvasWidth: number, canvasHeight: number): Position => {
    return {
      x: Math.random() * (canvasWidth - GameRuntime.gameState.foodSize),
      y: Math.random() * (canvasHeight - GameRuntime.gameState.foodSize),
    };
  };

  // key Press Handler
  static keyDownHandler = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ArrowLeft":
        GameRuntime.gameState.direction = "left";
        break;
      case "ArrowUp":
        GameRuntime.gameState.direction = "up";
        break;
      case "ArrowRight":
        GameRuntime.gameState.direction = "right";
        break;
      case "ArrowDown":
        GameRuntime.gameState.direction = "down";
        break;
    }
  };

  // Listen key press
  static setup = () => {
    document.addEventListener("keydown", this.keyDownHandler);
  };

  static loop = (
    context: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const {
      playerPosition,
      direction,
      speed,
      playerSize,
      gameOver,
      foodPosition,
      foodSize,
      score,
    } = GameRuntime.gameState;

    const newPosition = GameRuntime.newPlayerPos(
      playerPosition.x,
      playerPosition.y,
      direction,
      speed
    );

    const newPlayerSprite = GameRuntime.newPlayerSprite(direction);

    // Check game over for boundary collision
    const isGameOver =
      newPosition.x < 0 ||
      newPosition.x > canvasWidth - playerSize ||
      newPosition.y < 0 ||
      newPosition.y > canvasHeight - playerSize ||
      gameOver;

    // Check for overlap and create new food position if required
    const foodEaten = GameRuntime.squaresOverlap(
      playerPosition,
      playerSize,
      foodPosition,
      foodSize
    );
    const newFoodPosition = foodEaten
      ? GameRuntime.newFoodPos(canvasWidth, canvasHeight)
      : foodPosition;

    // Check state conditionally
    if (isGameOver) {
      GameRuntime.gameState = {
        ...GameRuntime.gameState,
        gameOver: true,
      };
    } else {
      GameRuntime.gameState = {
        ...GameRuntime.gameState,
        playerPosition: newPosition,
        playerSprite: newPlayerSprite,
        foodPosition: newFoodPosition,
        score: foodEaten ? score + 1 : score,
        speed: foodEaten ? speed + 1 : speed,
      };
    }

    this.draw(context, canvasWidth, canvasHeight, GameRuntime.gameState);
  };

  private static draw = (
    context: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    gameState: GameState
  ) => {
    const {
      score,
      speed,
      gameOver,
      playerSize,
      playerPosition,
      playerSprite,
      foodPosition,
      foodSize,
    } = gameState;

    // console.log("Draw fired");

    context.font = "18px arial";
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillText(
      `Blake the snake - Score: ${score}, Speed: ${speed}`,
      30,
      30
    );
    context.drawImage(
      playerSprite,
      playerPosition.x,
      playerPosition.y,
      playerSize,
      playerSize
    );
    context.drawImage(
      apple,
      foodPosition.x,
      foodPosition.y,
      foodSize,
      foodSize
    );

    context.font = "30px arial";
    context.fillStyle = "red";
    gameOver &&
      context.fillText("GAME OVER", canvasWidth / 2 - 50, canvasHeight / 2);
  };
}

export default GameRuntime;
