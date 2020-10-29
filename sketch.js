var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var feed, addFood;
var bedroom,washroom,garden;

function preload(){
   dogImg=loadImage("images/Dog.png");
   dogImg1=loadImage("images/happy dog.png");
   bedroom=loadImage("virtual pet images/Bed Room.png");
   washroom=loadImages("virtual pet images/Wash Room.png");
   garden= loadImages("virtual pet images/Garden.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(500,500);

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed = createButton("Feed the dog");
  feed.position(700,95)
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  // read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
}

// function to display UI
function draw() {
  background(46,139,87);
 

  drawSprites();
  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
  text("Last Feed : "+lastFed%12 + " PM",350,30);
  }else if(lastFed == 0){
  text("Last Feed : 12 AM",350,30);
  }else{
  text("Last Feed : "+ lastFed + " AM" ,350,30);
}
 
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}

// Function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

 foodObj.updateFoodStock(foodObj.getFoodStock()-1);
 database.ref('/').update({
   Food:foodObj.getFoodStock(),
   FeedTime:hour()
 })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  // function to update gameStates in database
  function update(state){
    database.ref('/').update({
      gameState: state
    });
  }

 currentTime = hour();
 if(currentTime==(lastFed+1)){
   update("playing");
   foodObj.garden();
 }else if(currentTime==(lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
 }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
 }else{
  update("hungry");
  foodObj.display();
 }
 
  
}


 
2