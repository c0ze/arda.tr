/** Builds the <img> class list, honoring contain-vs-cover fit and the
    light-theme logo invert. */
let imageClassName = (containImage, invertOnLight) => {
  let base = "h-full w-full transition-transform duration-500 group-hover:scale-105 "
  let fit = containImage ? "object-contain p-4" : "object-cover"
  let invert = invertOnLight ? " theme-invert-logo" : ""
  base ++ fit ++ invert
}

/** Glass work/release card: a themed image link, an aurora glow ring on hover,
    tag badges, and a repo (GitHub) or site (external-link) action icon. */
@react.component
let make = (
  ~title,
  ~description,
  ~image,
  ~link,
  ~repo=None,
  ~badgeContent=React.null,
  ~containImage=false,
  ~invertOnLight=false,
  ~titleClassName="text-lg",
  ~descriptionClassName="text-sm",
  ~linkIconClassName="w-4 h-4",
  ~imageOverlay=React.null,
) => {
  let imageEl =
    <img src={image} alt={title} loading=#lazy className={imageClassName(containImage, invertOnLight)} />

  // The image links to the deployed site in a new tab. When there is no site
  // (repo-only tools), the image is shown but not clickable.
  let imageBlock = if link == "" {
    <div className="block h-full w-full"> imageEl </div>
  } else {
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full w-full cursor-pointer">
      imageEl
    </a>
  }

  // Right-side action icon: GitHub (→ repo) for tools that have one, otherwise
  // the external-link icon (→ site).
  let actionIcon = switch repo {
  | Some(repoUrl) =>
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 text-muted-foreground transition-colors hover:text-primary">
      {Icons.github(~className=linkIconClassName, ())}
      <span className="sr-only"> {`${title} on GitHub`->React.string} </span>
    </a>
  | None =>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 text-muted-foreground transition-colors hover:text-primary">
      {Icons.externalLink(~className=linkIconClassName, ())}
      <span className="sr-only"> {`Visit ${title}`->React.string} </span>
    </a>
  }

  <article className="group relative flex h-full flex-col">
    <div
      ariaHidden=true
      className="absolute -inset-px rounded-2xl bg-gradient-aurora opacity-0 blur-[3px] transition-opacity duration-300 group-hover:opacity-50"
    />
    <div
      className="glass relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-glow">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {imageBlock}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent"
        />
        {imageOverlay}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5"> {badgeContent} </div>
        <h3
          className={`flex items-start justify-between gap-2 font-display font-semibold text-foreground ${titleClassName}`}>
          {title->React.string}
          {actionIcon}
        </h3>
        <p className={`leading-relaxed text-muted-foreground ${descriptionClassName}`}>
          {description->React.string}
        </p>
      </div>
    </div>
  </article>
}
