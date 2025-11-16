class NewtonApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 2;
        this.isMuted = false;
        this.highContrast = false;
        this.fontSize = 'normal';
        this.slides = [
    {
        title: "1ª Lei de Newton — Lei da Inércia",
        content: "A inércia é a tendência de um corpo manter seu estado atual. Se está parado, permanece parado. Se está em movimento, continua em movimento retilíneo uniforme até que uma força externa atue sobre ele.",
        example: "Exemplo: Quando o carro freia, seu corpo continua indo para frente devido à inércia.",
        colorClass: "slide-0"
    },
    {
        title: "3ª Lei de Newton — Ação e Reação",
        content: "Toda força que um corpo exerce sobre outro gera uma força de mesma intensidade, mesma direção e sentido oposto. Elas sempre agem em pares e em corpos diferentes.",
        example: "Exemplo: Ao caminhar, você empurra o chão para trás e o chão te empurra para frente.",
        colorClass: "slide-1"
    }
];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSlide();
        this.loadSettings();
    }

    bindEvents() {
        document.getElementById('menu-btn').addEventListener('click', () => this.openMenu());
        document.getElementById('close-menu').addEventListener('click', () => this.closeMenu());
        document.getElementById('menu-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'menu-overlay') {
                this.closeMenu();
            }
        });

        document.getElementById('prev-slide').addEventListener('click', () => this.prevSlide());
        document.getElementById('next-slide').addEventListener('click', () => this.nextSlide());

        document.querySelectorAll('.slide-indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        document.getElementById('toggle-contrast').addEventListener('click', () => this.toggleContrast());
        document.getElementById('change-font-size').addEventListener('click', () => this.changeFontSize());
        document.getElementById('toggle-sound').addEventListener('click', () => this.toggleSound());

        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    openMenu() {
        document.getElementById('menu-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        document.getElementById('menu-overlay').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
        this.playSound();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
        this.playSound();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
        this.playSound();
    }

    updateSlide() {
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        document.querySelectorAll('.slide-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        const currentSlideData = this.slides[this.currentSlide];
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.className = `slide active ${currentSlideData.colorClass}`;
            activeSlide.innerHTML = `
                <h2>${currentSlideData.title}</h2>
                <p class="slide-description">${currentSlideData.content}</p>
                <div class="slide-example">
                    <p><strong>${currentSlideData.example}</strong></p>
                </div>
            `;
        }
    }

    toggleContrast() {
        this.highContrast = !this.highContrast;
        document.body.classList.toggle('high-contrast', this.highContrast);

        const contrastText = document.getElementById('contrast-text');
        contrastText.textContent = this.highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste';

        this.saveSettings();
    }

    changeFontSize() {
        const sizes = ['normal', 'large', 'extra-large'];
        const currentIndex = sizes.indexOf(this.fontSize);
        this.fontSize = sizes[(currentIndex + 1) % sizes.length];

        document.body.classList.remove('font-large', 'font-extra-large');

        if (this.fontSize !== 'normal') {
            document.body.classList.add(`font-${this.fontSize.replace('-', '-')}`);
        }

        const fontSizeText = document.getElementById('font-size-text');
        const fontLabels = {
            'normal': 'Normal',
            'large': 'Grande',
            'extra-large': 'Extra Grande'
        };
        fontSizeText.textContent = `Fonte: ${fontLabels[this.fontSize]}`;

        this.saveSettings();
    }

    toggleSound() {
        this.isMuted = !this.isMuted;

        const soundIcon = document.getElementById('sound-icon');
        const soundText = document.getElementById('sound-text');

        if (this.isMuted) {
            soundIcon.className = 'fas fa-volume-mute';
            soundText.textContent = 'Som Desativado';
        } else {
            soundIcon.className = 'fas fa-volume-up';
            soundText.textContent = 'Som Ativado';
        }

        this.saveSettings();
    }

    playSound() {
        if (!this.isMuted) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (error) {
                console.log('Audio not supported');
            }

        }
    }


    handleKeydown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Escape':
                e.preventDefault();
                this.closeMenu();
                break;
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
        }
    }

    saveSettings() {
        const settings = {
            highContrast: this.highContrast,
            fontSize: this.fontSize,
            isMuted: this.isMuted
        };
        localStorage.setItem('newton-app-settings', JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('newton-app-settings') || '{}');

            if (settings.highContrast) {
                this.toggleContrast();
            }

            if (settings.fontSize && settings.fontSize !== 'normal') {
                this.fontSize = 'normal';
                this.changeFontSize();
                if (settings.fontSize === 'extra-large') {
                    this.changeFontSize();
                }
            }

            if (settings.isMuted) {
                this.toggleSound();
            }
        } catch (error) {
            console.log('Could not load settings');
        }
    }

    animateElement(element, animation, duration = 500) {
        element.style.animation = `${animation} ${duration}ms ease`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new NewtonApp();
    document.querySelectorAll('.btn, .slide-btn, .menu-button').forEach(button => {
        app.addRippleEffect(button);
    });

    document.body.classList.add('loaded');

    console.log('Newton Laws Application initialized successfully!');
});

const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    body:not(.loaded) {
        opacity: 0;
    }

    body.loaded {
        opacity: 1;
     transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(style);
