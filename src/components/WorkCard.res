/** One work: hex index, the entry's own image dithered live (a seeded sigil
    when it has none), name, note, kind and status. Hovering or focusing the
    card develops the image again and tints it signal.

    The name is the card's link (stretched over the whole card); the source
    link sits above it when an entry has both a site and a repo. The card keeps
    the entry's catalogue-number id so old deep links still land. */

let liveStatuses = ["LIVE", "PLAYABLE", "RELEASED", "ACTIVE"]

let hex = i => "0x" ++ Int.toString(i, ~radix=16)->String.padStart(2, "0")->String.toUpperCase

let anchorFor = (cat: string) => cat->String.replaceAll(" ", "-")

@react.component
let make = (~entry: CatalogContent.entry, ~index: int) => {
  let (hot, setHot) = React.useState(() => false)
  let kind = CatalogContent.kindFor(entry.band)
  let primary = entry.href == "" ? entry.repo : entry.href
  let live = liveStatuses->Array.includes(entry.status)
  let on = _ => setHot(_ => true)
  let off = _ => setHot(_ => false)

  <article
    id={anchorFor(entry.cat)}
    className="card"
    onMouseEnter=on
    onMouseLeave=off
    onFocus=on
    onBlur=off>
    <div className="card-img">
      <OneBit.Dithered src=entry.image fallbackSeed={index + 1} hot />
      <span className="hex" ariaHidden=true> {hex(index)->React.string} </span>
      {entry.featured ? <span className="pin"> {"featured"->React.string} </span> : React.null}
    </div>
    <h3>
      {primary == ""
        ? entry.name->React.string
        : <a className="card-link" href=primary rel="noopener noreferrer">
            {entry.name->React.string}
          </a>}
    </h3>
    <p className="note"> {entry.description->React.string} </p>
    <div className="meta">
      <span> {(kind.name->String.toLowerCase ++ "/")->React.string} </span>
      <span className="meta-r">
        <span className={live ? "st live" : "st"}>
          {entry.status->String.toLowerCase->React.string}
          {primary == ""
            ? <span className="sr-only"> {" — no public link"->React.string} </span>
            : React.null}
        </span>
        {entry.repo != "" && entry.href != ""
          ? <a
              className="src"
              href=entry.repo
              rel="noopener noreferrer"
              ariaLabel={`Source for ${entry.name}`}>
              {"src"->React.string}
            </a>
          : React.null}
      </span>
    </div>
  </article>
}
