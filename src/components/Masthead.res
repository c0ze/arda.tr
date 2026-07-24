/** The catalogue masthead: publisher wordmark, edition metadata, and the
    outbound link to the professional dossier. A printed catalogue's header
    rule, not a navigation bar — it states what this document is and stays put.

    The edition fields wrap on narrow screens rather than disappearing; they
    are what distinguishes this from an ordinary site header. */
@react.component
let make = () => {
  let entryCount = CatalogContent.entries->Array.length
  let kindCount = CatalogContent.kinds->Array.length

  let field = (label, value) =>
    <span className="cat-label whitespace-nowrap text-muted-foreground">
      {label->React.string}
      <span className="text-foreground"> {` ${value}`->React.string} </span>
    </span>

  <header id="top" className="sticky top-0 z-30 bg-background rule-heavy-b">
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 px-5 py-3 sm:px-7">
      <h1 className="font-display text-xl font-bold uppercase leading-none tracking-tight">
        <a href="#top">
          {"arda"->React.string}
          <span className="text-muted-foreground"> {".tr"->React.string} </span>
        </a>
        <span className="cat-label ml-3 font-sans text-muted-foreground">
          {"Catalogue of work"->React.string}
        </span>
      </h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:ml-auto">
        {field("CAT.", CatalogContent.catalogueNo)}
        {field("ENTRIES", Int.toString(entryCount))}
        {field("KINDS", Int.toString(kindCount))}
        {field("REV", CatalogContent.revision)}
        <TokyoClock className="hidden sm:inline" />
        <a href="https://resume.arda.tr" className="cat-chip" rel="noopener noreferrer">
          {"Résumé ↗"->React.string}
        </a>
        <ThemeToggleBridge />
      </div>
    </div>
  </header>
}
