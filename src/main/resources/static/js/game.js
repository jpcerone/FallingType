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

// Sound effects
var soundEffects = {
  perfect: new Howl({
    src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
    volume: 0.5
  }),
  great: new Howl({
    src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
    volume: 0.4
  }),
  good: new Howl({
    src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
    volume: 0.3
  }),
  miss: new Howl({
    src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
    volume: 0.4
  }),
  levelUp: new Howl({
    src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
    volume: 0.5
  })
};

var audioElementMusic = document.createElement('audio');
audioElementMusic.setAttribute('src','sound/music2.mp3'); //music2.mp3 is 135 bpm
audioElementMusic.loop = true;
audioElementMusic.playbackRate = .75;

// Particle system for visual effects
var particles = [];
function createParticles(x, y, type = 'perfect') {
  var count = type === 'perfect' ? 12 : 6;
  var colors = type === 'perfect' ? ['#71eb34', '#00ff00', '#7fff00'] : ['#e8eb34', '#ffff00'];
  
  for (var i = 0; i < count; i++) {
    var angle = (Math.PI * 2 * i) / count;
    var velocity = {
      x: Math.cos(angle) * (3 + Math.random() * 2),
      y: Math.sin(angle) * (3 + Math.random() * 2) - 1
    };
    
    var particle = two.makeCircle(x, y, 4);
    particle.fill = colors[Math.floor(Math.random() * colors.length)];
    particle.noStroke();
    particle.opacity = 1;
    
    particles.push({
      circle: particle,
      vx: velocity.x,
      vy: velocity.y,
      life: 1,
      decay: 0.98
    });
  }
}

// Screen shake effect
var screenShakeIntensity = 0;
var screenShakeDuration = 0;
function triggerScreenShake(intensity = 5, duration = 10) {
  screenShakeIntensity = intensity;
  screenShakeDuration = duration;
}

// Grade display system
var currentGradeText = null;
function showGrade(grade, x, y) {
  if (currentGradeText) {
    currentGradeText.remove();
  }
  
  var gradeColors = {
    'Perfect!': '#71eb34',
    'Great!': '#e8eb34',
    'Good!': '#ffa500',
    'Missed!': '#eb4634'
  };
  
  currentGradeText = two.makeText(grade);
  currentGradeText.size = 32;
  currentGradeText.stroke = gradeColors[grade] || '#ffffff';
  currentGradeText.position = new Two.Vector(x, y - 50);
  currentGradeText.family = textFontFamily;
  
  // Animate fade out
  var gradeLife = 0.5;
  var gradeFadeInterval = setInterval(function() {
    if (currentGradeText) {
      gradeLife -= 0.01;
      currentGradeText.opacity = gradeLife;
      if (gradeLife <= 0) {
        clearInterval(gradeFadeInterval);
        if (currentGradeText) {
          currentGradeText.remove();
          currentGradeText = null;
        }
      }
    }
  }, 16);
}

var textFontFamily = "'Courier New', monospace";
var rawText = "Failure is not the end it's a detour on the road to success Everyone stumbles and falls along the way but what truly matters is how you respond Instead of letting setbacks discourage you view them as valuable learning experiences Analyze what went wrong extract the lessons adjust your approach and keep moving forward with renewed determination Remember every successful person has encountered failure at some point It's through these challenges that we grow stronger wiser and more resilient";

// Remove special characters but keep spaces
var testText = rawText.replace(/[^a-zA-Z ]/g, '');

var rowOneChars = ['q','w','e','r','t','y','u','i','o','p'];
var rowTwoChars = ['a','s','d','f','g','h','j','k','l'];
var rowThreeChars = ['z','x','c','v','b','n','m'];
var spaceChar = ' ';

// NEW VISUAL SYSTEM - Video Game Style
var fallingChars = [];
var lanePositions = [
  two.width * 0.15,
  two.width * 0.35,
  two.width * 0.55,
  two.width * 0.75
];
var laneStartY = -100;
var captureZoneY = two.height * 0.75;
var captureZoneHeight = 80;

