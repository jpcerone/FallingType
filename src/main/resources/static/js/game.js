var params = {
  fullscreen: true
};
var elem = document.body;
var two = new Two(params).appendTo(elem);

var audioElementMusic = document.createElement('audio');
audioElementMusic.setAttribute('src','sound/music.mp3');
audioElementMusic.setAttribute('autoplay','autoplay');
audioElementMusic.loop = true;
audioElementMusic.play();

var testText = "Failure is not the end; it's a detour on the road to success. Everyone stumbles and falls along the way, but what truly matters is how you respond. Instead of letting setbacks discourage you, view them as valuable learning experiences. Analyze what went wrong, extract the lessons, adjust your approach, and keep moving forward with renewed determination. Remember, every successful person has encountered failure at some point. It's through these challenges that we grow stronger, wiser, and more resilient.";

var groupText = two.makeGroup();
var groupUserBox = two.makeGroup();
var xDelta = 0;
testText.split('').forEach(char => {
  var charObj = two.makeText(char);
  charObj.scale = 1.5;
  charObj.position = new Two.Vector(xDelta,0);
  charObj.addTo(groupText);
  xDelta += 13;
});

var userBox = two.makeRectangle(0,0,30,80);
userBox.noFill(); //Remove fill color
userBox.stroke = '#000000'; // Set stroke color to black
userBox.linewidth = 2; // Set stroke width to 5
userBox.opacity = .6;
userBox.addTo(groupUserBox);

var scoreText = two.makeText("Score: 0");
scoreText.scale = 2;
scoreText.position = new Two.Vector(0,-150);
scoreText.addTo(groupUserBox);

var healthText = two.makeText("Health: 5");
healthText.scale = 2;
healthText.position = new Two.Vector(0,-250);
healthText.addTo(groupUserBox);


var cx = two.width*0.40;
var cy = two.height * 0.3;

var userBoxX = two.width*0.3;
var userBoxY = two.height*0.3;

groupText.position.set(cx, cy);
groupText.noStroke();

groupUserBox.position.set(userBoxX,userBoxY);


//game vals
var currentLetter = groupText.children[0].value;
var currentIndex = 0;
var pressedKey = "";
var health = 5;
var score = 0;


two.bind('update', update);
// Finally, start the animation loop
two.play();

var gameSpeedModifier = 0.40;

function update(frameCount) {
    if(health > 0){
        var moddedGameSpeed = frameCount * gameSpeedModifier;

//        if(currentIndex % 25 == 0){
//            gameSpeedModifier =+ gameSpeedModifier * .05;
//            audioElementMusic.playbackRate = 1 + (currentIndex* .01);
//        }

        userBox.scale = 1;

        var curLetterObj = groupText.children[currentIndex];

        var curLetterX = groupText.position.x + curLetterObj.position.x;
        var isOnBox = false;
        if(Math.abs(curLetterX - userBoxX) < 10){
            isOnBox = true;
            curLetterObj.scale = 2;
            if(currentLetter == " "){
                userBox.scale = 1.3;
            }
        }
        if(currentLetter == pressedKey && isOnBox){
            var nextChild = groupText.children[currentIndex+1];
            groupText.children[currentIndex].opacity = 0;
            currentLetter = nextChild.value;
            currentIndex++;
            pressedKey = "";
            score++;
            score += Math.round(Math.abs(curLetterX - userBoxX));
        }
        else if(!isOnBox && curLetterX < userBoxX ){
            var nextChild = groupText.children[currentIndex+1];
            groupText.children[currentIndex].opacity = 0;
            currentLetter = nextChild.value;
            currentIndex++;
            pressedKey = "";
            health--;
        }
        scoreText.value = "Score: " + score;
        healthText.value = "Health: " + health;


        groupText.position.set(cx-moddedGameSpeed,cy);
    }else{
        audioElementMusic.pause();
    }
}
document.addEventListener('keydown', function(event) {
  const key = event.key;
  pressedKey = key;
});