import { useEffect, useRef, useState } from "react";

const navItems = [["about", "About"], ["sundays", "Sundays"], ["connect", "Connect"], ["sermons", "Sermons"], ["give", "Give"]];
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

function Mark() {
  return <a className="mark-link" href="#top" aria-label="Fordham Community Church home"><img className="mark" src={asset("fcc-mark.png")} alt="Fordham Community Church" /></a>;
}

function Header({ active }) {
  return <header className="site-header" aria-label="Main navigation"><Mark /><nav className="nav-rail" aria-label="Primary">{navItems.map(([id, label]) => <a key={id} className={active === id ? "active" : ""} href={`#${id}`}>{label}</a>)}</nav></header>;
}

function VisitPanel({ open, onClose }) {
  const [service, setService] = useState("English · 11:45 AM");
  const [submitted, setSubmitted] = useState(false);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    setSubmitted(false);
    document.body.classList.add("panel-open");
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => { document.body.classList.remove("panel-open"); window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  return <div className={`visit-shell ${open ? "open" : ""}`} aria-hidden={!open}>
    <button className="visit-backdrop" onClick={onClose} aria-label="Close visit planner" tabIndex={open ? 0 : -1} />
    <aside className="visit-panel" role="dialog" aria-modal="true" aria-labelledby="visit-title">
      <div className="panel-topline"><span>// PLAN A SUNDAY</span><button ref={closeRef} className="text-button" onClick={onClose}>CLOSE</button></div>
      <h2 id="visit-title">We’d love to<br />meet you.</h2>
      {!submitted ? <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
        <fieldset><legend>Choose a gathering</legend>{["Español · 9:45 AM", "English · 11:45 AM"].map((option) => <label className="service-choice" key={option}><input type="radio" name="service" value={option} checked={service === option} onChange={() => setService(option)} /><span>{option}</span></label>)}</fieldset>
        <label className="field-label" htmlFor="visit-name">Your name</label><input id="visit-name" className="line-input" name="name" placeholder="HOW SHOULD WE GREET YOU?" required />
        <button className="ink-button wide" type="submit">PLAN MY SUNDAY</button>
      </form> : <div className="success-note" role="status"><p className="eyebrow">YOU’RE ALL SET</p><h3>See you Sunday.</h3><p>{service}<br />2439 Creston Avenue, Bronx</p></div>}
      <a className="directions-link" href="https://www.google.com/maps/dir/?api=1&destination=2439+Creston+Avenue+Bronx+NY+10468" target="_blank" rel="noreferrer">GET DIRECTIONS</a>
    </aside>
  </div>;
}

function StoryStrip() {
  const stripRef = useRef(null);
  const move = (direction) => { const width = stripRef.current?.clientWidth || 0; stripRef.current?.scrollBy({ left: width * direction, behavior: "smooth" }); };
  return <div className="story-wrap"><div className="story-strip" ref={stripRef} aria-label="Life at FCC photo gallery">
    <figure className="story-card"><img src={asset("fcc-worship.webp")} alt="Musicians leading worship at Fordham Community Church" /><figcaption>WORSHIP / TOGETHER</figcaption></figure>
    <figure className="story-card"><img src={asset("membership-art.jpg")} alt="Membership classes flower artwork" /><figcaption>WORD / GROWTH</figcaption></figure>
    <figure className="story-card"><img src={asset("flower-ink.jpg")} alt="Hand-drawn flowers from an FCC class announcement" /><figcaption>FAMILY / MEMBERSHIP</figcaption></figure>
  </div><div className="story-controls" aria-label="Gallery controls"><button onClick={() => move(-1)}>PREV</button><span aria-hidden="true">/</span><button onClick={() => move(1)}>NEXT</button></div></div>;
}

export function App() {
  const [visitOpen, setVisitOpen] = useState(false);
  const [active, setActive] = useState("sundays");
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), { threshold: 0.14 });
    document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
    const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: "-35% 0px -55%", threshold: 0 });
    navItems.forEach(([id]) => { const node = document.getElementById(id); if (node) navObserver.observe(node); });
    return () => { revealObserver.disconnect(); navObserver.disconnect(); };
  }, []);
  return <div id="top" className="site-frame">
    <Header active={active} />
    <main>
      <section id="sundays" className="hero" aria-labelledby="hero-title">
        <div className="hero-image-wrap"><img className="hero-image" src={asset("fcc-worship.webp")} alt="Worship team singing and playing music at FCC" /></div>
        <div className="hero-copy"><p className="eyebrow hero-item">// BRONX</p><h1 id="hero-title" className="hero-item"><span>A Church of</span><span>the Bronx,</span><span>for the Bronx.</span></h1><p className="hero-deck hero-item">Building a Kingdom Family that<br className="desktop-break" /> Displays the Love of Jesus</p><button className="ink-button hero-item" onClick={() => setVisitOpen(true)}>PLAN YOUR VISIT</button><div className="times hero-item"><p>ESPAÑOL · 9:45 AM</p><p>ENGLISH · 11:45 AM</p></div><address className="address hero-item">2439 Creston Avenue ·<br />Bronx, NY 10468</address></div>
        <img className="hero-branch" src={asset("branch-ink.png")} alt="" aria-hidden="true" /><a className="scroll-cue" href="#about">SCROLL TO KNOW US</a>
      </section>
      <section id="about" className="section section-about" data-reveal><div className="section-label"><span>01</span><span>// WHO WE ARE</span></div><div className="about-copy"><div><h2>A kingdom family,<br />rooted in the Bronx.</h2><p>We gather around God’s Word, live as a family, and love our neighbors in word and deed. Everyone is welcome to come, listen, ask questions, and meet Jesus with us.</p></div><blockquote>“They devoted themselves to the apostles’ teaching and the fellowship.”<cite>ACTS 2:42</cite></blockquote></div><div className="values" aria-label="Our values">{[["KNOW", "God’s Word and the Gospel."], ["LIVE", "Like family, following Jesus together."], ["LOVE", "Our neighbors in word and deed."]].map(([word, copy], index) => <article key={word}><span>0{index + 1}</span><h3>{word}</h3><p>{copy}</p></article>)}</div></section>
      <section className="section life-section" data-reveal><div className="section-label"><span>02</span><span>// LIFE AT FCC</span></div><StoryStrip /></section>
      <section id="connect" className="section connect-section" data-reveal><img className="connect-art" src={asset("flower-ink.jpg")} alt="Hand-drawn botanical artwork" /><div className="connect-copy"><p className="eyebrow">// FIND YOUR PEOPLE</p><h2>Church is more<br />than a Sunday.</h2><div className="link-stack"><a href="https://www.fccbronx.org/city-link-groups" target="_blank" rel="noreferrer"><span>CITY LINK GROUPS</span><span>MEET DURING THE WEEK</span></a><a href="https://www.fccbronx.org/fcc-kids" target="_blank" rel="noreferrer"><span>FCC KIDS</span><span>NURSERY–5TH GRADE</span></a><a href="https://www.fccbronx.org/contact" target="_blank" rel="noreferrer"><span>CONTACT US</span><span>START A CONVERSATION</span></a></div></div></section>
      <section id="sermons" className="section dark-section" data-reveal><div className="section-label"><span>03</span><span>// LATEST MESSAGE</span></div><div className="sermon-grid"><p>THE WORD<br />FOR THE BRONX</p><div><h2>Hear the good news<br />of Jesus.</h2><p>Catch up on recent teaching in English and Español.</p><a className="paper-button" href="https://www.fccbronx.org/sermon" target="_blank" rel="noreferrer">WATCH SERMONS</a></div></div></section>
      <section id="give" className="section give-section" data-reveal><p className="eyebrow">// GENEROSITY</p><h2>Give toward Gospel<br />work in the Bronx.</h2><p>Support the ministry and mission of Fordham Community Church.</p><a className="ink-button" href="https://www.fccbronx.org/give" target="_blank" rel="noreferrer">GIVE ONLINE</a></section>
    </main>
    <footer><Mark /><p>FORDHAM · THE BRONX · NYC</p><p>2439 CRESTON AVENUE<br />BRONX, NY 10468</p><a href="#top">BACK TO TOP</a></footer>
    <VisitPanel open={visitOpen} onClose={() => setVisitOpen(false)} />
  </div>;
}
