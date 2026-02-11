document.addEventListener('DOMContentLoaded', function() {
    // Crear estrellas de fondo
    createStars();
    
    // Botones del menú
    const playBtn = document.getElementById('playBtn');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    
    // Modales
    const instructionsModal = document.getElementById('instructionsModal');
    const aboutModal = document.getElementById('aboutModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    
    // Eventos
    playBtn.addEventListener('click', function() {
        // Redirigir al juego
        window.location.href = 'game.html';
    });
    
    instructionsBtn.addEventListener('click', function() {
        instructionsModal.style.display = 'block';
    });
    
    aboutBtn.addEventListener('click', function() {
        aboutModal.style.display = 'block';
    });
    
    // Cerrar modales
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            instructionsModal.style.display = 'none';
            aboutModal.style.display = 'none';
        });
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === instructionsModal) {
            instructionsModal.style.display = 'none';
        }
        if (event.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });
    
    // Efecto de sonido al hacer clic (simulado)
    playBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    playBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    instructionsBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    instructionsBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    aboutBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    aboutBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
    
    document.body.appendChild(starsContainer);
}
