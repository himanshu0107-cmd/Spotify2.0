/* ─────────────────────────────────────────
   Web Audio Context (lazy init on first play)
───────────────────────────────────────── */
let audioCtx = null;
let currentSource = null;
let gainNode = null;
let startTime = 0;       // audioCtx.currentTime when track started
let pauseOffset = 0;     // seconds into track when paused
let tickInterval = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(audioCtx.destination);
    }
    return audioCtx;
}

/* Each song gets a unique synthesized tone based on its id */
function buildSongBuffer(song) {
    const ctx = getAudioCtx();
    const dur = song.duration;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, sampleRate * dur, sampleRate);

    // Base frequency: map song id to a musical note (A3–A5 range)
    const notes = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880];
    const freq = notes[(song.id - 1) % notes.length];
    const freq2 = freq * 1.5; // perfect fifth harmony

    for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Fade in/out envelope
            const env = Math.min(t * 4, 1) * Math.min((dur - t) * 4, 1);
            // Mix fundamental + harmony + subtle beat
            const beat = 0.3 * Math.sin(2 * Math.PI * 2 * t); // 2 Hz pulse
            data[i] = env * 0.18 * (
                Math.sin(2 * Math.PI * freq * t) +
                0.5 * Math.sin(2 * Math.PI * freq2 * t) +
                0.15 * Math.sin(2 * Math.PI * freq * 2 * t) +
                beat * Math.sin(2 * Math.PI * freq * t)
            );
        }
    }
    return buffer;
}

const bufferCache = {};

function getBuffer(song) {
    if (!bufferCache[song.id]) bufferCache[song.id] = buildSongBuffer(song);
    return bufferCache[song.id];
}

/* ─────────────────────────────────────────
   Greeting
───────────────────────────────────────── */
const hour = new Date().getHours();
document.getElementById('greeting').textContent =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

/* ─────────────────────────────────────────
   Sidebar (mobile drawer)
───────────────────────────────────────── */
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
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebar(); });

/* ─────────────────────────────────────────
   Mobile Bottom Nav
───────────────────────────────────────── */
document.querySelectorAll('.mob-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mob-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.nav === 'library') openSidebar();
    });
});

/* Desktop nav */
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
    });
});

/* ─────────────────────────────────────────
   Player State
───────────────────────────────────────── */
let isPlaying   = false;
let isShuffle   = false;
let isRepeat    = false;
let isMuted     = false;
let volume      = 0.7;
let currentIdx  = -1;   // index into SONGS array

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

function fmt(s) {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function currentElapsed() {
    if (!isPlaying) return pauseOffset;
    return pauseOffset + (getAudioCtx().currentTime - startTime);
}

function updateProgressUI() {
    const song = SONGS[currentIdx];
    if (!song) return;
    const elapsed = Math.min(currentElapsed(), song.duration);
    const pct = (elapsed / song.duration) * 100;
    progressFill.style.width  = pct + '%';
    progressThumb.style.left  = pct + '%';
    timeElapsed.textContent   = fmt(elapsed);
}

function startTick() {
    clearInterval(tickInterval);
    tickInterval = setInterval(() => {
        const song = SONGS[currentIdx];
        if (!song) return;
        if (currentElapsed() >= song.duration) {
            if (isRepeat) {
                pauseOffset = 0;
                startAudio(currentIdx, 0);
            } else {
                nextTrack();
            }
        } else {
            updateProgressUI();
        }
    }, 250);
}

function stopAudio() {
    if (currentSource) {
        try { currentSource.stop(); } catch (_) {}
        currentSource = null;
    }
    clearInterval(tickInterval);
}

function startAudio(idx, offset) {
    stopAudio();
    const ctx = getAudioCtx();
    const song = SONGS[idx];
    const buf = getBuffer(song);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(gainNode);
    src.start(0, offset);
    currentSource = src;
    startTime = ctx.currentTime;
    pauseOffset = offset;
    isPlaying = true;
    btnPlay.textContent = '⏸';
    startTick();
    src.onended = () => {};
}

function playIndex(idx, offset = 0) {
    currentIdx = idx;
    const song = SONGS[idx];
    pauseOffset = offset;

    // Update player bar UI
    playerTitle.textContent  = song.title;
    playerArtist.textContent = song.artist;
    playerArt.style.background = song.gradient;
    timeDuration.textContent = fmt(song.duration);
    heartBtn.classList.remove('liked');
    heartBtn.textContent = '♡';

    startAudio(idx, offset);
    highlightRow(idx);
}

function pausePlayer() {
    if (!isPlaying) return;
    pauseOffset = currentElapsed();
    stopAudio();
    isPlaying = false;
    btnPlay.textContent = '▶';
    updateProgressUI();
    highlightRow(currentIdx, true); // paused state
}

function nextTrack() {
    if (currentIdx < 0) return;
    const next = isShuffle
        ? Math.floor(Math.random() * SONGS.length)
        : (currentIdx + 1) % SONGS.length;
    playIndex(next);
}

function prevTrack() {
    if (currentIdx < 0) return;
    if (currentElapsed() > 3) {
        playIndex(currentIdx, 0);
        return;
    }
    const prev = isShuffle
        ? Math.floor(Math.random() * SONGS.length)
        : (currentIdx - 1 + SONGS.length) % SONGS.length;
    playIndex(prev);
}

/* ─────────────────────────────────────────
   Player Controls
───────────────────────────────────────── */
btnPlay.addEventListener('click', () => {
    if (currentIdx < 0) return;
    if (isPlaying) {
        pausePlayer();
    } else {
        startAudio(currentIdx, pauseOffset);
        highlightRow(currentIdx);
    }
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
    if (gainNode) gainNode.gain.value = isMuted ? 0 : volume;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
    volumeFill.style.width = isMuted ? '0%' : (volume * 100) + '%';
    volumeThumb.style.left = isMuted ? '0%' : (volume * 100) + '%';
});

heartBtn.addEventListener('click', () => {
    heartBtn.classList.toggle('liked');
    heartBtn.textContent = heartBtn.classList.contains('liked') ? '♥' : '♡';
});

document.getElementById('btnPrev').addEventListener('click', prevTrack);
document.getElementById('btnNext').addEventListener('click', nextTrack);

/* ─────────────────────────────────────────
   Scrub / Volume drag (mouse + touch)
───────────────────────────────────────── */
function scrubPct(e, bar) {
    const rect = bar.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (x - rect.left) / rect.width));
}

