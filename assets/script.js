/**
 * Mis XV Años — Ernestina
 * Motor Cósmico de Estrellas, Estrellas Fugaces y Destellos Celestiales.
 * Reproductor de audio (Coldplay - Viva La Vida), Cuenta Regresiva y Copia de Alias.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. MOTOR CÓSMICO AVANZADO: ESTRELLAS, FUGACES Y DESTELLOS
     =================================================================== */
  const canvas = document.getElementById('cosmosCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let stars = [];
  let shootingStars = [];
  let sparkles = [];
  let lastShootingStarTime = 0;
  let scrollY = 0;

  function initCosmos() {
    if (!canvas || !ctx) return;
    resizeCanvas();
    generateStarfield();
    animateCosmos(0);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    if (!canvas) return;
    resizeCanvas();
    generateStarfield();
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  // Generador de estrellas con profundidad (3 capas)
  function generateStarfield() {
    stars = [];
    const baseCount = Math.floor((canvas.width * canvas.height) / 8000);
    const count = Math.min(Math.max(baseCount, 90), 160);

    for (let i = 0; i < count; i++) {
      const depth = Math.random(); // 0 (lejano) a 1 (cercano)
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: depth > 0.85 ? Math.random() * 1.5 + 0.8 : Math.random() * 0.9 + 0.3,
        color: depth > 0.6 
          ? (Math.random() > 0.5 ? 'rgba(245, 215, 127, ' : 'rgba(255, 242, 200, ')
          : 'rgba(230, 235, 255, ',
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        angle: Math.random() * Math.PI * 2,
        depth: depth,
        speedX: (Math.random() - 0.5) * 0.15 * (depth + 0.2),
        speedY: (Math.random() * 0.2 + 0.05) * (depth + 0.2)
      });
    }
  }

  // Creación de una estrella fugaz
  function spawnShootingStar() {
    const angle = (Math.PI / 4) + (Math.random() * 0.3 - 0.15); // ~45 grados
    const speed = Math.random() * 8 + 12;
    shootingStars.push({
      x: Math.random() * (canvas.width * 0.8),
      y: Math.random() * (canvas.height * 0.3),
      length: Math.random() * 80 + 90,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.015,
      trailWidth: Math.random() * 1.8 + 1.2
    });
  }

  // Creación de un destello estelar (4 puntas que titilan brillantemente)
  function spawnSparkle() {
    sparkles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 12 + 8,
      rotation: Math.random() * Math.PI,
      opacity: 0,
      maxOpacity: Math.random() * 0.6 + 0.4,
      step: 0,
      speed: Math.random() * 0.03 + 0.02
    });
  }

  function animateCosmos(timestamp) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Estrellas de fondo con suave titileo orgánico y deriva
    stars.forEach(s => {
      s.angle += s.twinkleSpeed;
      s.x += s.speedX;
      s.y += s.speedY;

      // Wrap around screen
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;

      // Parallax sutil con el scroll
      const currentY = (s.y - (scrollY * s.depth * 0.15)) % canvas.height;
      const displayY = currentY < 0 ? currentY + canvas.height : currentY;

      const alpha = Math.max(0.1, Math.min(1, s.baseAlpha + Math.sin(s.angle) * 0.35));

      ctx.beginPath();
      ctx.arc(s.x, displayY, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color + alpha + ')';
      if (s.radius > 1.2) {
        ctx.shadowBlur = s.radius * 4;
        ctx.shadowColor = 'rgba(245, 215, 127, 0.7)';
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    });

    // 2. Estrellas fugaces periódicas (cada 4 a 7 segundos)
    if (timestamp - lastShootingStarTime > 4500 && Math.random() > 0.6) {
      spawnShootingStar();
      lastShootingStarTime = timestamp;
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.speedX;
      ss.y += ss.speedY;
      ss.opacity -= ss.decay;

      if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
        shootingStars.splice(i, 1);
        continue;
      }

      // Dibujar estela gradiente
      const tailX = ss.x - (ss.speedX * (ss.length / 15));
      const tailY = ss.y - (ss.speedY * (ss.length / 15));

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(245, 215, 127, 0)');
      grad.addColorStop(0.6, `rgba(255, 245, 210, ${ss.opacity * 0.5})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = ss.trailWidth;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 245, 200, 0.8)';
      ctx.stroke();

      // Cabeza brillante
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, ss.trailWidth * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
    }

    // 3. Destellos celestiales (4-point sparkle flare)
    if (sparkles.length < 3 && Math.random() < 0.02) {
      spawnSparkle();
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sp = sparkles[i];
      sp.step += sp.speed;
      sp.opacity = Math.sin(sp.step * Math.PI) * sp.maxOpacity;

      if (sp.step >= 1) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.rotate(sp.rotation);

      const rad = sp.size;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
      grad.addColorStop(0, `rgba(255, 255, 255, ${sp.opacity})`);
      grad.addColorStop(0.3, `rgba(245, 215, 127, ${sp.opacity * 0.8})`);
      grad.addColorStop(1, 'rgba(245, 215, 127, 0)');

      // Cruz en punta de 4 rayos
      ctx.fillStyle = grad;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(245, 215, 127, 0.8)';

      ctx.beginPath();
      ctx.ellipse(0, 0, rad, rad * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, rad * 0.15, rad, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(animateCosmos);
  }

  initCosmos();

  /* ===================================================================
     2. REPRODUCTOR DE MÚSICA (Coldplay - Viva La Vida)
     ================================================================== */
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
  const cardWaveBars = document.getElementById('cardWaveBars');

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
        console.warn('Interacción requerida por el navegador:', err);
      });
    } else {
      audio.pause();
      setPlayingState(false);
    }
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (floatingWave) floatingWave.classList.add('active');
      if (cardWaveBars) cardWaveBars.classList.add('active');
      if (dalePlayAction) dalePlayAction.textContent = 'PAUSAR';
    } else {
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (floatingWave) floatingWave.classList.remove('active');
      if (cardWaveBars) cardWaveBars.classList.remove('active');
      if (dalePlayAction) dalePlayAction.textContent = 'DALE PLAY';
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
      audio.currentTime = 0;
      audio.play();
    });
  }

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

  /* ===================================================================
     3. CUENTA REGRESIVA EDITORIAL
     Fecha: Sábado 17 de Octubre de 2026 a las 21:30 hs (GMT-3)
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
      const heading = document.querySelector('.countdown-title');
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
    }, 3000);
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
      showToast('Seleccioná el alias para copiarlo');
    }
    document.body.removeChild(textArea);
  }

  function handleCopySuccess() {
    showToast('Alias copiado al portapapeles');
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
      const title = encodeURIComponent('Mis XV Años — Ernestina');
      const details = encodeURIComponent('¡Te espero para festejar mis 15 años! Salón Mirasoles. Vestimenta: Elegante Sport (Color reservado: Azul).');
      const location = encodeURIComponent('Salón Mirasoles, Av. Paraguay 553, Resistencia, Chaco');
      const startUtc = '20261018T003000Z';
      const endUtc = '20261018T083000Z';

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;

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
      'SUMMARY:Mis XV Años — Ernestina',
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
