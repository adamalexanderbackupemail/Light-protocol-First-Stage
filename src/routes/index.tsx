import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChipCard, type ChipModule } from "@/components/ChipCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIGHT Protocol first stage" },
      { name: "description", content: "A calm, minimal operating system for civilization-scale engineering. Modules revealed on request." },
      { property: "og:title", content: "LIGHT Protocol first stage" },
      { property: "og:description", content: "A calm, minimal operating system for civilization-scale engineering. Modules revealed on request." },
    ],
  }),
  component: Home,
});

const MODULES: ChipModule[] = [
  { path: "/civilization", code: "CIV·01", title: "Civilization", desc: "Generation-driven evolution of species, industry and knowledge.", status: "online", progress: 0.72, accent: "mint" },
  { path: "/fleet",        code: "FLT·02", title: "Fleet",        desc: "Ship lineage, engine history and orbital deployment.",             status: "online", progress: 0.54, accent: "ice" },
  { path: "/scanner",      code: "SCN·03", title: "Scanner",      desc: "Procedural graphics engine across ten resonant modes.",           status: "online", progress: 0.88, accent: "cyan" },
  { path: "/industry",     code: "IND·04", title: "Industry",     desc: "Harmonic manufacturing and quiet production graphs.",             status: "build",  progress: 0.41, accent: "amber" },
  { path: "/research",     code: "RES·05", title: "Research",     desc: "Fractal knowledge trees and thoughtful compression.",             status: "online", progress: 0.66, accent: "emerald" },
  { path: "/fps",          code: "FPS·06", title: "FPS",          desc: "Mission command, armor, exosuits, gundams.",                      status: "idle",   progress: 0.22, accent: "coral" },
  { path: "/space",        code: "SPC·07", title: "Space",        desc: "Galaxy map, orbital ops and colonization.",                       status: "online", progress: 0.61, accent: "ice" },
  { path: "/species",      code: "SPS·08", title: "Species",      desc: "Evolutionary lineage and adaptation.",                            status: "online", progress: 0.48, accent: "mint" },
  { path: "/ai",           code: "AI·09",  title: "AI",           desc: "Neural runtime and tier progression.",                            status: "online", progress: 0.79, accent: "violet" },
  { path: "/engine",       code: "ENG·10", title: "Engine",       desc: "Scene graph, animation graph and module library.",                status: "online", progress: 0.58, accent: "cyan" },
  { path: "/runtime",      code: "RUN·11", title: "Runtime",      desc: "Live diagnostics: FPS, memory, animation load.",                  status: "online", progress: 0.9,  accent: "emerald" },
  { path: "/developer",    code: "DEV·12", title: "Developer",    desc: "Introspection tools and module registry.",                        status: "idle",   progress: 0.35, accent: "amber" },
];

const PAGE_SIZE = 10;

function Home() {
  const [page, setPage] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MODULES;
    return MODULES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q)
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const start = clampedPage * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const active = MODULES.slice(0, 4);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 sm:px-10 sm:pt-16">
      {/* Home header — only what's currently useful */}
      <section className="grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-end">
        <div className="animate-fade-slide">
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            {date}
          </div>
          <h1 className="mt-3 text-5xl font-extralight leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Good day.
          </h1>
          <p className="mt-4 max-w-md text-base font-light text-muted-foreground sm:text-lg">
            LIGHT OS Ω · Genesis Project. Everything else is hidden until you ask.
          </p>
        </div>

        <div className="animate-fade-slide flex flex-col items-start gap-4 sm:items-end">
          <div className="font-mono text-5xl font-extralight tabular-nums text-foreground sm:text-6xl">
            {time}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--mint)] animate-signal-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Runtime nominal
            </span>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mt-12 animate-fade-slide">
        <label className="ceramic-card flex items-center gap-4 rounded-full px-6 py-4">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search modules, blueprints, systems…"
            className="w-full bg-transparent text-base font-light outline-none placeholder:text-muted-foreground"
          />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:inline">
            ⌘ K
          </span>
        </label>
      </section>

      {/* Active modules — quiet strip */}
      <section className="mt-14 animate-fade-slide">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-mono uppercase tracking-[0.35em] text-muted-foreground">
            Active
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {active.length} running
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((m) => (
            <Link key={m.path} to={m.path} className="group flex items-center gap-3 rounded-full border border-border bg-plate px-4 py-3 transition-colors hover:border-foreground/20">
              <span className="h-2 w-2 rounded-full" style={{ background: `var(--${m.accent})` }} />
              <span className="truncate text-sm font-light">{m.title}</span>
              <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground">
                {Math.round(m.progress * 100)}%
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Modules — paginated 10/page */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.35em] text-muted-foreground">
              Modules
            </h2>
            <p className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
              {filtered.length === MODULES.length
                ? "All systems, revealed only when needed."
                : `${filtered.length} matching ${filtered.length === 1 ? "system" : "systems"}.`}
            </p>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:block">
            Page {clampedPage + 1} / {pageCount}
          </span>
        </div>

        <div key={clampedPage} className="mt-8 grid animate-fade-slide gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {visible.map((m) => (
            <ChipCard key={m.path} mod={m} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">No modules match “{query}”.</p>
          </div>
        )}

        {pageCount > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Module pages">
            <PagerButton
              disabled={clampedPage === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              label="◀ Previous"
            />
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-current={i === clampedPage ? "page" : undefined}
                  className={
                    "h-9 min-w-9 rounded-full px-3 font-mono text-xs tabular-nums transition-all " +
                    (i === clampedPage
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted")
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <PagerButton
              disabled={clampedPage >= pageCount - 1}
              onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
              label="Next ▶"
            />
          </nav>
        )}
      </section>
    </main>
  );
}

function PagerButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-border bg-plate px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
