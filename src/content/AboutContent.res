// A bio paragraph is a sequence of segments; `emphasis` ones render as accented spans.
type segment = {
  text: string,
  emphasis: bool,
}

let bio: array<array<segment>> = [
  [
    {text: "I've lived in ", emphasis: false},
    {text: "Japan since 2004", emphasis: true},
    {
      text: ". M.Sc. in Computer Science at Keio University (2006–2008), then PhD studies in embedded processor design and optimization (2008–2011).",
      emphasis: false,
    },
  ],
  [
    {text: "Over ", emphasis: false},
    {text: "15 years of professional work", emphasis: true},
    {
      text: ", from embedded systems to cloud architecture. Since 2024 I've been Systems Architect at Veltra, integrating legacy applications with AI over MCP and building infrastructure.",
      emphasis: false,
    },
  ],
  [
    {
      text: "Before that: Gaussy, Robotfund and Mobilous.",
      emphasis: false,
    },
  ],
]

// Quick-facts panel shown alongside the bio.
type fact = {
  label: string,
  value: string,
}

let facts: array<fact> = [
  {label: "Now", value: "Systems Architect @ Veltra"},
  {label: "Based", value: "Tokyo, Japan"},
  {label: "Studied", value: "Keio University · CS"},
  {label: "Past", value: "Gaussy · Robotfund · Mobilous"},
]

// Scrolling tech ribbon (decorative — same skills are described above).
let tech = [
  "Ruby",
  "Go",
  "Python",
  "TypeScript",
  "React",
  "AWS",
  "Kubernetes",
  "Docker",
  "PostgreSQL",
  "Terraform",
  "Microservices",
  "MCP",
  "gRPC",
  "Redis",
  "CI/CD",
  "Linux",
]

// Maker-record fields. These live here, not in Record.res — AGENTS.md requires
// all copy to sit in *Content.res so text edits never touch layout.
let recordCat = "AK 0-0001"
let recordName = "Arda Karaduman"
let recordLanguages = "Turkish (native) · English (near-native) · Japanese (business)"
