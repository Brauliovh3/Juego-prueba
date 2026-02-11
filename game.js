// Space Shooter Game
class SpaceShooterGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.lives = 3;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        // Nave del jugador
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 80,
            width: 50,
            height: 50,
            speed: 5,
            bullets: []
        };
        
        // Enemigos
        this.enemies = [];
        this.enemyRows = 3;
        this.enemyCols = 8;
        this.enemySpeed = 1;
        this.enemyDirection = 1;
        
        // Controles
        this.keys = {};
        this.lastShot = 0;
        this.shotCooldown = 250;
        
        // Partículas de explosión
        this.particles = [];
        
        this.init();
    }
    
    init() {
        // Event listeners
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('menuBtn').addEventListener('click', () => this.backToMenu());
        
        // Crear enemigos
        this.createEnemies();
        
        // Iniciar bucle del juego
        this.gameLoop();
    }
    
    createEnemies() {
        this.enemies = [];
        for (let row = 0; row < this.enemyRows; row++) {
            for (let col = 0; col < this.enemyCols; col++) {
                this.enemies.push({
                    x: col * 45 + 50,
                    y: row * 40 + 50,
                    width: 30,
                    height: 30,
                    type: row === 0 ? 'strong' : 'normal',
                    points: row === 0 ? 20 : 10
                });
            }
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.player.x = this.canvas.width / 2 - 25;
        this.player.bullets = [];
        this.particles = [];
        this.createEnemies();
        
        document.getElementById('startBtn').textContent = 'Reiniciar';
        this.updateUI();
    }
    
    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Continuar' : 'Pausar';
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        // Mover jugador
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        
        // Disparar
        if (this.keys[' '] && Date.now() - this.lastShot > this.shotCooldown) {
            this.player.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10,
                speed: 7
            });
            this.lastShot = Date.now();
        }
        
        // Actualizar balas
        this.player.bullets = this.player.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
        
        // Mover enemigos
        let shouldMoveDown = false;
        for (let enemy of this.enemies) {
            enemy.x += this.enemySpeed * this.enemyDirection;
            if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
                shouldMoveDown = true;
            }
        }
        
        if (shouldMoveDown) {
            this.enemyDirection *= -1;
            for (let enemy of this.enemies) {
                enemy.y += 20;
            }
            this.enemySpeed += 0.1;
        }
        
        // Colisiones balas-enemigos
        for (let i = this.player.bullets.length - 1; i >= 0; i--) {
            let bullet = this.player.bullets[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                let enemy = this.enemies[j];
                
                if (this.checkCollision(bullet, enemy)) {
                    // Crear explosión
                    this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                    
                    // Sumar puntos
                    this.score += enemy.points;
                    
                    // Eliminar bala y enemigo
                    this.player.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    
                    this.updateUI();
                    break;
                }
            }
        }
        
        // Colisiones jugador-enemigos
        for (let enemy of this.enemies) {
            if (this.checkCollision(this.player, enemy)) {
                this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.endGame();
                } else {
                    // Resetear posición del jugador
                    this.player.x = this.canvas.width / 2 - 25;
                    this.player.y = this.canvas.height - 80;
                }
                break;
            }
        }
        
        // Actualizar partículas
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            return particle.life > 0;
        });
        
        // Verificar si ganó
        if (this.enemies.length === 0) {
            this.nextLevel();
        }
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`
            });
        }
    }
    
    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar estrellas de fondo
        if (Math.random() < 0.1) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(Math.random() * this.canvas.width, 0, 1, 1);
        }
        
        // Dibujar jugador (nave)
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y);
        this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
        this.ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Dibujar balas
        this.ctx.fillStyle = '#ffff00';
        for (let bullet of this.player.bullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
        
        // Dibujar enemigos
        for (let enemy of this.enemies) {
            this.ctx.fillStyle = enemy.type === 'strong' ? '#ff00ff' : '#ff0000';
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Detalles del enemigo
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
            this.ctx.fillRect(enemy.x + enemy.width - 10, enemy.y + 5, 5, 5);
        }
        
        // Dibujar partículas
        for (let particle of this.particles) {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        }
        this.ctx.globalAlpha = 1;
        
        // Mensajes de estado
        if (!this.gameRunning && !this.gameOver) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Presiona "Iniciar Juego"', this.canvas.width / 2, this.canvas.height / 2);
        }
        
        if (this.gamePaused) {
            this.ctx.fillStyle = 'yellow';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
        }
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'red';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`Puntuación Final: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
    }
    
    nextLevel() {
        this.enemyRows++;
        this.enemySpeed = 1;
        this.createEnemies();
        this.score += 100;
        this.updateUI();
    }
    
    endGame() {
        this.gameOver = true;
        this.gameRunning = false;
    }
    
    backToMenu() {
        window.location.href = 'menu.html';
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Iniciar juego cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    new SpaceShooterGame();
});
