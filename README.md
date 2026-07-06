# For Mrs. Thakur ❤️

A premium romantic website built with pure HTML, CSS & Vanilla JavaScript.

## How to Open

Double-click `index.html` — that's it. No server, no installation needed.

## Password

```
Mrs Thakur
```
(Case-sensitive — exactly as written)

## Adding Your Photos

1. Drop your image files into `assets/gallery/`
2. Open `script.js` and add the filenames to the `GALLERY_IMAGES` array near the top:

```js
const GALLERY_IMAGES = [
  'photo1.jpg',
  'photo2.jpg',
  'us-together.png',
];

// Optional — captions shown in the lightbox
const GALLERY_CAPTIONS = [
  'Our favourite evening',
  'That perfect day',
  'Always, us',
];
```

## Adding Your Cover Photo

Replace `assets/cover.jpg` with your photo.
If it doesn't exist, a beautiful animated placeholder is shown automatically.

## Adding Your Music

Place your song at `assets/music/your-thoughts.mp3`.
It will auto-play after the password is unlocked.

## Folder Structure

```
for-mrs-thakur/
├── index.html          ← Open this in your browser
├── style.css
├── script.js
├── README.md
└── assets/
    ├── cover.jpg       ← Your hero background photo
    ├── gallery/        ← Drop your photos here
    │   ├── photo1.jpg
    │   └── ...
    └── music/
        └── your-thoughts.mp3   ← Your song
```

## Features

- 🔐 Password screen with shake animation on wrong entry
- 💫 Loading animation with heart beat, progress bar & rotating quotes
- 🌹 Hero section with parallax cover image
- 🎵 Floating music player (auto-plays, play/pause/mute/volume/seek)
- 💌 Love letter in handwritten style glass card
- 📅 Animated vertical timeline
- 🖼️ Photo gallery with lightbox (keyboard navigation)
- 💝 "Things I Love About You" cards
- 🤝 Promises section
- 💬 Rotating love quote carousel
- ✨ Cursor trail, click hearts, floating petals & particle effects
