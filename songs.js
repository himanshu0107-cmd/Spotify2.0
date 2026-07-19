const SONGS = [
    // ── Bollywood / Hindi ──────────────────────────────────────────────────
    { id: 1,  title: "Kesariya",               artist: "Arijit Singh",        duration: 268, genre: "Bollywood",  gradient: "linear-gradient(135deg,#f7971e,#ffd200)", cover: "covers/kesariya.jpg",      src: "songs/track01.m4a" },
    { id: 2,  title: "Tum Hi Ho",              artist: "Arijit Singh",        duration: 261, genre: "Bollywood",  gradient: "linear-gradient(135deg,#e96c5a,#f7c59f)", cover: "covers/tumhiho.jpg",       src: "songs/track02.m4a" },
    { id: 3,  title: "Raataan Lambiyan",       artist: "Jubin Nautiyal",      duration: 237, genre: "Bollywood",  gradient: "linear-gradient(135deg,#1a1a2e,#4a90d9)", cover: "covers/raataan.jpg",       src: "songs/track03.m4a" },
    { id: 4,  title: "Tera Ban Jaunga",        artist: "Akhil Sachdeva",      duration: 222, genre: "Bollywood",  gradient: "linear-gradient(135deg,#4b0082,#7b2ff7)", cover: "covers/terabanjaunga.jpg", src: "songs/track04.m4a" },
    { id: 5,  title: "Apna Bana Le",           artist: "Arijit Singh",        duration: 248, genre: "Bollywood",  gradient: "linear-gradient(135deg,#ff5f6d,#ffc371)", cover: "covers/apnabana.jpg",      src: "songs/track05.m4a" },
    { id: 6,  title: "Chaleya",                artist: "Arijit Singh",        duration: 255, genre: "Bollywood",  gradient: "linear-gradient(135deg,#f953c6,#b91d73)", cover: "covers/chaleya.jpg",       src: "songs/track06.m4a" },
    { id: 7,  title: "Ik Vaari Aa",            artist: "Arijit Singh",        duration: 271, genre: "Bollywood",  gradient: "linear-gradient(135deg,#11998e,#38ef7d)", cover: "covers/ikvaari.jpg",       src: "songs/track07.m4a" },
    { id: 8,  title: "Hawayein",               artist: "Arijit Singh",        duration: 285, genre: "Bollywood",  gradient: "linear-gradient(135deg,#56ccf2,#2f80ed)", cover: "covers/hawayein.jpg",      src: "songs/track08.m4a" },
    { id: 9,  title: "Dil Diyan Gallan",       artist: "Atif Aslam",          duration: 258, genre: "Bollywood",  gradient: "linear-gradient(135deg,#ee0979,#ff6a00)", cover: "covers/dildiyan.jpg",      src: "songs/track09.m4a" },
    { id: 10, title: "Tere Bina",              artist: "Atif Aslam",          duration: 244, genre: "Bollywood",  gradient: "linear-gradient(135deg,#bdc3c7,#2c3e50)", cover: "covers/terebina.jpg",      src: "songs/track10.m4a" },

    // ── Punjabi / Bhangra ──────────────────────────────────────────────────
    { id: 11, title: "Excuses",                artist: "AP Dhillon",          duration: 196, genre: "Punjabi",    gradient: "linear-gradient(135deg,#8e2de2,#4a00e0)", cover: "covers/excuses.jpg",       src: "songs/track11.m4a" },
    { id: 12, title: "Brown Munde",            artist: "AP Dhillon",          duration: 213, genre: "Punjabi",    gradient: "linear-gradient(135deg,#f7971e,#ffd200)", cover: "covers/brownmunde.jpg",    src: "songs/track12.m4a" },
    { id: 13, title: "Lover",                  artist: "Diljit Dosanjh",      duration: 231, genre: "Punjabi",    gradient: "linear-gradient(135deg,#00b4db,#0083b0)", cover: "covers/lover.jpg",         src: "songs/track13.m4a" },
    { id: 14, title: "G.O.A.T.",               artist: "Diljit Dosanjh",      duration: 218, genre: "Punjabi",    gradient: "linear-gradient(135deg,#1e3c72,#2a5298)", cover: "covers/goat.jpg",          src: "songs/track14.m4a" },
    { id: 15, title: "Softly",                 artist: "Karan Aujla",         duration: 204, genre: "Punjabi",    gradient: "linear-gradient(135deg,#ff416c,#ff4b2b)", cover: "covers/softly.jpg",        src: "songs/track15.m4a" },
    { id: 16, title: "Taare Ginn",             artist: "Karan Aujla",         duration: 227, genre: "Punjabi",    gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)", cover: "covers/taareginn.jpg",     src: "songs/track16.m4a" },
    { id: 17, title: "Pasoori",                artist: "Ali Sethi",           duration: 252, genre: "Punjabi",    gradient: "linear-gradient(135deg,#c471ed,#f64f59)", cover: "covers/pasoori.jpg",       src: "songs/track17.m4a" },
    { id: 18, title: "Naina",                  artist: "Arijit Singh",        duration: 239, genre: "Punjabi",    gradient: "linear-gradient(135deg,#0f2027,#2c5364)", cover: "covers/naina.jpg",         src: "songs/track18.m4a" },

    // ── Indie / Chill Hindi ────────────────────────────────────────────────
    { id: 19, title: "Aaoge Tum Kabhi",        artist: "Stebin Ben",          duration: 233, genre: "Indie",      gradient: "linear-gradient(135deg,#f6d365,#fda085)", cover: "covers/aaoge.jpg",         src: "songs/track19.m4a" },
    { id: 20, title: "Teri Baaton Mein",       artist: "Stebin Ben",          duration: 219, genre: "Indie",      gradient: "linear-gradient(135deg,#00b894,#55efc4)", cover: "covers/teribaaton.jpg",    src: "songs/track20.m4a" },
    { id: 21, title: "Kho Gaye Hum Kahan",     artist: "Jasleen Royal",       duration: 246, genre: "Indie",      gradient: "linear-gradient(135deg,#4e54c8,#8f94fb)", cover: "covers/khogaye.jpg",       src: "songs/track21.m4a" },
    { id: 22, title: "Doobey",                 artist: "Lothika",             duration: 228, genre: "Indie",      gradient: "linear-gradient(135deg,#373b44,#4286f4)", cover: "covers/doobey.jpg",        src: "songs/track22.m4a" },
    { id: 23, title: "Ranjha",                 artist: "B Praak",             duration: 241, genre: "Indie",      gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)", cover: "covers/ranjha.jpg",        src: "songs/track23.m4a" },

    // ── Party / Dance ──────────────────────────────────────────────────────
    { id: 24, title: "Besharam Rang",          artist: "Vishal-Shekhar",      duration: 188, genre: "Dance",      gradient: "linear-gradient(135deg,#e52d27,#b31217)", cover: "covers/besharamrang.jpg",  src: "songs/track24.m4a" },
    { id: 25, title: "Naatu Naatu",            artist: "Rahul Sipligunj",     duration: 216, genre: "Dance",      gradient: "linear-gradient(135deg,#f9d423,#ff4e50)", cover: "covers/naatunaatu.jpg",    src: "songs/track25.m4a" },
    { id: 26, title: "Jhoome Jo Pathaan",      artist: "Arijit Singh",        duration: 203, genre: "Dance",      gradient: "linear-gradient(135deg,#1a1a2e,#4a90d9)", cover: "covers/jhoome.jpg",        src: "songs/track26.m4a" },
    { id: 27, title: "Zinda Banda",            artist: "Vishal Dadlani",      duration: 197, genre: "Dance",      gradient: "linear-gradient(135deg,#8e2de2,#f000ff)", cover: "covers/zindabanda.jpg",    src: "songs/track27.m4a" },
    { id: 28, title: "Srivalli",               artist: "Sid Sriram",          duration: 224, genre: "Dance",      gradient: "linear-gradient(135deg,#11998e,#38ef7d)", cover: "covers/srivalli.jpg",      src: "songs/track28.m4a" },

    // ── Devotional / Spiritual ─────────────────────────────────────────────
    { id: 29, title: "Jai Ho",                 artist: "A.R. Rahman",         duration: 319, genre: "Devotional", gradient: "linear-gradient(135deg,#f7971e,#ffd200)", cover: "covers/jaiho.jpg",         src: "songs/track29.m4a" },
    { id: 30, title: "Maa",                    artist: "Shankar Mahadevan",   duration: 278, genre: "Devotional", gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)", cover: "covers/maa.jpg",           src: "songs/track30.m4a" },

    // ── 90s Retro Bollywood ────────────────────────────────────────────────
    { id: 31, title: "Chaiyya Chaiyya",        artist: "Sukhwinder Singh",    duration: 298, genre: "Retro",      gradient: "linear-gradient(135deg,#e96c5a,#f7c59f)", cover: "covers/chaiyya.jpg",       src: "songs/track31.m4a" },
    { id: 32, title: "Kuch Kuch Hota Hai",     artist: "Udit Narayan",        duration: 312, genre: "Retro",      gradient: "linear-gradient(135deg,#4b0082,#7b2ff7)", cover: "covers/kuchkuch.jpg",      src: "songs/track32.m4a" },
    { id: 33, title: "Tujhe Dekha Toh",        artist: "Kumar Sanu",          duration: 289, genre: "Retro",      gradient: "linear-gradient(135deg,#bdc3c7,#2c3e50)", cover: "covers/tujhedekha.jpg",    src: "songs/track33.m4a" },
    { id: 34, title: "Kal Ho Naa Ho",          artist: "Sonu Nigam",          duration: 305, genre: "Retro",      gradient: "linear-gradient(135deg,#56ccf2,#2f80ed)", cover: "covers/kalhona.jpg",       src: "songs/track34.m4a" },

    // ── South Indian Hits ──────────────────────────────────────────────────
    { id: 35, title: "Kannazhaga",             artist: "A.R. Rahman",         duration: 267, genre: "Tamil",      gradient: "linear-gradient(135deg,#00b4db,#0083b0)", cover: "covers/kannazhaga.jpg",    src: "songs/track35.m4a" },
    { id: 36, title: "Rowdy Baby",             artist: "Dhanush",             duration: 234, genre: "Tamil",      gradient: "linear-gradient(135deg,#f953c6,#b91d73)", cover: "covers/rowdybaby.jpg",     src: "songs/track36.m4a" },
    { id: 37, title: "Buttabomma",             artist: "Armaan Malik",        duration: 221, genre: "Telugu",     gradient: "linear-gradient(135deg,#ff416c,#ff4b2b)", cover: "covers/buttabomma.jpg",    src: "songs/track37.m4a" },
    { id: 38, title: "Saami Saami",            artist: "Mounika Yadav",       duration: 209, genre: "Telugu",     gradient: "linear-gradient(135deg,#1e3c72,#2a5298)", cover: "covers/saamisaami.jpg",    src: "songs/track38.m4a" },

    // ── Lofi / Study ───────────────────────────────────────────────────────
    { id: 39, title: "Tere Jaisa Yaar Kahan",  artist: "Kishore Kumar",       duration: 256, genre: "Lofi",       gradient: "linear-gradient(135deg,#a8c0ff,#3f2b96)", cover: "covers/terejaisa.jpg",     src: "songs/track39.m4a" },
    { id: 40, title: "Lag Ja Gale",            artist: "Lata Mangeshkar",     duration: 274, genre: "Lofi",       gradient: "linear-gradient(135deg,#0f0c29,#302b63)", cover: "covers/lagjagale.jpg",     src: "songs/track40.m4a" },
];
