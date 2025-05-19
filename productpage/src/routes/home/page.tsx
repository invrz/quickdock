import Logo from '../../assets/logo.png';

const Home = () => {
  return (
    <div className="page-view" style={{ background: 'var(--high-contrast-bg)' }}>
      
      {/* Header / Hero */}
      <header className="grid-row row-middle row-center col-width-15 col-height-10" style={{ background: '#000' }}>
        <div className="col-width-12">
          <div className=" object-alignment-wrapper">
            <img className="col-width-6 col-width-15-sm object-align--center" src={Logo} alt="GhostDeck Logo"/>
          </div>
          <h1 style={{ color: 'white', fontSize: '3.6rem', textAlign: 'center' }}>
            GhostDeck
          </h1>
          <p className='text-body text-align--center'>A quick app launcher for minimalists</p>
          {/* <nav style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="#features" style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Features</a>
            <a href="#demo"      style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Demo</a>
            <a href="#testi"     style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Testimonials</a>
          </nav> */}
        </div>
      </header>
      
      {/* Intro */}
      <section className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 2rem', background: 'var(--high-contrast-bg)' }}>
        <div className="col-width-10">
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>
            MEET GHOSTDECK: YOUR INVISIBLE PRODUCTIVITY ACE!
          </h2>
          <p style={{ color: 'var(--high-contrast-text)', lineHeight: '1.5rem' }}>
            Love minimal desktop ? Stop cramping it with bulky icons and quicklaunch your favorite apps with GhostDeck. Press <strong>Ctrl + Space</strong> and voilà, it’s there—like magic, but cooler.
          </p>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="grid-row gutter-width-2 col-width-15" style={{ padding: '2rem' }}>
        {[
          ['Invisible Until Needed',  '/features/feature1.png',  'Enjoy a clean desktop—GhostDeck stays invisible until you summon it.'],
          ['Keyboard‑First Navigation','/features/feature2.png',  'Use arrow keys & Enter for lightning‑fast access.'],
          ['Customizable Profiles',    '/features/feature3.png',  'Create workspaces for coding, design, office, etc.'],
          ['Lightweight & Fast',       '/features/feature4.png',  'Featherweight code, feather‑fast launches.']
        ].map(([t, img, d], i) => (
          <div key={i} className="grid-row grid-row--vertical gutter-width-1 col-width-7" style={{ background: 'var(--high-contrast-bg)', padding: '1rem', border: '1px solid var(--body-border)', transition: 'background .2s' }}
               onMouseEnter={e => e.currentTarget.style.background = 'var(--body-bg-hover)'}
               onMouseLeave={e => e.currentTarget.style.background = 'var(--high-contrast-bg)'}>
            <img src={img} alt={t} style={{ width: '100%', borderRadius: '4px' }}/>
            <h3 style={{ color: 'white', margin: '0.75rem 0' }}>{t}</h3>
            <p style={{ color: 'var(--high-contrast-text)' }}>{d}</p>
          </div>
        ))}
      </section>
      
      {/* Demo */}
      <section id="demo" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 2rem', background: 'var(--body-bg-darker)' }}>
        <div className="col-width-10">
          <h2 style={{ color: 'var(--body-text)', fontSize: '1.75rem', marginBottom: '1rem' }}>
            INTERACTIVE DEMO TIME!
          </h2>
          <p style={{ color: 'var(--body-text)', lineHeight: '1.5rem' }}>
            Watch GhostDeck spring to life through embedded videos or GIFs—and even play with a live mockup if you dare.
          </p>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testi" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 2rem', background: 'var(--body-bg)' }}>
        <div className="col-width-8">
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>USER TESTIMONIALS</h2>
          <ul style={{ color: 'var(--body-text)', listStyle: 'none', lineHeight: '1.5rem' }}>
            <li>Jason Momoa, Actor — 2024</li>
            <li>Elon Musk, SpaceX — 2025</li>
            <li>Ariana Grande, Singer — 2024</li>
            <li>Greta Thunberg, Activist — 2025</li>
          </ul>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '3rem 2rem', background: 'var(--secondary-bg)' }}>
        <div className="col-width-8" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--secondary-text)', fontSize: '1.75rem', marginBottom: '1rem' }}>
            JOIN THE GHOSTDECK SQUAD!
          </h2>
          <button
            className="row-center col-height-auto"
            style={{
              background: 'var(--highlight-bg)',
              color: 'var(--highlight-text)',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform .1s ease-out'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get GhostDeck
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="grid-row gutter-width-5 col-width-15 row-middle row-center" style={{ padding: '2rem', background: 'var(--high-contrast-bg)' }}>
        <div className="col-width-5" style={{ color: 'var(--high-contrast-text)' }}>
          <strong>GhostDeck</strong> © 2025
        </div>
        <nav className="col-width-5 row-center" style={{ color: 'var(--high-contrast-text)' }}>
          <a href="#features" style={{ margin: '0 1rem' }}>Features</a>
          <a href="#demo"      style={{ margin: '0 1rem' }}>Demo</a>
          <a href="#testi"     style={{ margin: '0 1rem' }}>Support</a>
        </nav>
        <div className="col-width-5 row-right" style={{ color: 'var(--high-contrast-text)' }}>
          <a href="#" style={{ margin: '0 0.5rem' }}>Privacy</a>
          <a href="#" style={{ margin: '0 0.5rem' }}>Terms</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;