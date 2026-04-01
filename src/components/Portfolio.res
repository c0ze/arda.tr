let tagBadge = tag =>
  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
    {tag->React.string}
  </span>

let playableOverlay = link =>
  <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
    <Button variant="default" size="sm" className="gap-2 pointer-events-auto" asChild=true>
      <a href={link} target="_blank" rel="noopener noreferrer">
        {Icons.gamepad2(~className="w-4 h-4", ())}
        <span> {"Play Now"->React.string} </span>
      </a>
    </Button>
  </div>

@react.component
let make = () => {
  <section id={SiteConfig.portfolio} className="py-24 px-6 bg-background">
    <div className="max-w-5xl mx-auto space-y-16">
      {PortfolioContent.sections
      ->Array.map(section =>
        <div key={section.title} className="space-y-8">
          <SectionHeader
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items
            ->Array.map(item =>
              <ProjectCard
                key={item.title}
                title={item.title}
                description={item.description}
                image={item.image}
                link={item.link}
                containImage={item.containImage}
                badgeContent={item.tags->Array.map(tagBadge)->React.array}
                imageOverlay={if item.playable { playableOverlay(item.link) } else { React.null }}
              />
            )
            ->React.array}
          </div>
        </div>
      )
      ->React.array}
    </div>
  </section>
}