// Create lanes with background
var groupGameArea = two.makeGroup();

// Draw lane backgrounds and guides
var laneBackgrounds = [];
for (var i = 0; i < 4; i++) {
  var laneBg = two.makeRectangle(lanePositions[i], two.height * 0.5, 70, two.height);
  laneBg.fill = '#0a0a0a';
  laneBg.noStroke();
  laneBg.opacity = 0.3;
  laneBackgrounds.push(laneBg);
}

// Draw capture zone (target area)
var captureZone = two.makeRectangle(two.width * 0.5, captureZoneY, two.width, captureZoneHeight);
captureZone.fill = '#1a1a1a';
captureZone.stroke = '#00ff88';
captureZone.linewidth = 3;
captureZone.opacity = 0.6;

// Create hit targets for each lane
var hitTargets = [];
for (var i = 0; i < 4; i++) {
  var target = two.makeCircle(lanePositions[i], captureZoneY, 40);
  target.fill = '#00ff88';
  target.stroke = '#00ff88';
  target.linewidth = 2;
  target.opacity = 0.2;
  hitTargets.push(target);
}

// HUD Group
var hudGroup = two.makeGroup();

var scoreText = two.makeText("SCORE");
scoreText.size = 20;
scoreText.family = textFontFamily;
scoreText.position = new Two.Vector(50, 40);
scoreText.stroke = '#00ff88';
scoreText.addTo(hudGroup);

var scoreValueText = two.makeText("0");
scoreValueText.size = 28;
scoreValueText.family = textFontFamily;
scoreValueText.position = new Two.Vector(50, 70);
scoreValueText.stroke = '#00ff88';
scoreValueText.addTo(hudGroup);

var healthText = two.makeText("HEALTH");
healthText.size = 20;
healthText.family = textFontFamily;
healthText.position = new Two.Vector(150, 40);
healthText.stroke = '#ff4466';
healthText.addTo(hudGroup);

var healthValueText = two.makeText("25");
healthValueText.size = 28;
healthValueText.family = textFontFamily;
healthValueText.position = new Two.Vector(150, 70);
healthValueText.stroke = '#ff4466';
healthValueText.addTo(hudGroup);

var levelText = two.makeText("LEVEL");
levelText.size = 20;
levelText.family = textFontFamily;
levelText.position = new Two.Vector(two.width - 100, 40);
levelText.stroke = '#ffaa00';
levelText.addTo(hudGroup);

var levelValueText = two.makeText("0");
levelValueText.size = 28;
levelValueText.family = textFontFamily;
levelValueText.position = new Two.Vector(two.width - 100, 70);
levelValueText.stroke = '#ffaa00';
levelValueText.addTo(hudGroup);

var streakText = two.makeText("STREAK: 0");
streakText.size = 24;
streakText.family = textFontFamily;
streakText.position = new Two.Vector(two.width * 0.5, 40);
streakText.stroke = '#ffff00';
streakText.addTo(hudGroup);

// Difficulty color themes
var colorThemes = {
  level0: { accent: '#00ff88', secondary: '#00ccff', bg: '#001100' },
  level1: { accent: '#00ff88', secondary: '#00ccff', bg: '#0a1a0a' },
  level2: { accent: '#ffaa00', secondary: '#ff6600', bg: '#1a0a00' },
  level3: { accent: '#ff4466', secondary: '#ff0066', bg: '#1a0005' },
  level4: { accent: '#aa00ff', secondary: '#ff00ff', bg: '#0a001a' },
  level5: { accent: '#ff0000', secondary: '#ff6666', bg: '#1a0000' }
};
var currentTheme = colorThemes.level0;

// Update lane colors for theme
function updateTheme() {
  captureZone.stroke = currentTheme.accent;
  for (var i = 0; i < hitTargets.length; i++) {
    hitTargets[i].fill = currentTheme.accent;
    hitTargets[i].stroke = currentTheme.accent;
  }
  document.body.style.backgroundColor = '#000000';
}

