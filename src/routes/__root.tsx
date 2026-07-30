import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { EveOrb } from "../components/EveOrb";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">Signal Lost</div>
        <h1 className="mt-4 font-mono text-7xl text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Requested runtime module could not be resolved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center rounded border border-signal px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-signal hover:bg-signal hover:text-background">
            Return to Genesis
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-destructive">Runtime Fault</div>
        <h1 className="mt-4 text-xl font-medium tracking-tight text-foreground">Module failed to initialize</h1>
        <p className="mt-2 text-sm text-muted-foreground">The subsystem returned an unhandled state. Reboot the module or return to the shell.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded border border-signal px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-signal hover:bg-signal hover:text-background"
          >Reboot module</button>
          <a href="/" className="rounded border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:bg-plate-raised">Return home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LIGHT Protocol first stage" },
      { name: "description", content: "A calm, minimal operating system for civilization-scale engineering. Modules revealed on request." },
      { property: "og:title", content: "LIGHT Protocol first stage" },
      { property: "og:description", content: "A calm, minimal operating system for civilization-scale engineering. Modules revealed on request." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LIGHT Protocol first stage" },
      { name: "twitter:description", content: "A calm, minimal operating system for civilization-scale engineering. Modules revealed on request." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a8b01b79-0e2d-4cb8-850e-d999c5d20c80/id-preview-ca15ac83--e143ed2a-baae-4907-ae31-2ea4ad767b4d.lovable.app-1785298996918.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a8b01b79-0e2d-4cb8-850e-d999c5d20c80/id-preview-ca15ac83--e143ed2a-baae-4907-ae31-2ea4ad767b4d.lovable.app-1785298996918.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <TopBar />
        <Outlet />
        <EveOrb />
      </div>
    </QueryClientProvider>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-6 w-6 place-items-center rounded-full border border-border bg-plate">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--mint)] animate-signal-pulse" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground">LIGHT OS Ω</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:inline">Genesis</span>
        </Link>
        <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <Link to="/core" className="rounded border border-signal/60 px-3 py-1.5 text-signal hover:bg-signal hover:text-background">Enter Core</Link>
          <Link to="/hierarchy" className="hidden hover:text-signal sm:inline">Hierarchy</Link>
          <span className="hidden sm:inline">Notifications</span>


          <span className="hidden sm:inline">Search</span>
          <span className="text-[color:var(--mint)]">● Online</span>
        </div>
      </div>
    </header>
  );
}
