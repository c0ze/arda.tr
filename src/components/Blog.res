// Writing section: the newest posts from blog.arda.tr, baked in at build time
// (see scripts/fetch-blog-posts.mjs and the BlogFeed binding). When the feed
// was unreachable during the build the posts array is empty and this section
// renders nothing — no empty shell. The blog repo pokes this site to rebuild
// (repository_dispatch: blog-updated) whenever a post publishes.

let card = (post: BlogFeed.post) =>
  <a
    href={post.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group glass relative flex h-full flex-col gap-2 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
      {post.date->React.string}
    </span>
    <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
      {post.title->React.string}
    </h3>
    <p className="text-sm leading-relaxed text-muted-foreground"> {post.excerpt->React.string} </p>
  </a>

@react.component
let make = () => {
  switch BlogFeed.posts {
  | [] => React.null
  | posts =>
    <section id={SiteConfig.writing} className="relative scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl space-y-8">
        <Reveal>
          <SectionHeader
            eyebrow={BlogContent.eyebrow}
            title={BlogContent.title}
            description={BlogContent.description}
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts
          ->Array.mapWithIndex((post, i) =>
            <Reveal key={post.link} delay={mod(i, 3) * 90}> {card(post)} </Reveal>
          )
          ->React.array}
        </div>
        <div className="pt-2">
          <a
            href={BlogContent.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80">
            {BlogContent.ctaLabel->React.string}
            {Icons.externalLink(~className="h-4 w-4", ())}
          </a>
        </div>
      </div>
    </section>
  }
}