//game vals
var currentLetter = testText.charAt(0);
var currentCharIndex = 0;
var pressedKey = "";
var health = 25;
var score = 0;
var gameOver = false;
var gamePaused = false;
var currentSpawnRate = 130;

// Audio-based sync: Use music playback position as clock source
var gameSpeed = 50; // Pixels per second of audio playback
var levelArray = [30, 60, 90, 120, 150, 180]; // Seconds of audio playback for level-ups
var currentLevel = 0;

var hits = 0;
var startTime;
var streak = 0;
var lastPressedKey = "";

// Pause UI
var pauseOverlay = null;
var pauseText = null;

// Spawn falling character
function spawnFallingChar(char, laneIndex) {
  var charBox = two.makeRectangle(lanePositions[laneIndex], laneStartY, 50, 50);
  charBox.fill = currentTheme.accent;
  charBox.stroke = currentTheme.secondary;
  charBox.linewidth = 2;
  charBox.opacity = 0.9;
  
  // Display space as underscore for visibility
  var displayChar = (char === ' ') ? '_' : char.toUpperCase();
  
  var charText = two.makeText(displayChar);
  charText.size = 28;
  charText.family = textFontFamily;
  charText.stroke = '#000000';
  charText.position = new Two.Vector(lanePositions[laneIndex], laneStartY);
  
  fallingChars.push({
    box: charBox,
    text: charText,
    char: char,
    lane: laneIndex,
    y: laneStartY,
    hit: false
  });
}

newGame();
two.bind('update', update);

