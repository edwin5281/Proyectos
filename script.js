document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. CANVAS DE FONDO INTERACTIVO (RED DE NODOS)
    // ==========================================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = Math.floor(window.innerWidth / 20);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 1.8 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f0ff';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // ==========================================================================
    // 2. LÓGICA DEL SIMULADOR DE ESCANEO DE SEGURIDAD
    // ==========================================================================
    const scanTypes = document.querySelectorAll('.btn-scan');
    const startScanBtn = document.getElementById('btn-start-scan');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercent = document.getElementById('progress-percent');
    const progressStatus = document.getElementById('progress-status');
    const terminalOutput = document.getElementById('terminal-output');
    const targetInput = document.getElementById('target-ip');

    let selectedScanType = 'quick';
    let isScanning = false;

    // Selector de tipo de escaneo
    scanTypes.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isScanning) return;
            scanTypes.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedScanType = btn.dataset.type;
        });
    });

    // Función auxiliar para imprimir logs en la terminal
    function appendLog(message, type = 'info') {
        const p = document.createElement('p');
        p.className = `log-${type}`;
        const timestamp = new Date().toLocaleTimeString();
        p.textContent = `[${timestamp}] ${message}`;
        terminalOutput.appendChild(p);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Iniciar simulación de escaneo
    startScanBtn.addEventListener('click', () => {
        if (isScanning) return;
        
        const target = targetInput.value.trim() || "192.168.1.105";
        isScanning = true;
        startScanBtn.disabled = true;
        startScanBtn.style.opacity = "0.5";
        
        progressBarFill.style.width = '0%';
        progressPercent.textContent = '0%';
        progressStatus.textContent = 'Iniciando escaneo...';

        appendLog(`Iniciando escaneo tipo [${selectedScanType.toUpperCase()}] sobre objetivo: ${target}`, 'system');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress > 100) progress = 100;

            progressBarFill.style.width = `${progress}%`;
            progressPercent.textContent = `${progress}%`;

            // Logs simulados dinámicos
            if (progress === 20) {
                appendLog(`[PUERTOS] Verificando puertos abiertos (80, 443, 22, 8080)...`, 'info');
            } else if (progress === 50) {
                if (selectedScanType === 'quick') {
                    appendLog(`[ANÁLISIS] Sin anomalías graves encontradas en la capa de red.`, 'success');
                } else if (selectedScanType === 'deep') {
                    appendLog(`[ALERTA] Puerto 8080 presenta paquete malformado con coincidencia de exploit conocido.`, 'warning');
                } else {
                    appendLog(`[IA-CORE] Evaluando vector Zero-Day mediante sandbox predictivo...`, 'system');
                }
            } else if (progress === 80) {
                appendLog(`[FIREWALL] Sincronizando regla de bloqueo preventivo en iptables.`, 'info');
            }

            if (progress >= 100) {
                clearInterval(interval);
                isScanning = false;
                startScanBtn.disabled = false;
                startScanBtn.style.opacity = "1";
                progressStatus.textContent = 'Escaneo completado';

                if (selectedScanType === 'ai') {
                    appendLog(`[RESULTADO] Amenaza aislada. Firma asignada: CVE-2026-X89. Mitigación aplicada.`, 'danger');
                } else {
                    appendLog(`[RESULTADO] Análisis completado. El sistema de defensa está activo.`, 'success');
                }
            }
        }, 400);
    });

    // ==========================================================================
    // 3. GENERADOR DE LOGS AUTOMÁTICOS DE RED
    // ==========================================================================
    const autoLogs = [
        { msg: "[TRAFFIC] Petición GET sospechosa bloqueada desde IP 45.142.120.10", type: "warning" },
        { msg: "[AUTENTICACIÓN] Intento de fuerza bruta mitigado en SSD/SSH", type: "danger" },
        { msg: "[SSL/TLS] Certificado renvado automáticamente con cifrado cuántico", type: "success" },
        { msg: "[PATCH] Micro-parche heurístico aplicado a servidor de aplicaciones", type: "info" }
    ];

    setInterval(() => {
        if (!isScanning) {
            const randomLog = autoLogs[Math.floor(Math.random() * autoLogs.length)];
            appendLog(randomLog.msg, randomLog.type);
        }
    }, 8000);

    // ==========================================================================
    // 4. FORMULARIO DE CONTACTO
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        formResponse.style.color = '#00ff66';
        formResponse.textContent = 'Transmitiendo paquete cifrado con clave PGP...';

        setTimeout(() => {
            formResponse.textContent = '✔ Solicitud recibida. Un analista SOC revisará los parámetros de red proporcionados.';
            contactForm.reset();
        }, 1500);
    });
});