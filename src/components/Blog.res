// Writing section: fetches the latest posts from blog.arda.tr (client-side RSS,
// see blogFeed.mjs) and shows them as glass cards. None = loading; Some([]) =
// fetch failed (we point at the blog instead).

type post = {
  title: string,
  link: string,
  date: string,
  image: string,
  excerpt: string,
}

@module("./blogFeed.mjs") external fetchLatest: int => promise<array<post>> = "fetchLatest"

let card = (post: post) =>
  <a
    key={post.link}
    href={post.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group glass relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
    {post.image == ""
      ? React.null
      : <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            loading=#lazy
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent"
          />
        </div>}
    <div className="flex flex-1 flex-col gap-2 p-5">
      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {post.date->React.string}
      </span>
      <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {post.title->React.string}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground"> {post.excerpt->React.string} </p>
    </div>
  </a>

@react.component
let make = () => {
  let (posts, setPosts) = React.useState(() => None)

  React.useEffect0(() => {
    fetchLatest(3)
    ->Promise.thenResolve(ps => setPosts(_ => Some(ps)))
    ->Promise.catch(_ => {
      setPosts(_ => Some([]))
      Promise.resolve()
    })
    ->ignore
    None
  })

  let body = switch posts {
  | None =>
    <p className="text-sm text-muted-foreground"> {"Loading recent posts…"->React.string} </p>
  | Some([]) =>
    <p className="text-sm text-muted-foreground">
      {"Couldn't load posts right now — "->React.string}
      <a
        href="https://blog.arda.tr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline">
        {"visit the blog"->React.string}
      </a>
      {"."->React.string}
    </p>
  | Some(ps) =>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ps
      ->Array.mapWithIndex((p, i) =>
        <Reveal key={p.link} delay={mod(i, 3) * 90}> {card(p)} </Reveal>
      )
      ->React.array}
    </div>
  }

  <section id="writing" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-6xl space-y-8">
      <Reveal>
        <SectionHeader
          eyebrow="06 — Writing"
          title="Writing"
          description="Latest from the blog — AI/LLM tooling, Go/DevOps, home networking, and generative-music notes."
        />
      </Reveal>
      {body}
      <div className="pt-2">
        <a
          href="https://blog.arda.tr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80">
          {"Read the blog"->React.string}
          {Icons.externalLink(~className="h-4 w-4", ())}
        </a>
      </div>
    </div>
  </section>
}
