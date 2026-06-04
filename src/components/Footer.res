@new external makeDate: unit => Date.t = "Date"

let renderSocialIcon = icon =>
  switch icon {
  | #Github => Icons.github(~className="w-4 h-4", ())
  | #Linkedin => Icons.linkedin(~className="w-4 h-4", ())
  | #Mail => Icons.mail(~className="w-4 h-4", ())
  | #Guitar => Icons.guitar(~className="w-4 h-4", ())
  | #Mastodon => Icons.mastodon(~className="w-4 h-4", ())
  | #Bluesky => Icons.bluesky(~className="w-4 h-4", ())
  }

let socialPill = (link: FooterContent.socialLink) =>
  <a
    key={link.name}
    href={link.href}
    target={link.href->String.startsWith("mailto:") ? "_self" : "_blank"}
    rel={link.rel}
    ariaLabel={link.name}
    className="glass grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-primary hover:shadow-glow">
    {renderSocialIcon(link.icon)}
  </a>

@react.component
let make = () => {
  let currentYear = makeDate()->Date.getFullYear

  <footer id="contact" className="relative scroll-mt-24 px-6 pb-12 pt-12">
    <div className="mx-auto max-w-5xl">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-14 sm:py-20">
          <div
            ariaHidden=true
            className="absolute -top-24 left-1/2 h-56 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-gradient-aurora opacity-30 blur-3xl"
          />
          <div className="relative">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-primary/85">
              {FooterContent.ctaEyebrow->React.string}
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {FooterContent.ctaTitle->React.string}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground"> {FooterContent.ctaText->React.string} </p>
            <a
              href={FooterContent.ctaButtonHref}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform duration-200 hover:scale-[1.03]">
              {Icons.mail(~className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5", ())}
              <span> {FooterContent.ctaButtonLabel->React.string} </span>
            </a>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 flex flex-col items-center gap-6 border-t border-border/60 pt-8 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-sm text-muted-foreground">
            {`© ${currentYear->Int.toString} Arda Karaduman`->React.string}
          </p>
          <TokyoClock />
        </div>

        <div className="flex gap-2.5"> {FooterContent.socialLinks->Array.map(socialPill)->React.array} </div>
      </div>

      <p className="mt-6 text-center font-mono text-xs text-muted-foreground/60">
        {`${FooterContent.builtNote} · Themes by `->React.string}
        <a
          href={FooterContent.themeAttributionHref}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-primary">
          {FooterContent.themeAttributionLabel->React.string}
        </a>
      </p>
    </div>
  </footer>
}
