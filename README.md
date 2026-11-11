# Gyan Chaupar · ज्ञान चौपड़ (Moksha Patam)

<p align="center">
  <img src="assets/hero.png" alt="Gyan Chaupar Frontispiece Artwork" width="680" style="border-radius: 8px;">
</p>

<p align="center">
  <strong>The ancient 72-square Indian board game of karma, virtue, and spiritual liberation.</strong><br>
  <em>Reconstructed, designed, and engineered from scratch by <strong>Gauransh Bansal</strong>.</em>
</p>

<p align="center">
  <a href="https://github.com/gauranshbansal/gyan-chaupar-game/releases/latest"><img src="https://img.shields.io/badge/Release-v1.4%20APK-gold.svg?style=flat-square" alt="Download APK"></a>
  <img src="https://img.shields.io/badge/Platform-Android%208.0%2B-green.svg?style=flat-square" alt="Android Platform">
  <img src="https://img.shields.io/badge/Payload-22.12%20MB-blue.svg?style=flat-square" alt="Payload Size">
  <img src="https://img.shields.io/badge/Engine-Three.js%20%2F%20WebGL-orange.svg?style=flat-square" alt="Three.js">
  <img src="https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20No%20Ads-purple.svg?style=flat-square" alt="Offline & No Ads">
  <img src="https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square" alt="MIT License">
</p>

<p align="center">
  <a href="https://gauranshbansal.github.io/gyan-chaupar-game/"><strong>🌐 View Live Download Site</strong></a> &nbsp;•&nbsp;
  <a href="https://gauranshbansal.github.io/gyan-chaupar-game/web-game/"><strong>🎮 Play 3D Web Edition</strong></a> &nbsp;•&nbsp;
  <a href="https://www.linkedin.com/in/gauransh-bansal-a71223239/"><strong>Connect on LinkedIn</strong></a>
</p>

---

## 🛠️ The Build: Why & How I Made This

Hi, I’m **Gauransh Bansal**. I built this project to bridge creative computing, physics-informed simulations, and forgotten cultural systems.

Most people know *Snakes and Ladders*, but few realize its ancestor—**Gyan Chaupar (Moksha Patam)**—was a mathematically deliberate 72-square philosophical map. When 19th-century colonial toy makers adapted it, they flattened it into a 100-square kids' game, stripped away the Sanskrit virtues, and discarded its mechanical logic.

Rather than just writing about the history, **I engineered a complete digital recreation from scratch**:

- **Real-Time 3D WebGL Engine:** Built a real-time carved 3D board in Three.js (r128) with dynamic camera orbiting, custom lighting passes, and mobile-optimized geometry rendering at a locked 60 FPS.
- **Probabilistic Cowrie Dice Physics:** Replaced uniform flat 1–6 dice with authentic 6-cowrie shell mechanics, modeling non-uniform binomial probability distributions ($n=6, p \approx 0.5$) for authentic gameplay.
- **Rule Engine & State Machine:** Programmed the 72-square non-linear state machine including virtue ascents (*Dharma, Daya, Bhakti*), vice falls (*Krodha, Lobha, Moha*), and 4 asymmetric Yaksha guardian archetypes (*Kubera, Śaṅkha, Padma, Guhyaka*).
- **Zero-Bloat Android APK:** Packaged the local runtime into a 22.1 MB standalone Android APK requiring zero network calls, zero tracking libraries, and zero ad frameworks.
- **Art Direction & Editorial Design:** Curated the visual identity, carved token textures, and tactile poster aesthetic honoring 18th-century Rajasthani and Mewar manuscript art.

---

## 🎮 How to Play

### 1. Android APK (Direct Sideload)
- **Direct Link:** [`assets/Gyan-Chaupar.apk`](assets/Gyan-Chaupar.apk)
- **File Size:** `22.12 MB` (23,195,692 bytes)
- **Target OS:** Android 8.0 (Oreo) through Android 15+
- **Architecture:** Universal (ARM64, ARMv7, x86_64)
- **Permissions:** None required (Runs in an offline local sandbox)

