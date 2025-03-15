var params = {
  fullscreen: true
};
var elem = document.body;
var two = new Two(params).appendTo(elem);

var musicStart = 1.2;
var musicEnd = 132.6;
var gameMusic = new Howl({
      src: ['sound/music2.mp3'],
      loop: true,
      preload: true,
      rate: .74,
    });
gameMusic.seek(musicStart);

var audioElementMusic = document.createElement('audio');
audioElementMusic.setAttribute('src','sound/music2.mp3'); //music2.mp3 is 135 bpm
audioElementMusic.loop = true;
audioElementMusic.playbackRate = .75;

var textFontFamily = "'Courier New', monospace";
var testText = "Failure is not the end; it's a detour on the road to success. Everyone stumbles and falls along the way, but what truly matters is how you respond. Instead of letting setbacks discourage you, view them as valuable learning experiences. Analyze what went wrong, extract the lessons, adjust your approach, and keep moving forward with renewed determination. Remember, every successful person has encountered failure at some point. It's through these challenges that we grow stronger, wiser, and more resilient.";

var rowOneChars = ['q','w','e','r','t','y','u','i','o','p'];
var rowTwoChars = ['a','s','d','f','g','h','j','k','l'];
var rowThreeChars = ['z','x','c','v','b','n','m'];

var groupText = two.makeGroup();
var xDelta = 0;
var charSpacing = 102;
testText.split('').forEach(char => {
    if(char == " "){
        char = "_";
    }
    var charObj = two.makeText(char);
    var yDelta = 0;
    if(rowOneChars.includes(char.toLowerCase())){
        yDelta = 0;
    }else if(rowTwoChars.includes(char.toLowerCase())){
        yDelta = 125;
    }else if(rowThreeChars.includes(char.toLowerCase())){
        yDelta = 250;
    }else if(char == "_"){
        yDelta = 375;
    }
    charObj.family = textFontFamily;
    charObj.size = 20;
    charObj.position = new Two.Vector(xDelta,yDelta);
    charObj.addTo(groupText);
    xDelta += charSpacing;
});

var groupUserBox = two.makeGroup();
var userBox = two.makeRectangle(0,0,30,80);
userBox.noFill();
userBox.stroke = '#000000';
userBox.linewidth = 2;
userBox.opacity = .6;
userBox.addTo(groupUserBox);

var userBoxTwo = two.makeRectangle(0,0,30,80);
userBoxTwo.noFill();
userBoxTwo.stroke = '#000000';
userBoxTwo.linewidth = 2;
userBoxTwo.opacity = .6;
userBoxTwo.position = new Two.Vector(0,125);
userBoxTwo.addTo(groupUserBox);

var userBoxThree = two.makeRectangle(0,0,30,80);
userBoxThree.noFill();
userBoxThree.stroke = '#000000';
userBoxThree.linewidth = 2;
userBoxThree.opacity = .6;
userBoxThree.position = new Two.Vector(0,250);
userBoxThree.addTo(groupUserBox);

var userBoxFour = two.makeRectangle(0,0,30,80);
userBoxFour.noFill();
userBoxFour.stroke = '#000000';
userBoxFour.linewidth = 2;
userBoxFour.opacity = .6;
userBoxFour.position = new Two.Vector(0,375);
userBoxFour.addTo(groupUserBox);


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

var streakText = two.makeText("Streak: 0");
streakText.scale = 2;
streakText.position = new Two.Vector(150,-150);
streakText.addTo(groupUserBox);

var userBoxX = two.width*0.3;
var userBoxY = two.height*0.3;
groupUserBox.position.set(userBoxX,userBoxY);


var xOffset = 97;
var cx = (two.width * 0.4) - xOffset;
var cy = two.height * 0.3;
groupText.position.set(cx, cy);
groupText.noStroke();

