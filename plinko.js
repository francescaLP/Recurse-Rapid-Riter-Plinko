//plinko by francesca pettigrew
var g = 0.6;
var xCap = 1;
var yCap = 1;

function checkCircleCollision(ball,obj){
  let distX = ball.pos.x - obj.pos.x;
  let distY = ball.pos.y - obj.pos.y;

  let d = sqrt((distX*distX) + (distY*distY));

  if(d <= ball.size/2+obj.size/2){
    return true;
  } else {
    return false;
  }
}

class Ball{
  constructor(pos,size,stat,main){
    this.pos = pos;
    this.size = size;
    this.stat = stat;
    this.acc = createVector(0,0);
    this.vel = createVector(0,0);
    this.main = main;
    this.isColliding = false;
  }

  

  update(){
    //console.log(this.pos);
    this.checkWalls();
    this.acc.add(g);
    this.vel.add(this.acc);
    if(abs(this.vel.x) > xCap){
      this.vel.x = xCap;
    }
    if(this.vel.y < -yCap*.8){
      this.vel.y = -yCap*.8;
    }
    this.pos.add(this.vel);
    this.acc = createVector(0,0);
  }

  checkWalls(){
    if(this.pos.x >= width-(this.size/2)){
      this.pos.x = width-(this.size/2)
      this.vel.x = -this.vel.x * .9;
    } else if(this.pos.x <= this.size/2){
      this.pos.x = this.size/2;
      this.vel.x = -this.vel.x * .9;
    }
    if(this.pos.y <= this.size/2){
      this.pos.y = this.size/2;
      this.vel.y = -this.vel.y;
    }
  }

  addForce(f){
    this.vel.add(f);
    //console.log(f);
  }

  checkCircColl(obj){
    let hit = checkCircleCollision(this,obj);

    //Have to make sure we're not applying the force multiple times while they overlap, need to have "isColliding" boolean

    // get direction and normalize so I can multiply by bounciness number
    if(hit && !this.isColliding){
      this.isColliding = true
      let bounceForce = createVector(((this.pos.x - obj.pos.x)*.5),(this.pos.y - obj.pos.y)*.5).normalize().mult(.3);
      //console.log(bounceForce);
      this.addForce(bounceForce);
      
    } else if(!hit){
      this.isColliding = false;
    }
  }

  display(){
    if(this.stat){
      circle(this.pos.x,this.pos.y,this.size);
    } else {
      circle(this.pos.x,18,this.size);
    }
  }
}

class wall{
  constructor(pos,w,h,a){
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.a = a;
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    rotate(this.a);
    rect(0,0,this.w,this.h);
    resetMatrix();
    pop();
 
  }

}
ball = null;
walls = [];
balls = [];

function makeWalls(){
  walls.push(new wall(createVector(20,60),5,40,-45));
  walls.push(new wall(createVector(width-20,60),5,40,45));
}



function makeBalls(num,startPos,size){
  flipper = false;
  for(let i=0;i<num;i++){
    flipper = !flipper;
    for(let j=0;j<5; j++){
      if(flipper){
        balls.push(new Ball(createVector(j*18 + 18,i*20 + startPos),size,true));
      } else {
        balls.push(new Ball(createVector(j*18 + 14,i*20 + startPos),size,true));
      }
    }
  }
}
let cam;

function setup() {
  angleMode(DEGREES)
  createCanvas(96, 36);
  rectMode(CENTER);
  makeBalls(4,100,6);
  makeBalls(4,180,8)
  makeBalls(4,260,10)
  ball = new Ball(createVector(random((width/2)-18,width/2+18),18),6,false);
  makeWalls();
  g = createVector(0,.01);
  
}

function draw() {
  noStroke();
  background(255);
  fill(0);
  push();
  for(let i=0;i<walls.length;i++){
    walls[i].display();
  }
  translate(0,-(ball.pos.y-18));
  for(let i=0;i<balls.length;i++){
    balls[i].display();
    ball.checkCircColl(balls[i]);
  }
  pop();
  //ball.checkWalls();
  ball.update();
  ball.display();
  
}
