let tagBadge = tag =>
  <span
    key={tag}
    className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium tracking-wide text-primary">
    {tag->React.string}
  </span>

// Visual-only "Play" cue for games. The card image underneath is the actual
// link, so this stays pointer-events-none.
let playableOverlay =
  <div
    className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    <span
      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
      {Icons.gamepad2(~className="w-4 h-4", ())}
      <span> {"Play Now"->React.string} </span>
    </span>
  </div>

@react.component
let make = () => {
  <section id={SiteConfig.portfolio} className="relative scroll-mt-24 px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-6xl space-y-20">
      {PortfolioContent.sections
      ->Array.map(section =>
        <div key={section.title} className="space-y-8">
          <Reveal>
            <SectionHeader
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.items
            ->Array.mapWithIndex((item, i) =>
              <Reveal key={item.title} delay={mod(i, 3) * 90}>
                <ProjectCard
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  link={item.link}
                  repo={item.repo}
                  containImage={item.containImage}
                  badgeContent={item.tags->Array.map(tagBadge)->React.array}
                  imageOverlay={item.playable ? playableOverlay : React.null}
                />
              </Reveal>
            )
            ->React.array}
          </div>
        </div>
      )
      ->React.array}
    </div>
  </section>
}
