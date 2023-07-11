const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let score = 0;
let lives = 3;

var centerX = canvas.width/ 2;
var centerY = canvas.height / 2;
var buttonWidth = 110;
var buttonHeight = 50;
var buttonX = centerX - buttonWidth / 2;
var buttonY = centerY - buttonHeight / 2;

let enemyspeed = 10;
let projectilespeed = 10;
const enemyCars = [];
const projectiles = [];

// Game objects
const figcar = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 100,
    width: 80,
    height: 150,
    speed: 5 ,
    health: 100
};
      



// Event listener for key presses
document.addEventListener('keydown', handleKeyDown);

// Start the game

window.onload = function(){


    // figter carload
    fcar = new Image();
    fcar.src = "./img/policecar.png"

    // enemy car laod
    ecar = new Image();
    ecar.src = "./img/greencar.png"

    // blockade
    blocks = new Image();
    blocks.src = "./img/block.png"

    // bomb
    bomb = new Image();
    bomb.src = "./img/Bomb.png"

    drawinit()

    ctx.fillStyle = "lightblue";  
    ctx.fillRect(buttonX,buttonY,buttonWidth,buttonHeight);
    ctx.fillStyle = "blue";
    ctx.font = "20px Arial bold";
    ctx.fillText("START", buttonX+20, buttonY+30);



    document.addEventListener("click", function(event){
        handleButtonClick(event,buttonX,buttonY,startGame)    
    })




}    

function startGame() {
    gameRunning = true;
    score = 0;
    lives = 3;
    figcar.health = 100;
    enemyCars.length = 0;
    projectiles.length = 0;

    placeCars();

    // Game loop
    function gameLoop() {
    
        if (gameRunning) {
            updateGame();
            drawGame();
            requestAnimationFrame(gameLoop);
        }
    }

    gameLoop();

}
function drawinit(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw the road background
    ctx.fillStyle = "yellow"; 
    ctx.fillRect(90, 0,10 , canvas.height);
    ctx.fillStyle = "yellow"; 
    ctx.fillRect(700, 0,10 , canvas.height);
    
    // Draw the road
    ctx.fillStyle = '#808080'; 
    ctx.fillRect(100, 0, canvas.width - 200, canvas.height);
    
    // Draw the road markings
    ctx.fillStyle = '#ffffff'; 
    const lineSpacing = 50;
    const lineWidth = 10; 
    const lineLength = 80; 

    ctx.fillRect(canvas.width/2, 0, lineWidth, lineLength);
    
    var y= 0;
    for (let i = 0;i< 10 ; i++) {
        var x = canvas.width/2

        var y = y +i+lineSpacing+lineLength;
        

        ctx.fillRect(x, y, lineWidth, lineLength);
    }
}

function updateGame() {

        if ((figcar.moveLeft) && figcar.x > 100)  {
            figcar.x -= figcar.speed;
        }
        if (figcar.moveRight  && figcar.x<(canvas.width - 100-figcar.width )) {
            figcar.x += figcar.speed;
        }
        if (figcar.moveUp  && figcar.y>(canvas.height - 200 )) {
            figcar.y -= figcar.speed;
        }
        if (figcar.moveDown  && figcar.y<(canvas.height )) {
            figcar.y += figcar.speed;
        }
    

    // Move enemy cars
    enemyCars.forEach((enemyCar) => {
        enemyCar.y += enemyCar.speed;

        // Check for collision with figcar
        if (checkCollision(figcar, enemyCar)) {
            figcar.health -= 100;
            if (figcar.health <= 0) {
                lives = lives -1;
                if (lives > 0) {
                    resetPlayerPosition(lives);
                } else {
                    gameOver();
                }
            }
            // enemyCar.y = -enemyCar.height; // Reset enemy car position
        }
    });

    // Move projectiles
    projectiles.forEach((projectile) => {
        projectile.y -= projectile.speed;

        // Check for collision with enemy cars
        enemyCars.forEach((enemyCar) => {
            if (checkCollision(projectile, enemyCar)) {
                score += 20;
                enemyCar.y = enemyCars.shift(); 
                projectiles.splice(projectiles.indexOf(projectile), 1);
            }
        });

        // Remove projectiles that are off the screen
        if (projectile.y < 0) {
            projectiles.splice(projectiles.indexOf(projectile), 1);
        }
    });

}

