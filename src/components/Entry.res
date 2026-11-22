/** One entry of the list, drawn two ways from the same data: as a row
    (number, kind, title and note, status) and as a plate (a flat tile with
    the number and the entry's own image, uncropped).

    The title is the entry's link and covers the whole row or plate; the
    source link sits above it when an entry has both a site and a repo. Both
    views keep the entry's catalogue-number id, so old deep links
    (#AK-2-0142) still land. */

// The number shown: the entry's place in the list, three digits, from 001.
let number = index => (index + 1)->Int.toString->String.padStart(3, "0")

let anchorFor = (cat: string) => cat->String.replaceAll(" ", "-")

/* Links within the family (arda.tr and *.arda.tr) pass the referrer; every
   other host, and anything that is not an http(s) URL, gets
   rel="noopener noreferrer". The URL parser, not a pattern, decides the host,
   so userinfo (https://arda.tr:1@evil.com) cannot pass for the family. */
type url = {protocol: string, hostname: string}
@new external parseUrl: string => url = "URL"

let isFamily = href =>
  switch parseUrl(href) {
  | {protocol: "http:" | "https:", hostname} =>
    hostname == "arda.tr" || hostname->String.endsWith(".arda.tr")
  | _ => false
  | exception _ => false
  }

let relFor = href => isFamily(href) ? None : Some("noopener noreferrer")

let primaryOf = (entry: CatalogContent.entry) => entry.href == "" ? entry.repo : entry.href

let title = (entry: CatalogContent.entry, ~className: string) => {
  let primary = primaryOf(entry)
  <h3 className>
    {primary == ""
      ? <>
          {entry.name->React.string}
          <span className="ix-sr"> {HeroContent.noLink->React.string} </span>
        </>
      : <a href=primary rel=?{relFor(primary)}> {entry.name->React.string} </a>}
  </h3>
}

// The status, preceded by "Featured" where an entry is one. Featured entries
// are marked in place, not repeated in a strip of their own.
let status = (entry: CatalogContent.entry) =>
  <>
    {entry.featured ? <span> {HeroContent.featuredLabel->React.string} </span> : React.null}
    <span> {entry.status->React.string} </span>
  </>

// "src", shown beside the status when the title already links to a site.
let source = (entry: CatalogContent.entry) =>
  entry.repo != "" && entry.href != ""
    ? <a
        className="ix-navlink"
        href=entry.repo
        rel=?{relFor(entry.repo)}
        ariaLabel={`${HeroContent.sourceLabel}: source for ${entry.name}`}>
        {HeroContent.sourceLabel->React.string}
      </a>
    : React.null

module Row = {
  @react.component
  let make = (~entry: CatalogContent.entry, ~index: int) =>
    <li id={anchorFor(entry.cat)} className="ix-row">
      <span className="ix-num"> {number(index)->React.string} </span>
      <span className="ix-label"> {CatalogContent.kindFor(entry.band).code->React.string} </span>
      {title(entry, ~className="ix-row__title")}
      <p className="ix-row__desc"> {entry.description->React.string} </p>
      <p className="ix-row__meta ix-label entry-meta">
        {status(entry)}
        {source(entry)}
      </p>
    </li>
}

module Plate = {
  @react.component
  let make = (~entry: CatalogContent.entry, ~index: int) =>
    <li
      id={anchorFor(entry.cat)} className={entry.featured ? "ix-plate ix-plate--ink" : "ix-plate"}>
      <div className="ix-plate__head">
        <span className="ix-label">
          {CatalogContent.kindFor(entry.band).code->React.string}
        </span>
        <span className="ix-plate__num"> {number(index)->React.string} </span>
      </div>
      {entry.image == ""
        ? React.null
        : <img className="ix-plate__art" src=entry.image alt="" loading=#lazy />}
      <div className="ix-plate__body">
        {title(entry, ~className="ix-plate__title")}
        <p className="ix-small plate-note"> {entry.description->React.string} </p>
        <p className="ix-label entry-meta">
          {status(entry)}
          {source(entry)}
        </p>
      </div>
    </li>
}
