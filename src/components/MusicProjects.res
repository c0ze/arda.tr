let renderSocialIcon = icon =>
  switch icon {
  | #Disc => Icons.disc(~className="w-4 h-4", ())
  | #Music => Icons.music(~className="w-4 h-4", ())
  }

let tagBadge = tag =>
  <span
    key={tag}
    className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium tracking-wide text-primary">
    {tag->React.string}
  </span>

let kindBadge = kind =>
  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium tracking-wide text-accent">
    {MusicContent.kindLabel(kind)->React.string}
  </span>

let imageOverlay =
  <div className="pointer-events-none absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/5" />

@react.component
let make = () => {
  <section id={SiteConfig.music} className="relative scroll-mt-24 px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-5xl space-y-14">
      <Reveal>
        <SectionHeader
          eyebrow={MusicContent.eyebrow}
          title={MusicContent.title}
          description={MusicContent.description}
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {MusicContent.projects
        ->Array.mapWithIndex((project, i) =>
          <Reveal key={project.title} delay={i * 120}>
            <ProjectCard
              title={project.title}
              description={project.description}
              image={project.image}
              link={project.link}
              invertOnLight={project.invertOnLight}
              titleClassName="text-xl"
              descriptionClassName="text-base"
              linkIconClassName="w-5 h-5"
              imageOverlay
              badgeContent={<>
                {kindBadge(project.kind)}
                {project.tags->Array.map(tagBadge)->React.array}
              </>}
            />
          </Reveal>
        )
        ->React.array}
      </div>

      <Reveal>
        <div className="flex flex-wrap justify-center gap-3">
          {MusicContent.socialLinks
          ->Array.map(link =>
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-foreground/80 transition-all duration-200 hover:scale-[1.03] hover:text-primary hover:shadow-glow">
              {renderSocialIcon(link.icon)}
              <span> {link.name->React.string} </span>
            </a>
          )
          ->React.array}
        </div>
      </Reveal>
    </div>
  </section>
}