//game vals
var currentLetter = groupText.children[0].value;
var currentIndex = 0;
var pressedKey = "";
var health = 25;
var score = 0;
var levelArray = [1500,3000,4500,6000,7500,9000];
var levelAdjust = 0;
var hits = 0;
var startTime;
var frameTimer;
var timeBetweenFrames = 20;
var actualFrames = 0;
var gameSpeed = 2;
var streak = 0;
var lastPressedKey = "";

newGame();
two.bind('update', update);

function update(frameCount) {
    var currentTime = new Date().getTime();
    if(gameMusic.seek() >= musicEnd){
        gameMusic.seek(musicStart);
    }
    if(currentTime - frameTimer >= timeBetweenFrames){
        frameTimer = new Date().getTime();
        actualFrames++;
        if(health > 0){
            var moddedGameSpeed = (actualFrames * gameSpeed)+levelAdjust;
            if(levelArray.includes(actualFrames)){
                //level modifiers
                var oldPlaybackRate = gameMusic.rate();
                gameSpeed = gameSpeed * 1.25;
                levelText.value = "Level "+(levelArray.indexOf(actualFrames) + 1);
                gameMusic.rate(oldPlaybackRate * 1.25);
                levelAdjust = moddedGameSpeed - (actualFrames * gameSpeed);
            }
            userBox.scale = 1;
            userBoxTwo.scale = 1;
            userBoxThree.scale = 1;
            userBoxFour.scale = 1;

            var curLetterObj = groupText.children[currentIndex];
            var curLetterX = Math.round(groupText.position.x + curLetterObj.position.x);
            var isOnBox = false;
            if(Math.abs(curLetterX - userBoxX) < 12){
                isOnBox = true;
                curLetterObj.scale = 2;
            }
            var scored = false;

            if(currentLetter == pressedKey && isOnBox){
                score++;
                streak++;
                scored = true;
                var accuracyVal = Math.round(Math.abs(curLetterX - userBoxX));
                var comboMod = 1;
                if(streak > 10){
                    comboMod = streak/10;
                }
                score += Math.round((12-accuracyVal) * comboMod);
                phoneHome();
                var actualUserBox = userBox;
                if(rowOneChars.includes(pressedKey.toLowerCase())){
                    actualUserBox = userBox;
                }else if(rowTwoChars.includes(pressedKey.toLowerCase())){
                    actualUserBox = userBoxTwo;
                }else if(rowThreeChars.includes(pressedKey.toLowerCase())){
                    actualUserBox = userBoxThree;
                }else if(pressedKey == "_"){
                     actualUserBox = userBoxFour;
                }
                if (accuracyVal < 3){
                    scoreText.stroke = '#71eb34';
                    actualUserBox.scale = 1.3;
                }else{
                    scoreText.stroke = '#e8eb34';
                    actualUserBox.scale = 1.1;
                }
                removeCurrentLetter();
            }
            else if(!isOnBox && curLetterX < userBoxX ){
                removeCurrentLetter();
                pressedKey = "";
                health--;
                scoreText.stroke = '#eb4634';
                streak = 0;
            }
            if(!scored && pressedKey != ""){
                streak = 0;
            }
            scoreText.value = "Score: " + score;
            healthText.value = "Health: " + health;
            streakText.value = "Streak: " + streak;

            pressedKey = "";
            groupText.position.set(cx-moddedGameSpeed,cy);
        }else{
            gameMusic.pause();
            document.getElementById("highScoreSubmit").style.display = 'block';
        }
    }

}

function removeCurrentLetter(){
    var nextChild = groupText.children[currentIndex+1];
    groupText.children[currentIndex].opacity = 0;
    currentLetter = nextChild.value;
    currentIndex++;
    pressedKey = "";
    hits++;
}

function startGame(){
    document.body.className = document.body.className.replace("disabled","");
    var startScreenPopup = document.getElementById("startScreenPopup");
    startScreenPopup.style.display = 'none';
    gameMusic.play();
    two.play();
    startTime = new Date().getTime();
    frameTimer = new Date().getTime();
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

document.addEventListener('keydown', function(event) {
  var key = event.key;
  if(key == " "){
    key = "_";
  }
  pressedKey = key;
});