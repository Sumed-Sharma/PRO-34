const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var player, playerArcher;
var playerArrows = [];
var numberOfArrows = 10;
var backgroundImg;
var ghost, ghostImg;

var score = 0;

function preload() {
  backgroundImg = loadImage("background.jpg");
  ghostImg = loadImage("ghost-standing.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  player = new Player(300,  400, 50, 180);
  playerArcher = new PlayerArcher(
    300,
    300,
    120,
    120
  );

  ghost = new Ghost(width - 300, height - 300, 100, 180);
}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  player.display();
  playerArcher.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      var ghostCollision = Matter.SAT.collides(
        ghost.body,
        playerArrows[i].body
      );

      if (ghostCollision.collided) {
        score += 5;
        ghost.remove(i);
        Matter.World.remove(world, playerArrows[i].body);
        playerArrows.splice(i, 1);
        i--;
      }

      var posX = playerArrows[i].body.position.x;
      var posY = playerArrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          playerArrows[i].remove(i);
        } else {
          playerArrows[i].trajectory = [];
        }
      }
    }
  }

  ghost.display();

  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Score " + score, width - 200, 100);

  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 100);

  if (numberOfArrows == 0) {
    gameOver();
  }
}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}
var ghostBody;
function spawnGhost() {
  if (frameCount % 60 === 0) {
    var ghost = createSprite(width - 50, height - 50, 50, 50);
    ghost.addImage(ghostImg);
    ghost.scale = 0.3;
    ghost.velocityX = -3;
    ghost.life = 300;
    ghostBody = Bodies.rectangle(ghost.position.x, ghost.position.y, ghost.width, ghost.height);
    Matter.Body.setVelocity(ghostBody, { x: -3, y: 0 });
    ghostGroup.add(ghost);
  }
}

