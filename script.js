document.addEventListener('DOMContentLoaded', function() {
    const slideContainer = document.querySelector('.slide-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let currentSlide = 0;

    // Função para ir para um slide específico
    function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = 0;
        if (slideIndex >= slides.length) slideIndex = slides.length - 1;
        
        currentSlide = slideIndex;
        
        // Rolar para o slide correspondente com animação suave
        slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Atualizar a UI para refletir o slide atual
        updateUI();
    }

    // Atualizar interface baseada no slide atual
    function updateUI() {
        // Atualizar números de slide
        document.querySelectorAll('.slide-number').forEach((el, index) => {
            el.textContent = `${index + 1}/${slides.length}`;
        });
        
        // Atualizar indicador na navegação
        const indicator = document.getElementById('slide-indicator');
        if (indicator) {
            indicator.textContent = `${currentSlide + 1}/${slides.length}`;
        }
    }

    // Botões de navegação
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        goToSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        goToSlide(currentSlide + 1);
    });

    // Navegação pelo teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowUp') {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowDown') {
            goToSlide(currentSlide + 1);
        }
    });

    // Atualizar o slide atual ao rolar
    slideContainer.addEventListener('scroll', () => {
        const containerTop = slideContainer.scrollTop;
        
        // Encontrar qual slide está mais próximo do topo do container
        for (let i = 0; i < slides.length; i++) {
            const slideTop = slides[i].offsetTop;
            if (Math.abs(containerTop - slideTop) < 100) {
                if (currentSlide !== i) {
                    currentSlide = i;
                    updateUI();
                }
                break;
            }
        }
    });

    // Inicializar partículas de IA
    initParticles();

    // Inicializar UI
    updateUI();
});

// Função para inicializar as partículas de IA
function initParticles() {
    const container = document.getElementById('particles-ia');
    const numParticles = 50;
    const particles = [];
    const connections = [];
    const connectionDistance = 150;
    
    // Criar partículas
    for (let i = 0; i < numParticles; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle-ia');
        
        // Tamanho aleatório entre 2px e 4px
        const size = Math.random() * 2 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posição aleatória na tela
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Adicionar efeito de brilho pulsante
        particle.style.animation = `pulse ${Math.random() * 3 + 2}s infinite alternate`;
        
        container.appendChild(particle);
        
        particles.push({
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: size
        });
        
        return particles[particles.length - 1];
    }
    
    // Criar e atualizar conexões entre partículas
    function updateConnections() {
        // Limpar conexões existentes
        connections.forEach(conn => {
            if (conn.element && conn.element.parentNode) {
                conn.element.parentNode.removeChild(conn.element);
            }
        });
        connections.length = 0;
        
        // Criar novas conexões
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                // Calcular distância entre partículas
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Conectar apenas partículas próximas
                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    createConnection(p1, p2, opacity);
                }
            }
        }
    }
    
    // Criar uma conexão visual entre duas partículas
    function createConnection(p1, p2, opacity) {
        const connection = document.createElement('div');
        connection.classList.add('connection');
        
        // Posição e dimensionamento
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        connection.style.width = `${distance}px`;
        connection.style.left = `${p1.x}px`;
        connection.style.top = `${p1.y}px`;
        connection.style.opacity = opacity * 0.3;
        connection.style.transform = `rotate(${angle}rad)`;
        
        container.appendChild(connection);
        
        connections.push({
            element: connection,
            p1: p1,
            p2: p2
        });
    }
    
    // Animação das partículas
    function animate() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Atualizar posição
            p.x += p.vx;
            p.y += p.vy;
            
            // Redirecionar se bater nas bordas
            if (p.x < 0 || p.x > window.innerWidth) {
                p.vx = -p.vx;
            }
            
            if (p.y < 0 || p.y > window.innerHeight) {
                p.vy = -p.vy;
            }
            
            // Manter dentro dos limites da tela
            p.x = Math.max(0, Math.min(window.innerWidth, p.x));
            p.y = Math.max(0, Math.min(window.innerHeight, p.y));
            
            // Atualizar posição visual
            p.element.style.left = `${p.x}px`;
            p.element.style.top = `${p.y}px`;
        }
        
        // Atualizar conexões periodicamente para economizar processamento
        if (window.animationCounter % 10 === 0) {
            updateConnections();
        }
        
        window.animationCounter = (window.animationCounter || 0) + 1;
        
        requestAnimationFrame(animate);
    }
    
    // Recalcular em caso de redimensionamento da janela
    window.addEventListener('resize', function() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Manter partículas dentro dos novos limites
            p.x = Math.min(p.x, window.innerWidth);
            p.y = Math.min(p.y, window.innerHeight);
            
            p.element.style.left = `${p.x}px`;
            p.element.style.top = `${p.y}px`;
        }
        
        updateConnections();
    });
    
    // Iniciar animação
    animate();
    updateConnections();
}