function update(frameCount) {
    // Sync to actual audio playback position
    var audioTime = gameMusic.seek();
    
    if(audioTime >= musicEnd){
        gameMusic.seek(musicStart);
    }
    
    // Update particles
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.circle.position.x += p.vx;
      p.circle.position.y += p.vy;
      p.vy += 0.15; // gravity
      p.life *= p.decay;
      p.circle.opacity = p.life;
      
      if (p.life < 0.05) {
        p.circle.remove();
        particles.splice(i, 1);
      }
    }
    
    // Update screen shake
    if (screenShakeDuration > 0) {
      var shakeX = (Math.random() - 0.5) * screenShakeIntensity;
      var shakeY = (Math.random() - 0.5) * screenShakeIntensity;
      hudGroup.position.set(shakeX, shakeY);
      screenShakeDuration--;
    } else {
      hudGroup.position.set(0, 0);
    }
    
    // Handle pause
    if (gamePaused) {
      return;
    }
    
    if(health > 0 && !gameOver){
        // Calculate game speed based on actual audio playback time
        var moddedGameSpeed = (audioTime * gameSpeed);
        
        // Check for level-ups based on audio time
        if(currentLevel < levelArray.length && audioTime >= levelArray[currentLevel]){
            var oldPlaybackRate = gameMusic.rate();
            gameSpeed = gameSpeed * 1.25;
            levelValueText.value = "" + (currentLevel + 1);
            gameMusic.rate(oldPlaybackRate * 1.25);
            
            // Increase difficulty: faster spawn rate as levels progress
            var spawnRate = Math.max(15, 30 - (currentLevel * 2));
            currentSpawnRate = spawnRate;
            
            // Level up effects
            soundEffects.levelUp.play();
            createParticles(two.width * 0.5, 100, 'perfect');
            triggerScreenShake(8, 15);
            
            // Update theme
            if (currentLevel < Object.keys(colorThemes).length) {
              currentTheme = colorThemes['level' + currentLevel];
              updateTheme();
            }
            
            currentLevel++;
        }
        
        // Check if text is finished
        if (currentCharIndex >= testText.length && fallingChars.length === 0) {
          endGame();
          return;
        }
        
        // Spawn new characters based on text progression
        if (frameCount % currentSpawnRate === 0 && currentCharIndex < testText.length) {
          var char = testText.charAt(currentCharIndex);
          var laneIndex = 0;
          
          if (char === ' ') {
            // Space goes to lane 3 (bottom lane)
            laneIndex = 3;
          } else if (rowOneChars.includes(char.toLowerCase())) {
            laneIndex = 0;
          } else if (rowTwoChars.includes(char.toLowerCase())) {
            laneIndex = 1;
          } else if (rowThreeChars.includes(char.toLowerCase())) {
            laneIndex = 2;
          } else {
            laneIndex = 3;
          }
          
          spawnFallingChar(char, laneIndex);
          currentCharIndex++;
        }
        
        // Update falling characters
        for (var i = fallingChars.length - 1; i >= 0; i--) {
          var fc = fallingChars[i];
          fc.y += gameSpeed / 60; // Adjust for game speed
          fc.box.position.y = fc.y;
          fc.text.position.y = fc.y;
          
          // Check if character passed the capture zone
          if (fc.y > captureZoneY + 100 && !fc.hit) {
            fc.box.remove();
            fc.text.remove();
            fallingChars.splice(i, 1);
            health--;
            scoreValueText.stroke = '#ff4466';
            streak = 0;
            triggerScreenShake(10, 12);
            showGrade('MISSED!', lanePositions[fc.lane], captureZoneY);
            soundEffects.miss.play();
          } else if (fc.y > captureZoneY - 40 && fc.y < captureZoneY + 40) {
            // Highlight when in zone
            if (!fc.inZone) {
              fc.inZone = true;
              fc.box.scale = 1.2;
              fc.text.scale = 1.2;
            }
          } else if (fc.inZone) {
            fc.inZone = false;
            fc.box.scale = 1;
            fc.text.scale = 1;
          }
        }
        
        // Handle key presses
        if (pressedKey !== "" && pressedKey !== " " && !pressedKey.match(/[a-z]/i)) {
          // Non-letter key and not space, ignore
          pressedKey = "";
        } else if (pressedKey !== "") {
          var matched = false;
          
          for (var i = fallingChars.length - 1; i >= 0; i--) {
            var fc = fallingChars[i];
            var keyMatches = (fc.char === '_' && pressedKey === ' ') || 
                            (fc.char.toLowerCase() === pressedKey.toLowerCase());
            
            if (keyMatches && !fc.hit && 
                fc.y > captureZoneY - 40 && fc.y < captureZoneY + 40) {
              
              matched = true;
              fc.hit = true;
              
              var accuracy = Math.abs(fc.y - captureZoneY);
              var grade = '';
              var accuracyBonus = 0;
              
              if (accuracy < 10) {
                grade = 'PERFECT!';
                scoreValueText.stroke = '#00ff88';
                accuracyBonus = 100;
                soundEffects.perfect.play();
                createParticles(lanePositions[fc.lane], captureZoneY, 'perfect');
                streak++;
              } else if (accuracy < 25) {
                grade = 'GREAT!';
                scoreValueText.stroke = '#ffaa00';
                accuracyBonus = 50;
                soundEffects.great.play();
                createParticles(lanePositions[fc.lane], captureZoneY, 'great');
                streak++;
              } else {
                grade = 'GOOD!';
                scoreValueText.stroke = '#ffff00';
                accuracyBonus = 20;
                soundEffects.good.play();
                streak++;
              }
              
              var comboMod = 1 + (streak / 20);
              score += accuracyBonus * comboMod;
              
              // Pulse hit target
              hitTargets[fc.lane].opacity = 0.8;
              var pulseInterval = setInterval(function() {
                hitTargets[fc.lane].opacity = Math.max(0.2, hitTargets[fc.lane].opacity - 0.15);
                if (hitTargets[fc.lane].opacity <= 0.2) {
                  clearInterval(pulseInterval);
                }
              }, 50);
              
              showGrade(grade, lanePositions[fc.lane], captureZoneY);
              phoneHome();
              
              // Fade out character
              var fadeInterval = setInterval(function() {
                fc.box.opacity = Math.max(0, fc.box.opacity - 0.1);
                fc.text.opacity = Math.max(0, fc.text.opacity - 0.1);
                if (fc.box.opacity <= 0) {
                  clearInterval(fadeInterval);
                  fc.box.remove();
                  fc.text.remove();
                  var idx = fallingChars.indexOf(fc);
                  if (idx > -1) {
                    fallingChars.splice(idx, 1);
                  }
                }
              }, 30);
              
              break;
            }
          }
          
          if (!matched) {
            streak = 0;
          }
        }
        
        scoreValueText.value = "" + score;
        healthValueText.value = "" + health;
        streakText.value = "STREAK: " + streak;
        
        pressedKey = "";
    }else{
        if (!gameOver) {
          endGame();
        }
    }
}

