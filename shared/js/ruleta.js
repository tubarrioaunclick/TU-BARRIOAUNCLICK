class RuletaDescuentos {
    constructor() {
        this.ruleta = document.getElementById('ruleta');
        this.btnGirar = document.getElementById('btnGirar');
        this.modal = document.getElementById('modal');
        this.premioGanado = document.getElementById('premioGanado');
        this.telefonoInput = document.getElementById('telefono');
        this.btnValidar = document.getElementById('btnValidar');
        this.closeModal = document.getElementById('closeModal');
        
        this.girando = false;
        this.angulo = 0;
        this.premioActual = null;
        
        // Premios disponibles con 1 sector sin premio
        this.premios = [
            { texto: "🥐 10% OFF", color: "#667eea", fullText: "10% OFF en Panadería", tipo: "premio" },
            { texto: "☕ Café Gratis", color: "#764ba2", fullText: "Café + Muffin Gratis", tipo: "premio" },
            { texto: "🍕 2x1 Pizzas", color: "#f093fb", fullText: "2x1 en Pizzas", tipo: "premio" },
            { texto: "🚚 Envío Free", color: "#4ecdc4", fullText: "Envío Gratis", tipo: "premio" },
            { texto: "💊 15% OFF", color: "#45b7d1", fullText: "15% OFF en Farmacia", tipo: "premio" },
            { texto: "🍰 Postre", color: "#96ceb4", fullText: "Postre Gratis", tipo: "premio" },
            { texto: "😊 ¡Suerte!", color: "#e2e8f0", fullText: "Esta vez no hay premio", tipo: "vacio" }
        ];

        this.inicializar();
    }
    
    inicializar() {
        this.crearRuleta();
        this.agregarEventListeners();
        this.crearSpinner();
    }
    
    crearRuleta() {
        const sectores = this.premios.length;
        const anguloSector = 360 / sectores;
        
        this.ruleta.innerHTML = '';
        
        this.premios.forEach((premio, index) => {
            const sector = document.createElement('div');
            sector.className = 'sector';
            sector.style.backgroundColor = premio.color;
            sector.style.transform = `rotate(${index * anguloSector}deg) skewY(${90 - anguloSector}deg)`;
            
            // Para sectores vacíos, usar color más neutro
            if (premio.tipo === "vacio") {
                sector.style.backgroundColor = "#f8f9fa";
                sector.style.color = "#718096";
            }
            
            const texto = document.createElement('div');
            texto.textContent = premio.texto;
            texto.style.cssText = `
                position: absolute;
                top: 55%;
                left:55%;
                transform: rotate(45deg);
                font-size: 12px;
                font-weight: 700;
                color: ${premio.tipo === "vacio" ? "#718096" : "white"};
                text-shadow: ${premio.tipo === "vacio" ? "none" : "1px 1px 3px rgba(0,0,0,0.8)"};
                text-align: center;
                line-height: 1.1;
                max-width: 65px;
            `;
            
            sector.appendChild(texto);
            this.ruleta.appendChild(sector);
        });
    }
    
    crearSpinner() {
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
                margin-right: 10px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .premio-destacado {
                animation: destello 1s ease-in-out 3;
            }
            
            @keyframes destello {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
    
    agregarEventListeners() {
        this.btnGirar.addEventListener('click', () => this.girarRuleta());
        this.btnValidar.addEventListener('click', () => this.validarPremio());
        this.closeModal.addEventListener('click', () => this.cerrarModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.cerrarModal();
            }
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });

        this.telefonoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.validarPremio();
            }
        });
    }
    
    girarRuleta() {
        if (this.girando) return;
        
        this.girando = true;
        this.btnGirar.disabled = true;
        this.mostrarCarga();
        
        // Determinar premio aleatorio (con posibilidad de sector vacío)
        const premioAleatorio = Math.floor(Math.random() * this.premios.length);
        this.premioActual = this.premios[premioAleatorio];
        
        const sectores = this.premios.length;
        const anguloSector = 360 / sectores;
        
        // Calcular ángulo exacto para que el selector apunte al premio ganador
        const anguloPremio = (360 / sectores) * premioAleatorio;
        
        // Girar múltiples vueltas + ajuste para que el premio quede en el selector
        const vueltas = 5;
        const anguloAjuste = 90 - (anguloSector / 2); // Ajuste para que el selector apunte al centro del sector
        const anguloTotal = (vueltas * 360) + (360 - anguloPremio) + anguloAjuste;
        
        this.angulo += anguloTotal;
        this.ruleta.style.transform = `rotate(${this.angulo}deg)`;
        
        this.reproducirEfectoSonido();
        
        setTimeout(() => {
            this.mostrarPremio(premioAleatorio);
            this.ocultarCarga();
            
            // Destacar el sector ganador
            this.destacarSectorGanador(premioAleatorio);
        }, 4000);
    }
    
    destacarSectorGanador(indicePremio) {
        const sectores = this.ruleta.getElementsByClassName('sector');
        if (sectores[indicePremio]) {
            sectores[indicePremio].classList.add('premio-destacado');
            
            // Quitar la animación después de 3 segundos
            setTimeout(() => {
                sectores[indicePremio].classList.remove('premio-destacado');
            }, 3000);
        }
    }
    
    mostrarCarga() {
        this.btnGirar.innerHTML = '<div class="spinner"></div> Girando...';
        this.btnGirar.style.background = 'linear-gradient(45deg, #a0aec0, #cbd5e0)';
    }
    
    ocultarCarga() {
        this.btnGirar.innerHTML = '¡GIRAR!';
        this.btnGirar.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
    
    reproducirEfectoSonido() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 3);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);
        } catch (e) {
            console.log('Audio no soportado');
        }
    }
    
    mostrarPremio(indicePremio) {
        const premio = this.premios[indicePremio];
        
        if (premio.tipo === "vacio") {
            // Mostrar mensaje especial para sector sin premio
            this.premioGanado.textContent = premio.fullText;
            this.premioGanado.style.color = "#718096";
            this.btnValidar.style.display = 'none'; // Ocultar botón de validación
        } else {
            this.premioGanado.textContent = premio.fullText;
            this.premioGanado.style.color = premio.color;
            this.btnValidar.style.display = 'block'; // Mostrar botón de validación
        }
        
        this.modal.style.display = 'block';
        this.girando = false;

        setTimeout(() => {
            this.telefonoInput.focus();
        }, 300);
    }
    
    validarPremio() {
        const telefono = this.telefonoInput.value.trim();
        
        if (!telefono) {
            this.mostrarError('Por favor, ingresa tu número de teléfono');
            return;
        }
        
        const telefonoLimpio = telefono.replace(/\s+/g, '');
        if (!this.validarFormatoTelefono(telefonoLimpio)) {
            this.mostrarError('Por favor, ingresa un número de teléfono válido');
            return;
        }
        
        this.mostrarCargaValidacion();
        
        setTimeout(() => {
            // Simular envío de notificación al comerciante
            this.notificarComerciante(telefonoLimpio);
            
            console.log('Premio validado:', {
                premio: this.premioActual.fullText,
                telefono: telefonoLimpio,
                fecha: new Date().toISOString(),
                hash: Math.random().toString(36).substr(2, 9)
            });
            
            this.mostrarExito(`¡Premio validado! Te contactaremos al ${telefono} en las próximas 24 horas.`);
            this.cerrarModal();
            this.resetearRuleta();
        }, 1500);
    }
    
    notificarComerciante(telefono) {
        // Aquí iría la lógica real para notificar al comerciante
        // Por ahora simulamos con console.log y podríamos agregar:
        // - Envío por email
        // - Notificación por WhatsApp
        // - Mensaje a sistema de gestión
        
        const mensajeComerciante = `
🚨 NUEVO PREMIO ENTREGADO 🚨

📞 Cliente: ${telefono}
🎁 Premio: ${this.premioActual.fullText}
🕐 Fecha: ${new Date().toLocaleString()}
📍 Origen: Ruleta de Descuentos

¡Contacta al cliente para hacer efectivo su premio!
        `;
        
        console.log('🔔 NOTIFICACIÓN PARA COMERCIANTE:');
        console.log(mensajeComerciante);
        
        // En un entorno real, aquí enviaríamos:
        // 1. Email al comerciante
        // 2. Mensaje por WhatsApp
        // 3. Notificación en panel de control
        // 4. Registro en base de datos
    }
    
    validarFormatoTelefono(telefono) {
        const regex = /^[\+]?[(]?[\d\s\-\(\)]{8,}$/;
        return regex.test(telefono) && telefono.length >= 8;
    }
    
    mostrarCargaValidacion() {
        this.btnValidar.innerHTML = '<div class="spinner"></div> Validando...';
        this.btnValidar.disabled = true;
    }
    
    ocultarCargaValidacion() {
        this.btnValidar.innerHTML = 'Validar Premio';
        this.btnValidar.disabled = false;
    }
    
    mostrarError(mensaje) {
        alert(mensaje);
    }
    
    mostrarExito(mensaje) {
        alert(mensaje);
        this.ocultarCargaValidacion();
    }
    
    cerrarModal() {
        this.modal.style.display = 'none';
        this.telefonoInput.value = '';
        this.btnValidar.style.display = 'block'; // Asegurar que esté visible para el próximo premio
        this.ocultarCargaValidacion();
    }
    
    resetearRuleta() {
        this.btnGirar.disabled = false;
        this.girando = false;
        this.premioActual = null;
    }
}

// Inicializar la ruleta cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new RuletaDescuentos();
});