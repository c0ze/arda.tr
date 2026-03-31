let ctaLink = (
  ~href,
  ~label,
  ~variant,
  ~iconClass,
  ~icon: (~className: string=?, unit) => React.element,
) =>
  <Button variant size="lg" className="gap-2 px-6" asChild=true>
    <a href target="_blank" rel="noopener noreferrer">
      {icon(~className=iconClass, ())}
      <span> {label->React.string} </span>
    </a>
  </Button>

@react.component
let make = () => {
  <section className="min-h-screen flex flex-col bg-background relative overflow-hidden">
    <div className="absolute inset-0 hero-grid opacity-25 pointer-events-none" />
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
    </div>

    <header className="relative z-10 w-full px-6 py-4 flex justify-end">
      <ThemeToggleBridge />
    </header>

    <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="animate-fade-in-1">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {"Tokyo, Japan"->React.string}
          </span>
        </div>

        <h1 className="animate-fade-in-2 text-5xl md:text-7xl font-bold tracking-tight text-foreground">
          {"Arda Karaduman"->React.string}
        </h1>

        <p className="animate-fade-in-3 text-lg md:text-xl text-muted-foreground font-medium">
          {"Systems Architect & Pragmatic Programmer"->React.string}
        </p>

        <p className="animate-fade-in-4 text-base md:text-lg text-foreground/60 max-w-lg mx-auto leading-relaxed">
          {"Building scalable systems and exploring new technologies. Living in Japan since 2004."->React.string}
        </p>

        <div className="animate-fade-in-5 flex flex-col sm:flex-row gap-3 justify-center items-center">
          {ctaLink(~href="https://resume.arda.tr", ~label="Resume", ~variant="default", ~iconClass="w-4 h-4", ~icon=Icons.user)}
          {ctaLink(~href="https://blog.arda.tr", ~label="Blog", ~variant="outline", ~iconClass="w-4 h-4", ~icon=Icons.bookOpen)}
          {ctaLink(~href="https://ai.arda.tr", ~label="AI Chat", ~variant="outline", ~iconClass="w-4 h-4", ~icon=Icons.bot)}
        </div>
      </div>
    </div>

    <div className="relative z-10 pb-8 flex justify-center animate-fade-in-6">
      {Icons.chevronDown(~className="w-5 h-5 animate-bounce-slow", ())}
    </div>
  </section>
}
