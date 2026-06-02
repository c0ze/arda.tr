type highlightIcon =
  | Code2
  | Globe
  | Lightbulb

type highlight = {
  icon: highlightIcon,
  title: string,
  description: string,
}

// A bio paragraph is a sequence of segments; `emphasis` ones render as accented spans.
type segment = {
  text: string,
  emphasis: bool,
}

let eyebrow = "01 — About"
let title = "About"
let description = "A pragmatic programmer who enjoys tinkering, hacking, and exploring new languages and frameworks."

let bio: array<array<segment>> = [
  [
    {text: "I've been living in ", emphasis: false},
    {text: "Japan since 2004", emphasis: true},
    {
      text: ", where I earned my Master's degree in Computer Science from Keio University (2006-2008). I also pursued PhD studies in Embedded Processor Design and Optimization from 2008-2011.",
      emphasis: false,
    },
  ],
  [
    {text: "With over ", emphasis: false},
    {text: "15 years of professional experience", emphasis: true},
    {
      text: ", I've worked across the full technology stack - from embedded systems to cloud architecture. Currently serving as a Systems Architect at Veltra since 2024, I specialize in integrating legacy applications with AI using MCP and building scalable infrastructure solutions.",
      emphasis: false,
    },
  ],
  [
    {
      text: "My journey has taken me through various roles at companies like Gaussy, Robotfund, and Mobilous, always focusing on pragmatic solutions and continuous learning.",
      emphasis: false,
    },
  ],
]

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
