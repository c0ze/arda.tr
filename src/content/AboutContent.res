// A bio paragraph is a sequence of segments; `emphasis` ones render as <strong>.
type segment = {
  text: string,
  emphasis: bool,
}

let bio: array<array<segment>> = [
  [
    {text: "I have lived in ", emphasis: false},
    {text: "Japan since 2004", emphasis: true},
    {
      text: ". I finished an M.Sc. in Computer Science at Keio University (2006–2008) and stayed for PhD studies in embedded processor design and optimization (2008–2011).",
      emphasis: false,
    },
  ],
  [
    {text: "Over ", emphasis: false},
    {text: "15 years of engineering work", emphasis: true},
    {
      text: ", moving from embedded systems to cloud architecture. Since 2024 I have been Systems Architect at Veltra, connecting legacy applications to AI over MCP and building infrastructure.",
      emphasis: false,
    },
  ],
  [
    {
      text: "Previously at Gaussy, Robotfund, and Mobilous.",
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
  {label: "Role", value: "Systems Architect @ Veltra"},
  {label: "Location", value: "Tokyo, Japan"},
  {label: "Education", value: "Keio University · CS"},
  {label: "Previous", value: "Gaussy · Robotfund · Mobilous"},
]

// The stack, joined with " · " into the Record's "stack" row.
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

// The section's heading and the rows that follow the facts. These live here,
// not in Record.res: PROJECT.md keeps page copy in *Content.res so text edits
// never touch layout.
let title = "About"
// The section's heading is the surname, and what it means.
let surname = "Karaduman"
let surnameNote = "Turkish for \"black smoke\"."
let languagesLabel = "Languages"
let recordLanguages = "Turkish (native) · English (near-native) · Japanese (business)"
let stackLabel = "Stack"
