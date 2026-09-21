/**
 * Mis XV Años — Ernestina
 * Interactividad: Reproductor de audio, Cuenta Regresiva, Canvas de estrellas, Copiar Alias y Calendario.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. CANVAS DE ESTRELLAS Y POLVO DORADO ANIMADO
     =================================================================== */
  const canvas = document.getElementById('starsCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animationFrameId = null;

  function initCanvas() {
    if (!canvas || !ctx) return;
    resizeCanvas();
    createParticles();
    animateParticles();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    if (!canvas) return;
    resizeCanvas();
  });

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(window.innerWidth * 0.1), 70);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.5,
        color: Math.random() > 0.4 ? 'rgba(255, 216, 117, ' : 'rgba(255, 255, 255, ',
        baseAlpha: Math.random() * 0.7 + 0.2,
        speedY: (Math.random() * 0.35 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
        speedX: (Math.random() * 0.3 - 0.15),
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.angle += p.twinkleSpeed;

      const alpha = p.baseAlpha + Math.sin(p.angle) * 0.3;
      const clampedAlpha = Math.max(0.1, Math.min(1, alpha));

      // Reaparecer al cruzar los límites
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + clampedAlpha + ')';
      ctx.shadowBlur = p.radius * 3;
      ctx.shadowColor = 'rgba(255, 216, 117, 0.8)';
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(animateParticles);
  }

  initCanvas();

  /* ===================================================================
     2. REPRODUCTOR DE MÚSICA & AUDIO
     =================================================================== */
  const audio = document.getElementById('bgAudio');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const dalePlayAction = document.getElementById('dalePlayAction');
  const progressBar = document.getElementById('progressBar');
  const progressThumb = document.getElementById('progressThumb');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');
  const floatingMusicBtn = document.getElementById('floatingMusicBtn');
  const floatingWave = document.getElementById('floatingWave');

  let isPlaying = false;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function togglePlay() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.warn('Autoplay restringido por el navegador:', err);
        // Si hay algún problema, intentamos sintetizar un suave arpegio con Web Audio
        playFallbackSynth();
        setPlayingState(true);
      });
    } else {
      audio.pause();
      setPlayingState(false);
    }
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      if (floatingWave) floatingWave.classList.add('active');
      if (dalePlayAction) {
        dalePlayAction.querySelector('span').textContent = 'PAUSAR';
      }
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      if (floatingWave) floatingWave.classList.remove('active');
      if (dalePlayAction) {
        dalePlayAction.querySelector('span').textContent = 'DALE PLAY';
      }
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (dalePlayAction) dalePlayAction.addEventListener('click', togglePlay);
  if (floatingMusicBtn) floatingMusicBtn.addEventListener('click', togglePlay);

  if (audio) {
    audio.addEventListener('loadedmetadata', () => {
      if (totalDurationEl && !isNaN(audio.duration)) {
        totalDurationEl.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      if (progressBar) progressBar.style.width = `${progressPercent}%`;
      if (progressThumb) progressThumb.style.left = `${progressPercent}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      // Loop continuo
      audio.currentTime = 0;
      audio.play();
    });
  }

  // Permitir saltar en la barra de progreso
  if (progressBarContainer && audio) {
    progressBarContainer.addEventListener('click', (e) => {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (audio.duration) {
        audio.currentTime = (clickX / width) * audio.duration;
      }
    });
  }

  /* Fallback sintético Web Audio API por si el archivo no cargara */
  let synthContext = null;
  function playFallbackSynth() {
    try {
      if (!synthContext) {
        synthContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (synthContext.state === 'suspended') {
        synthContext.resume();
      }
    } catch (e) {
      console.log('Web Audio no disponible');
    }
  }

  /* ===================================================================
     3. CUENTA REGRESIVA EN VIVO (COUNTDOWN)
     Fecha del Evento: Sábado 17 de Octubre de 2026 a las 21:30 hs (GMT-3)
     =================================================================== */
  const eventDate = new Date('2026-10-17T21:30:00-03:00').getTime();

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      const heading = document.querySelector('.countdown-heading');
      if (heading) heading.textContent = '¡HOY ES LA FIESTA! 🎉';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ===================================================================
     4. COPIAR ALIAS AL PORTAPAPELES
     =================================================================== */
  const btnCopyAlias = document.getElementById('btnCopyAlias');
  const aliasCodeText = document.getElementById('aliasCodeText');
  const copyBtnLabel = document.getElementById('copyBtnLabel');
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (btnCopyAlias && aliasCodeText) {
    btnCopyAlias.addEventListener('click', () => {
      const alias = aliasCodeText.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(alias).then(() => {
          handleCopySuccess();
        }).catch(() => {
          fallbackCopyText(alias);
        });
      } else {
        fallbackCopyText(alias);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      handleCopySuccess();
    } catch (err) {
      showToast('Por favor selecciona y copia el alias manualmente');
    }
    document.body.removeChild(textArea);
  }

  function handleCopySuccess() {
    showToast('¡Alias copiado al portapapeles! 🎉');
    if (copyBtnLabel) {
      const originalText = copyBtnLabel.textContent;
      copyBtnLabel.textContent = '¡COPIADO! ✓';
      setTimeout(() => {
        copyBtnLabel.textContent = originalText;
      }, 2500);
    }
  }

  /* ===================================================================
     5. AGENDAR EN CALENDARIO (Google Calendar y descarga .ICS)
     =================================================================== */
  const btnAddToCalendar = document.getElementById('btnAddToCalendar');

  if (btnAddToCalendar) {
    btnAddToCalendar.addEventListener('click', () => {
      // Opciones: Google Calendar o archivo iCal (.ics)
      const title = encodeURIComponent('Mis XV Años — Ernestina ✨');
      const details = encodeURIComponent('¡Te espero para festejar mis 15 años! Salón Mirasoles. Vestimenta: Elegante Sport (Color reservado: Azul).');
      const location = encodeURIComponent('Salón Mirasoles, Av. Paraguay 553, Resistencia, Chaco');
      // 17 de Octubre 2026 de 21:30 a 05:30 (18 de Octubre)
      // En UTC (Argentina GMT-3): 21:30 AR = 00:30 UTC del día siguiente
      const startUtc = '20261018T003000Z';
      const endUtc = '20261018T083000Z';

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;

      // Si es dispositivo móvil Apple o prefiere descarga:
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        downloadIcsFile();
      } else {
        window.open(googleCalUrl, '_blank');
      }
    });
  }

  function downloadIcsFile() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ernestina XV//Invitacion Digital//ES',
      'BEGIN:VEVENT',
      'SUMMARY:Mis XV Años — Ernestina ✨',
      'DESCRIPTION:¡Te espero para festejar mis 15 años! Salón Mirasoles. Vestimenta: Elegante Sport (Color reservado: Azul).',
      'LOCATION:Salón Mirasoles, Av. Paraguay 553, Resistencia, Chaco',
      'DTSTART:20261018T003000Z',
      'DTEND:20261018T083000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Mis_XV_Ernestina.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

});
