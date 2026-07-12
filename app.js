/* ── Greeting ── */
const hour = new Date().getHours();
document.getElementById('greeting').textContent =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

/* ── Sidebar (mobile drawer) ── */
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const hamburger      = document.getElementById('hamburger');
const sidebarClose   = document.getElementById('sidebarClose');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

/* ── Mobile Bottom Nav ── */
document.querySelectorAll('.mob-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mob-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.nav === 'library') openSidebar();
    });
});

/* ── Desktop Nav active state ── */
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
    });
});

/* ── Art gradients ── */
const artGradients = [
    'linear-gradient(135deg, #ff5f6d, #ffc371)',
    'linear-gradient(135deg, #56ccf2, #2f80ed)',
    'linear-gradient(135deg, #00b894, #55efc4)',
    'linear-gradient(135deg, #f7971e, #ffd200)',
    'linear-gradient(135deg, #8e2de2, #f000ff)',
    'linear-gradient(135deg, #a8c0ff, #3f2b96)',
    'linear-gradient(135deg, #f953c6, #b91d73)',
    'linear-gradient(135deg, #1a1a2e, #4a90d9)',
];

/* ── Player state ── */
let isPlaying = false, isShuffle = false, isRepeat = false, isMuted = false;
let volume = 0.7, progress = 0;
let progressInterval = null;
const DURATION = 210;

const btnPlay      = document.getElementById('btnPlay');
const btnShuffle   = document.getElementById('btnShuffle');
const btnRepeat    = document.getElementById('btnRepeat');
const btnMute      = document.getElementById('btnMute');
const heartBtn     = document.getElementById('heartBtn');
const progressFill = document.getElementById('progressFill');
const progressThumb= document.getElementById('progressThumb');
const progressBar  = document.getElementById('progressBar');
const volumeFill   = document.getElementById('volumeFill');
const volumeThumb  = document.getElementById('volumeThumb');
const volumeBar    = document.getElementById('volumeBar');
const timeElapsed  = document.getElementById('timeElapsed');
const timeDuration = document.getElementById('timeDuration');
const playerTitle  = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerArt    = document.getElementById('playerArt');

timeDuration.textContent = formatTime(DURATION);

function formatTime(s) {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function setProgress(pct) {
    progress = Math.max(0, Math.min(100, pct));
    progressFill.style.width  = progress + '%';
    progressThumb.style.left  = progress + '%';
    timeElapsed.textContent   = formatTime((progress / 100) * DURATION);
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
    playerTitle.textContent  = title;
    playerArtist.textContent = artist;
    playerArt.style.background = artGradients[artIdx % artGradients.length];
    isPlaying = true;
    btnPlay.textContent = '⏸';
    startProgress();
}

/* ── Player controls ── */
btnPlay.addEventListener('click', () => {
    if (playerTitle.textContent === 'Select a track') return;
    isPlaying ? pausePlayer() : (() => { isPlaying = true; btnPlay.textContent = '⏸'; startProgress(); })();
});

btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
});

btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('active', isRepeat);
});

btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
    volumeFill.style.width = isMuted ? '0%' : (volume * 100) + '%';
    volumeThumb.style.left = isMuted ? '0%' : (volume * 100) + '%';
});

heartBtn.addEventListener('click', () => {
    heartBtn.classList.toggle('liked');
    heartBtn.textContent = heartBtn.classList.contains('liked') ? '♥' : '♡';
});

document.getElementById('btnPrev').addEventListener('click', () => { setProgress(0); if (isPlaying) startProgress(); });
document.getElementById('btnNext').addEventListener('click', () => { setProgress(0); if (isPlaying) startProgress(); });

/* ── Progress bar: click + drag (touch & mouse) ── */
function scrubFromEvent(e, bar, cb) {
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    cb(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)));
}

function makeDraggable(bar, onScrub) {
    let dragging = false;

    bar.addEventListener('mousedown',  e => { dragging = true; scrubFromEvent(e, bar, onScrub); });
    bar.addEventListener('touchstart', e => { dragging = true; scrubFromEvent(e, bar, onScrub); }, { passive: true });

    document.addEventListener('mousemove',  e => { if (dragging) scrubFromEvent(e, bar, onScrub); });
    document.addEventListener('touchmove',  e => { if (dragging) scrubFromEvent(e, bar, onScrub); }, { passive: true });

    document.addEventListener('mouseup',   () => { dragging = false; });
    document.addEventListener('touchend',  () => { dragging = false; });

    bar.addEventListener('click', e => scrubFromEvent(e, bar, onScrub));
}

makeDraggable(progressBar, pct => setProgress(pct * 100));

makeDraggable(volumeBar, pct => {
    volume = pct;
    isMuted = false;
    btnMute.textContent = '🔊';
    volumeFill.style.width = (volume * 100) + '%';
    volumeThumb.style.left = (volume * 100) + '%';
});

/* ── Clickable cards ── */
document.querySelectorAll('.music-card, .feature-card').forEach((card, i) => {
    const play = () => {
        const title = card.dataset.track;
        const artist = card.dataset.artist;
        if (title) { playTrack(title, artist, i); closeSidebar(); }
    };
    card.addEventListener('click', play);
    const btn = card.querySelector('.play-overlay, .card-play-btn');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); play(); });
});

/* ── Close sidebar on resize to desktop ── */
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
});
