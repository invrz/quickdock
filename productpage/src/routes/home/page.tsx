import Logo from '../../assets/logo.png';

import MicrosoftLogo from "../../assets/micosoftLogo.svg";
import AppleLogo from "../../assets/appleLogo.svg";
import LinuxLogo from "../../assets/linuxLogo.svg";

import invisibleImg from '../../assets/invisible.png';
import hotkeyImg from "../../assets/hotkey.png";
import customizationImg from "../../assets/customization.png";
import lightweightImg from "../../assets/lightweight.gif";
import startupImg from "../../assets/startup.png";

const Home = () => {

  const features = [
    ['Toggle with Hotkey', `${hotkeyImg}`, 'Instantly summon your dock with the universal hotkey Ctrl + Space.'],
    ['Customize Everything', `${customizationImg}`, 'Choose your own search engine, theme, and more—tailor GhostDeck to your workflow.'],
    ['Lightweight & Fast', `${lightweightImg}`, 'So snappy, it becomes muscle memory.'],
    ['Invisible Until Needed', `${invisibleImg}`, 'GhostDeck stays out of your way—appearing only when you call it.'],
    ['Starts when you do', `${startupImg}`, 'Runs quietly in the background from the moment you log in.'],
  ];

  const ctrlSpaceHotkeyAction = () => {
    console.log("Ctrl + Space pressed - Trigger GhostDeck UI");
    const windowView = document.getElementById('windowviewid');
    if (windowView) {
      windowView.style.display = windowView.style.display === 'none' ? 'block' : 'none';
    } else {
      console.error("Window view element not found");
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.code === 'Space') {
      event.preventDefault();
      ctrlSpaceHotkeyAction();
    }
  });

  document.addEventListener('mousemove', (event) => {
    const motionSection = document.getElementById('hero');
    if (motionSection) {
      const rect = motionSection.getBoundingClientRect();
      const x = event.clientX - rect.left; // x position within the element
      const y = event.clientY - rect.top;  // y position within the element

      const movableImage = document.getElementById('tilter');
      if (movableImage) {
        const { innerWidth, innerHeight } = window;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Calculate rotation range (-5deg to +5deg)
        const rotateX = ((mouseY / innerHeight) - 0.5) * 20;
        const rotateY = ((mouseX / innerWidth) - 0.5) * -20;

        movableImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${x * 0.025}px, ${y * 0.025}px)`;
        // movableImage.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      }
    }
  });

  // document.addEventListener('scroll', () => {
  //   const motionSections = document.querySelectorAll('.scale-onscroll');

  //   motionSections.forEach(section => {
  //     const rect = section.getBoundingClientRect();
  //     const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  //     const sectionTop = rect.top;
  //     const sectionHeight = rect.height;
  //     const sectionCenter = sectionTop + sectionHeight / 2;
  //     const viewportCenter = windowHeight / 2;

  //     // Calculate distance from section center to viewport center
  //     const distanceToCenter = Math.abs(viewportCenter - sectionCenter);

  //     // Normalize distance (0 when centered, 1 when far)
  //     const maxDistance = windowHeight / 2 + sectionHeight / 2;
  //     const normalized = Math.min(distanceToCenter / maxDistance, 1);

  //     // Invert and scale (closer to center = higher scale)
  //     const scale = 1 + (1 - normalized) * 0.05; // max scale = 1.05

  //     (section as HTMLElement).style.transform = `scale(${scale})`;
  //     (section as HTMLElement).style.transition = 'transform 0.1s ease-out'; // optional: smoothen transitions
  //   });
  // });

  document.addEventListener('scroll', () => {
    const motionSections = document.querySelectorAll('.scale-onscroll');

    motionSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const sectionCenter = sectionTop + sectionHeight / 2;
      const viewportCenter = windowHeight / 2;

      let scale = 0.9;

      if (sectionCenter > viewportCenter) {
        // Calculate distance only if section center is above or at the viewport center
        const distanceToCenter = Math.abs(viewportCenter - sectionCenter);
        const maxDistance = windowHeight / 2 + sectionHeight / 2;
        const normalized = Math.min(distanceToCenter / maxDistance, 1);
        scale = 0.9 + (1 - normalized) * 0.1; // Max scale = 1.05
      } else {
        // Lock scale at max if section center has passed viewport center
        scale = 1;
      }

      (section as HTMLElement).style.transform = `scale(${scale}) perspective(600px) rotateX(${10 - scale * 10}deg)`;
      (section as HTMLElement).style.transition = 'transform 0.05s ease-out';
    });
  });


  return (
    <>
      <div className="page-view" style={{ background: 'var(--high-contrast-bg)' }}>
        
        {/* Header / Hero */}
        <header id="hero" className="grid-row row-middle row-center col-width-15 col-height-10">
          <div className="col-width-12" id="tilter">
            <div className=" object-alignment-wrapper">
              <img id="movableImage" className="col-width-6 col-width-15-sm object-align--center zIndexFull" src={Logo} alt="GhostDeck Logo"/>
            </div>
            <h1 className="zIndexFull text--xxlarge text--bold text-body text-align--center text-montserrat">
              GhostDeck
            </h1>
            <p className='text-body text-align--center zIndexFull text-sourcesanspro'>
              A quick app launcher for minimalists<br/><br/>
              <button onClick={() => ctrlSpaceHotkeyAction()} className='padding-medium text--regsmall bg-body-dark border--none border--smooth text-body text--bold'>
                Ctrl + Space
              </button>
            </p>
            {/* <nav style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href="#features" style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Features</a>
              <a href="#demo"      style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Demo</a>
              <a href="#testi"     style={{ color: 'var(--secondary-text)', margin: '0 1rem' }}>Testimonials</a>
            </nav> */}
          </div>
        </header>
        
        {/* Intro */}
        <section id="about" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 0rem'}}>
          <div className="col-width-12 col-height-5--min row-center row-middle bg-body border--smoother padding--large scale-onscroll">
            <h2 className='col-width-15 text-body text--bold text--xlarge text-align--left text-montserrat' style={{marginBottom: '2rem'}}>
              Streamline your workflow.
            </h2>
              <p className='col-width-15 text-body text--medium text-align--left'>
              Set up powerful macros or shortcuts to launch your entire workflow with a single click or key combo. Open all your essential apps, folders, and websites instantly—no more repetitive clicks or searching. GhostDeck lets you automate your daily setup so you can dive straight into productivity.
              </p>
          </div>
          <div className='col-width-12 col-height-1'></div>
          <div className="col-width-12 col-height-5--min row-center row-middle bg-body border--smoother padding--large scale-onscroll">
            <h2 className='col-width-15 text-body text--bold text--xlarge text-align--left text-montserrat' style={{marginBottom: '2rem'}}>
              Declutter your desktop.
            </h2>
            <p className='col-width-15 text-body text--medium text-align--left'>
              {/* Love minimal desktops ? Stop cramping it with bulky icons and quicklaunch your favorite apps with GhostDeck. Press <strong>Ctrl + Space</strong> and voilà, it’s there—like magic, but cooler. */}
              Love minimal desktops? Keep it clean and distraction-free by ditching icons and taskbar clutter. With GhostDeck, you can quicklaunch your favorite apps, folders, or websites in an instant. Just press Ctrl + Space and voilà—your launcher appears. It’s like magic, but cooler.
            </p>
          </div>
        </section>
        
        {/* Features */}
        <section id="features" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 0rem'}}>

          <div className="col-width-12">
            <h2 className='col-width-15 text-body text--bold text--xlarge text-align--left text-montserrat' style={{marginBottom: '2rem'}}>
              Designed to do more.
            </h2>
            <div className='slideshow row-center row-middle col-width-15'>
              
              {features.map(([title, imgpath, desc], i) => {
                return (
                    <div className='slide border--smoother col-height-6' key={i} style={{ marginBottom: '1rem' }}>
                      <div className='slide-text'>
                        <h3 className='heading--h3 text--bold text-montserrat'>{title}</h3>
                        <p className='text--medium text-sourcesanspro'>{desc}</p>
                      </div>
                      <div className='slide-img'>
                        <img src={imgpath} alt={title} />
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
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
        <section id="testimonials" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '4rem 0rem'}}>
          <div className="col-width-12">
            <h2 className='col-width-15 text-body text--bold text--xlarge text-align--left text-montserrat' style={{marginBottom: '2rem'}}>What users are saying ?</h2>
            <ul className="ul-halfwidth-items">
              <li className='margin-bottom--large text-body'>
                <h3 className='heading--h3 text--italic text-lora'>"Probably replacing the start menu itself for me."</h3><br/>
                <p className='text--regsmall text--bold text-sourcesanspro'>Fake Reviewer 1</p>
              </li>
              <li className='margin-bottom--large text-body'>
                <h3 className='heading--h3 text--italic text-lora'>"I love that just pressing Ctrl+Space does both, opens and closes the UI."</h3><br/>
                <p className='text--regsmall text--bold text-sourcesanspro'>Fake Reviewer 4</p>
              </li>
              <li className='margin-bottom--large text-body'>
                <h3 className='heading--h3 text--italic text-lora'>"A bit slow at startup, but after that its smooth as butter."</h3><br/>
                <p className='text--regsmall text--bold text-sourcesanspro'>Fake Reviewer 2</p>
              </li>
              <li className='margin-bottom--large text-body'>
                <h3 className='heading--h3 text--italic text-lora'>"Similar to Mac's spotlight, but not just search."</h3><br/>
                <p className='text--regsmall text--bold text-sourcesanspro'>Fake Reviewer 3</p>
              </li>

            </ul>
          </div>
        </section>
        
        {/* CTA Banner */}
        <section id="footer" className="grid-row gutter-width-5 col-width-15 row-center" style={{ padding: '3rem 2rem' }}>
          <div className="col-width-12" style={{ textAlign: 'center' }}>
            <h2 className='heading--h2 text-montserrat' style={{ color: 'var(--secondary-text)', fontSize: '1.75rem', marginBottom: '1rem' }}>
              Ready to take control of your desktop?
            </h2>
            <button
              className="row-center col-height-auto margin--small text-montserrat text-body text--bold bg-highlight text--white"
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform .1s ease-out'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => ctrlSpaceHotkeyAction()}
            >
              Get GhostDeck
            </button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="grid-row col-width-12 row-middle row-center padding--small" style={{background: 'var(--high-contrast-bg)' }}>
          <nav className="col-width-10 col-width-15-sm" style={{ color: 'var(--high-contrast-text)' }}>
            <a className="text-body text--no-decoration text-sourcesanspro" href="#hero">Hero</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a className="text-body text--no-decoration text-sourcesanspro" href="#about">About</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a className="text-body text--no-decoration text-sourcesanspro" href="#features">Features</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a className="text-body text--no-decoration text-sourcesanspro" href="#testimonials">Testimonials</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a className="text-body text--no-decoration text-sourcesanspro" href="#download">Download</a>
          </nav>
          <div className="col-width-5 col-width-0-sm text-align--right" style={{ color: 'var(--high-contrast-text)' }}>
            <strong className=' text-sourcesanspro'>GhostDeck | Invrz</strong> © 2025
          </div>
          <div className="col-width-0-ld col-width-0-sq col-width-15-sm" style={{ color: 'var(--high-contrast-text)' }}>
            <br/>
            <strong className=' text-sourcesanspro'>GhostDeck | Invrz</strong> © 2025
            <br/><br/>
          </div>
        </footer>
        
      </div>

      <div className="window-view padding--small" id="windowviewid">
        <div className="window-title bg-muted-light text-muted">
          <span className="window-title-text">Get GhostDeck</span>
          <button className="window-title-action bg-error border--none border--smooth" onClick={ctrlSpaceHotkeyAction}>&nbsp;&nbsp; X &nbsp;&nbsp;</button>
        </div>
        <div className="window-content bg-body-dark text-body">
          <div className="content-view padding--small">
            <div className="grid-row row-center row-middle col-width-15 col-height-4">
              <a className='icon-link border--circular'>
                <img className="icon-icon inactive-icon" src={AppleLogo} alt="Apple Logo" />
                <p className="icon-tooltip">Coming soon for MacOs</p>
              </a>
              <a className='icon-link border--circular' href="/GhostDeck_Installer.exe" download>
                <img className="icon-icon" src={MicrosoftLogo} alt="Windows Logo" />
                <p className="icon-tooltip">Download now for Windows</p>
              </a>
              <a className='icon-link border--circular'>
                <img className="icon-icon inactive-icon" src={LinuxLogo} alt="Linux Logo" />
                <p className="icon-tooltip">Coming soon for Linux</p>
              </a>
            </div>
            <div className="grid-row row-center row-middle col-width-15 col-height-1">
              <h1 className='ta--center' style={{fontFamily: 'monospace'}}>take control of your desktop</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;