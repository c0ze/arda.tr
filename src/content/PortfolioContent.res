type item = {
  title: string,
  description: string,
  image: string,
  link: string,
  tags: array<string>,
  playable: bool,
  containImage: bool,
}

type section = {
  eyebrow: string,
  title: string,
  description: string,
  items: array<item>,
}

let sections: array<section> = [
  {
    eyebrow: "02 — Projects",
    title: "Projects",
    description: "A collection of digital products and interactive experiences I've built.",
    items: [
      {
        title: "Fablecast.kids",
        description: "AI generated children books.",
        image: "/fablecast.png",
        link: "https://fablecast.kids",
        tags: ["AI", "Children Books", "Storytelling"],
        playable: false,
        containImage: false,
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
        containImage: false,
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
    ],
  },
  {
    eyebrow: "03 — Games",
    title: "Games",
    description: "A collection of web-based games I've developed.",
    items: [
      {
        title: "Domino Game",
        description: "A classic Domino game built with Love2D and Lua. Play against the computer in this web-based version.",
        image: "/domino.png",
        link: "https://domino.arda.tr",
        tags: ["Lua", "Love2D", "Game Dev"],
        playable: true,
        containImage: false,
      },
      {
        title: "Hackerman",
        description: "Dive into the digital realm with this hacking simulation. Test your skills and breach the system.",
        image: "/hackerman.png",
        link: "https://hackerman.arda.tr",
        tags: ["Simulation", "Puzzle", "Web Game"],
        playable: true,
        containImage: false,
      },
      {
        title: "TankFury",
        description: "A retro-style action game. Take control and fight your way through enemy lines.",
        image: "/commando.png",
        link: "https://tankfury.arda.tr",
        tags: ["Action", "Retro", "Web Game"],
        playable: true,
        containImage: false,
      },
    ],
  },
  {
    eyebrow: "04 — Tools",
    title: "Tools",
    description: "Utilities and tools I've developed to improve workflows.",
    items: [
      {
        title: "Git Roast",
        description: "A CLI tool that roasts your git commits. Make your version control a little more entertaining.",
        image: "/git-roast.png",
        link: "https://github.com/c0ze/git-roast",
        tags: ["CLI", "Go", "Tool"],
        playable: false,
        containImage: false,
      },
    ],
  },
]
