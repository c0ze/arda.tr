let renderHighlightIcon = (icon: AboutContent.highlightIcon) =>
  switch icon {
  | Code2 => Icons.code2(~className="w-5 h-5 text-primary", ())
  | Globe => Icons.globe(~className="w-5 h-5 text-primary", ())
  | Lightbulb => Icons.lightbulb(~className="w-5 h-5 text-primary", ())
  }

let renderSegment = (index, segment: AboutContent.segment) =>
  if segment.emphasis {
    <span key={Int.toString(index)} className="font-medium text-primary"> {segment.text->React.string} </span>
  } else {
    <React.Fragment key={Int.toString(index)}> {segment.text->React.string} </React.Fragment>
  }

let renderParagraph = (index, paragraph: array<AboutContent.segment>) =>
  <p key={Int.toString(index)} className="leading-relaxed text-foreground/90">
    {paragraph->Array.mapWithIndex((segment, i) => renderSegment(i, segment))->React.array}
  </p>

let factItem = (fact: AboutContent.fact) =>
  <div
    key={fact.label}
    className="flex flex-col gap-1 border-b border-border/60 pb-4 last:border-0 last:pb-0">
    <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-primary/80">
      {fact.label->React.string}
    </span>
    <span className="font-display text-base font-medium text-foreground"> {fact.value->React.string} </span>
  </div>

let techChip = (i, tech) =>
  <span
    key={Int.toString(i)}
    className="glass shrink-0 rounded-full px-4 py-2 font-mono text-sm text-foreground/80">
    {tech->React.string}
  </span>

let highlightCard = (i, item: AboutContent.highlight) =>
  <Reveal key={item.title} delay={i * 110}>
    <div
      className="group glass flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
          {renderHighlightIcon(item.icon)}
        </div>
        <span className="font-mono text-xs text-muted-foreground/50">
          {(i + 1)->Int.toString->String.padStart(2, "0")->React.string}
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground"> {item.title->React.string} </h3>
      <p className="text-sm leading-relaxed text-muted-foreground"> {item.description->React.string} </p>
    </div>
  </Reveal>

@react.component
let make = () => {
  <section id={SiteConfig.about} className="relative scroll-mt-24 px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-5xl">
      <Reveal>
        <SectionHeader
          eyebrow={AboutContent.eyebrow}
          title={AboutContent.title}
          description={AboutContent.description}
        />
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <div className="glass flex h-full flex-col gap-4 rounded-2xl p-7 sm:p-8">
            {AboutContent.bio
            ->Array.mapWithIndex((paragraph, index) => renderParagraph(index, paragraph))
            ->React.array}
          </div>
        </Reveal>

        <Reveal className="md:col-span-5" delay=120>
          <div className="glass flex h-full flex-col justify-center gap-5 rounded-2xl p-7 sm:p-8">
            {AboutContent.facts->Array.map(factItem)->React.array}
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {AboutContent.highlights->Array.mapWithIndex((item, i) => highlightCard(i, item))->React.array}
      </div>

      <Reveal className="mt-12">
        <div className="mask-fade-x relative overflow-hidden py-1" ariaHidden=true>
          <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {Array.concat(AboutContent.tech, AboutContent.tech)
            ->Array.mapWithIndex((tech, i) => techChip(i, tech))
            ->React.array}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
}
