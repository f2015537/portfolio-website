import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const NAV_LINKS = ["About", "Projects", "Blog", "Skills", "Contact"];

const RESUME_URL = "/resume.pdf"; // ← replace with your hosted PDF URL

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const PROJECTS = [
  {
    name: "Space Finder",
    tag: "Full-stack · AWS · CDK",
    description:
      "Serverless venue listing app built on AWS CDK. Six infrastructure stacks in TypeScript — API Gateway, Lambda, DynamoDB, Cognito, CloudFront, and S3 with direct browser uploads.",
    bullets: [
      "Direct browser-to-S3 uploads via Cognito Identity Pool credentials — backend never in the data path",
      "Per-user DynamoDB isolation enforced at the query layer via Cognito sub claims",
      "Full infra reproducible with three commands: npm install → cdk bootstrap → cdk deploy --all",
    ],
    github: "https://github.com/f2015537/space-finder",
    demo: "https://d24kqex7dx8ru7.cloudfront.net",
    stack: [
      "TypeScript",
      "AWS CDK",
      "React 19",
      "Lambda",
      "DynamoDB",
      "Cognito",
      "CloudFront",
    ],
  },
];

const BLOG_POSTS = [
  {
    title:
      "Building a Serverless Full-Stack App on AWS with CDK: Architecture Decisions and Tradeoffs",
    tag: "AWS · CDK · Serverless",
    date: "2026",
    url: "https://blog.divyampatro.dev//building-a-serverless-full-stack-app-on-aws-with-cdk-architecture-decisions-and-tradeoffs",
  },
];

const SKILLS = [
  { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Vite"] },
  { category: "Backend", items: ["Node.js", "Lambda", "API Gateway", "REST"] },
  {
    category: "Cloud",
    items: ["AWS CDK", "DynamoDB", "S3", "Cognito", "CloudFront", "SNS", "SES"],
  },
  { category: "Tooling", items: ["Git", "GitHub", "Jest", "ESLint"] },
  {
    category: "Concepts",
    items: ["System Design", "Serverless", "Multi-tenancy", "IaC"],
  },
  {
    category: "Writing",
    items: ["Technical blogging", "Architecture docs", "ADRs"],
  },
];

function GridBg() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#1a2535"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #0d1f3c 0%, transparent 70%)",
          opacity: 0.8,
        }}
      />
    </div>
  );
}

function TypeWriter({ text, speed = 38 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      {!done && (
        <span
          style={{
            borderRight: "2px solid #4a9ede",
            marginLeft: 1,
            animation: "blink 1s step-end infinite",
          }}
        >
          &nbsp;
        </span>
      )}
    </span>
  );
}

function LayerTag({ label }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.1em",
        color: "#3a6490",
        padding: "2px 8px",
        border: "0.5px solid #3a6490",
        borderRadius: 3,
      }}
    >
      {label}
    </span>
  );
}

function Pill({ label }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: "#4a9ede",
        background: "rgba(74,158,222,0.08)",
        border: "0.5px solid rgba(74,158,222,0.25)",
        borderRadius: 3,
        padding: "3px 10px",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}

function Section({ id, children, style }) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 860,
        margin: "0 auto",
        padding: "100px 32px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 48,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "#4a9ede",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: "0.5px", background: "#1a2535" }} />
    </div>
  );
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `0.5px solid ${hovered ? "#4a80b0" : "#1a2535"}`,
        borderRadius: 8,
        padding: "32px 36px",
        background: hovered ? "rgba(26,35,53,0.7)" : "rgba(14,17,23,0.5)",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: hovered
            ? "linear-gradient(90deg, transparent, #4a9ede, transparent)"
            : "transparent",
          transition: "all 0.25s ease",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: "#f0f4f8",
            margin: 0,
            fontWeight: 400,
          }}
        >
          {project.name}
        </h3>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#4a80b0",
            letterSpacing: "0.08em",
          }}
        >
          {project.tag}
        </span>
      </div>
      <p
        style={{
          fontSize: 14,
          color: "#8899aa",
          lineHeight: 1.7,
          margin: "0 0 20px",
        }}
      >
        {project.description}
      </p>
      <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none" }}>
        {project.bullets.map((b, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: 10,
              fontSize: 13,
              color: "#8095a8",
              lineHeight: 1.65,
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#4a80b0", flexShrink: 0, marginTop: 1 }}>
              →
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}
      >
        {project.stack.map((s) => (
          <Pill key={s} label={s} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#4a9ede",
            textDecoration: "none",
            letterSpacing: "0.06em",
            borderBottom: "0.5px solid rgba(74,158,222,0.3)",
            paddingBottom: 1,
          }}
        >
          GitHub →
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#4a9ede",
            textDecoration: "none",
            letterSpacing: "0.06em",
            borderBottom: "0.5px solid rgba(74,158,222,0.3)",
            paddingBottom: 1,
          }}
        >
          Live Demo →
        </a>
      </div>
    </div>
  );
}

