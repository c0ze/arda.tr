/** Works: every entry of every kind in one grid, opened like a directory
    listing. The kind filter is a row of directories; `*` (or "clear filter")
    shows everything again. Filtering removes cards from the listing rather
    than dimming them, so the count in the status line is what is on screen. */

let pad2 = n => n->Int.toString->String.padStart(2, "0")
let dir = (k: CatalogContent.kind) => k.name->String.toLowerCase ++ "/"

@react.component
let make = (~active: option<int>, ~onSelect: option<int> => unit) => {
  let entries = CatalogContent.entries
  let total = entries->Array.length
  let shown = switch active {
  | None => total
  | Some(b) => CatalogContent.countFor(b)
  }
  let kindArg = switch active {
  | None => "all"
  | Some(b) => CatalogContent.kindFor(b).name->String.toLowerCase
  }

  <section id="catalogue" className="works" ariaLabelledby="works-heading">
    <p className="prompt">
      {`${HeroContent.shellPrompt} `->React.string}
      <b> {`ls -la works/ --kind=${kindArg}`->React.string} </b>
      {" "->React.string}
      <span className="cur" ariaHidden=true />
    </p>
    <div className="sec-head">
      <h2 id="works-heading"> {"Works"->React.string} </h2>
      <small>
        {`${Int.toString(total)} entries · ${CatalogContent.kinds->Array.length->Int.toString} kinds`->React.string}
        <br />
        {HeroContent.worksTagline->React.string}
      </small>
    </div>

    <div className="kinds" role="group" ariaLabel="Filter by kind">
      <button
        type_="button"
        onClick={_ => onSelect(None)}
        ariaPressed={active == None ? #"true" : #"false"}
        ariaControls="catalogue-listing">
        <span>
          <span ariaHidden=true> {"*"->React.string} </span>
          <span className="sr-only"> {"all kinds"->React.string} </span>
        </span>
        {" "->React.string}
        <em> {pad2(total)->React.string} </em>
      </button>
      {CatalogContent.kinds
      ->Array.map(k => {
        let isOn = active == Some(k.band)
        <button
          key={Int.toString(k.band)}
          type_="button"
          title=k.note
          onClick={_ => onSelect(isOn ? None : Some(k.band))}
          ariaPressed={isOn ? #"true" : #"false"}
          ariaControls="catalogue-listing">
          <span> {dir(k)->React.string} </span>
          {" "->React.string}
          <em> {CatalogContent.countFor(k.band)->pad2->React.string} </em>
        </button>
      })
      ->React.array}
    </div>

    <p className="works-status" ariaLive=#polite>
      <span>
        {"showing "->React.string}
        <strong> {pad2(shown)->React.string} </strong>
        {" of "->React.string}
        <strong> {pad2(total)->React.string} </strong>
      </span>
      {switch active {
      | Some(b) =>
        let k = CatalogContent.kindFor(b)
        <>
          <span> {`${dir(k)} — ${k.note}`->React.string} </span>
          <button type_="button" onClick={_ => onSelect(None)}>
            {"clear filter"->React.string}
            <span ariaHidden=true> {" ×"->React.string} </span>
          </button>
        </>
      | None => <span> {"every kind · sorted by kind, then newest"->React.string} </span>
      }}
    </p>

    <div id="catalogue-listing" className="grid-works">
      {entries
      ->Array.mapWithIndex((e, i) =>
        switch active {
        | Some(b) if e.band != b => React.null
        | _ => <WorkCard key=e.cat entry=e index=i />
        }
      )
      ->React.array}
    </div>
  </section>
}
