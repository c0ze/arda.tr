let renderSocialIcon = icon =>
  switch icon {
  | #Disc => Icons.disc(~className="w-5 h-5", ())
  | #Music => Icons.music(~className="w-5 h-5", ())
  }

let tagBadge = tag =>
  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
    {tag->React.string}
  </span>

let kindBadge = kind =>
  <span className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium">
    {MusicContent.kindLabel(kind)->React.string}
  </span>

let imageOverlay =
  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

@react.component
let make = () => {
  <section id={SiteConfig.music} className="py-24 px-6 bg-background relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-subtle opacity-40 pointer-events-none" />

    <div className="max-w-5xl mx-auto space-y-16 relative z-10">
      <SectionHeader
        eyebrow={MusicContent.eyebrow}
        title={MusicContent.title}
        description={MusicContent.description}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {MusicContent.projects
        ->Array.map(project =>
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            titleClassName="text-xl"
            descriptionClassName="text-base"
            linkIconClassName="w-5 h-5"
            imageOverlay=imageOverlay
            badgeContent={
              <>
                {kindBadge(project.kind)}
                {project.tags->Array.map(tagBadge)->React.array}
              </>
            }
          />
        )
        ->React.array}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {MusicContent.socialLinks
        ->Array.map(link =>
          <Button key={link.name} variant="outline" className="gap-2" asChild=true>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {renderSocialIcon(link.icon)}
              <span> {link.name->React.string} </span>
            </a>
          </Button>
        )
        ->React.array}
      </div>
    </div>
  </section>
}
