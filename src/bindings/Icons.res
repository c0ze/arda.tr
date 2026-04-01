module User = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "User"
}

let user = (~className=?, ()) => <User ?className />

module BookOpen = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "BookOpen"
}

let bookOpen = (~className=?, ()) => <BookOpen ?className />

module Bot = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Bot"
}

let bot = (~className=?, ()) => <Bot ?className />

module ChevronDown = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "ChevronDown"
}

let chevronDown = (~className=?, ()) => <ChevronDown ?className />

module Code2 = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Code2"
}

let code2 = (~className=?, ()) => <Code2 ?className />

module Globe = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Globe"
}

let globe = (~className=?, ()) => <Globe ?className />

module Lightbulb = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Lightbulb"
}

let lightbulb = (~className=?, ()) => <Lightbulb ?className />

module Gamepad2 = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Gamepad2"
}

let gamepad2 = (~className=?, ()) => <Gamepad2 ?className />

module ExternalLink = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "ExternalLink"
}

let externalLink = (~className=?, ()) => <ExternalLink ?className />

module Music = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Music"
}

let music = (~className=?, ()) => <Music ?className />

module Disc = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Disc"
}

let disc = (~className=?, ()) => <Disc ?className />

module Github = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Github"
}

let github = (~className=?, ()) => <Github ?className />

module Mail = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Mail"
}

let mail = (~className=?, ()) => <Mail ?className />

module Linkedin = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Linkedin"
}

let linkedin = (~className=?, ()) => <Linkedin ?className />

module Guitar = {
  @module("lucide-react") @react.component
  external make: (~className: string=?, unit) => React.element = "Guitar"
}

let guitar = (~className=?, ()) => <Guitar ?className />

module Mastodon = {
  @react.component
  let make = (~className: string= "") =>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className=className
    >
      <path d="M21.36 8.52c-.12-3.15-2.58-4.75-5.91-5.18l-.13-.02C13.62 3.12 12.01 3 12 3s-1.62.12-3.32.32c-3.46.42-5.92 2.03-6.04 5.34C2.5 12.35 2.5 16.27 3.51 18c1.33 2.32 4.09 2.51 6.51 2.5.6 0 1.2-.05 1.77-.14 1.25-.19 2.1-.53 2.1-.53l-.15-1.93s-.84.28-1.92.35c-1.42.09-2.8-.07-3.08-1.46-.24-.46-.35-1.04-.37-1.68 1.45.36 3.06.49 4.71.49 1.76 0 3.39-.12 4.79-.42 2.82-.62 3.5-2.22 3.5-4.48 0-1.45 0-2.31 0-2.31Z" />
      <path d="M17.15 15.22V9.01C17.15 7.42 16.03 6.4 14.53 6.4c-1.35 0-2.25.96-2.25 2.6V11H11.7V9c0-1.64-.9-2.6-2.25-2.6-1.5 0-2.62 1.02-2.62 2.61v6.21h2.24V9.82c0-.66.28-1.12.81-1.12.55 0 .82.5.82 1.25v3.66h2.22V9.95c0-.75.27-1.25.82-1.25.53 0 .81.46.81 1.12v5.4h2.6Z" />
    </svg>
}

let mastodon = (~className=?, ()) => <Mastodon ?className />

module Bluesky = {
  @react.component
  let make = (~className: string= "") =>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className=className
    >
      <path d="M5.46 4.38c2.08 1.56 4.31 4.72 5.13 6.42.82-1.7 3.05-4.86 5.13-6.42 1.5-1.13 3.93-2 3.93.77 0 .55-.32 4.65-.5 5.31-.63 2.3-2.91 2.89-4.94 2.54 3.55.61 4.45 2.61 2.5 4.61-3.7 3.79-5.32-.95-5.73-2.16-.08-.22-.11-.32-.39-.32s-.31.1-.39.32c-.41 1.21-2.03 5.95-5.73 2.16-1.95-2-1.05-4 2.5-4.61-2.03.35-4.31-.24-4.94-2.54-.18-.66-.5-4.76-.5-5.31 0-2.77 2.43-1.9 3.93-.77Z" />
    </svg>
}

let bluesky = (~className=?, ()) => <Bluesky ?className />
