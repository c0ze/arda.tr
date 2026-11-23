/** Works: five categories, each a block that opens to its entries. The
    blocks are <details>, so they open without script and their contents stay
    findable; several can be open at once. The first is open on arrival.

    An entry keeps its catalogue-number id (#AK-2-0142), so old deep links
    still land: App.tsx opens the block that holds the target. */

let romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
let roman = i => romans->Array.get(i)->Option.getOr(Int.toString(i + 1))

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

// The entry's name: a link to its site, or to its source when that is all it has.
let nameOf = (entry: CatalogContent.entry) => {
  let primary = primaryOf(entry)
  primary == ""
    ? <>
        {entry.name->React.string}
        <span className="ix-sr"> {HeroContent.noLink->React.string} </span>
      </>
    : <a href=primary rel=?{relFor(primary)}> {entry.name->React.string} </a>
}

// "source", when the name already links to a site.
let source = (entry: CatalogContent.entry) =>
  entry.repo != "" && entry.href != ""
    ? <>
        {" "->React.string}
        <a
          href=entry.repo
          rel=?{relFor(entry.repo)}
          ariaLabel={`${HeroContent.sourceLabel}: source for ${entry.name}`}>
          {HeroContent.sourceLabel->React.string}
        </a>
      </>
    : React.null

module Entry = {
  @react.component
  let make = (~entry: CatalogContent.entry) =>
    <li id={anchorFor(entry.cat)} className="ix-entry">
      <h3 className="ix-entry__name"> {nameOf(entry)} </h3>
      <p className="ix-entry__desc">
        {entry.status == "DISCONTINUED"
          ? <>
              <span className="ix-entry__ended"> {HeroContent.discontinuedLabel->React.string} </span>
              {" "->React.string}
            </>
          : React.null}
        {entry.description->React.string}
        {source(entry)}
      </p>
    </li>
}

// Entries that share a group sit on one line under the group's name.
module Group = {
  @react.component
  let make = (~name: string, ~entries: array<CatalogContent.entry>) =>
    <li className="ix-entry">
      <h3 className="ix-entry__name"> {name->React.string} </h3>
      <p className="ix-entry__desc">
        {entries
        ->Array.mapWithIndex((e, i) =>
          <span key=e.cat id={anchorFor(e.cat)} title=e.description>
            {i > 0 ? ", "->React.string : React.null}
            {nameOf(e)}
          </span>
        )
        ->React.array}
      </p>
    </li>
}

module Category = {
  @react.component
  let make = (~category: CatalogContent.category, ~index: int) => {
    let entries = CatalogContent.entriesIn(category.id)
    let single = entries->Array.filter(e => e.group == "")
    let groupNames = entries->Array.filterMap(e => e.group == "" ? None : Some(e.group))
    let groups = groupNames->Array.filterWithIndex((g, i) => groupNames->Array.indexOf(g) == i)

    // `open` is only the state on arrival; the browser owns it after that.
    React.cloneElement(
      <details className="ix-cat ix-reveal" id={`works-${category.id}`}>
        <summary>
          <span className="ix-num"> {roman(index)->React.string} </span>
          <span className="ix-cat__name">
            <span className="ix-name"> {category.name->React.string} </span>
          </span>
          <span className="ix-cat__preview"> {category.note->React.string} </span>
        </summary>
        <div className="ix-cat__body">
          <ul className="ix-entries">
            {single->Array.map(e => <Entry key=e.cat entry=e />)->React.array}
            {groups
            ->Array.map(g =>
              <Group key=g name=g entries={entries->Array.filter(e => e.group == g)} />
            )
            ->React.array}
          </ul>
        </div>
      </details>,
      index == 0 ? {"open": true} : Object.make(),
    )
  }
}

@react.component
let make = () =>
  <section id="catalogue" className="works" ariaLabelledby="works-heading">
    <h2 id="works-heading" className="ix-label ix-label--ember works__label">
      {HeroContent.worksTitle->React.string}
    </h2>
    <div className="ix-cats">
      {CatalogContent.categories
      ->Array.mapWithIndex((c, i) => <Category key=c.id category=c index=i />)
      ->React.array}
    </div>
  </section>