function makeDraggable(bar, onScrub) {
    let drag = false;
    bar.addEventListener('mousedown',  e => { drag = true; onScrub(scrubPct(e, bar)); });
    bar.addEventListener('touchstart', e => { drag = true; onScrub(scrubPct(e, bar)); }, { passive: true });
    document.addEventListener('mousemove',  e => { if (drag) onScrub(scrubPct(e, bar)); });
    document.addEventListener('touchmove',  e => { if (drag) onScrub(scrubPct(e, bar)); }, { passive: true });
    document.addEventListener('mouseup',  () => { drag = false; });
    document.addEventListener('touchend', () => { drag = false; });
    bar.addEventListener('click', e => onScrub(scrubPct(e, bar)));
}

makeDraggable(progressBar, pct => {
    if (currentIdx < 0) return;
    const newOffset = pct * SONGS[currentIdx].duration;
    if (isPlaying) {
        startAudio(currentIdx, newOffset);
    } else {
        pauseOffset = newOffset;
        updateProgressUI();
    }
});

makeDraggable(volumeBar, pct => {
    volume = pct;
    isMuted = false;
    if (gainNode) gainNode.gain.value = volume;
    btnMute.textContent = '🔊';
    volumeFill.style.width = (volume * 100) + '%';
    volumeThumb.style.left = (volume * 100) + '%';
});

/* ─────────────────────────────────────────
   Feature / Music cards (existing cards)
───────────────────────────────────────── */
document.querySelectorAll('.music-card, .feature-card').forEach((card) => {
    const play = () => {
        const title  = card.dataset.track;
        const artist = card.dataset.artist;
        if (!title) return;
        // Find in SONGS array or create a temp entry
        const idx = SONGS.findIndex(s => s.title === title);
        if (idx >= 0) {
            playIndex(idx);
        } else {
            // Fallback: play first song with card's label
            playerTitle.textContent  = title;
            playerArtist.textContent = artist;
            playerArt.style.background = 'linear-gradient(135deg,#535353,#282828)';
            timeDuration.textContent = fmt(210);
            playIndex(0);
        }
        closeSidebar();
    };
    card.addEventListener('click', play);
    const btn = card.querySelector('.play-overlay, .card-play-btn');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); play(); });
});

/* ─────────────────────────────────────────
   Song List Rendering
───────────────────────────────────────── */
const songList  = document.getElementById('songList');
const songCount = document.getElementById('songCount');

songCount.textContent = `${SONGS.length} songs`;

SONGS.forEach((song, idx) => {
    const li = document.createElement('li');
    li.className = 'song-row';
    li.dataset.idx = idx;
    li.innerHTML = `
        <div class="col-num">
            <span class="song-num">
                <span class="song-num-text">${song.id}</span>
                <span class="eq-bars"><span></span><span></span><span></span></span>
            </span>
            <button class="row-play" aria-label="Play ${song.title}">▶</button>
        </div>
        <div class="song-info">
            <div class="song-thumb" style="background:${song.gradient}"></div>
            <div class="song-meta">
                <p class="song-title">${song.title}</p>
                <p class="song-artist">${song.artist}</p>
            </div>
        </div>
        <span class="song-genre hide-mobile">${song.genre}</span>
        <span class="song-dur">${fmt(song.duration)}</span>
    `;

    const doPlay = () => playIndex(idx);
    li.addEventListener('click', doPlay);
    li.querySelector('.row-play').addEventListener('click', e => { e.stopPropagation(); doPlay(); });

    songList.appendChild(li);
});

function highlightRow(idx, paused = false) {
    document.querySelectorAll('.song-row').forEach(r => {
        r.classList.remove('playing', 'paused');
    });
    const row = songList.querySelector(`[data-idx="${idx}"]`);
    if (row) {
        row.classList.add('playing');
        if (paused) row.classList.add('paused');
        row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}
