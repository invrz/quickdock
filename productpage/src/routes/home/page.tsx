import Logo from '../../assets/logo.png';

import featureGif1 from '../../assets/invisible-till-needed.gif';
import featureSvg1 from "../../assets/keyboard-solid.svg";
import featureSvg2 from "../../assets/gears-solid.svg";
import featureSvg3 from "../../assets/bolt-solid.svg";
import featureSvg4 from "../../assets/power-off-solid.svg";

const Home = () => {
  return (
    <div className="page-view" style={{ background: 'var(--high-contrast-bg)' }}>
      
      {/* Header / Hero */}
      <header id="hero" className="grid-row row-middle row-center col-width-15 col-height-10" style={{ background: '#000' }}>
        <div className="col-width-12">
          <div className=" object-alignment-wrapper">
            <img className="col-width-6 col-width-15-sm object-align--center" src={Logo} alt="GhostDeck Logo"/>
          </div>
          <h1 style={{ color: 'white', fontSize: '3.6rem', textAlign: 'center' }}>
            GhostDeck
          </h1>
          <p className='text-body text-align--center'>
            A quick app launcher for minimalists<br/><br/>
            <span className='code--inline padding-small bg-secondary'>
              Ctrl + Space
            </span>
          </p>
          {/* <nav style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="#features" style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Features</a>
            <a href="#demo"      style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Demo</a>
            <a href="#testi"     style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Testimonials</a>
          </nav> */}
        </div>
      </header>
      
      {/* Intro */}
      <section id="about" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 2rem', background: 'var(--high-contrast-bg)' }}>
        <div className="col-width-12 col-height-5 row-center row-middle">
          <h2 className='col-width-15 text-body text--bold text--xlarge text-align--left' style={{marginBottom: '2rem'}}>
            Streamline your workflow.
          </h2>
            <p className='col-width-15 text-body text--medium text-align--left'>
            Set up powerful macros or shortcuts to launch your entire workflow with a single click or key combo. Open all your essential apps, folders, and websites instantly—no more repetitive clicks or searching. GhostDeck lets you automate your daily setup so you can dive straight into productivity.
            </p>
        </div>
        <div className="col-width-12 col-height-5 row-center row-middle">
          <h2 className='col-width-15 text-body text--bold text--xlarge text-align--left' style={{marginBottom: '2rem'}}>
            Declutter your desktop.
          </h2>
          <p className='col-width-15 text-body text--medium text-align--left'>
            Love minimal desktops ? Stop cramping it with bulky icons and quicklaunch your favorite apps with GhostDeck. Press <strong>Ctrl + Space</strong> and voilà, it’s there—like magic, but cooler.
          </p>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="grid-row gutter-width-2 col-width-15 row-center row-middle" style={{ padding: '2rem' }}>
        {[
          ['Keyboard‑First Navigation',`${featureSvg1}`,  'Use arrow keys & Enter for lightning‑fast access.'],
          ['Customization Options',    `${featureSvg2}`,  'Set your own search engine, select a theme and much more.'],
          ['Invisible Until Needed',    `${featureGif1}`,  'Enjoy a clean desktop—GhostDeck stays invisible until you summon it.'],
          ['Lightweight & Fast',       `${featureSvg3}`,  'Featherweight code, feather‑fast launches.'],
          ['Starts when you do',       `${featureSvg4}`,  'Starts running in background as soon as you log in.'],
        ].map(([t, imgpath, d], i) => (
          i === 2 ?
          <div key={i} className="grid-row--vertical col-width-14" style={{ background: 'var(--high-contrast-bg)', padding: '1rem', border: '1px solid var(--body-border)', transition: 'background .2s' }}
               onMouseEnter={e => e.currentTarget.style.background = 'var(--body-bg-hover)'}
               onMouseLeave={e => e.currentTarget.style.background = 'var(--high-contrast-bg)'}>
            <img src={imgpath} alt={t} style={{ width: '100%', borderRadius: '4px' }}/>
            <h3 className="text-align--center" style={{ color: 'white', margin: '0.75rem 0' }}>{t}</h3>
            <p className="text-align--center" style={{ color: 'var(--high-contrast-text)' }}>{d}</p>
          </div>
          :
          <div key={i} className="grid-row--vertical col-width-7" style={{ background: 'var(--high-contrast-bg)', padding: '1rem', border: '1px solid var(--body-border)', transition: 'background .2s' }}
               onMouseEnter={e => e.currentTarget.style.background = 'var(--body-bg-hover)'}
               onMouseLeave={e => e.currentTarget.style.background = 'var(--high-contrast-bg)'}>
            <img className='col-height-2 bg-muted padding--large' src={imgpath} alt={t} style={{ width: '100%', borderRadius: '12px' }}/>
            <h3 className="text-align--center" style={{ color: 'white', margin: '0.75rem 0' }}>{t}</h3>
            <p className="text-align--center" style={{ color: 'var(--high-contrast-text)' }}>{d}</p>
          </div>
        ))}
      </section>
      
      {/* Demo */}
      {/* <section id="demo" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 2rem', background: 'var(--body-bg-darker)' }}>
        <div className="col-width-10">
          <h2 style={{ color: 'var(--body-text)', fontSize: '1.75rem', marginBottom: '1rem' }}>
            INTERACTIVE DEMO TIME!
          </h2>
          <p style={{ color: 'var(--body-text)', lineHeight: '1.5rem' }}>
            Watch GhostDeck spring to life through embedded videos or GIFs—and even play with a live mockup if you dare.
          </p>
        </div>
      </section> */}
      
      {/* Testimonials */}
      <section id="testi" className="grid-row gutter-width-5 col-width-15 row-center bg-accent-dark" style={{ padding: '4rem 2rem'}}>
        <div className="col-width-12">
          <h2 className='margin-bottom--large heading--h2 text-body text--bold'>What users are saying ?</h2>
          <ul style={{listStyle: 'none', lineHeight: '1.5rem' }}>
            <li className='margin-bottom--large'>
              <h3 className='heading--h3'>Probably replacing the start menu itself for me.</h3>
              <p className='text--regsmall text--bold text-body'>Fake Reviewer 1</p>
            </li>
            <li className='margin-bottom--large'>
              <h3 className='heading--h3'>I love that just pressing Ctrl+Space does both, opens and closes the UI.</h3>
              <p className='text--regsmall text--bold text-body'>Fake Reviewer 3</p>
            </li>
            <li className='margin-bottom--large'>
              <h3 className='heading--h3'>Similar to Mac's spotlight, but not just search.</h3>
              <p className='text--regsmall text--bold text-body'>Fake Reviewer 2</p>
            </li>
            <li className='margin-bottom--large'>
              <h3 className='heading--h3'>Takes a bit of time to start when I log in, but after that its smooth as butter.</h3>
              <p className='text--regsmall text--bold text-body'>Fake Reviewer 4</p>
            </li>

          </ul>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '3rem 2rem', background: 'var(--secondary-bg)' }}>
        <div className="col-width-12" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--secondary-text)', fontSize: '1.75rem', marginBottom: '1rem' }}>
            Ready to take control of your desktop?
          </h2>
          <button
            className="row-center col-height-auto margin--small"
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
          <button
            className="row-center col-height-auto margin--small"
            style={{
              background: 'var(--highlight-bg)',
              color: 'var(--highlight-text)',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform .1s ease-out',
              filter: 'blur(1px) grayscale(1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Hitting Mac OS and Linux soon
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="grid-row col-width-12 row-middle row-center padding--small" style={{background: 'var(--high-contrast-bg)' }}>
        <nav className="col-width-10 col-width-15-sm" style={{ color: 'var(--high-contrast-text)' }}>
          <a href="#hero">Hero</a>&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#about">About</a>&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#features">Features</a>&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#testi">Testimonials</a>&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#download">Download</a>
        </nav>
        <div className="col-width-5 col-width-0-sm text-align--right" style={{ color: 'var(--high-contrast-text)' }}>
          <strong>GhostDeck | Invrz</strong> © 2025
        </div>
        <div className="col-width-0-ld col-width-0-sq col-width-15-sm" style={{ color: 'var(--high-contrast-text)' }}>
          <br/>
          <strong>GhostDeck | Invrz</strong> © 2025
          <br/><br/>
        </div>
      </footer>
    </div>
  );
}

export default Home;