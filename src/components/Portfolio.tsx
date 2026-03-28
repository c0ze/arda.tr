import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sectionIds } from "@/config/site";
import { cn } from "@/lib/utils";

// Define an interface for the items to keep TypeScript happy
interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  link?: string;
  tags: string[];
  playable?: boolean;
  containImage?: boolean;
}

const Portfolio = () => {
  const projects: PortfolioItem[] = [
    {
      title: "Fablecast.kids",
      description: "AI generated children books.",
      image: "/fablecast.png",
      link: "https://fablecast.kids",
      tags: ["AI", "Children Books", "Storytelling"],
      playable: false,
    },
    {
      title: "Slop Machine",
      description: "A custom story building engine featuring a Flask API, Cloud Run jobs, and a React studio.",
      image: "/slop-machine.png",
      link: "https://slop-machine.arda.tr",
      tags: ["React", "Flask", "AI", "Cloud Run"],
      playable: false,
      containImage: true,
    },
    {
      title: "Skriv.ist",
      description: "Multiplatform ebook reader.",
      image: "/skrivist_logo_3.png",
      link: "https://skriv.ist",
      tags: ["Ebook", "Reader", "Multiplatform"],
      playable: false,
    },
    {
      title: "Vigil.today",
      description: "Smart reminder widget PWA that keeps you on track with recurring tasks.",
      image: "/vigil-today.png",
      link: "https://vigil.today",
      tags: ["SvelteKit", "PWA", "Firebase"],
      playable: false,
      containImage: true,
    },
  ];

  const games: PortfolioItem[] = [
    {
      title: "Domino Game",
      description: "A classic Domino game built with Love2D and Lua. Play against the computer in this web-based version.",
      image: "/domino.png",
      link: "https://domino.arda.tr",
      tags: ["Lua", "Love2D", "Game Dev"],
      playable: true,
    },
    {
      title: "Hackerman",
      description: "Dive into the digital realm with this hacking simulation. Test your skills and breach the system.",
      image: "/hackerman.png",
      link: "https://hackerman.arda.tr",
      tags: ["Simulation", "Puzzle", "Web Game"],
      playable: true,
    },
    {
      title: "TankFury",
      description: "A retro-style action game. Take control and fight your way through enemy lines.",
      image: "/commando.png",
      link: "https://tankfury.arda.tr",
      tags: ["Action", "Retro", "Web Game"],
      playable: true,
    },
  ];

  const tools: PortfolioItem[] = [
    {
      title: "Git Roast",
      description: "A CLI tool that roasts your git commits. Make your version control a little more entertaining.",
      image: "/git-roast.png",
      link: "https://github.com/c0ze/git-roast",
      tags: ["CLI", "Go", "Tool"],
      playable: false,
    }
  ];

  const renderCard = (item: PortfolioItem, index: number) => (
    <Card key={index} className="overflow-hidden border-border bg-card hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)] transition-all group">
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className={cn("w-full h-full transition-transform duration-500 group-hover:scale-105", item.containImage ? "object-contain" : "object-cover")}
          />
        </a>
        {item.playable && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Button variant="default" size="sm" className="gap-2 pointer-events-auto" asChild>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <Gamepad2 className="w-4 h-4" />
                Play Now
              </a>
            </Button>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {item.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <CardTitle className="flex items-center justify-between text-base">
          {item.title}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">
          {item.description}
        </CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <section id={sectionIds.portfolio} className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Projects section */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <span className="font-mono text-xs text-primary/70 tracking-[0.2em] uppercase">02 — Projects</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Projects
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A collection of digital products and interactive experiences I've built.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(renderCard)}
          </div>
        </div>

        {/* Games section */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <span className="font-mono text-xs text-primary/70 tracking-[0.2em] uppercase">03 — Games</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Games
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A collection of web-based games I've developed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(renderCard)}
          </div>
        </div>

        {/* Tools section */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <span className="font-mono text-xs text-primary/70 tracking-[0.2em] uppercase">04 — Tools</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Tools
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Utilities and tools I've developed to improve workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(renderCard)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
