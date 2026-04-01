type highlightIcon =
  | Code2
  | Globe
  | Lightbulb

type highlight = {
  icon: highlightIcon,
  title: string,
  description: string,
}

let highlights: array<highlight> = [
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
]

let renderHighlightIcon = icon =>
  switch icon {
  | Code2 => Icons.code2(~className="w-5 h-5 text-primary", ())
  | Globe => Icons.globe(~className="w-5 h-5 text-primary", ())
  | Lightbulb => Icons.lightbulb(~className="w-5 h-5 text-primary", ())
  }

@react.component
let make = () => {
  <section id={SiteConfig.about} className="py-24 px-6 bg-card/30">
    <div className="max-w-4xl mx-auto space-y-16">
      <SectionHeader
        eyebrow="01 — About"
        title="About"
        description="A pragmatic programmer who enjoys tinkering, hacking, and exploring new languages and frameworks."
      />

      <div className="bg-card border border-border border-l-[3px] border-l-primary/40 rounded-xl p-8 space-y-4">
        <p className="text-foreground/90 leading-relaxed">
          {"I've been living in "->React.string}
          <span className="text-primary font-medium"> {"Japan since 2004"->React.string} </span>
          {" , where I earned my Master's degree in Computer Science from Keio University (2006-2008). I also pursued PhD studies in Embedded Processor Design and Optimization from 2008-2011."->React.string}
        </p>
        <p className="text-foreground/90 leading-relaxed">
          {"With over "->React.string}
          <span className="text-primary font-medium"> {"15 years of professional experience"->React.string} </span>
          {" , I've worked across the full technology stack - from embedded systems to cloud architecture. Currently serving as a Systems Architect at Veltra since 2024, I specialize in integrating legacy applications with AI using MCP and building scalable infrastructure solutions."->React.string}
        </p>
        <p className="text-foreground/90 leading-relaxed">
          {"My journey has taken me through various roles at companies like Gaussy, Robotfund, and Mobilous, always focusing on pragmatic solutions and continuous learning."->React.string}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {highlights
        ->Array.map(item =>
          <Card key={item.title} className="p-6 space-y-4 bg-card border-border hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)] transition-all">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {renderHighlightIcon(item.icon)}
            </div>
            <h3 className="text-lg font-medium text-card-foreground">
              {item.title->React.string}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description->React.string}
            </p>
          </Card>
        )
        ->React.array}
      </div>
    </div>
  </section>
}
