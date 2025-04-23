// Funções de navegação dos slides
document.addEventListener('DOMContentLoaded', function() {
    // Seleção de elementos DOM
    const slideContainer = document.querySelector('.slide-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let currentSlide = 0;

    // Função para navegar para um slide específico
    function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = 0;
        if (slideIndex >= slides.length) slideIndex = slides.length - 1;
        
        currentSlide = slideIndex;
        slides[currentSlide].scrollIntoView({ behavior: 'smooth' });
    }

    // Eventos de clique nos botões de navegação
    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
        }
    });

    // Atualização do slide atual durante a rolagem
    slideContainer.addEventListener('scroll', () => {
        const containerTop = slideContainer.scrollTop;
        for (let i = 0; i < slides.length; i++) {
            const slideTop = slides[i].offsetTop;
            if (Math.abs(containerTop - slideTop) < 100) {
                currentSlide = i;
                break;
            }
        }
    });

    // Sistema de partículas de IA
    const setupParticles = function() {
        const container = document.getElementById('particles-ia');
        const numParticles = 50; // Número de partículas
        const particles = [];
        const connections = [];
        const connectionDistance = 150;
        
        // Criação das partículas
        for (let i = 0; i < numParticles; i++) {
            createParticle();
        }
        
        // Função para criar uma partícula
        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle-ia');
            
            // Posição aleatória
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            // Velocidade aleatória
            const vx = (Math.random() - 0.5) * 0.5;
            const vy = (Math.random() - 0.5) * 0.5;
            
            // Tamanho aleatório
            const size = Math.random() * 2 + 2;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Adicionar um brilho pulsante para simular "atividade neural"
            particle.style.animation = `pulse ${Math.random() * 3 + 2}s infinite alternate`;
            
            container.appendChild(particle);
            
            particles.push({
                element: particle,
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                size: size,
                connections: []
            });
            
            return particles[particles.length - 1];
        }
        
        // Criar conexões entre nós próximos
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
            
            // Atualizar conexões a cada X frames para economizar processamento
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
    };
    
    // Iniciar o sistema de partículas
    setupParticles();
});