import { Card } from "@/components/ui/card";
import { sectionIds } from "@/config/site";
import { Code2, Globe, Lightbulb } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "Technical Excellence",
      description: "Proficient in Ruby, Go, Python, and modern web technologies. Hands-on with AWS, Kubernetes, and microservices.",
    },
    {
      icon: Globe,
      title: "Multilingual",
      description: "Native Turkish speaker with near-native English and business-level Japanese proficiency.",
    },
    {
      icon: Lightbulb,
      title: "Pragmatic Approach",
      description: "Early adopter of CI/CD, TDD, and Agile methodologies. Always exploring new frameworks and ideas.",
    },
  ];

  return (
    <section id={sectionIds.about} className="py-24 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Section header */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            About
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A pragmatic programmer who enjoys tinkering, hacking, and exploring new languages and frameworks.
          </p>
        </div>

        {/* Bio */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-4">
          <p className="text-foreground/90 leading-relaxed">
            I've been living in <span className="text-primary font-medium">Japan since 2004</span>, where I earned my Master's degree in Computer Science from Keio University (2006-2008). I also pursued PhD studies in Embedded Processor Design and Optimization from 2008-2011.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            With over <span className="text-primary font-medium">15 years of professional experience</span>, I've worked across the full technology stack - from embedded systems to cloud architecture. Currently serving as a Systems Architect at Veltra since 2024, I specialize in integrating legacy applications with AI using MCP and building scalable infrastructure solutions.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            My journey has taken me through various roles at companies like Gaussy, Robotfund, and Mobilous, always focusing on pragmatic solutions and continuous learning.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <Card
              key={index}
              className="p-6 space-y-4 bg-card border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
