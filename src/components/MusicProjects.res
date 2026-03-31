type musicProject = {
  title: string,
  description: string,
  image: string,
  link: string,
  tags: array<string>,
  kind: string,
}

type socialLink = {
  name: string,
  url: string,
  icon: [#Disc | #Music],
}

let renderSocialIcon = icon =>
  switch icon {
  | #Disc => Icons.disc(~className="w-5 h-5", ())
  | #Music => Icons.music(~className="w-5 h-5", ())
  }

@react.component
let make = () => {
  let musicProjects: array<musicProject> = [
    {
      title: "Pagan",
      description: "Atmospheric Black Metal from Turkey. Dark, melodic, and aggressive.",
      image: "/pagan.jpg",
      link: "https://pagan.tr",
      tags: ["Black Metal", "Atmospheric", "Turkish Metal"],
      kind: "Band",
    },
    {
      title: "The Seventh Shadow",
      description: "AI Generated Gothic Metal exploring themes of alienation and artificiality.",
      image: "/7th-shadow.jpg",
      link: "https://distrokid.com/hyperfollow/the7thshadow/alienation-by-design-2",
      tags: ["Gothic Metal", "AI Music", "Experimental"],
      kind: "Project",
    },
  ]

  let socialLinks: array<socialLink> = [
    {
      name: "Discogs",
      url: "https://www.discogs.com/artist/5627323-Arda-Karaduman",
      icon: #Disc,
    },
    {
      name: "Metal Archives",
      url: "https://www.metal-archives.com/artists/Talciron/36967",
      icon: #Music,
    },
    {
      name: "Last.fm",
      url: "https://www.last.fm/user/c0ze",
      icon: #Music,
    },
  ]

  <section id={SiteConfig.music} className="py-24 px-6 bg-background relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-subtle opacity-40 pointer-events-none" />

    <div className="max-w-5xl mx-auto space-y-16 relative z-10">
      <div className="text-center space-y-3">
        <span className="font-mono text-xs text-primary/70 tracking-[0.2em] uppercase">
          {"05 — Music"->React.string}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {"Music Projects"->React.string}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {"My musical endeavors and contributions to the metal scene."->React.string}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {musicProjects
        ->Array.map(project =>
          <Card key={project.title} className="overflow-hidden border-border bg-card hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)] transition-all group">
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                <img
                  src={project.image}
                  alt={project.title}
                  loading=#lazy
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              </a>
            </div>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium">
                  {project.kind->React.string}
                </span>
                {project.tags
                ->Array.map(tag =>
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                    {tag->React.string}
                  </span>
                )
                ->React.array}
              </div>
              <CardTitle className="flex items-center justify-between text-xl">
                {project.title->React.string}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {Icons.externalLink(~className="w-5 h-5", ())}
                  <span className="sr-only"> {`Visit ${project.title}`->React.string} </span>
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {project.description->React.string}
              </CardDescription>
            </CardContent>
          </Card>
        )
        ->React.array}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {socialLinks
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
