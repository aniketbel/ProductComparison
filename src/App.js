// src/App.jsx
import React, { useEffect, useRef, useState } from "react";

/* ---------------- Data ---------------- */
const CATEGORIES = {
  "Date Night": [
    ["Candlelit dinner at home", "Spontaneous midnight road trip"],
    ["Slow dancing in the living room", "Dancing at a lively rooftop bar"],
    ["A handwritten love letter", "A surprise day-of-adventures itinerary"],
    ["Movie marathon cuddled up", "Live concert under the stars"],
    ["Breakfast in bed", "Sunrise hike and picnic"],
  ],
  Compliments: [
    ['Call me poetic: "You are my sunrise"', 'Keep it playful: "You slay, Ace"'],
    ["Praise their laugh", "Praise their kindness"],
    ["Admire their style", "Admire their courage"],
    ["Tell them they glow", "Tell them they make you better"],
    ["Say they're irresistible", "Say they're inspiring"],
  ],
  "Love Language": [
    ["Surprise gifts", "Meaningful quality time"],
    ["Affectionate touch", "Acts of service"],
    ["Verbal praise", "Shared adventures"],
    ["Handwritten notes", "Comforting presence"],
    ["Small thoughtful gestures", "Long, undistracted conversations"],
  ],
  Getaway: [
    ["Secluded mountain cabin", "Charming beach bungalow"],
    ["Historic European city wander", "Tropical island escape"],
    ["Forest glamping under stars", "Boutique city hotel with skyline view"],
    ["Countryside vineyard weekend", "Cozy ski chalet retreat"],
    ["Road-trip to sleepy coastal towns", "Flight to a neon-lit city"],
  ],
  "Cozy Foods": [
    ["Hot chocolate & marshmallows", "Spiced chai & pastries"],
    ["Homemade chocolate cake", "Sushi and candlelight"],
    ["Warm apple pie with cream", "Charcuterie & wine pairing"],
    ["Steam dumplings with soy dip", "Comforting bowl of ramen"],
    ["Charred marshmallows by a bonfire", "Fondue for two"],
  ],
};

const RESPONSE_SNIPPETS = {
  "Date Night": {
    left: "Soft, intimate — the slow, memorable kind of night.",
    right: "Adventurous and electric — love with a spark.",
  },
  Compliments: {
    left: "Romantic and lyrical — swoon-worthy lines.",
    right: "Bold and playful — cheeky charm.",
  },
  "Love Language": {
    left: "A thoughtful heart who delights in surprises.",
    right: "Present and connected — time is your gift.",
  },
  Getaway: {
    left: "Cozy, introspective — you find beauty in hush and warmth.",
    right: "Sun, sand, and story-filled days — you chase color and light.",
  },
  "Cozy Foods": {
    left: "Warmth-first — comfort is your love language.",
    right: "Savor the flavor — you celebrate moments with food.",
  },
};

function pickPair(categoryPairs, roundIndex) {
  return categoryPairs[roundIndex % categoryPairs.length];
}

