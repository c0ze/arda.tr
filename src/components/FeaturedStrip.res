/** Three entries at plate scale — the proof that the range is real before a
    single row is read. Each cites its own catalogue number as a working
    in-page anchor, so the dense table is genuinely one jump away rather than
    merely gestured at.

    Plates are normalised the way a catalogue normalises them: one ground, one
    crop discipline, numbered Fig. 1–3. Imagery renders in full colour
    (confirmed at comp approval, 2026-07-25). */
@react.component
let make = (~onCite: unit => unit) => {
  <section className="rule-heavy-b" ariaLabelledby="featured-heading">
    <h2 id="featured-heading" className="sr-only"> {"Featured entries"->React.string} </h2>
    <div className="grid grid-cols-1 md:grid-cols-3">
      {CatalogContent.featured
      ->Array.mapWithIndex((e, i) => {
        let kind = CatalogContent.kindFor(e.band)
        let bandColor = `hsl(var(--band-${Int.toString(e.band)}))`
        let anchor = "#" ++ e.cat->String.replaceAll(" ", "-")

        <article
          key={e.cat}
          className="flex flex-col rule-b last:border-b-0 md:rule-r md:border-b-0 md:last:border-r-0">
          <a
            href={e.href}
            rel="noopener noreferrer"
            className="group relative block aspect-[5/2] overflow-hidden bg-card rule-b md:aspect-[16/10]">
            <img
              src={e.image}
              alt=""
              loading=#lazy
              className={"h-full w-full object-contain p-6 md:p-9" ++ (
                e.invertOnLight ? " theme-invert-logo" : ""
              )}
            />
            <span className="cat-label absolute left-0 top-0 bg-foreground px-1.5 py-0.5 text-background">
              {`Fig. ${Int.toString(i + 1)}`->React.string}
            </span>
          </a>

          <div className="flex flex-1 flex-col gap-2 px-5 py-4">
            <span className="flex items-center gap-2">
              <span className="band-mark" style={{backgroundColor: bandColor}} ariaHidden=true />
              <span className="cat-label text-muted-foreground">
                {`${Int.toString(kind.band)} · ${kind.name} — ${e.status}`->React.string}
              </span>
            </span>
            <h3 className="font-display text-2xl font-bold leading-none tracking-tight">
              <a href={e.href} rel="noopener noreferrer"> {e.name->React.string} </a>
            </h3>
            <p className="text-sm leading-snug text-muted-foreground"> {e.description->React.string} </p>
            /* Clearing the filter first: a band filter can have unmounted this
               entry's own row, and an anchor to a row that is not in the DOM
               silently does nothing. */
            <a
              href={anchor}
              onClick={_ => onCite()}
              className="mt-auto cat-label text-muted-foreground hover:text-foreground">
              {`See cat. ${e.cat} ↓`->React.string}
            </a>
          </div>
        </article>
      })
      ->React.array}
    </div>
  </section>
}
