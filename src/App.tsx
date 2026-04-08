const projects = [
  {
    title: "Web Design by Kick",
    tagline: "AI-gedreven webdesign agency voor MKB",
    description:
      "Premium websites in 1–3 weken, 30–60% goedkoper dan traditionele bureaus. Van intake tot live site: geautomatiseerd met een menselijke eindregie.",
    tags: ["Vite", "React", "Tailwind", "AI pipeline"],
    href: "https://webdesign.bykick.nl",
    screenshot: "/shots/webdesign.webp",
    accent: "from-orange-500 to-pink-500",
    year: "2026",
  },
  {
    title: "AI Solutions",
    tagline: "Kickstart je bedrijf met AI chatbots & automations",
    description:
      "Maatwerk AI chatbots en workflow automations voor MKB. Bespaar uren per week, geef klanten 24/7 service en laat AI de repetitieve taken overnemen.",
    tags: ["AI", "Chatbots", "Zapier", "Automation"],
    href: "https://aisolutions.bykick.nl",
    screenshot: "/shots/aisolutions.webp",
    accent: "from-purple-500 to-pink-500",
    year: "2026",
  },
  {
    title: "Agent Mission Control",
    tagline: "Web UI om AI-agents 24/7 te draaien op een VPS",
    description:
      "Jarvis: een mission control voor autonome Claude-agents. Intake → briefing → build → review pipeline met pm2, hooks en live monitoring.",
    tags: ["TypeScript", "Node", "PM2", "Claude Agents"],
    href: "https://jarvis.bykick.nl",
    screenshot: "/shots/jarvis.webp",
    accent: "from-amber-400 to-orange-600",
    year: "2026",
  },
  {
    title: "Puntify",
    tagline: "Gratis huurprijscheck op basis van het WWS",
    description:
      "Bereken in 5 minuten hoeveel punten je woning waard is en wat de maximale huurprijs mag zijn. Volledig up-to-date met de officiële Huurcommissie beleidsboeken 2025/2026.",
    tags: ["React", "Supabase", "WWS/WWSO", "Freemium"],
    href: "https://puntify.nl",
    screenshot: "/shots/puntify.webp",
    accent: "from-blue-500 to-indigo-600",
    year: "2025",
  },
  {
    title: "Compliance Checker",
    tagline: "Weet waar je staat voordat de toezichthouder het vraagt",
    description:
      "NS2 Quick Scan in 3 minuten: direct inzicht in je compliance-score, toezichthouders en belangrijkste gaps. Tot €7.000.000 boetes voorkomen.",
    tags: ["NS2", "Compliance", "Quick Scan", "SaaS"],
    href: "https://compliance-checker.nl",
    screenshot: "/shots/compliance.webp",
    accent: "from-emerald-400 to-teal-600",
    year: "2026",
  },
  {
    title: "MVD Management",
    tagline: "25+ jaar expertise in IT projectmanagement",
    description:
      "Corporate site voor MVD Management B.V. — IT consultancy met focus op ERP, CRM, AI, cybersecurity en digitale transformatie voor grote organisaties.",
    tags: ["Corporate", "IT Consultancy", "ERP", "PMO"],
    href: "https://mvdmanagement.nl",
    screenshot: "/shots/mvd.webp",
    accent: "from-slate-400 to-stone-600",
    year: "2024",
  },
];

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-sunset animate-gradient-shift">
      {/* ambient orbs */}
      <div className="orb bg-orange-500" style={{ width: 500, height: 500, top: -200, left: -150 }} />
      <div className="orb bg-pink-500" style={{ width: 400, height: 400, top: "40%", right: -100 }} />
      <div className="orb bg-amber-400" style={{ width: 350, height: 350, bottom: -120, left: "30%" }} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {/* Header */}
        <header className="flex items-center justify-between opacity-0 animate-fade-up">
          <div className="flex items-center gap-3">
            <img
              src="/pf.webp"
              alt="Kick"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-400/40"
            />
            <div className="font-extrabold text-lg tracking-tight">
              by <span className="text-gradient-sunset">Kick</span>
            </div>
          </div>
          <a
            href="mailto:hi@bykick.nl"
            className="text-sm text-stone-300 hover:text-orange-300 transition-colors"
          >
            hi@bykick.nl
          </a>
        </header>

        {/* Hero */}
        <section className="mt-24 sm:mt-32 opacity-0 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/5 px-4 py-1.5 text-xs font-medium text-orange-200">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Bouwer · Designer · Tinkerer
          </div>
          <h1 className="mt-6 text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
            Ik bouw tools <br />
            die <span className="text-gradient-sunset">écht werken</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-300 leading-relaxed">
            AI-gedreven webdesign voor MKB en een mission control voor autonome agents.
            Twee projecten, één obsessie: menselijk werk automatiseren zonder de ziel eruit te slopen.
          </p>
        </section>

        {/* Projects */}
        <section className="mt-20 sm:mt-28 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-glow group relative rounded-3xl overflow-hidden opacity-0 animate-fade-up flex flex-col"
              style={{ animationDelay: `${0.3 + i * 0.12}s` }}
            >
              {/* Screenshot header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-900/60 border-b border-stone-800/60">
                <img
                  src={p.screenshot}
                  alt={`${p.title} preview`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />
                <span className="absolute top-3 right-3 text-xs text-stone-300 font-mono bg-black/60 backdrop-blur px-2 py-1 rounded-md border border-stone-700/50">
                  {p.year}
                </span>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} shadow-lg shadow-orange-900/30`}
                  >
                    <span className="text-white font-black text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-orange-200/80 font-medium">{p.tagline}</p>
                <p className="mt-4 text-stone-400 leading-relaxed text-sm flex-1">{p.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-stone-800/60 text-stone-300 border border-stone-700/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-300 group-hover:text-orange-200 transition-colors">
                  Bekijk live
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-24 sm:mt-32 pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500 opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <div>© {new Date().getFullYear()} · Gebouwd met koffie en Claude</div>
          <div className="flex gap-5">
            <a href="https://webdesign.bykick.nl" className="hover:text-orange-300 transition-colors">
              webdesign.bykick.nl
            </a>
            <a href="https://jarvis.bykick.nl" className="hover:text-orange-300 transition-colors">
              jarvis.bykick.nl
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
