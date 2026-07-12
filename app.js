'use strict';

/* ══════════════════════════════════════════
   PLAYLIST DEFINITIONS
   Map playlist key → array of SONGS indices
══════════════════════════════════════════ */
const PLAYLISTS = {
    liked:     { name: 'Liked Songs',        art: 'linear-gradient(135deg,#4b0082,#7b2ff7)', indices: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27] },
    dailymix:  { name: 'Daily Mix 1',        art: 'linear-gradient(135deg,#1f5c4a,#2d9c6e)', indices: [0,3,6,9,12,15,18,21,24,27] },
    discover:  { name: 'Discover Weekly',    art: 'linear-gradient(135deg,#4a1a6d,#7a3ed6)', indices: [1,4,7,10,13,16,19,22,25] },
    chill:     { name: 'Chill Hits',         art: 'linear-gradient(135deg,#1c4f7d,#4b8ef5)', indices: [2,5,8,11,14,17,20,23,26] },
    lofi:      { name: 'Midnight Drive',     art: 'linear-gradient(135deg,#ff5f6d,#ffc371)', indices: [0,2,4,6,8,10,12] },
    pop:       { name: 'Summer Vibes',       art: 'linear-gradient(135deg,#56ccf2,#2f80ed)', indices: [1,3,5,7,9,11,13] },
    focus:     { name: 'Focus Flow',         art: 'linear-gradient(135deg,#00b894,#55efc4)', indices: [14,15,16,17,18,19,20] },
    throwback: { name: 'Throwback Hits',     art: 'linear-gradient(135deg,#f7971e,#ffd200)', indices: [21,22,23,24,25,26,27] },
    synthwave: { name: 'Neon Nights',        art: 'linear-gradient(135deg,#8e2de2,#f000ff)', indices: [6,7,8,9,10,11] },
    acoustic:  { name: 'Acoustic Morning',   art: 'linear-gradient(135deg,#a8c0ff,#3f2b96)', indices: [15,16,17,18,19] },
    hiphop:    { name: 'Hip-Hop Essentials', art: 'linear-gradient(135deg,#f953c6,#b91d73)', indices: [3,6,12,13,20,21,22,23,25] },
    jazz:      { name: 'Jazz After Dark',    art: 'linear-gradient(135deg,#1a1a2e,#4a90d9)', indices: [0,5,10,15,20,25] },
};

/* ══════════════════════════════════════════
   WEB AUDIO
══════════════════════════════════════════ */
let audioCtx = null, gainNode = null, currentSource = null;
let startTime = 0, pauseOffset = 0, tickInterval = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(audioCtx.destination);
    }
    return audioCtx;
}

const bufCache = {};
function getBuffer(song) {
    if (bufCache[song.id]) return bufCache[song.id];
    const ctx = getCtx();
    const sr  = ctx.sampleRate;
    const dur = song.duration;
    const buf = ctx.createBuffer(2, sr * dur, sr);
    const notes = [220,246.94,261.63,293.66,329.63,349.23,392,440,493.88,523.25,587.33,659.25,698.46,783.99,880];
    const f1 = notes[(song.id - 1) % notes.length];
    const f2 = f1 * 1.5;
    const f3 = f1 * 2;
    for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++) {
            const t   = i / sr;
            const env = Math.min(t * 3, 1) * Math.min((dur - t) * 3, 1);
            const pulse = 1 + 0.25 * Math.sin(2 * Math.PI * 1.5 * t);
            d[i] = env * 0.15 * pulse * (
                Math.sin(2 * Math.PI * f1 * t) +
                0.45 * Math.sin(2 * Math.PI * f2 * t) +
                0.2  * Math.sin(2 * Math.PI * f3 * t)
            );
        }
    }
    bufCache[song.id] = buf;
    return buf;
}

/* ══════════════════════════════════════════
   PLAYER STATE
══════════════════════════════════════════ */
let isPlaying = false, isShuffle = false, isRepeat = false, isMuted = false;
let volume = 0.7;
let currentIdx = -1;          // index in SONGS
let currentQueue = [];        // ordered list of SONGS indices for current context