/* ---------------- Helpers ---------------- */
function slugify(text) {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/["'“”‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------------- Flowers component (inline SVGs) ---------------- */
function Flowers({ className = "" }) {
  return (
    <div className={`flowers-wrapper ${className}`} aria-hidden="true">
      <svg className="flower flower-lily" viewBox="0 0 64 64" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="36" rx="10" ry="14" fill="#fffefa" stroke="#f0e8e2" strokeWidth="1" />
        <path d="M32 10 C28 18, 20 18, 18 30 C26 34, 32 32, 32 32 C32 32, 38 34, 46 30 C44 18, 36 18, 32 10 Z" fill="#f9f3ee" />
        <circle cx="32" cy="32" r="3" fill="#ffd7d7" />
      </svg>

      <svg className="flower flower-orchid" viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="12" fill="#ffeef9" />
        <path d="M32 8 C24 14, 14 14, 12 28 C22 34, 32 28, 32 28 C32 28, 42 34, 52 28 C50 14, 40 14, 32 8 Z" fill="#ffd7f0" />
        <circle cx="32" cy="32" r="3" fill="#ff8fb1" />
      </svg>

      <svg className="flower flower-rose-white" viewBox="0 0 64 64" width="62" height="62" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="30" r="14" fill="#fffdf9" />
        <path d="M32 18 C30 22, 26 24, 24 28 C28 30, 32 30, 32 30 C32 30, 36 30, 40 28 C38 24, 34 22, 32 18 Z" fill="#fff6f6" />
        <path d="M20 44 L44 44 L36 56 L28 56 Z" fill="#cde9c8" />
      </svg>

      <svg className="flower flower-rose-red" viewBox="0 0 64 64" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="28" r="12" fill="#ff4455" />
        <path d="M32 18 C29 22, 24 24, 22 28 C28 30, 32 30, 32 30 C32 30, 38 30, 42 28 C40 24, 36 22, 32 18 Z" fill="#ff6b7a" />
        <rect x="28" y="40" width="8" height="16" rx="3" fill="#2f8f4b" />
      </svg>
    </div>
  );
}

/* ---------------- ImageTile (slide + pulse + hearts) ---------------- */
function ImageTile({ text, onClick, side }) {
  const [imgError, setImgError] = useState(false);
  const [anim, setAnim] = useState(false);
  const [animSide, setAnimSide] = useState(null); // 'left' | 'right'
  const slug = slugify(text);
  const srcJpg = `/images/thisorthat/${slug}.jpg`;
  const srcPng = `/images/thisorthat/${slug}.png`;
  const [src, setSrc] = useState(srcJpg);

  useEffect(() => {
    setImgError(false);
    setSrc(srcJpg);
  }, [text]);

  function handleError() {
    if (src === srcJpg) {
      setSrc(srcPng);
      setImgError(false);
    } else {
      setImgError(true);
    }
  }

  function handleClick() {
    setAnim(true);
    setAnimSide(side);
    onClick?.();
    setTimeout(() => {
      setAnim(false);
      setAnimSide(null);
    }, 520);
  }

  const classes = ["this-or-that-card"];
  if (anim) classes.push("picked");
  if (animSide === "left") classes.push("slide-left");
  if (animSide === "right") classes.push("slide-right");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={classes.join(" ")}
      style={{ cursor: "pointer" }}
      aria-label={text}
    >
      <div className="tile-hearts" aria-hidden="true">
        <span className="heart-sm">❤️</span>
        <span className="heart-sm">💖</span>
        <span className="heart-sm">❣️</span>
      </div>

      {!imgError ? (
        <img className="this-or-that-img" src={src} alt={text} onError={handleError} draggable="false" />
      ) : (
        <div className="this-or-that-fallback">
          <div className="this-or-that-fallback-text">{text}</div>
        </div>
      )}
      <div className="this-or-that-caption">
        {text} <span className="caption-heart"> ❤️</span>
      </div>
    </div>
  );
}

/* ---------------- Modal components ---------------- */
function FullscreenImageModal({ src, alt = "photo", open, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <button
        aria-label="Close photo"
        onClick={onClose}
        style={{
          position: "absolute",
          right: 18,
          top: 18,
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 28,
          cursor: "pointer",
        }}
      >
        ×
      </button>

      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: "94%",
          maxHeight: "94%",
          objectFit: "contain",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}

function TextModal({ text, open, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ position: "relative", background: "white", padding: 28, borderRadius: 14, maxWidth: 720, width: "90%", textAlign: "center" }}>
        <button
          aria-label="Close"
          onClick={onClose}
          style={{ position: "absolute", right: 12, top: 12, background: "transparent", border: "none", fontSize: 22, cursor: "pointer" }}
        >
          ×
        </button>

        <h2 style={{ margin: 0, fontSize: 48, lineHeight: 1 }}>{text}</h2>
        <p style={{ marginTop: 10, color: "#555" }}></p>
      </div>
    </div>
  );
}

