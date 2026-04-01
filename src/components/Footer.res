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

@react.component
let make = () => {
  let currentYear = makeDate()->Date.getFullYear

  <footer className="py-12 px-6 bg-card/50 border-t border-border">
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
          <p className="text-sm text-muted-foreground">
            {`© ${currentYear->Int.toString} Arda Karaduman`->React.string}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {"Themes by "->React.string}
            <a
              href={FooterContent.themeAttributionHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              {FooterContent.themeAttributionLabel->React.string}
            </a>
          </p>
        </div>

        <div className="flex gap-3">
          {FooterContent.socialLinks
          ->Array.map(link =>
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel={link.rel}
              className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              {renderSocialIcon(link.icon)}
              <span className="sr-only"> {link.name->React.string} </span>
            </a>
          )
          ->React.array}
        </div>
      </div>
    </div>
  </footer>
}
