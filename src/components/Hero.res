let ctaClassName = variant => {
  let base = "group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.03] sm:w-auto "
  switch variant {
  | "default" => base ++ "bg-primary text-primary-foreground shadow-glow"
  | _ => base ++ "glass text-foreground hover:text-primary"
  }
}

let ctaLink = (cta: HeroContent.cta) =>
  <a
    key={cta.label}
    href={cta.href}
    target="_blank"
    rel="noopener noreferrer"
    className={ctaClassName(cta.variant)}>
    {cta.icon(~className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5", ())}
    <span> {cta.label->React.string} </span>
  </a>

let statItem = (i, stat: HeroContent.stat) =>
  <div key={Int.toString(i)} className="flex items-center gap-8">
    {i > 0 ? <span className="hidden h-8 w-px bg-border sm:block" ariaHidden=true /> : React.null}
    <div className="flex flex-col items-center">
      <span className="font-display text-lg font-semibold text-foreground"> {stat.value->React.string} </span>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
        {stat.label->React.string}
      </span>
    </div>
  </div>

@react.component
let make = () => {
  <section
    id="top"
    className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32">
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
      <div className="animate-fade-in-1 glass inline-flex items-center gap-3 rounded-full px-4 py-1.5">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">
          {HeroContent.eyebrow->React.string}
        </span>
        <span className="h-3.5 w-px bg-border" ariaHidden=true />
        <TokyoClock />
      </div>

      <h1
        ariaLabel={HeroContent.name}
        className="animate-fade-in-2 mt-8 font-display text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl md:text-8xl">
        <span className="block text-foreground"> {HeroContent.nameLead->React.string} </span>
        <span className="block text-gradient-aurora"> {HeroContent.nameAccent->React.string} </span>
      </h1>

      <p
        className="animate-fade-in-3 mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {HeroContent.tagline->React.string}
      </p>

      <div
        className="animate-fade-in-4 mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
        {HeroContent.ctas->Array.map(ctaLink)->React.array}
      </div>

      <div className="animate-fade-in-5 mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {HeroContent.stats->Array.mapWithIndex((stat, i) => statItem(i, stat))->React.array}
      </div>
    </div>

    <a
      href="#about"
      ariaLabel="Scroll to about section"
      className="animate-fade-in-6 absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em]"> {"Scroll"->React.string} </span>
      {Icons.chevronDown(~className="h-4 w-4 animate-bounce-slow", ())}
    </a>
  </section>
}
