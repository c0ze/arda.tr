/** The catalogue's back matter: how to reach the publisher, and where the rest
    of the range lives. Set as an ordering-information block, not a campaign —
    the contract refuses a contact CTA as the page's loudest voice, so the
    invitation is set at body scale and the section label carries the heading. */
@react.component
let make = () => {
  <footer id="contact">
    <div className="grid rule-heavy-b lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-2.5 px-5 py-7 rule-r sm:px-7">
        <h2 className="cat-label text-muted-foreground"> {"Ordering information"->React.string} </h2>
        <p className="max-w-[34ch] font-display text-xl font-semibold leading-tight">
          {FooterContent.ctaTitle->React.string}
        </p>
        <p className="max-w-[52ch] text-sm leading-snug text-muted-foreground">
          {FooterContent.ctaText->React.string}
        </p>
        <a href={FooterContent.ctaButtonHref} className="cat-chip mt-1 w-fit px-3 py-1.5">
          {`${FooterContent.ctaButtonLabel} ↗`->React.string}
        </a>
      </div>

      <div className="flex flex-col">
        {FooterContent.socialLinks
        ->Array.map(l =>
          <a
            key={l.name}
            href={l.href}
            rel={l.rel}
            className="flex items-baseline gap-3 px-5 py-2.5 rule-b transition-colors duration-100 hover:bg-card sm:px-7">
            <span className="cat-label text-muted-foreground"> {l.name->React.string} </span>
            <span className="ml-auto truncate font-mono text-[0.7rem] text-muted-foreground">
              {l.href
              ->String.replace("https://", "")
              ->String.replace("mailto:", "")
              ->React.string}
            </span>
          </a>
        )
        ->React.array}
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4 sm:px-7">
      <span className="cat-label text-muted-foreground">
        {"Arda Karaduman · Systems Architect"->React.string}
      </span>
      <span className="cat-label text-muted-foreground"> {"Tokyo, since 2004"->React.string} </span>
      <span className="cat-label text-muted-foreground">
        {`Cat. ${CatalogContent.catalogueNo} · Rev ${CatalogContent.revision}`->React.string}
      </span>
      <span className="cat-label ml-auto text-muted-foreground">
        {FooterContent.builtNote->React.string}
      </span>
    </div>
  </footer>
}
