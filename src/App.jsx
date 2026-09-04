import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const navItems = [["about", "About"], ["sundays", "Sundays"], ["connect", "Connect"], ["sermons", "Sermons"], ["give", "Give"]];
const services = [
  { id: "es", label: "Español", time: "9:45 AM" },
  { id: "en", label: "English", time: "11:45 AM" },
];
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

function upcomingSunday() {
  const date = new Date();
  const day = date.getDay();
  const add = day === 0 ? 0 : 7 - day;
  date.setDate(date.getDate() + add);
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date).toUpperCase();
}

function Mark() {
  return <a className="mark-link" href="#top" aria-label="Fordham Community Church home">
    <img className="mark" src={asset("fcc-mark.png")} alt="Fordham Community Church" />
  </a>;
}

function Header({ active, progress, onVisit }) {
  return <header className="site-header" aria-label="Main navigation">
    <Mark />
    <nav className="nav-rail" aria-label="Primary">
      {navItems.map(([id, label]) => <a key={id} className={active === id ? "active" : ""} href={`#${id}`}>{label}</a>)}
    </nav>
    <button className="header-visit" onClick={onVisit}>VISIT <span aria-hidden="true">↗</span></button>
    <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
  </header>;
}

function VisitPanel({ open, onClose }) {
  const [service, setService] = useState(services[1].id);
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const sunday = useMemo(upcomingSunday, []);

  useEffect(() => {
    if (!open) return undefined;
    setSubmitted(false);
    document.body.classList.add("panel-open");
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = [...panelRef.current?.querySelectorAll("button, a, input, [tabindex]:not([tabindex='-1'])") || []]
        .filter((node) => !node.disabled && node.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.classList.remove("panel-open");
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const chosen = services.find((item) => item.id === service) || services[1];

  return <div className={`visit-shell ${open ? "open" : ""}`} aria-hidden={!open}>
    <button className="visit-backdrop" onClick={onClose} aria-label="Close visit planner" tabIndex={open ? 0 : -1} />
    <aside ref={panelRef} className="visit-panel" role="dialog" aria-modal="true" aria-labelledby="visit-title">
      <div className="panel-topline">
        <span>// PLAN A SUNDAY</span>
        <button ref={closeRef} className="text-button" onClick={onClose}>CLOSE</button>
      </div>

      <div className="panel-date"><span>NEXT GATHERING</span><strong>{sunday}</strong></div>

      <h2 id="visit-title">Come as<br />you are.</h2>
      <p className="panel-intro">Pick a gathering and tell us your name. We’ll make your first few minutes feel a little less unfamiliar.</p>

      {!submitted ? <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
        <fieldset>
          <legend>01 / Choose a gathering</legend>
          <div className="service-grid">
            {services.map((option) => <label className="service-choice" key={option.id}>
              <input type="radio" name="service" value={option.id} checked={service === option.id} onChange={() => setService(option.id)} />
              <span><small>{option.label}</small><strong>{option.time}</strong><i aria-hidden="true">↗</i></span>
            </label>)}
          </div>
        </fieldset>
        <label className="field-label" htmlFor="visit-name">02 / Your name</label>
        <input id="visit-name" className="line-input" name="name" placeholder="HOW SHOULD WE GREET YOU?" autoComplete="name" required />
        <button className="ink-button wide button-arrow" type="submit"><span>PLAN MY SUNDAY</span><span aria-hidden="true">↗</span></button>
      </form> : <div className="success-note" role="status">
        <p className="eyebrow">YOU’RE ALL SET</p>
        <h3>See you Sunday.</h3>
        <p>{chosen.label} · {chosen.time}<br />2439 Creston Avenue, Bronx</p>
        <p className="success-small">No special dress code. No need to arrive knowing what to do. Just come.</p>
      </div>}

      <div className="panel-foot">
        <a className="directions-link" href="https://www.google.com/maps/dir/?api=1&destination=2439+Creston+Avenue+Bronx+NY+10468" target="_blank" rel="noreferrer">GET DIRECTIONS <span aria-hidden="true">↗</span></a>
        <span>FORDHAM · THE BRONX</span>
      </div>
    </aside>
  </div>;
}

function StoryStrip() {
  const stripRef = useRef(null);
  const [index, setIndex] = useState(0);
  const stories = [
    ["fcc-worship.webp", "Musicians leading worship at Fordham Community Church", "WORSHIP", "We sing because Jesus is worthy."],
    ["membership-art.jpg", "Membership classes flower artwork", "GROWTH", "We become a people shaped by God’s Word."],
    ["flower-ink.jpg", "Hand-drawn flowers from an FCC class announcement", "FAMILY", "We belong to one another, not just a room."],
  ];

  const measure = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll(".story-card")];
    let closest = 0;
    let distance = Infinity;
    cards.forEach((card, cardIndex) => {
      const delta = Math.abs(card.offsetLeft - el.scrollLeft);
      if (delta < distance) {
        closest = cardIndex;
        distance = delta;
      }
    });
    setIndex(closest);
  }, []);

  const move = (direction) => {
    const next = Math.max(0, Math.min(stories.length - 1, index + direction));
    const card = stripRef.current?.querySelectorAll(".story-card")[next];
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return <div className="story-wrap">
    <div className="story-strip" ref={stripRef} onScroll={measure} aria-label="Life at FCC photo gallery">
      {stories.map(([image, alt, title, copy], storyIndex) => <figure className="story-card" key={title}>
        <div className="story-image-wrap">
          <img src={asset(image)} alt={alt} />
          <span className="story-number">0{storyIndex + 1}</span>
        </div>
        <figcaption><strong>{title}</strong><span>{copy}</span></figcaption>
      </figure>)}
    </div>
    <div className="story-meta">
      <div className="story-progress" aria-hidden="true"><span style={{ transform: `scaleX(${(index + 1) / stories.length})` }} /></div>
      <span className="story-count">0{index + 1} / 0{stories.length}</span>
      <div className="story-controls" aria-label="Gallery controls">
        <button onClick={() => move(-1)} disabled={index === 0}>PREV</button>
        <span aria-hidden="true">/</span>
        <button onClick={() => move(1)} disabled={index === stories.length - 1}>NEXT</button>
      </div>
    </div>
  </div>;
}

function ValueCard({ number, word, copy }) {
  return <article>
    <span>{number}</span>
    <div className="value-word"><h3>{word}</h3><span aria-hidden="true">↗</span></div>
    <p>{copy}</p>
  </article>;
}

export function App() {
  const [visitOpen, setVisitOpen] = useState(false);
  const [active, setActive] = useState("sundays");
  const [progress, setProgress] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));

    const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    }), { rootMargin: "-32% 0px -60%", threshold: 0 });
    navItems.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) navObserver.observe(node);
    });

    let ticking = false;
    const syncScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(ratio);
      const heroProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      document.documentElement.style.setProperty("--hero-scroll", heroProgress.toFixed(3));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(syncScroll);
        ticking = true;
      }
    };
    syncScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      revealObserver.disconnect();
      navObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onHeroPointer = (event) => {
    const node = heroRef.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = node.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    node.style.setProperty("--pointer-x", x.toFixed(3));
    node.style.setProperty("--pointer-y", y.toFixed(3));
  };

  return <div id="top" className="site-frame" style={{ "--paper-texture": `url(${asset("paper-texture.png")})` }}>
    <Header active={active} progress={progress} onVisit={() => setVisitOpen(true)} />
    <main>
      <section id="sundays" className="hero" aria-labelledby="hero-title" ref={heroRef} onPointerMove={onHeroPointer}>
        <div className="hero-image-wrap">
          <img className="hero-image" src={asset("fcc-worship.webp")} alt="Worship team singing and playing music at FCC" />
          <div className="hero-image-tag"><span>SUNDAY</span><span>THE BRONX</span></div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow hero-item">// BRONX · NYC</p>
          <h1 id="hero-title" className="hero-item"><span>A Church of</span><span>the Bronx,</span><span>for the Bronx.</span></h1>
          <p className="hero-deck hero-item">Building a Kingdom Family that<br className="desktop-break" /> Displays the Love of Jesus</p>
          <button className="ink-button hero-item button-arrow" onClick={() => setVisitOpen(true)}><span>PLAN YOUR VISIT</span><span aria-hidden="true">↗</span></button>
          <div className="service-block hero-item">
            <span className="service-kicker">SUNDAYS</span>
            <div className="times"><p><span>ESPAÑOL</span><strong>9:45 AM</strong></p><p><span>ENGLISH</span><strong>11:45 AM</strong></p></div>
          </div>
          <address className="address hero-item">2439 Creston Avenue · Bronx, NY 10468</address>
        </div>
        <img className="hero-branch" src={asset("branch-ink.png")} alt="" aria-hidden="true" />
        <a className="scroll-cue" href="#about"><span>SCROLL TO KNOW US</span><i aria-hidden="true">↓</i></a>
      </section>

      <section id="about" className="section section-about" data-reveal>
        <div className="section-label"><span>01</span><span>// WHO WE ARE</span></div>
        <div className="about-copy">
          <div><h2>A kingdom family,<br />rooted in the Bronx.</h2><p>We gather around God’s Word, live as a family, and love our neighbors in word and deed. Everyone is welcome to come, listen, ask questions, and meet Jesus with us.</p></div>
          <blockquote>“They devoted themselves to the apostles’ teaching and the fellowship.”<cite>ACTS 2:42</cite></blockquote>
        </div>
        <div className="values" aria-label="Our values">
          <ValueCard number="01" word="KNOW" copy="God’s Word and the Gospel." />
          <ValueCard number="02" word="LIVE" copy="Like family, following Jesus together." />
          <ValueCard number="03" word="LOVE" copy="Our neighbors in word and deed." />
        </div>
      </section>

      <section className="section life-section" data-reveal>
        <div className="section-label"><span>02</span><span>// LIFE AT FCC</span></div>
        <div className="section-intro"><h2>Not an audience.<br />A people.</h2><p>Sunday worship, weekday tables, children growing, neighbors serving neighbors. Church life is shared life.</p></div>
        <StoryStrip />
      </section>

      <section id="connect" className="section connect-section" data-reveal>
        <div className="connect-art-shell"><img className="connect-art" src={asset("flower-ink.jpg")} alt="Hand-drawn botanical artwork" /><span className="art-note">GROW / TOGETHER</span></div>
        <div className="connect-copy">
          <p className="eyebrow">// FIND YOUR PEOPLE</p>
          <h2>Church is more<br />than a Sunday.</h2>
          <div className="link-stack">
            <a href="https://www.fccbronx.org/city-link-groups" target="_blank" rel="noreferrer"><span>CITY LINK GROUPS</span><span>MEET DURING THE WEEK</span><i aria-hidden="true">↗</i></a>
            <a href="https://www.fccbronx.org/fcc-kids" target="_blank" rel="noreferrer"><span>FCC KIDS</span><span>NURSERY–5TH GRADE</span><i aria-hidden="true">↗</i></a>
            <a href="https://www.fccbronx.org/contact" target="_blank" rel="noreferrer"><span>CONTACT US</span><span>START A CONVERSATION</span><i aria-hidden="true">↗</i></a>
          </div>
        </div>
      </section>

      <section id="sermons" className="section dark-section" data-reveal>
        <div className="section-label"><span>03</span><span>// LATEST MESSAGE</span></div>
        <div className="sermon-grid">
          <div className="sermon-stamp"><span>THE WORD</span><span>FOR THE BRONX</span><i>FCC</i></div>
          <div>
            <p className="eyebrow">LISTEN / WATCH / RETURN</p>
            <h2>Hear the good news<br />of Jesus.</h2>
            <p>Catch up on recent teaching in English and Español.</p>
            <a className="paper-button button-arrow" href="https://www.fccbronx.org/sermon" target="_blank" rel="noreferrer"><span>WATCH SERMONS</span><span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section id="give" className="section give-section" data-reveal>
        <p className="eyebrow">// GENEROSITY</p>
        <h2>Give toward Gospel<br />work in the Bronx.</h2>
        <p>Support the ministry and mission of Fordham Community Church.</p>
        <a className="ink-button button-arrow" href="https://www.fccbronx.org/give" target="_blank" rel="noreferrer"><span>GIVE ONLINE</span><span aria-hidden="true">↗</span></a>
        <div className="give-line" aria-hidden="true"><span>THE BRONX</span><span>·</span><span>JESUS</span><span>·</span><span>KINGDOM FAMILY</span></div>
      </section>
    </main>

    <footer>
      <Mark />
      <p>FORDHAM · THE BRONX · NYC</p>
      <p>2439 CRESTON AVENUE<br />BRONX, NY 10468</p>
      <a href="#top">BACK TO TOP ↑</a>
    </footer>

    <VisitPanel open={visitOpen} onClose={() => setVisitOpen(false)} />
  </div>;
}
