import { User, BookOpen, Bot, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 hero-grid opacity-25 pointer-events-none" />

      {/* Soft gradient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 flex justify-end">
        <ThemeToggle />
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">

          {/* Location badge */}
          <div className="animate-fade-in-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
              Tokyo, Japan
            </span>
          </div>

          {/* Name */}
          <h1 className="animate-fade-in-2 text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Arda Karaduman
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-3 text-lg md:text-xl text-muted-foreground font-medium">
            Systems Architect & Pragmatic Programmer
          </p>

          {/* Description */}
          <p className="animate-fade-in-4 text-base md:text-lg text-foreground/60 max-w-lg mx-auto leading-relaxed">
            Building scalable systems and exploring new technologies.
            Living in Japan since 2004.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-5 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="default" size="lg" className="gap-2 px-6" asChild>
              <a href="https://resume.arda.tr" target="_blank" rel="noopener noreferrer">
                <User className="w-4 h-4" />
                Resume
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-6" asChild>
              <a href="https://blog.arda.tr" target="_blank" rel="noopener noreferrer">
                <BookOpen className="w-4 h-4" />
                Blog
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-6" asChild>
              <a href="https://ai.arda.tr" target="_blank" rel="noopener noreferrer">
                <Bot className="w-4 h-4" />
                AI Chat
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 pb-8 flex justify-center animate-fade-in-6">
        <ChevronDown className="w-5 h-5 animate-bounce-slow" aria-hidden />
      </div>
    </section>
  );
};

export default Hero;
