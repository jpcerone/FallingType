var params = {
  fullscreen: true
};
var elem = document.body;
var two = new Two(params).appendTo(elem);
var FRAMERATE = 30 / 1000; // This is like 30fps

var refreshRate = getRefreshRate();
var frameInterval;

var textFontFamily = "'Courier New', monospace";

var audioElementMusic = document.createElement('audio');
audioElementMusic.setAttribute('src','sound/music2.mp3');
audioElementMusic.loop = true;
audioElementMusic.playbackRate = .99; //get to 133.8


var testText = "Failure is not the end; it's a detour on the road to success. Everyone stumbles and falls along the way, but what truly matters is how you respond. Instead of letting setbacks discourage you, view them as valuable learning experiences. Analyze what went wrong, extract the lessons, adjust your approach, and keep moving forward with renewed determination. Remember, every successful person has encountered failure at some point. It's through these challenges that we grow stronger, wiser, and more resilient.";

var groupText = two.makeGroup();
var groupUserBox = two.makeGroup();
var xDelta = 0;
testText.split('').forEach(char => {
  if(char == " "){
    char = "_";
  }
  var charObj = two.makeText(char);
  charObj.family = textFontFamily;
  charObj.size = 20;
  charObj.position = new Two.Vector(xDelta,0);
  charObj.addTo(groupText);
  var boundingRect = charObj.getBoundingClientRect();

  xDelta += 50;
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

var levelText = two.makeText("Level 0");
levelText.scale = 2;
levelText.position = new Two.Vector(500,-250);
levelText.addTo(groupUserBox);


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
var health = 25;
var score = 0;
newGame();

var gameSpeedModifier = 1;//match bpm

var levelArray = [1500,3000,4500,6000,7500,9000];
var levelAdjust = 0;

var hits = 0;

var startTime;

var stopRepeat;

var animationFrameCounter = 0;


two.bind('update', update);

function update(frameCount) {
    if(health > 0){
        var moddedGameSpeed = (frameCount * gameSpeedModifier)+levelAdjust;

        if(levelArray.includes(frameCount)){
            //level modifiers
            var oldPlaybackRate = audioElementMusic.playbackRate;
            gameSpeedModifier = gameSpeedModifier + 0.3;
            levelText.value = "Level "+(levelArray.indexOf(frameCount) + 1);
            levelAdjust = moddedGameSpeed - (frameCount * gameSpeedModifier);
            audioElementMusic.playbackRate = oldPlaybackRate + 0.3;
        }

        userBox.scale = 1;

        var curLetterObj = groupText.children[currentIndex];

        var curLetterX = Math.round(groupText.position.x + curLetterObj.position.x);
        var isOnBox = false;
        if(Math.abs(curLetterX - userBoxX) < 12){
            isOnBox = true;
            curLetterObj.scale = 2;
        }

        if(currentLetter == pressedKey && isOnBox){
            removeCurrentLetter();
            score++;
            var accuracyVal = Math.round(Math.abs(curLetterX - userBoxX));
            score += (10-accuracyVal);
            phoneHome();
            if (accuracyVal < 3){
                scoreText.stroke = '#71eb34';
                userBox.scale = 1.3;
            }else{
                scoreText.stroke = '#e8eb34';
                userBox.scale = 1.1;
            }
        }
        else if(!isOnBox && curLetterX < userBoxX ){
            removeCurrentLetter();
            pressedKey = "";
            health--;
            scoreText.stroke = '#eb4634';
        }
        scoreText.value = "Score: " + score;
        healthText.value = "Health: " + health;

        pressedKey = "";

        groupText.position.set(cx-moddedGameSpeed,cy);
    }else{
        audioElementMusic.pause();
        document.getElementById("highScoreSubmit").style.display = 'block';
    }
}

function removeCurrentLetter(){
    var nextChild = groupText.children[currentIndex+1];
    groupText.children[currentIndex].opacity = 0;
    currentLetter = nextChild.value;
    currentIndex++;
    pressedKey = "";

    hits++;
    var now = new Date().getTime();
    var diff = (now - startTime)/1000;
    if(diff >= 30 && diff <= 31){
        console.log("hits in 30 seconds: " + hits);
    }
    if(diff >= 60 && diff <= 61){
        console.log("hits in 60 seconds: " + hits);
    }
    if(diff >= 90 && diff <= 91){
        console.log("hits in 90 seconds: " + hits);
    }
    if(diff >= 120 && diff <= 121){
        console.log("hits in 120 seconds: " + hits);
    }

}

function startGame(){
    document.body.className = document.body.className.replace("disabled","");
    var startScreenPopup = document.getElementById("startScreenPopup");
    startScreenPopup.style.display = 'none';
    audioElementMusic.play();
    startTime = new Date().getTime();
    gameTimerLoop();
}

function phoneHome(){
    $.ajax({
        type: "POST",
        url: "gameHealthCheck",
        data: {"score":score}
    });
}

function newGame(){
    $.ajax({
        type: "POST",
        url: "newGame"
    });
}

function gameTimerLoop() {
    if(animationFrameCounter == frameInterval){
        two.update();
        animationFrameCounter = 0;
    }
    animationFrameCounter++;

    requestAnimationFrame(gameTimerLoop);
}

function getRefreshRate() {
    let frameCount = 0;
    let startTime = performance.now();
    let refreshRate = 0;

    function measureFrame() {
        frameCount++;
        let currentTime = performance.now();
        if (currentTime - startTime > 1000) {
            refreshRate = frameCount;
            console.log("Refresh Rate: " + refreshRate + " Hz");
            frameInterval = Math.round(refreshRate/60);//trying to hit 60 frames
            document.getElementById("playBtn").removeAttribute("disabled");
            return refreshRate;
        }
        requestAnimationFrame(measureFrame);
    }

    measureFrame();
}


document.addEventListener('keydown', function(event) {
  var key = event.key;
  if(key == " "){
    key = "_";
  }
  pressedKey = key;
});