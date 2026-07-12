const artGradients = [
    'linear-gradient(135deg, #ff5f6d, #ffc371)',
    'linear-gradient(135deg, #56ccf2, #2f80ed)',
    'linear-gradient(135deg, #00b894, #55efc4)',
    'linear-gradient(135deg, #f7971e, #ffd200)',
    'linear-gradient(135deg, #8e2de2, #f000ff)',
    'linear-gradient(135deg, #a8c0ff, #3f2b96)',
    'linear-gradient(135deg, #f953c6, #b91d73)',
    'linear-gradient(135deg, #1a1a2e, #16213e)',
];

// Greeting
const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
document.getElementById('greeting').textContent = greeting;

// Player state
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let volume = 0.7;
let progress = 0;
let progressInterval = null;
let currentArtIndex = 0;

const btnPlay = document.getElementById('btnPlay');
const btnShuffle = document.getElementById('btnShuffle');
const btnRepeat = document.getElementById('btnRepeat');
const btnMute = document.getElementById('btnMute');
const heartBtn = document.getElementById('heartBtn');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const progressBar = document.getElementById('progressBar');
const volumeFill = document.getElementById('volumeFill');
const volumeThumb = document.getElementById('volumeThumb');
const volumeBar = document.getElementById('volumeBar');
const timeElapsed = document.getElementById('timeElapsed');
const timeDuration = document.getElementById('timeDuration');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerArt = document.getElementById('playerArt');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

const DURATION = 210; // 3:30

function setProgress(pct) {
    progress = Math.max(0, Math.min(100, pct));
    progressFill.style.width = progress + '%';
    progressThumb.style.left = progress + '%';
    timeElapsed.textContent = formatTime((progress / 100) * DURATION);
}

function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (progress >= 100) {
            setProgress(0);
            if (!isRepeat) { pausePlayer(); return; }
        }
        setProgress(progress + (100 / DURATION));
    }, 1000);
}

function pausePlayer() {
    isPlaying = false;
    btnPlay.textContent = '▶';
    clearInterval(progressInterval);
}

function playTrack(title, artist, artIdx) {
    playerTitle.textContent = title;
    playerArtist.textContent = artist;
    playerArt.style.background = artGradients[artIdx % artGradients.length];
    isPlaying = true;
    btnPlay.textContent = '⏸';
    startProgress();
}

// Play/Pause toggle
btnPlay.addEventListener('click', () => {
    if (playerTitle.textContent === 'Select a track') return;
    if (isPlaying) {
        pausePlayer();
    } else {
        isPlaying = true;
        btnPlay.textContent = '⏸';
        startProgress();
    }
});

// Shuffle
btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
});

// Repeat
btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('active', isRepeat);
});

// Mute
btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
    volumeFill.style.width = isMuted ? '0%' : (volume * 100) + '%';
    volumeThumb.style.left = isMuted ? '0%' : (volume * 100) + '%';
});

// Heart / Like
heartBtn.addEventListener('click', () => {
    heartBtn.classList.toggle('liked');
    heartBtn.textContent = heartBtn.classList.contains('liked') ? '♥' : '♡';
});

// Progress bar click
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(pct);
});

// Volume bar click
volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    isMuted = false;
    btnMute.textContent = '🔊';
    volumeFill.style.width = (volume * 100) + '%';
    volumeThumb.style.left = (volume * 100) + '%';
});

// Prev / Next (reset progress)
document.getElementById('btnPrev').addEventListener('click', () => {
    setProgress(0);
    if (isPlaying) startProgress();
});

document.getElementById('btnNext').addEventListener('click', () => {
    setProgress(0);
    if (isPlaying) startProgress();
});

// Duration display
timeDuration.textContent = formatTime(DURATION);

// Clickable music cards
document.querySelectorAll('.music-card, .feature-card').forEach((card, i) => {
    const playFn = () => {
        const title = card.dataset.track;
        const artist = card.dataset.artist;
        if (title) playTrack(title, artist, i);
    };
    card.addEventListener('click', playFn);
    const btn = card.querySelector('.play-overlay, .card-play-btn');
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); playFn(); });
});

// Nav active state
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
    });
});