function endGame() {
    gameOver = true;
    gameMusic.pause();
    
    // Calculate completion bonus
    var completionBonus = 0;
    if (currentCharIndex >= testText.length && fallingChars.length === 0) {
      completionBonus = 5000;
      score += completionBonus;
      scoreValueText.value = "" + score;
      
      // Show completion message
      var completionMsg = two.makeText("TEXT COMPLETED!");
      completionMsg.size = 48;
      completionMsg.family = textFontFamily;
      completionMsg.stroke = '#00ff88';
      completionMsg.position = new Two.Vector(two.width * 0.5, two.height * 0.3);
      
      var bonusMsg = two.makeText("BONUS: +5000");
      bonusMsg.size = 36;
      bonusMsg.family = textFontFamily;
      bonusMsg.stroke = '#ffaa00';
      bonusMsg.position = new Two.Vector(two.width * 0.5, two.height * 0.4);
    }
    
    document.getElementById("highScoreSubmit").style.display = 'block';
}

function togglePause() {
    if (!gameOver) {
      gamePaused = !gamePaused;
      
      if (gamePaused) {
        gameMusic.pause();
        
        // Create pause overlay
        pauseOverlay = two.makeRectangle(two.width * 0.5, two.height * 0.5, two.width, two.height);
        pauseOverlay.fill = '#000000';
        pauseOverlay.noStroke();
        pauseOverlay.opacity = 0.7;
        
        // Create pause text
        pauseText = two.makeText("PAUSED");
        pauseText.size = 64;
        pauseText.family = textFontFamily;
        pauseText.stroke = '#ffaa00';
        pauseText.position = new Two.Vector(two.width * 0.5, two.height * 0.4);
        
        var resumeText = two.makeText("Press 'ESC' to Resume");
        resumeText.size = 24;
        resumeText.family = textFontFamily;
        resumeText.stroke = '#00ff88';
        resumeText.position = new Two.Vector(two.width * 0.5, two.height * 0.55);
      } else {
        gameMusic.play();
        
        // Remove pause overlay
        if (pauseOverlay) {
          pauseOverlay.remove();
          pauseOverlay = null;
        }
        if (pauseText) {
          pauseText.remove();
          pauseText = null;
        }
        
        // Remove resume text
        var children = two.scene.children;
        for (var i = children.length - 1; i >= 0; i--) {
          if (children[i].value === "Press 'ESC' to Resume") {
            children[i].remove();
          }
        }
      }
    }
}

function removeCurrentLetter(){
    // No longer needed with new system
}

function startGame(){
    document.body.className = document.body.className.replace("disabled","");
    var startScreenPopup = document.getElementById("startScreenPopup");
    startScreenPopup.style.display = 'none';
    gameMusic.play();
    two.play();
    startTime = new Date().getTime();
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
  
  // Handle pause key (Escape)
  if (key === 'Escape') {
    togglePause();
    return;
  }
  
  // Only register key presses if not paused
  if (!gamePaused) {
    pressedKey = key;
  }
});