function BlogCard({ post }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `0.5px solid ${hovered ? "#4a80b0" : "#1a2535"}`,
          borderRadius: 8,
          padding: "28px 32px",
          background: hovered ? "rgba(26,35,53,0.7)" : "rgba(14,17,23,0.5)",
          transition: "all 0.25s ease",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#4a80b0",
              margin: "0 0 8px",
              letterSpacing: "0.08em",
            }}
          >
            {post.tag}
          </p>
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 18,
              color: "#f0f4f8",
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            {post.title}
          </h3>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: hovered ? "#4a9ede" : "#4a80b0",
            transition: "color 0.2s",
            flexShrink: 0,
          }}
        >
          Read →
        </span>
      </div>
    </a>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("About");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((l) => document.getElementById(l));
      const scrollY = window.scrollY + 120;
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
      if (atBottom) {
        setActiveSection("Contact");
        return;
      }
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollY) {
          setActiveSection(NAV_LINKS[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      style={{
        background: "#0a0e15",
        minHeight: "100vh",
        color: "#f0f4f8",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0e15; }
        ::-webkit-scrollbar-thumb { background: #3a6490; border-radius: 2px; }
        a { color: inherit; }
        ::selection { background: rgba(74,158,222,0.25); }
        .nav-links { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <GridBg />

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: "0.5px solid #1a2535",
          background: "rgba(10,14,21,0.85)",
          backdropFilter: "blur(12px)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            letterSpacing: "0.08em",
            color: "#4a9ede",
          }}
        >
          divyampatro<span style={{ color: "#4a80b0" }}>.dev</span>
        </span>

        {/* Desktop nav */}
        <div className="nav-links" style={{ gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.08em",
                color: activeSection === link ? "#4a9ede" : "#607d96",
                transition: "color 0.2s",
                padding: "4px 0",
                borderBottom:
                  activeSection === link
                    ? "0.5px solid #4a9ede"
                    : "0.5px solid transparent",
              }}
            >
              {link}
            </button>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.08em",
              padding: "5px 14px",
              borderRadius: 4,
              border: "0.5px solid #4a80b0",
              color: "#4a9ede",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a9ede"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#4a80b0"; }}
          >
            Resume ↗
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            padding: 4,
          }}
        >
          {menuOpen ? (
            <>
              <span style={{ width: 22, height: 1.5, background: "#4a9ede", transform: "rotate(45deg) translate(4.5px, 4.5px)", display: "block" }} />
              <span style={{ width: 22, height: 1.5, background: "#4a9ede", transform: "rotate(-45deg) translate(4.5px, -4.5px)", display: "block" }} />
            </>
          ) : (
            <>
              <span style={{ width: 22, height: 1.5, background: "#4a9ede", display: "block" }} />
              <span style={{ width: 22, height: 1.5, background: "#4a9ede", display: "block" }} />
              <span style={{ width: 22, height: 1.5, background: "#4a9ede", display: "block" }} />
            </>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            zIndex: 99,
            background: "rgba(10,14,21,0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: "0.5px solid #1a2535",
            display: "flex",
            flexDirection: "column",
            padding: "16px 32px 24px",
            gap: 4,
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                letterSpacing: "0.08em",
                color: activeSection === link ? "#4a9ede" : "#8095a8",
                padding: "12px 0",
                textAlign: "left",
                borderBottom: "0.5px solid #1a2535",
              }}
            >
              {link}
            </button>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              letterSpacing: "0.08em",
              color: "#4a9ede",
              textDecoration: "none",
              padding: "12px 0",
              marginTop: 4,
            }}
          >
            Resume ↗
          </a>
        </div>
      )}

      {/* HERO */}
      <section
        id="About"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          maxWidth: 860,
          margin: "0 auto",
          padding: "120px 32px 80px",
        }}
      >
        <div style={{ animation: "fadeUp 0.9s ease both" }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            <LayerTag label="// layer 0 — presentation" />
            <LayerTag label="// layer 1 — application" />
            <LayerTag label="// layer 2 — domain" />
            <LayerTag label="// layer 3 — infrastructure" />
          </div>

          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              color: "#4a80b0",
              letterSpacing: "0.1em",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            Hello, I'm
          </p>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(48px, 8vw, 80px)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "#f0f4f8",
              marginBottom: 24,
              letterSpacing: "-0.5px",
            }}
          >
            Divyam Patro
          </h1>

          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(18px, 2.5vw, 24px)",
              color: "#4a9ede",
              marginBottom: 32,
              fontWeight: 400,
              lineHeight: 1.4,
              fontStyle: "italic",
            }}
          >
            <TypeWriter text="Fullstack engineer specialising in cloud architecture, system design, and AI." />
          </p>

          <p
            style={{
              fontSize: 15,
              color: "#8095a8",
              lineHeight: 1.8,
              maxWidth: 560,
              marginBottom: 48,
            }}
          >
            I build production-grade fullstack systems and write precisely about
            the architecture decisions, tradeoffs, and reasoning behind them.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => scrollTo("Projects")}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.08em",
                padding: "12px 28px",
                borderRadius: 4,
                background: "#4a9ede",
                border: "none",
                color: "#0a0e15",
                cursor: "pointer",
                fontWeight: 500,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
              onMouseLeave={(e) => (e.target.style.opacity = 1)}
            >
              View Projects
            </button>

            <a
              href="https://blog.divyampatro.dev/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.08em",
                padding: "12px 28px",
                borderRadius: 4,
                background: "transparent",
                border: "0.5px solid #4a80b0",
                color: "#4a9ede",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4a9ede";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#4a80b0";
              }}
            >
              Read the Blog
            </a>

            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.08em",
                padding: "12px 28px",
                borderRadius: 4,
                background: "transparent",
                border: "0.5px solid #4a80b0",
                color: "#4a9ede",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4a9ede";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#4a80b0";
              }}
            >
              Resume ↗
            </a>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <Section id="Projects">
        <SectionLabel>// Projects</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {PROJECTS.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#4a80b0",
            marginTop: 32,
            letterSpacing: "0.06em",
          }}
        >
          More on{" "}
          <a
            href="https://github.com/f2015537"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4a9ede",
              textDecoration: "none",
              borderBottom: "0.5px solid rgba(74,158,222,0.3)",
            }}
          >
            github.com/f2015537 →
          </a>
        </p>
      </Section>

      {/* BLOG */}
      <Section id="Blog">
        <SectionLabel>// Blog — The Stack Depth</SectionLabel>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {BLOG_POSTS.map((p) => (
            <BlogCard key={p.title} post={p} />
          ))}
        </div>
        <a
          href="https://blog.divyampatro.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#4a9ede",
            textDecoration: "none",
            letterSpacing: "0.06em",
            borderBottom: "0.5px solid rgba(74,158,222,0.3)",
          }}
        >
          All posts on blog.divyampatro.dev →
        </a>
      </Section>

      {/* SKILLS */}
      <Section id="Skills">
        <SectionLabel>// Skills & Stack</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {SKILLS.map((group) => (
            <div
              key={group.category}
              style={{
                border: "0.5px solid #1a2535",
                borderRadius: 8,
                padding: "20px 24px",
                background: "rgba(14,17,23,0.4)",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#4a80b0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {group.category}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: "#8095a8",
                      background: "rgba(26,35,53,0.6)",
                      border: "0.5px solid #1a2535",
                      borderRadius: 3,
                      padding: "4px 10px",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="Contact" style={{ paddingBottom: 140 }}>
        <SectionLabel>// Contact</SectionLabel>
        <div style={{ maxWidth: 540 }}>
          <p
            style={{
              fontSize: 15,
              color: "#8095a8",
              lineHeight: 1.8,
              marginBottom: 40,
            }}
          >
            Available for fullstack engineering roles and consulting engagements
            — remote, worldwide. If you want someone who thinks deeply about
            architecture and writes clearly about it, let's talk.
          </p>

          {sent ? (
            <div
              style={{
                border: "0.5px solid #1d6a3a",
                borderRadius: 8,
                padding: "28px 32px",
                background: "rgba(14,17,23,0.5)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "#3dba6f",
                letterSpacing: "0.06em",
              }}
            >
              ✓ Message sent. I'll get back to you shortly.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  key: "name",
                  label: "Name",
                  type: "text",
                  placeholder: "Your name",
                },
                {
                  key: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "your@email.com",
                },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: "#4a80b0",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formState[key]}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, [key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      background: "rgba(14,17,23,0.6)",
                      border: "0.5px solid #1a2535",
                      borderRadius: 4,
                      padding: "12px 16px",
                      color: "#f0f4f8",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4a80b0")}
                    onBlur={(e) => (e.target.style.borderColor = "#1a2535")}
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#4a80b0",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: 8,
                    textTransform: "uppercase",
                  }}
                >
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="What are you working on?"
                  value={formState.message}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, message: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: "rgba(14,17,23,0.6)",
                    border: "0.5px solid #1a2535",
                    borderRadius: 4,
                    padding: "12px 16px",
                    color: "#f0f4f8",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#4a80b0")}
                  onBlur={(e) => (e.target.style.borderColor = "#1a2535")}
                />
              </div>
              {sendError && (
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: "#e05c5c",
                    letterSpacing: "0.04em",
                  }}
                >
                  {sendError}
                </p>
              )}
              <button
                disabled={sending}
                onClick={async () => {
                  if (!formState.name || !formState.email || !formState.message)
                    return;
                  setSending(true);
                  setSendError(null);
                  try {
                    await emailjs.send(
                      EMAILJS_SERVICE_ID,
                      EMAILJS_TEMPLATE_ID,
                      {
                        title: formState.name,
                        name: formState.name,
                        from_email: formState.email,
                        message: formState.message,
                      },
                      EMAILJS_PUBLIC_KEY,
                    );
                    setSent(true);
                  } catch {
                    setSendError("Something went wrong. Please try again.");
                  } finally {
                    setSending(false);
                  }
                }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  padding: "13px 32px",
                  borderRadius: 4,
                  background: "#4a9ede",
                  border: "none",
                  color: "#0a0e15",
                  cursor: sending ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  alignSelf: "flex-start",
                  transition: "opacity 0.2s",
                  opacity: sending ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!sending) e.target.style.opacity = 0.85;
                }}
                onMouseLeave={(e) => {
                  if (!sending) e.target.style.opacity = 1;
                }}
              >
                {sending ? "Sending…" : "Send Message"}
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: 48,
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "GitHub", url: "https://github.com/f2015537" },
              { label: "LinkedIn", url: "https://www.linkedin.com/in/divyampatro/" },
              { label: "Blog", url: "https://blog.divyampatro.dev" },
              { label: "Resume", url: RESUME_URL },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: "#4a9ede",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  borderBottom: "0.5px solid rgba(74,158,222,0.3)",
                }}
              >
                {label} →
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "0.5px solid #1a2535",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#3a6490",
            letterSpacing: "0.06em",
          }}
        >
          © 2026 Divyam Patro
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#3a6490",
            letterSpacing: "0.06em",
          }}
        >
          Built with React · divyampatro.dev
        </span>
      </footer>
    </div>
  );
}
