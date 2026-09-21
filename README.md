# ✨ Invitación Digital de 15 Años — Ernestina

Sitio web interactivo y responsive para la invitación de 15 años de Ernestina, listo para desplegar en **Vercel** (`.vercel.app`) o cualquier hosting estático (Netlify, GitHub Pages, etc.).

---

## 🌟 Características

- **Diseño Móvil & Escritorio:** Adaptado perfectamente a pantallas de celulares (iPhone/Android) y centrado elegante en computadoras.
- **Reproductor de Música Interactivo:**
  - Botón "DALE PLAY" con barra de progreso interactiva, controles y botón flotante con ecualizador animado.
  - Archivo de música incluido en `assets/musica.mp3`.
- **Cuenta Regresiva en Vivo:**
  - Ticks en tiempo real hacia el **Sábado 17 de Octubre de 2026 a las 21:30 hs**.
- **Ubicación & Salón:**
  - Salón Mirasoles (Av. Paraguay 553, Resistencia, Chaco).
  - Botón directo para abrir en **Google Maps**.
  - Botón para **Agendar en Google Calendar** o descargar archivo de calendario `.ics` para iPhone.
- **Dress Code:**
  - Detalle de *Elegante Sport* y aviso de *Color reservado: Azul*.
- **Confirmación por WhatsApp (RSVP):**
  - Botón directo que abre WhatsApp con el número `362 424 9632` y un mensaje pre-cargado.
- **Regalo & Alias Bancario:**
  - Alias `EVALUSSIR1621.NX.ARS` con botón de **Copiar con 1 click** y notificación Toast.
- **Efectos Cósmicos:**
  - Canvas animado de partículas y polvo de estrellas doradas que titilan suavemente.

---

## 🚀 Cómo desplegar en Vercel (Paso a Paso)

### Opción 1: Conectando con GitHub (Recomendado)
1. Subí este repositorio a tu cuenta de **GitHub**:
   ```bash
   git add .
   git commit -m "Invitación de 15 años - Ernestina"
   git push origin main
   ```
2. Entrá en [vercel.com](https://vercel.com) e iniciá sesión con GitHub.
3. Hacé click en **"Add New..."** → **"Project"**.
4. Seleccioná el repositorio y hacé click en **"Deploy"**.
5. ¡Listo! En menos de 1 minuto vas a tener tu enlace público, por ejemplo:
   `https://ernestina-mis-15.vercel.app`

### Opción 2: Con Vercel CLI
Si tenés instalada la herramienta de Vercel:
```bash
npm i -g vercel
vercel
```

---

## 🎵 Cómo cambiar la música
Para usar tu propia canción:
1. Conseguí tu canción favorita en formato `.mp3`.
2. Renombrala a `musica.mp3`.
3. Reemplazá el archivo existente dentro de la carpeta `assets/musica.mp3`.
4. ¡Y listo! Al abrir la página y tocar "DALE PLAY", sonará tu canción.