const $ = id => document.getElementById(id);
const btnPlay      = $('btnPlay');
const btnShuffle   = $('btnShuffle');
const btnRepeat    = $('btnRepeat');
const btnMute      = $('btnMute');
const heartBtn     = $('heartBtn');
const progressFill = $('progressFill');
const progressThumb= $('progressThumb');
const progressBar  = $('progressBar');
const volumeFill   = $('volumeFill');
const volumeThumb  = $('volumeThumb');
const volumeBar    = $('volumeBar');
const timeElapsed  = $('timeElapsed');
const timeDuration = $('timeDuration');
const playerTitle  = $('playerTitle');
const playerArtist = $('playerArtist');
const playerArt    = $('playerArt');

function fmt(s) {
    s = Math.max(0, s);
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
}

function elapsed() {
    if (!isPlaying) return pauseOffset;
    return pauseOffset + (getCtx().currentTime - startTime);
}

function updateUI() {
    const song = SONGS[currentIdx];
    if (!song) return;
    const e   = Math.min(elapsed(), song.duration);
    const pct = (e / song.duration) * 100;
    progressFill.style.width = pct + '%';
    progressThumb.style.left = pct + '%';
    timeElapsed.textContent  = fmt(e);
}

function stopAudio() {
    if (currentSource) { try { currentSource.stop(); } catch(_){} currentSource = null; }
    clearInterval(tickInterval);
}

function startAudio(songIdx, offset) {
    stopAudio();
    const ctx  = getCtx();
    const song = SONGS[songIdx];
    const src  = ctx.createBufferSource();
    src.buffer = getBuffer(song);
    src.connect(gainNode);
    src.start(0, offset);
    currentSource = src;
    startTime     = ctx.currentTime;
    pauseOffset   = offset;
    isPlaying     = true;
    btnPlay.textContent = '⏸';
    tickInterval = setInterval(() => {
        if (elapsed() >= song.duration) {
            if (isRepeat) { startAudio(songIdx, 0); }
            else { nextTrack(); }
        } else { updateUI(); }
    }, 250);
}

function playIndex(songIdx, offset = 0) {
    currentIdx = songIdx;
    const song = SONGS[songIdx];
    playerTitle.textContent  = song.title;
    playerArtist.textContent = song.artist;
    playerArt.style.background = song.gradient;
    timeDuration.textContent = fmt(song.duration);
    heartBtn.classList.remove('liked');
    heartBtn.textContent = '♡';
    startAudio(songIdx, offset);
    highlightRows(songIdx);
}

function pausePlayer() {
    if (!isPlaying) return;
    pauseOffset = elapsed();
    stopAudio();
    isPlaying = false;
    btnPlay.textContent = '▶';
    updateUI();
    highlightRows(currentIdx, true);
}

function nextTrack() {
    if (!currentQueue.length) return;
    const pos  = currentQueue.indexOf(currentIdx);
    const next = isShuffle
        ? currentQueue[Math.floor(Math.random() * currentQueue.length)]
        : currentQueue[(pos + 1) % currentQueue.length];
    playIndex(next);
}

function prevTrack() {
    if (!currentQueue.length) return;
    if (elapsed() > 3) { playIndex(currentIdx, 0); return; }
    const pos  = currentQueue.indexOf(currentIdx);
    const prev = isShuffle
        ? currentQueue[Math.floor(Math.random() * currentQueue.length)]
        : currentQueue[(pos - 1 + currentQueue.length) % currentQueue.length];
    playIndex(prev);
}

