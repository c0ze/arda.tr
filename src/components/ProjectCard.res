let imageClassName = containImage =>
  if containImage {
    "w-full h-full transition-transform duration-500 group-hover:scale-105 object-contain"
  } else {
    "w-full h-full transition-transform duration-500 group-hover:scale-105 object-cover"
  }

@react.component
let make = (
  ~title,
  ~description,
  ~image,
  ~link,
  ~repo=None,
  ~badgeContent=React.null,
  ~containImage=false,
  ~titleClassName="text-base",
  ~descriptionClassName="text-sm",
  ~linkIconClassName="w-4 h-4",
  ~imageOverlay=React.null,
) => {
  let imageEl =
    <img
      src={image}
      alt={title}
      loading=#lazy
      className={imageClassName(containImage)}
    />

  // The image links to the deployed site in a new tab. When there is no site
  // (link is empty, e.g. a repo-only tool) the image is shown but not clickable.
  let imageBlock = if link == "" {
    <div className="block w-full h-full"> imageEl </div>
  } else {
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full cursor-pointer">
      imageEl
    </a>
  }

  // Right-side action icon: GitHub (→ repo) for tools that have one, otherwise
  // the external-link icon (→ site) used by projects and games.
  let actionIcon = switch repo {
  | Some(repoUrl) =>
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary transition-colors">
      {Icons.github(~className=linkIconClassName, ())}
      <span className="sr-only"> {`${title} on GitHub`->React.string} </span>
    </a>
  | None =>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary transition-colors">
      {Icons.externalLink(~className=linkIconClassName, ())}
      <span className="sr-only"> {`Visit ${title}`->React.string} </span>
    </a>
  }

  <Card className="overflow-hidden border-border bg-card hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)] transition-all group">
    <div className="aspect-video w-full overflow-hidden bg-muted relative">
      {imageBlock}
      {imageOverlay}
    </div>
    <CardHeader className="pb-2">
      <div className="flex flex-wrap gap-2 mb-2"> {badgeContent} </div>
      <CardTitle className={`flex items-center justify-between ${titleClassName}`}>
        {title->React.string}
        {actionIcon}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className={descriptionClassName}>
        {description->React.string}
      </CardDescription>
    </CardContent>
  </Card>
}
