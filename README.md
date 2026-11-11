# Gyan Chaupar · ज्ञान चौपड़ (Moksha Patam)

<p align="center">
  <img src="assets/hero.png" alt="Gyan Chaupar Game Cover Artwork" width="680" style="border-radius: 8px;">
</p>

<p align="center">
  <strong>The ancient 72-square Indian board game of karma, virtue, and spiritual liberation.</strong><br>
  <em>The authentic philosophical ancestor to Snakes and Ladders, reimagined for Android and Modern Web.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%208.0%2B-green.svg?style=flat-square" alt="Android Platform">
  <img src="https://img.shields.io/badge/Payload-22.12%20MB-blue.svg?style=flat-square" alt="Payload Size">
  <img src="https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/Offline-100%25%20No%20Ads-purple.svg?style=flat-square" alt="Offline & No Ads">
  <img src="https://img.shields.io/badge/Web-Three.js%20%2F%20WebGL-orange.svg?style=flat-square" alt="Three.js">
</p>

---

## 📜 About The Game

**Gyan Chaupar** (also historically known as *Moksha Patam*, *Mokshapat*, or *Leela*) is an ancient Indian philosophical board game originating centuries ago across Jain, Hindu, and Sufi traditions. 

In 1892, colonial manufacturers adapted the board into the British children's game *Snakes and Ladders*, removing its 72-square cosmology, Sanskrit virtues, and karmic depth.

This repository preserves and revitalizes the **authentic 72-square board**:
- **72 Cosmic Squares** tracing the soul's passage (*Jiva*) through worldly existence (*Samsara*) to liberation (*Vaikuntha / Moksha*).
- **Ladders of Virtue (*Dharma Soapan*)**: Virtues like *Daya* (Compassion), *Tapa* (Ascetic discipline), and *Bhakti* (Devotion) propel the player upward.
- **Serpents of Karma (*Sarpa Dansha*)**: Vices like *Krodha* (Wrath), *Lobha* (Greed), and *Irshya* (Envy) swallow the player back to lower planes.
- **Four Yaksha Guardians**: Play as *Kubera*, *Śaṅkha*, *Padma*, or *Guhyaka*, each with distinct abilities.
- **Three Play Modes**: *Classic Patam*, *Yama's Vacation*, and *Shakti Mode*.

---

## 🎮 Play & Download

### 1. Android APK (Direct Download)
- **File:** [`assets/Gyan-Chaupar.apk`](assets/Gyan-Chaupar.apk)
- **Size:** `22.12 MB` (23,195,692 bytes)
- **Target OS:** Android 8.0 (Oreo) through Android 15+
- **Architecture:** Universal (ARM64, ARMv7, x86_64)
- **Permissions:** Zero invasive permissions (No contacts, camera, or storage tracking)
- **Network:** 100% Offline playable

### 2. Web Edition (Interactive 3D Board)
Play directly in any modern desktop or mobile browser without installation:
- **Location:** Open [`web-game/index.html`](web-game/index.html) locally or via GitHub Pages.
- **Tech Stack:** Vanilla JavaScript, Three.js (r128), OrbitControls, TailwindCSS.

---

## 🛡️ Cryptographic Verification

To ensure your downloaded APK is untampered, compare its SHA-256 checksum:

```bash
# Windows PowerShell
Get-FileHash -Path assets/Gyan-Chaupar.apk -Algorithm SHA256

# Linux / macOS
sha256sum assets/Gyan-Chaupar.apk
```

**Official SHA-256 Hash:**
```text
BC498A0449F7C327D17DC2C02E8968142A5216D5DA1815126C9C97F1DED011C8
```

---

## 📲 How to Install on Android

1. Download [`Gyan-Chaupar.apk`](assets/Gyan-Chaupar.apk) to your Android device.
2. Tap the downloaded file in your browser or File Manager.
3. If prompted with *"For security, your phone is not allowed to install unknown apps"*:
   - Tap **Settings** → toggle **Allow from this source**.
4. Tap **Install** and begin your journey across the 72 squares.

---

## 🏛️ The Four Yaksha Guardians

| Glyph | Guardian | Epithet | Domain & Ability |
|:---:|---|---|---|
| **कु** | **Kubera** | Lord of True Wealth | Resilience across squares of greed (*Lobha*) and temporal attachment. |
| **शं** | **Śaṅkha** | The Sacred Resonance | Divine conch sound; dispels serpentine delusions in lower planes. |
| **प** | **Padma** | Lotus Purity | Untainted karmic ascension; boosts progress across virtue ladders. |
| **गु** | **Guhyaka** | Master of Hidden Ways | Mystic knowledge of karmic shortcuts and cowrie dice control. |

---

## 📂 Repository Structure

```text
gyan-chaupar/
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
│   ├── standalone.html           # Standalone single-file version
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

## 🌐 Deploying to GitHub Pages

1. Push this repository to a new repository on GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/gyan-chaupar.git
   git push -u origin main
   ```
2. Navigate to your repository **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy-pages.yml` will automatically build and publish:
   - The landing page at `https://<your-username>.github.io/gyan-chaupar/`
   - The 3D game at `https://<your-username>.github.io/gyan-chaupar/web-game/`

---

## 👨‍💻 Author & Credits

- **Creator & Developer:** **Gauransh Bansal**
  - **LinkedIn:** [linkedin.com/in/gauransh-bansal-a71223239](https://www.linkedin.com/in/gauransh-bansal-a71223239/)
  - **GitHub:** [@gauranshbansal](https://github.com/gauranshbansal)
  - **Email:** [gauranshbansal2205@gmail.com](mailto:gauranshbansal2205@gmail.com)

---

## 📄 License

This project is open-source software licensed under the **[MIT License](LICENSE)**. Traditional rules, nomenclatures, and board motifs are part of the cultural heritage of South Asia.
