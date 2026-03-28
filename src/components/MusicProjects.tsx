import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Music, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sectionIds } from "@/config/site";

const MusicProjects = () => {
  const musicProjects = [
    {
      title: "Pagan",
      description: "Atmospheric Black Metal from Turkey. Dark, melodic, and aggressive.",
      image: "/pagan.jpg",
      link: "https://pagan.tr",
      tags: ["Black Metal", "Atmospheric", "Turkish Metal"],
      type: "Band",
    },
    {
      title: "The Seventh Shadow",
      description: "AI Generated Gothic Metal exploring themes of alienation and artificiality.",
      image: "/7th-shadow.jpg",
      link: "https://distrokid.com/hyperfollow/the7thshadow/alienation-by-design-2",
      tags: ["Gothic Metal", "AI Music", "Experimental"],
      type: "Project",
    },
  ];

  const socialLinks = [
    {
      name: "Discogs",
      url: "https://www.discogs.com/artist/5627323-Arda-Karaduman",
      icon: <Disc className="w-5 h-5" />,
    },
    {
      name: "Metal Archives",
      url: "https://www.metal-archives.com/artists/Talciron/36967",
      icon: <Music className="w-5 h-5" />,
    },
    {
      name: "Last.fm",
      url: "https://www.last.fm/user/c0ze",
      icon: <Music className="w-5 h-5" />,
    },
  ];

  return (
    <section id={sectionIds.music} className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background gradient for section separation */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-3">
          <span className="font-mono text-xs text-primary/70 tracking-[0.2em] uppercase">05 — Music</span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Music Projects
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            My musical endeavors and contributions to the metal scene.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {musicProjects.map((project, index) => (
            <Card key={index} className="overflow-hidden border-border bg-card hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)] transition-all group">
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </a>
              </div>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium">
                    {project.type}
                  </span>
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CardTitle className="flex items-center justify-between text-xl">
                  {project.title}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Profile Links */}
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((link, index) => (
            <Button key={index} variant="outline" className="gap-2" asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.icon}
                {link.name}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicProjects;