### 2. Web Edition (Interactive 3D Board)
Play directly in your browser without installing anything:
- **Online:** [gauranshbansal.github.io/gyan-chaupar-game/web-game/](https://gauranshbansal.github.io/gyan-chaupar-game/web-game/)
- **Local:** Open [`web-game/index.html`](web-game/index.html) in Chrome, Edge, or Firefox.

---

## 🛡️ Cryptographic Integrity (SHA-256)

All official builds of `Gyan-Chaupar.apk` distributed here match this exact SHA-256 hash:

```text
BC498A0449F7C327D17DC2C02E8968142A5216D5DA1815126C9C97F1DED011C8
```

Verify it locally in terminal:
```bash
# Windows PowerShell
Get-FileHash -Path assets/Gyan-Chaupar.apk -Algorithm SHA256

# Linux / macOS
sha256sum assets/Gyan-Chaupar.apk
```

---

## 🏛️ The Four Yaksha Guardians

| Glyph | Guardian | Epithet | Mechanical Specialty |
|:---:|---|---|---|
| **कु** | **Kubera** | Lord of True Wealth | Resilience across squares of greed (*Lobha*) and temporal attachment. |
| **शं** | **Śaṅkha** | The Sacred Resonance | Primordial sound; dispels serpentine delusions in lower planes. |
| **प** | **Padma** | Lotus Purity | Untainted ascension; bonus progress across virtue ladders. |
| **गु** | **Guhyaka** | Master of Hidden Ways | Mystic knowledge of karmic shortcuts and cowrie manipulation. |

---

## 💻 Tech Stack & Architecture

- **Core Game Engine:** Vanilla JavaScript (ES6+), Three.js r128, WebGL, OrbitControls
- **UI & Layout:** Tailwind CSS, Semantic HTML5, CSS Grid / Flexbox
- **Typography:** Cinzel, Playfair Display, Space Mono, Yatra One (Devanagari)
- **Mobile Distribution:** Android SDK (WebView Native Wrapper), Gradle, APK signing
- **CI/CD:** GitHub Actions (`.github/workflows/deploy-pages.yml`) for zero-config GitHub Pages hosting

---

## 📂 Repository Structure

```text
gyan-chaupar-game/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml      # Automated GitHub Pages CI/CD
├── assets/
│   ├── Gyan-Chaupar.apk          # Official signed Android APK (v1.4)
│   ├── SHA256SUMS                # Checksum verification file
│   ├── hero.png                  # Frontispiece cover artwork
│   ├── board.png                 # In-game 72-square board screenshot
│   ├── welcome.png               # Welcome portal screenshot
│   ├── setup.png                 # Player setup and Yaksha selector
│   └── campaign.png              # 10-panel lore tapestry artwork
├── web-game/
│   ├── index.html                # Playable 3D WebGL edition
│   ├── standalone.html           # Single-file browser fallback
│   ├── OrbitControls.js          # Three.js camera controller
│   ├── three.min.js              # Three.js r128 engine
│   ├── tailwind.min.js           # Styling framework
│   └── token_*.jpg               # Yaksha carved token textures
├── index.html                    # Official download page (GitHub Pages root)
├── CONTRIBUTING.md               # Contribution guidelines
├── LICENSE                       # MIT License
├── README.md                     # Project documentation
└── SECURITY.md                   # Security and integrity policy
```

---

## 👨‍💻 Creator & Author

**Gauransh Bansal**  
*Physics, Computational Modelling & Creative Engineering*

- **LinkedIn:** [linkedin.com/in/gauransh-bansal-a71223239](https://www.linkedin.com/in/gauransh-bansal-a71223239/)
- **GitHub:** [@gauranshbansal](https://github.com/gauranshbansal)
- **Email:** [gauranshbansal2205@gmail.com](mailto:gauranshbansal2205@gmail.com)

---

## 📄 License

This software is released under the **[MIT License](LICENSE)**. © 2026 Gauransh Bansal.