/* ══════════════════════════════════════════
   PLAYER CONTROLS
══════════════════════════════════════════ */
btnPlay.addEventListener('click', () => {
    if (currentIdx < 0) return;
    isPlaying ? pausePlayer() : (() => { startAudio(currentIdx, pauseOffset); highlightRows(currentIdx); })();
});
btnShuffle.addEventListener('click', () => { isShuffle = !isShuffle; btnShuffle.classList.toggle('active', isShuffle); });
btnRepeat.addEventListener('click',  () => { isRepeat  = !isRepeat;  btnRepeat.classList.toggle('active', isRepeat); });
btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    if (gainNode) gainNode.gain.value = isMuted ? 0 : volume;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
    volumeFill.style.width = isMuted ? '0%' : (volume*100)+'%';
    volumeThumb.style.left = isMuted ? '0%' : (volume*100)+'%';
});
heartBtn.addEventListener('click', () => {
    heartBtn.classList.toggle('liked');
    heartBtn.textContent = heartBtn.classList.contains('liked') ? '♥' : '♡';
});
$('btnPrev').addEventListener('click', prevTrack);
$('btnNext').addEventListener('click', nextTrack);

/* ══════════════════════════════════════════
   DRAG SCRUB (mouse + touch)
══════════════════════════════════════════ */
function pctFromEvent(e, el) {
    const r = el.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (x - r.left) / r.width));
}
function draggable(el, cb) {
    let down = false;
    el.addEventListener('mousedown',  e => { down = true; cb(pctFromEvent(e,el)); });
    el.addEventListener('touchstart', e => { down = true; cb(pctFromEvent(e,el)); }, {passive:true});
    document.addEventListener('mousemove',  e => { if (down) cb(pctFromEvent(e,el)); });
    document.addEventListener('touchmove',  e => { if (down) cb(pctFromEvent(e,el)); }, {passive:true});
    document.addEventListener('mouseup',  () => { down = false; });
    document.addEventListener('touchend', () => { down = false; });
    el.addEventListener('click', e => cb(pctFromEvent(e,el)));
}
draggable(progressBar, pct => {
    if (currentIdx < 0) return;
    const off = pct * SONGS[currentIdx].duration;
    isPlaying ? startAudio(currentIdx, off) : (() => { pauseOffset = off; updateUI(); })();
});
draggable(volumeBar, pct => {
    volume = pct; isMuted = false;
    if (gainNode) gainNode.gain.value = volume;
    btnMute.textContent = '🔊';
    volumeFill.style.width = (volume*100)+'%';
    volumeThumb.style.left = (volume*100)+'%';
});

/* ══════════════════════════════════════════
   HIGHLIGHT ROWS (both song lists)
══════════════════════════════════════════ */
function highlightRows(idx, paused = false) {
    document.querySelectorAll('.song-row').forEach(r => r.classList.remove('playing','paused'));
    document.querySelectorAll(`.song-row[data-idx="${idx}"]`).forEach(r => {
        r.classList.add('playing');
        if (paused) r.classList.add('paused');
    });
}

/* ══════════════════════════════════════════
   BUILD SONG ROW HTML
══════════════════════════════════════════ */
function buildRow(song, songIdx, num) {
    const li = document.createElement('li');
    li.className = 'song-row';
    li.dataset.idx = songIdx;
    li.innerHTML = `
        <div class="col-num">
            <span class="song-num">
                <span class="song-num-text">${num}</span>
                <span class="eq-bars"><span></span><span></span><span></span></span>
            </span>
            <button class="row-play">▶</button>
        </div>
        <div class="song-info">
            <div class="song-thumb" style="background:${song.gradient}"></div>
            <div class="song-meta">
                <p class="song-title">${song.title}</p>
                <p class="song-artist">${song.artist}</p>
            </div>
        </div>
        <span class="song-genre hide-mobile">${song.genre}</span>
        <span class="song-dur">${fmt(song.duration)}</span>`;
    return li;
}

/* ══════════════════════════════════════════
   RENDER ALL SONGS LIST
══════════════════════════════════════════ */
const songListEl = $('songList');
$('songCount').textContent = `${SONGS.length} songs`;

SONGS.forEach((song, idx) => {
    const li = buildRow(song, idx, idx + 1);
    const doPlay = () => { currentQueue = SONGS.map((_,i)=>i); playIndex(idx); };
    li.addEventListener('click', doPlay);
    li.querySelector('.row-play').addEventListener('click', e => { e.stopPropagation(); doPlay(); });
    songListEl.appendChild(li);
});