/* ---------------- Main App ---------------- */
export default function App() {
  // theme
  const [theme, setTheme] = useState("light");

  // dialog overlay
  const [showDialog, setShowDialog] = useState(true);
  const [dialogOpening, setDialogOpening] = useState(false);

  // confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // music
  const [musicOn, setMusicOn] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const iframeRef = useRef(null);

  // this-or-that
  const [category, setCategory] = useState(Object.keys(CATEGORIES)[0]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [roundsToPlay] = useState(5);
  const [history, setHistory] = useState([]);
  const [lastChoiceSnippet, setLastChoiceSnippet] = useState(null);

  // confetti canvas
  const canvasRef = useRef(null);

  // modals
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLoveModal, setShowLoveModal] = useState(false);

  const UNO_LINK = "https://buddyboardgames.com/uno";
  const MUSIC_VIDEO_ID = "SqEcZrfcfoo";
  const PHOTO_URL = "https://cdn.mos.cms.futurecdn.net/jnpeQRvSGXZdUwYVEk7DXE-970-80.jpg.webp";

  // load theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ace_theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        applyTheme(saved);
      } else {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setTheme(initial);
        applyTheme(initial);
      }
    } catch (e) {
      setTheme("light");
      applyTheme("light");
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ace_theme", theme);
    } catch (e) {}
    applyTheme(theme);
  }, [theme]);
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
  }

  useEffect(() => {
    if (showConfetti) startConfetti(canvasRef.current);
  }, [showConfetti]);

  // sounds
  function playPopSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const decay = 1 - i / bufferSize;
        data[i] = (Math.random() * 2 - 1) * 0.7 * Math.pow(decay, 2.2);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1200;
      band.Q.value = 0.8;

      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 600;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.003);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

      noise.connect(band);
      band.connect(hp);
      hp.connect(g);
      g.connect(ctx.destination);

      osc.connect(oscGain);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 6000;
      oscGain.connect(lp);
      lp.connect(ctx.destination);

      noise.start();
      osc.start();

      setTimeout(() => {
        try {
          noise.stop();
        } catch (e) {}
      }, 140);
      setTimeout(() => {
        try {
          osc.stop();
        } catch (e) {}
      }, 80);
      setTimeout(() => {
        try {
          ctx.close();
        } catch (e) {}
      }, 900);
    } catch (e) {}
  }

  // romantic confetti (simplified)
  function playRomanticConfetti() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const freqs = [440, 660, 880];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.setValueAtTime(f, now + i * 0.06);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.12, now + 0.02 + i * 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9 + i * 0.04);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 4200 - i * 600;
        o.connect(g);
        g.connect(lp);
        lp.connect(ctx.destination);
        o.start(now + i * 0.06);
        o.stop(now + 0.9 + i * 0.04);
      });
      setTimeout(() => {
        try {
          ctx.close();
        } catch (e) {}
      }, 1200);
    } catch (e) {}
  }

  function handleOpenPresent() {
    if (dialogOpening || !showDialog) return;
    setDialogOpening(true);

    playPopSound();

    setTimeout(() => {
      playRomanticConfetti();
      setShowConfetti(true);
    }, 80);

    setTimeout(() => {
      setShowConfetti(false);
      setDialogOpening(false);
      setShowDialog(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
  }

  // This-or-That helpers
  function startGameFor(cat) {
    setCategory(cat);
    setRoundIndex(0);
    setHistory([]);
    setLastChoiceSnippet(null);
  }

  function makeChoice(whichSide) {
    const pairs = CATEGORIES[category];
    const pair = pickPair(pairs, roundIndex);
    const choice = whichSide === "left" ? pair[0] : pair[1];
    const snippet = (RESPONSE_SNIPPETS[category] && RESPONSE_SNIPPETS[category][whichSide]) || "Lovely choice!";
    setHistory((h) => [...h, { round: roundIndex + 1, choice, whichSide }]);
    setLastChoiceSnippet(snippet);
    if (roundIndex + 1 >= roundsToPlay) setTimeout(() => setRoundIndex(roundIndex + 1), 300);
    else setTimeout(() => setRoundIndex(roundIndex + 1), 750);
  }

  function resetThisOrThat() {
    setRoundIndex(0);
    setHistory([]);
    setLastChoiceSnippet(null);
  }

  // celebration actions
  function actionPopBalloon() {
    playPopSound();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 900);
  }
  function actionConfetti() {
    playRomanticConfetti();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1400);
  }
  function actionTinyConfetti() {
    playRomanticConfetti();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 900);
  }
  function actionCelebrate() {
    playRomanticConfetti();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1400);
  }

  // iframe control
  function postPlayerCommand(command, args = []) {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args }), "*");
    } catch (e) {}
  }

  function handleToggleMusic() {
    setMusicOn((m) => {
      const next = !m;
      if (!next) postPlayerCommand("pauseVideo", []);
      else {
        postPlayerCommand("playVideo", []);
        if (!musicMuted) postPlayerCommand("unMute", []);
      }
      return next;
    });
  }

  function handleUnmuteToggle() {
    if (musicMuted) {
      postPlayerCommand("unMute", []);
      setMusicMuted(false);
    } else {
      postPlayerCommand("mute", []);
      setMusicMuted(true);
    }
  }

  // confetti visual
  function startConfetti(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const particles = [];
    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * -40,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 6 + 2,
        r: Math.random() * 6 + 2,
        color: `hsl(${Math.random() * 360},80%,60%)`,
        life: 100 + Math.random() * 60,
      });
    }
    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      frame++;
      if (frame < 300) requestAnimationFrame(render);
      else ctx.clearRect(0, 0, W, H);
    }
    render();
  }

  function summaryMessage() {
    if (history.length === 0) return "No choices yet — pick a side to begin!";
    const leftCount = history.filter((h) => h.whichSide === "left").length;
    const rightCount = history.filter((h) => h.whichSide === "right").length;
    if (leftCount > rightCount) return "Your heart leans soft and intimate — gentle, thoughtful, and deeply affectionate.";
    if (rightCount > leftCount) return "You love sparkle and adventure — bold, bright, and unforgettable.";
    return "Balanced and open — you cherish both quiet warmth and spontaneous fun.";
  }

  const pairs = CATEGORIES[category];
  const currentPair = pickPair(pairs, roundIndex);

  return (
    <div className={`page ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* Image modal */}
      <FullscreenImageModal src={PHOTO_URL} open={showImageModal} onClose={() => setShowImageModal(false)} />

      {/* Heart text modal (shows single heart) */}
      <TextModal text={"❤️"} open={showLoveModal} onClose={() => setShowLoveModal(false)} />

      {/* Dialog overlay */}
      {showDialog && (
        <div className={`dialog-overlay ${dialogOpening ? "opening" : ""}`} role="dialog" aria-modal="true" aria-label="Birthday dialog">
          <div className="dialog-card" role="document">
            <div className="dialog-title">Happy Birthday My Love</div>
            <div className="dialog-sub">Wishing you a day full of love and sparkle ✨</div>
            <div className="dialog-actions">
              <button className="btn primary dialog-btn" onClick={handleOpenPresent} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpenPresent(); }}>
                Open your present
              </button>
            </div>
          </div>

          {showConfetti && <canvas ref={canvasRef} className="confetti-canvas" />}
        </div>
      )}

      {/* Header */}
      <header className="header" aria-hidden={showDialog}>
        <div>
          <h1 className="title">Happy 24th Birthday, My Beautiful Ace 🎉</h1>
          <p className="subtitle">Play, choose, and celebrate the love 💖</p>

          <Flowers className="header-flowers" />
        </div>

        <div className="header-actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Day / Night toggle */}
          <button className="btn" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} aria-label="Toggle theme">
            {theme === "dark" ? "🌞 Day" : "🌙 Night"}
          </button>

          {/* Scorpio icon button (SVG glyph) */}
          <button className="btn" onClick={() => setShowImageModal(true)} aria-label="Show photo full screen" title="Show Photo">
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: "inline-block", verticalAlign: "middle" }}>
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fill="currentColor" style={{ fontFamily: "serif" }}>♏</text>
            </svg>
          </button>

          {/* Heart button (SVG) */}
          <button className="btn" onClick={() => setShowLoveModal(true)} aria-label="Show I love you message" title="I Love You">
              <span>❤️</span>
          </button>

          {/* Music controls */}
          <button className="btn" onClick={() => { setMusicOn((m) => { const next = !m; if (!next) postPlayerCommand("pauseVideo", []); else postPlayerCommand("playVideo", []); return next; }); }} aria-label="Toggle music">
            {musicOn ? "Hide Music" : "Play Music"}
          </button>

          {musicOn && (
            <button className="btn" onClick={handleUnmuteToggle} aria-label={musicMuted ? "Unmute" : "Mute"}>
              {musicMuted ? "Unmute" : "Mute"}
            </button>
          )}

          <button className="btn primary" onClick={() => actionCelebrate()}>
            Celebrate
          </button>
        </div>
      </header>

      {/* Music embed */}
      {musicOn && (
        <div className="music-embed" style={{ display: "flex", justifyContent: "center", padding: 12 }}>
          <iframe
            ref={iframeRef}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${MUSIC_VIDEO_ID}?enablejsapi=1&autoplay=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}

      <main className="container" aria-hidden={showDialog}>
        {/* Left: Hero + This-or-That */}
        <section className="left big-card">
          <div className="hero">
            <div className="hero-left">
              <h2>For Ace — 24 years of sparkle ✨</h2>
              <p className="muted">Try the romantic "This or That" — choose what makes your heart flutter.</p>

              <div className="controls" style={{ marginTop: 12 }}>
                <button className="btn primary" onClick={() => actionPopBalloon()}>
                  Pop a Balloon 🎈
                </button>
                <button className="btn" onClick={() => actionConfetti()}>
                  Confetti
                </button>
                <button className="btn" onClick={() => { resetThisOrThat(); startGameFor(Object.keys(CATEGORIES)[0]); }}>
                  Restart This or That
                </button>
              </div>
            </div>

            <div className="hero-right">
              <div className="balloon-container">
                <svg className="balloon-bg" viewBox="0 0 200 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0" stopColor="#ff9a9e" />
                      <stop offset="1" stopColor="#fad0c4" />
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="50" r="18" fill="url(#g1)" opacity="0.95" />
                  <circle cx="120" cy="80" r="22" fill="#a18cd1" opacity="0.95" />
                  <circle cx="70" cy="120" r="16" fill="#fbc2eb" opacity="0.95" />
                </svg>
                <button className="btn pop-btn" onClick={() => actionPopBalloon()}>
                  Pop 🎈
                </button>
              </div>
            </div>
          </div>

          {/* This or That */}
          <div style={{ marginTop: 18 }}>
            <h3>This or That — {category}</h3>

            <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ minWidth: 220, flex: "0 0 260px" }}>
                <div style={{ marginBottom: 8, color: "var(--muted)", fontSize: 13 }}>Pick a category</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.keys(CATEGORIES).map((cat) => (
                    <button key={cat} className="btn" onClick={() => startGameFor(cat)} style={{ padding: "8px 10px", background: cat === category ? "var(--accent)" : "transparent", color: cat === category ? "#fff" : "inherit" }}>
                      {cat}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 10, color: "var(--muted)" }}>
                  Round {Math.min(roundIndex + 1, roundsToPlay)} of {roundsToPlay}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                {roundIndex < roundsToPlay ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <ImageTile text={currentPair[0]} onClick={() => makeChoice("left")} side="left" />
                      <ImageTile text={currentPair[1]} onClick={() => makeChoice("right")} side="right" />
                    </div>
                    {lastChoiceSnippet && <div style={{ marginTop: 10, color: "var(--muted)" }}>{lastChoiceSnippet}</div>}
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Game complete — lovely choices ❤️</div>
                    <div style={{ marginTop: 8 }}>{summaryMessage()}</div>
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <button className="btn" onClick={resetThisOrThat}>Play again (same category)</button>
                      <button className="btn" onClick={() => startGameFor(Object.keys(CATEGORIES)[Math.floor(Math.random() * Object.keys(CATEGORIES).length)])}>Play another category</button>
                      <button className="btn primary" onClick={() => actionCelebrate()}>Celebrate</button>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ color: "var(--muted)", marginBottom: 6 }}>Your picks</div>
                      <ul style={{ paddingLeft: 18 }}>
                        {history.map((h, i) => (<li key={i}>{h.round}. {h.choice}</li>))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right column */}
        <aside className="right small-card">
          <div style={{ marginTop: 8 }}>
            <h3>Play UNO</h3>
            <p className="muted">Want a multiplayer break? Play UNO — quick and fun.</p>
            <div style={{ marginTop: 8 }}>
              <a href={UNO_LINK} target="_blank" rel="noopener noreferrer" className="btn primary" style={{ display: "inline-block" }}>Play UNO (online)</a>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <h3>Quick Celebrations</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => actionTinyConfetti()}>Tiny Confetti</button>
            </div>
          </div>

          <div className="footer-note" style={{ marginTop: 18 }}>Made with Lots of ❤️ for Ace, My Love</div>
        </aside>
      </main>

      {showConfetti && !showDialog && <canvas ref={canvasRef} className="confetti-canvas" />}

      <footer className="page-footer">Tip: open on mobile to use touch interactions and play on the go!</footer>
    </div>
  );
}
