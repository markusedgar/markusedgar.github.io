import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown } from "@phosphor-icons/react/ArrowDown";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { CirclesThreePlus } from "@phosphor-icons/react/CirclesThreePlus";
import { Cpu } from "@phosphor-icons/react/Cpu";
import { Desktop } from "@phosphor-icons/react/Desktop";
import { List } from "@phosphor-icons/react/List";
import { Moon } from "@phosphor-icons/react/Moon";
import { Sun } from "@phosphor-icons/react/Sun";
import { UsersThree } from "@phosphor-icons/react/UsersThree";
import { X } from "@phosphor-icons/react/X";
import { labNotes, lenses, projectBySlug, projects } from "./content.js";

const navItems = [
  ["Work", "/work"],
  ["Lab Log", "/lab"],
  ["Books + Methods", "/work?lens=Publish"],
  ["About", "/about"],
];

function cleanPath(pathname) {
  if (!pathname || pathname === "/index.html") return "/";
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function currentLocation() {
  return `${cleanPath(window.location.pathname)}${window.location.search}`;
}

function usePath() {
  const [location, setLocation] = useState(currentLocation);

  useEffect(() => {
    const onPopState = () => setLocation(currentLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return [location, setLocation];
}

function SmartLink({ href, children, className = "", onNavigate, ...props }) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const handleClick = (event) => {
    if (external || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({}, "", href);
    window.scrollTo({ top: 0, behavior: "auto" });
    onNavigate?.(currentLocation());
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

function ThemeControl() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const choices = [
    ["light", Sun],
    ["system", Desktop],
    ["dark", Moon],
  ];

  return (
    <div className="theme-control" aria-label="Color theme">
      {choices.map(([value, Icon]) => (
        <button
          key={value}
          type="button"
          className={theme === value ? "is-active" : ""}
          aria-label={`Use ${value} theme`}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          <Icon size={15} weight="regular" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function Header({ path, requestedLens, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const coveredContent = [
      document.querySelector(".skip-link"),
      document.getElementById("main-content"),
      ...document.querySelectorAll(".site-footer"),
    ].filter((element, index, elements) => element && elements.indexOf(element) === index);

    coveredContent.forEach((element) => { element.inert = menuOpen; });

    const focusableElements = () => [
      menuToggleRef.current,
      ...navRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    ].filter(Boolean);

    const handleMenuKeys = (event) => {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        requestAnimationFrame(() => menuToggleRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = focusableElements();
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

    if (menuOpen) requestAnimationFrame(() => navRef.current?.querySelector("a")?.focus());
    window.addEventListener("keydown", handleMenuKeys);
    return () => {
      document.body.style.overflow = "";
      coveredContent.forEach((element) => { element.inert = false; });
      window.removeEventListener("keydown", handleMenuKeys);
    };
  }, [menuOpen]);

  const isActive = (label) => {
    if (label === "Books + Methods") return path === "/work" && requestedLens === "Publish";
    if (label === "Work") return path.startsWith("/work") && !(path === "/work" && requestedLens === "Publish");
    if (label === "Lab Log") return path === "/lab";
    if (label === "About") return path === "/about";
    return false;
  };

  return (
    <header className="site-header">
      <SmartLink href="/" className="wordmark" onNavigate={onNavigate}>
        MARKUS EDGAR HORMEẞ
      </SmartLink>
      <button
        ref={menuToggleRef}
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((value) => !value)}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
      >
        {menuOpen ? <X size={21} /> : <List size={21} />}
        <span>{menuOpen ? "CLOSE" : "MENU"}</span>
      </button>
      <nav ref={navRef} id="primary-navigation" className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Primary">
        {navItems.map(([label, href]) => {
          const active = isActive(label);
          return (
            <SmartLink key={label} href={href} onNavigate={onNavigate} aria-current={active ? "page" : undefined}>
              {label}
            </SmartLink>
          );
        })}
        <ThemeControl />
      </nav>
    </header>
  );
}

function Status({ children, quiet = false }) {
  return <span className={quiet ? "status status--quiet" : "status"}>{children}</span>;
}

function InquiryDiagram() {
  const nodes = [
    ["PEOPLE", UsersThree],
    ["AI SYSTEMS", Cpu],
    ["CONTEXT", CirclesThreePlus],
  ];
  return (
    <div className="inquiry-diagram" aria-label="People, AI systems, and context connected in a feedback loop">
      {nodes.map(([label, Icon], index) => (
        <div className="diagram-node-wrap" key={label}>
          <div className="diagram-node">
            <Icon size={38} weight="thin" aria-hidden="true" />
          </div>
          <span>{label}</span>
          {index < nodes.length - 1 && <span className="diagram-connector" aria-hidden="true" />}
        </div>
      ))}
      <div className="feedback-line" aria-hidden="true">
        <ArrowDown size={14} />
        <span />
        <ArrowDown size={14} />
      </div>
    </div>
  );
}

function ProjectVisual({ project, compact = false }) {
  if (project.image) {
    return (
      <figure className={compact ? "project-image project-image--compact" : "project-image"}>
        <img src={project.image} alt={project.imageAlt} />
        {!compact && <figcaption>{project.credit}</figcaption>}
      </figure>
    );
  }

  return (
    <div className={`project-poster ${compact ? "project-poster--compact" : ""} poster--${project.accent || "paper"}`} aria-label={`${project.title} typographic poster`}>
      <span>{project.code}</span>
      <strong>{project.shortTitle}</strong>
      <small>{project.format}</small>
    </div>
  );
}

function WorkbenchRow({ project, onNavigate }) {
  return (
    <SmartLink href={`/work/${project.slug}`} onNavigate={onNavigate} className="workbench-item">
      <ProjectVisual project={project} compact />
      <div className="workbench-copy">
        <div className="record-meta">
          <span>{project.code}</span>
          <span>{project.period}</span>
        </div>
        <h3>{project.shortTitle}</h3>
        <p>{project.format}</p>
        <Status quiet>{project.state}</Status>
      </div>
      <ArrowRight className="record-arrow" size={22} aria-hidden="true" />
    </SmartLink>
  );
}

function Home({ onNavigate }) {
  const current = projects[0];
  const shelf = [projects[0], projects[1], projects[4]];

  useEffect(() => {
    document.title = "Markus Edgar Hormeß — Strategic Prototyping + Teaming with AI";
  }, []);

  return (
    <>
      <main id="main-content">
        <section className="hero" aria-labelledby="home-title">
          <div className="hero-evidence">
            <img
              src="/images/global-service-jam-ube-opening.jpg"
              alt="Global Service Jam participants discussing around workshop tables in Baguio."
            />
            <div className="image-credit">UBE JAM / CC BY</div>
          </div>
          <div className="hero-proposition">
            <div className="eyebrow"><span>CURRENT INQUIRY</span><span>{current.code}</span></div>
            <h1 id="home-title">EXPERIENCE<br />THE FUTURE.<br />DON’T JUST<br />TALK ABOUT IT.</h1>
            <div className="signal-rule" />
            <p>{current.dek}</p>
            <Status>{current.state}</Status>
            <InquiryDiagram />
            <SmartLink href={`/work/${current.slug}`} onNavigate={onNavigate} className="primary-action">
              ENTER THE INQUIRY <ArrowRight size={19} weight="bold" aria-hidden="true" />
            </SmartLink>
          </div>
        </section>

        <section className="workbench" aria-labelledby="workbench-title">
          <div className="section-label">
            <h2 id="workbench-title">FROM THE WORKBENCH</h2>
            <SmartLink href="/work" onNavigate={onNavigate}>VIEW ALL {projects.length} RECORDS <ArrowRight size={14} /></SmartLink>
          </div>
          <div className="workbench-grid">
            {shelf.map((project) => <WorkbenchRow key={project.code} project={project} onNavigate={onNavigate} />)}
          </div>
        </section>

        <section className="home-thesis ruled-section">
          <div className="section-kicker">THE LINEAGE / THE QUESTION</div>
          <p className="thesis-large">We learned how to design and make change <em>with people.</em></p>
          <p className="thesis-large thesis-large--shift">Now we are exploring what changes when <em>AI joins the team.</em></p>
        </section>

        <section className="home-index ruled-section" aria-labelledby="home-index-title">
          <div>
            <div className="section-kicker">PUBLISH / GATHER / TEACH / PRACTICE / EXPERIMENT</div>
            <h2 id="home-index-title">ONE BODY OF WORK.<br />FIVE WAYS IN.</h2>
          </div>
          <div className="lens-list">
            {lenses.slice(1).map((lens, index) => (
              <SmartLink key={lens} href={`/work?lens=${lens}`} onNavigate={onNavigate}>
                <span>0{index + 1}</span><strong>{lens}</strong><ArrowRight size={18} />
              </SmartLink>
            ))}
          </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
}

function WorkIndex({ onNavigate, requestedLens }) {
  const initialLens = requestedLens || "All";
  const [activeLens, setActiveLens] = useState(lenses.includes(initialLens) ? initialLens : "All");
  const filtered = useMemo(
    () => activeLens === "All" ? projects : projects.filter((project) => project.lenses.includes(activeLens)),
    [activeLens],
  );

  useEffect(() => { document.title = "Work — Markus Edgar Hormeß"; }, []);
  useEffect(() => {
    setActiveLens(lenses.includes(requestedLens) ? requestedLens : "All");
  }, [requestedLens]);

  const selectLens = (lens) => {
    setActiveLens(lens);
    const suffix = lens === "All" ? "" : `?lens=${encodeURIComponent(lens)}`;
    window.history.replaceState({}, "", `/work${suffix}`);
    onNavigate(currentLocation());
  };

  return (
    <main id="main-content" className="page-shell">
      <header className="page-intro">
        <div className="eyebrow"><span>WORK INDEX</span><span>{String(projects.length).padStart(2, "0")} RECORDS</span></div>
        <h1>WORK THAT<br />LEAVES A TRACE.</h1>
        <p>Books, communities, teaching, workshops, and experiments—connected as one evolving practice.</p>
      </header>
      <div className="filter-bar" role="group" aria-label="Filter work by editorial lens">
        {lenses.map((lens) => (
          <button key={lens} type="button" className={activeLens === lens ? "is-active" : ""} onClick={() => selectLens(lens)}>
            {lens} <span>{lens === "All" ? projects.length : projects.filter((project) => project.lenses.includes(lens)).length}</span>
          </button>
        ))}
      </div>
      <div className="record-list" aria-live="polite">
        {filtered.map((project) => (
          <SmartLink key={project.code} href={`/work/${project.slug}`} onNavigate={onNavigate} className="record-row">
            <div className="record-code"><span>{project.code}</span><Status quiet>{project.state}</Status></div>
            <h2>{project.title}</h2>
            <p>{project.format}</p>
            <span className="record-period">{project.period}</span>
            <ArrowRight size={21} className="record-arrow" aria-hidden="true" />
          </SmartLink>
        ))}
      </div>
      <Footer onNavigate={onNavigate} />
    </main>
  );
}

function ProjectPage({ project, onNavigate }) {
  useEffect(() => { document.title = `${project.title} — Markus Edgar Hormeß`; }, [project.title]);
  const related = projects.filter((item) => item.slug !== project.slug && item.lenses.some((lens) => project.lenses.includes(lens))).slice(0, 3);

  return (
    <main id="main-content" className="page-shell project-page">
      <header className="project-header">
        <div className="eyebrow"><span>{project.code} / {project.format}</span><span>{project.period}</span></div>
        <div className="project-title-grid">
          <div>
            <Status>{project.state}</Status>
            <h1>{project.title}</h1>
            <p className="project-dek">{project.dek}</p>
          </div>
          <ProjectVisual project={project} />
        </div>
      </header>

      <section className="project-question ruled-section">
        <div className="section-kicker">THE QUESTION</div>
        <blockquote>{project.question}</blockquote>
      </section>

      <section className="project-context ruled-section">
        <div>
          <div className="section-kicker">CONTEXT</div>
          <p className="body-large">{project.description}</p>
        </div>
        <dl className="project-facts">
          <div><dt>ROLE</dt><dd>{project.contribution}</dd></div>
          <div><dt>MODE</dt><dd>{project.lenses.join(" / ")}</dd></div>
          <div><dt>STATE</dt><dd>{project.state}</dd></div>
          <div><dt>SOURCE</dt><dd><SmartLink href={project.href}>{project.sourceLabel} <ArrowRight size={14} /></SmartLink></dd></div>
        </dl>
      </section>

      <section className="project-takeaways ruled-section">
        <div className="section-kicker">WHAT IT LEAVES BEHIND</div>
        <ol>
          {project.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
        </ol>
      </section>

      <section className="related ruled-section">
        <div className="section-label"><h2>FOLLOW THE THREAD</h2><span>{project.lenses.join(" + ")}</span></div>
        <div className="related-grid">
          {related.map((item) => <WorkbenchRow key={item.code} project={item} onNavigate={onNavigate} />)}
        </div>
      </section>
      <Footer onNavigate={onNavigate} />
    </main>
  );
}

function LabLog({ onNavigate }) {
  useEffect(() => { document.title = "Lab Log — Markus Edgar Hormeß"; }, []);
  return (
    <main id="main-content" className="page-shell">
      <header className="page-intro page-intro--lab">
        <div className="eyebrow"><span>LAB LOG</span><span>OPEN / DATED / ACCOUNTABLE</span></div>
        <h1>NOT FINISHED.<br />USEFUL ALREADY.</h1>
        <p>Working notes from the edge of the practice. Each one names its state and points back to the work.</p>
      </header>
      <div className="lab-list">
        {labNotes.map((note) => (
          <article key={note.code} className="lab-note">
            <div className="lab-meta"><span>{note.code}</span><span>{note.date}</span></div>
            <div><Status>{note.state}</Status><span className="lab-lens">{note.lens}</span></div>
            <h2>{note.title}</h2>
            <p>{note.text}</p>
            <SmartLink href={`/work/${note.projectSlug}`} onNavigate={onNavigate}>FOLLOW THE WORK <ArrowRight size={15} /></SmartLink>
          </article>
        ))}
      </div>
      <Footer onNavigate={onNavigate} />
    </main>
  );
}

function About({ onNavigate }) {
  useEffect(() => { document.title = "About — Markus Edgar Hormeß"; }, []);
  return (
    <main id="main-content" className="page-shell">
      <header className="about-header">
        <div className="eyebrow"><span>ABOUT</span><span>DIPL.-PHYS. / DESIGNER / EDUCATOR</span></div>
        <h1>PRECISE ABOUT<br />THE QUESTION.<br />PLAYFUL ABOUT<br />THE ROUTE.</h1>
      </header>
      <section className="about-grid ruled-section">
        <div className="about-lead">
          <p>Markus Edgar Hormeß is a consultant, practitioner, author, and educator working across service design, innovation, strategic prototyping, and AI-enabled collaboration.</p>
        </div>
        <div className="about-body">
          <p>His work helps organizations tackle complex business problems and make team cultures more agile and human-centered. The focal point is strategic prototyping: pushing what a dedicated team can achieve with limited resources.</p>
          <p>With a background in theoretical physics, Markus works across the perceived boundaries between technology, design, and business. He believes cheap experiments and prototypes can move a strategy, team, or project forward more efficiently than another round of abstract discussion.</p>
          <p>He is a partner at WorkPlayExperience, co-initiator of the Global Jams, co-author of <em>This is Service Design Doing</em> and <em>This is Service Design Methods</em>, and co-initiator of Teaming with AI.</p>
        </div>
      </section>
      <section className="about-principles ruled-section">
        <div className="section-kicker">WORKING PRINCIPLES</div>
        <div className="principle-grid">
          {["DOING / NOT TALKING", "HUMAN / TECHNOLOGY", "CHEAP / CONSEQUENTIAL", "SERIOUS / PLAYFUL"].map((item, index) => (
            <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>
          ))}
        </div>
      </section>
      <section className="contact-strip">
        <div><span>AVAILABLE FOR</span><strong>TALKS / TEACHING / STRATEGIC PROTOTYPING</strong></div>
        <SmartLink href="mailto:markus@workplayexperience.com" className="primary-action">START A CONVERSATION <ArrowRight size={19} /></SmartLink>
      </section>
      <Footer onNavigate={onNavigate} />
    </main>
  );
}

function NotFound({ onNavigate }) {
  return (
    <main id="main-content" className="not-found">
      <span>404 / NO RECORD</span>
      <h1>NOT HERE.<br />STILL USEFUL.</h1>
      <SmartLink href="/work" onNavigate={onNavigate} className="primary-action">RETURN TO THE WORK <ArrowRight size={19} /></SmartLink>
    </main>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div><span>MARKUS EDGAR HORMEẞ</span><span>SCHWAIG / GERMANY</span></div>
      <div>
        <SmartLink href="mailto:markus@workplayexperience.com">EMAIL</SmartLink>
        <SmartLink href="https://www.linkedin.com/in/markushormess/">LINKEDIN</SmartLink>
        <SmartLink href="/about" onNavigate={onNavigate}>ABOUT</SmartLink>
      </div>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  );
}

export function App() {
  const [location, setLocation] = usePath();
  const [path, query = ""] = location.split("?");
  const requestedLens = new URLSearchParams(query).get("lens") || "All";

  useEffect(() => {
    const main = document.getElementById("main-content");
    main?.setAttribute("tabindex", "-1");
    main?.focus({ preventScroll: true });
  }, [path]);

  let page;
  if (path === "/") page = <Home onNavigate={setLocation} />;
  else if (path === "/work") page = <WorkIndex onNavigate={setLocation} requestedLens={requestedLens} />;
  else if (path === "/lab") page = <LabLog onNavigate={setLocation} />;
  else if (path === "/about") page = <About onNavigate={setLocation} />;
  else if (path.startsWith("/work/")) {
    const project = projectBySlug(path.slice("/work/".length));
    page = project ? <ProjectPage project={project} onNavigate={setLocation} /> : <NotFound onNavigate={setLocation} />;
  } else page = <NotFound onNavigate={setLocation} />;

  return (
    <>
      <a href="#main-content" className="skip-link">SKIP TO CONTENT</a>
      <Header path={path} requestedLens={requestedLens} onNavigate={setLocation} />
      {page}
    </>
  );
}