/* ══════════════════════════════════════════
   PLAYLIST VIEW
══════════════════════════════════════════ */
const homeView        = $('homeView');
const playlistView    = $('playlistView');
const playlistHeroArt = $('playlistHeroArt');
const playlistTitle   = $('playlistTitle');
const playlistMeta    = $('playlistMeta');
const playlistSongList= $('playlistSongList');
const playAllBtn      = $('playAllBtn');
const backToHome      = $('backToHome');

let activePlaylistKey = null;

function openPlaylist(key) {
    const pl = PLAYLISTS[key];
    if (!pl) return;
    activePlaylistKey = key;

    // Update hero
    playlistHeroArt.style.background = pl.art;
    playlistTitle.textContent = pl.name;
    playlistMeta.textContent  = `${pl.indices.length} songs`;

    // Build song rows
    playlistSongList.innerHTML = '';
    pl.indices.forEach((songIdx, num) => {
        const song = SONGS[songIdx];
        const li   = buildRow(song, songIdx, num + 1);
        const doPlay = () => {
            currentQueue = [...pl.indices];
            playIndex(songIdx);
            closeSidebar();
        };
        li.addEventListener('click', doPlay);
        li.querySelector('.row-play').addEventListener('click', e => { e.stopPropagation(); doPlay(); });
        playlistSongList.appendChild(li);
    });

    // Play All
    playAllBtn.onclick = () => {
        currentQueue = [...pl.indices];
        playIndex(pl.indices[0]);
        closeSidebar();
    };

    // Switch views
    homeView.classList.add('hidden');
    playlistView.classList.remove('hidden');

    // Highlight active library item
    document.querySelectorAll('.library-item').forEach(li => {
        li.classList.toggle('active-playlist', li.dataset.playlist === key);
    });

    // Scroll to top
    $('mainContent').scrollTop = 0;
    closeSidebar();
}

backToHome.addEventListener('click', () => {
    playlistView.classList.add('hidden');
    homeView.classList.remove('hidden');
    document.querySelectorAll('.library-item').forEach(li => li.classList.remove('active-playlist'));
    $('mainContent').scrollTop = 0;
});

/* ══════════════════════════════════════════
   WIRE UP LIBRARY ITEMS
══════════════════════════════════════════ */
document.querySelectorAll('.library-item').forEach(item => {
    item.addEventListener('click', () => openPlaylist(item.dataset.playlist));
});

/* ══════════════════════════════════════════
   WIRE UP FEATURE CARDS & MUSIC CARDS
══════════════════════════════════════════ */
document.querySelectorAll('.feature-card, .music-card').forEach(card => {
    const key = card.dataset.playlist;
    const doOpen = () => { if (key) openPlaylist(key); };
    card.addEventListener('click', doOpen);
    const btn = card.querySelector('.play-overlay, .card-play-btn');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); doOpen(); });
});

/* ══════════════════════════════════════════
   SIDEBAR (mobile drawer)
══════════════════════════════════════════ */
const sidebar        = $('sidebar');
const sidebarOverlay = $('sidebarOverlay');
const hamburger      = $('hamburger');
const sidebarClose   = $('sidebarClose');

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
hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebar(); });

/* ══════════════════════════════════════════
   MOBILE BOTTOM NAV
══════════════════════════════════════════ */
document.querySelectorAll('.mob-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mob-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.nav === 'library') openSidebar();
        if (btn.dataset.nav === 'home') {
            homeView.classList.remove('hidden');
            playlistView.classList.add('hidden');
            document.querySelectorAll('.library-item').forEach(li => li.classList.remove('active-playlist'));
        }
    });
});

/* Desktop nav */
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        if (item.dataset.nav === 'home') {
            homeView.classList.remove('hidden');
            playlistView.classList.add('hidden');
            document.querySelectorAll('.library-item').forEach(li => li.classList.remove('active-playlist'));
        }
    });
});

/* ══════════════════════════════════════════
   GREETING
══════════════════════════════════════════ */
const h = new Date().getHours();
$('greeting').textContent = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

/* Default queue = all songs */
currentQueue = SONGS.map((_,i) => i);
