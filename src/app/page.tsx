const tracks = [
  {
    index: "01",
    eyebrow: "Kultur · Kl 18:00",
    title: "En kväll bland nya perspektiv",
    place: "Röda Sten Konsthall",
    tone: "signal",
  },
  {
    index: "02",
    eyebrow: "Mat · Linné",
    title: "Tre bord värda en omväg",
    place: "Redaktionens urval",
    tone: "ink",
  },
  {
    index: "03",
    eyebrow: "Familj · Fri entré",
    title: "En långsam söndag i Slottsskogen",
    place: "Lek, natur och fika",
    tone: "moss",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="STADEN, startsida">
          STADEN
        </a>
        <div className="city-stamp" aria-label="Aktuell stad">
          <span>GÖTEBORG</span>
          <span>57.7089° N</span>
        </div>
        <button className="menu-button" type="button" aria-label="Öppna meny">
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">STADEN I DIN FICKA</p>
          <h1>
            Gå ut.
            <br />
            Hitta <em>in.</em>
          </h1>
          <p className="hero-description">
            Kultur, mat, nöjen och platser — kurerat varje dag för livet du
            faktiskt lever.
          </p>
          <a className="primary-action" href="#upptack">
            <span>Utforska Göteborg</span>
            <span aria-hidden="true">↘</span>
          </a>
        </div>

        <div className="hero-art" aria-label="Kommande evenemang om tolv dagar">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="countdown">
            <span className="countdown-number">12</span>
            <span className="countdown-label">DAGAR KVAR</span>
          </div>
          <div className="event-caption">
            <span>WAY OUT WEST</span>
            <span>Slottsskogen · 13–15 AUG</span>
          </div>
        </div>
      </section>

      <section className="discovery" id="upptack">
        <div className="section-heading">
          <p className="kicker">KURERAT JUST NU</p>
          <h2>Tre vägar ut i staden.</h2>
          <p>En första glimt av det redaktionella flödet som kommer.</p>
        </div>

        <div className="track-grid">
          {tracks.map((track) => (
            <article className={`track-card ${track.tone}`} key={track.index}>
              <div className="card-topline">
                <span>{track.index}</span>
                <button type="button" aria-label={`Spara ${track.title}`}>
                  ＋
                </button>
              </div>
              <div className="card-copy">
                <p>{track.eyebrow}</p>
                <h3>{track.title}</h3>
                <span>{track.place}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <p>GÖTEBORG, SVERIGE</p>
        <p>FÖRHANDSVISNING · 2026</p>
      </footer>
    </main>
  );
}
