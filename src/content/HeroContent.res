type cta = {
  href: string,
  label: string,
  variant: string,
  icon: (~className: string=?, unit) => React.element,
}

let location = "Tokyo, Japan"
let name = "Arda Karaduman"
let title = "Systems Architect & Pragmatic Programmer"
let tagline = "Building scalable systems and exploring new technologies. Living in Japan since 2004."

let ctas: array<cta> = [
  {href: "https://resume.arda.tr", label: "Resume", variant: "default", icon: Icons.user},
  {href: "https://blog.arda.tr", label: "Blog", variant: "outline", icon: Icons.bookOpen},
  {href: "https://ai.arda.tr", label: "AI Chat", variant: "outline", icon: Icons.bot},
]
