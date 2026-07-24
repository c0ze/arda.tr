/** One catalogue line item. Every entry gets this same grammar regardless of
    whether it is an infrastructure programme or a black metal record — that
    equality is the argument the whole page is making.

    Each column carries a `.col-label`: visible as `label: value` on small
    screens, screen-reader-only on desktop where the header strip does the
    visible work. The band mark always ships with its kind name, so colour is
    never the sole signal. The `col-*` classes drive the restack; see .cat-cols. */
@react.component
let make = (~entry: CatalogContent.entry) => {
  let kind = CatalogContent.kindFor(entry.band)
  let bandColor = `hsl(var(--band-${Int.toString(entry.band)}))`
  let primary = entry.href == "" ? entry.repo : entry.href

  let label = (text: string) =>
    <span className="cat-label col-label mr-1.5 text-muted-foreground">
      {`${text}: `->React.string}
    </span>

  <div id={entry.cat->String.replaceAll(" ", "-")} className="cat-row cat-cols px-5 sm:px-7">
    <div className="col-cat font-mono text-[0.72rem] text-muted-foreground">
      {label("Cat. no")}
      {entry.cat->React.string}
    </div>

    <div className="col-band">
      <span className="band-mark" style={{backgroundColor: bandColor}} ariaHidden=true />
      <span className="sr-only"> {`Kind: ${kind.name}`->React.string} </span>
    </div>

    <div className="col-name font-display text-base font-semibold leading-tight">
      {label("Entry")}
      {entry.name->React.string}
      <span className="cat-label ml-2 text-muted-foreground lg:hidden">
        {kind.name->React.string}
      </span>
    </div>

    <div className="col-desc text-[0.8rem] leading-snug text-muted-foreground">
      {label("Description")}
      {entry.description->React.string}
    </div>

    <div className="col-spec truncate font-mono text-[0.68rem] text-muted-foreground">
      {label("Spec")}
      {entry.spec->React.string}
    </div>

    <div className="col-year font-mono text-[0.72rem]">
      {label("Yr")}
      {entry.year->React.string}
    </div>

    <div className="col-status flex items-center justify-end gap-1.5">
      {primary == ""
        ? <span className="cat-chip border-dashed text-muted-foreground">
            {entry.status->React.string}
            <span className="sr-only"> {" — no public link"->React.string} </span>
          </span>
        : <a
            href={primary}
            rel="noopener noreferrer"
            className="cat-chip"
            ariaLabel={`${entry.name} — ${entry.status}`}>
            {entry.status->React.string}
          </a>}
      {entry.repo != "" && entry.href != ""
        ? <a
            href={entry.repo}
            rel="noopener noreferrer"
            ariaLabel={`Source for ${entry.name}`}
            className="cat-chip">
            {"SRC"->React.string}
          </a>
        : React.null}
    </div>
  </div>
}