function drawGame() {
    drawinit();


    // Draw enemy cars
    enemyCars.forEach((enemyCar) => {
        ctx.drawImage(enemyCar.img,enemyCar.x, enemyCar.y, enemyCar.width, enemyCar.height);
    });

    // Draw figcar
    ctx.drawImage(fcar,figcar.x, figcar.y, figcar.width, figcar.height);
    

    // Draw projectiles
    projectiles.forEach((projectile) => {
        ctx.drawImage(bomb,projectile.x, projectile.y, projectile.width, projectile.height);
        
    });

    ctx.fillStyle = 'blue';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 0, 30);
    ctx.fillText(`Lives: ${lives}`, 0, 60);
    ctx.fillText(`Health: ${figcar.health}`, 0, 90);

    if(!gameRunning){

        ctx.fillStyle = "red"
        ctx.strokeStyle = "blue"
        ctx.font = "60px sans-serif";
        ctx.strokeText(`GAME OVER`, canvas.width /2 - 170, canvas.height / 3);
        ctx.fillText(`GAME OVER`, canvas.width /2 - 170, canvas.height / 3);

        // ctx.()e

        ctx.fillStyle = "lightblue";  
        ctx.fillRect(buttonX,buttonY,buttonWidth+20,buttonHeight);
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial bold";
        ctx.fillText("Restart", buttonX+24, buttonY+30);
    
        document.addEventListener("click", function(event){
            handleButtonClick(event,buttonX,buttonY,)    
        })
    }
}
 


function handleButtonClick(event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    if (
        mouseX >= buttonX &&
        mouseX <= buttonX + buttonWidth &&
        mouseY >= buttonY &&
        mouseY <= buttonY + buttonHeight
    ) {
        startGame();
        document.removeEventListener("click", handleButtonClick);
    }
}





function placeCars() {
    const lanes = [100, 300, 500]; 
    
    setInterval(() => {
        const randomX = lanes[Math.floor(Math.random() * lanes.length)];
        const enemyCar = {
            img : ecar,
            x: randomX,
            y: 0,
            width: 60,
            height: 80,
            speed: enemyspeed
        };
        const block = {
            img : blocks,
            x: randomX,
            y: 0,
            width: 150,
            height: 80,
            speed: 2
            
        }
        
        blockOrCar = Math.floor(Math.random() *2)
        
        if (blockOrCar === 0 && randomX != 300){
            if (randomX == 500){
                block.x = randomX + 50
            }
            enemyCars.push(block)
            
        }        
        else {
            enemyCars.push(enemyCar)
            
            
        }
    }, 500);
}


function resetPlayerPosition(lives) {
        figcar.x = canvas.width / 2 -30;
        figcar.y = canvas.height - 100;
        figcar.health = 100;
        figcar.lives = lives
        // projectiles = 
        
    }
    
    function gameOver() {
        
        gameRunning = false;
    }
    function fireProjectile() {
        const projectile = {
            x: figcar.x + figcar.width / 2 - 5,
            y: figcar.y,
            width: 30,
            height: 50 ,
            speed: projectilespeed
        };
        projectiles.push(projectile);
    }
    
    function checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
            );
        }
    
        
        function handleKeyDown(event) {
        if (event.key === 'ArrowLeft') {
            figcar.moveLeft = true;
        }else if (event.key === 'ArrowRight') {
            figcar.moveRight = true;
        }else if (event.key === 'ArrowUp') {
            figcar.moveUp = true;
        } else if (event.key === 'ArrowDown') {
            figcar.moveDown = true;    
        }else if (event.key === ' ') {
            fireProjectile();
        }
    }
    
    function handleKeyUp(event) {
        if (event.key === 'ArrowLeft') {
            figcar.moveLeft = false;
        } else if (event.key === 'ArrowRight') {
            figcar.moveRight = false;
        } else if (event.key === 'ArrowUp') {
            figcar.moveUp = false;
        } else if (event.key === 'ArrowDown') {
            figcar.moveDown = false;    
        }
    }
    // Event listener for key releases
    document.addEventListener('keyup', handleKeyUp);



