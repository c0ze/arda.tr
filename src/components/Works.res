/** Works: every entry of every kind in one list. The kind filter narrows it;
    the view switch shows the same entries as rows or as plates. Filtering
    removes entries from the listing rather than dimming them, so the count in
    the status line is what is on screen. */

let pad2 = n => n->Int.toString->String.padStart(2, "0")

type view = List | Plates

@react.component
let make = (~active: option<int>, ~onSelect: option<int> => unit) => {
  let (view, setView) = React.useState(() => List)
  let entries = CatalogContent.entries
  let total = entries->Array.length
  let shown = switch active {
  | None => total
  | Some(b) => CatalogContent.countFor(b)
  }
  let visible = entries->Array.mapWithIndex((e, i) => (e, i))->Array.filter(((e, _)) =>
    switch active {
    | Some(b) => e.band == b
    | None => true
    }
  )

  <section id="catalogue" className="ix-wrap ix-section" ariaLabelledby="works-heading">
    <div className="ix-section__head">
      <Astryx.Heading level=2 id="works-heading">
        {HeroContent.worksTitle->React.string}
      </Astryx.Heading>
      <p className="ix-label">
        {`${Int.toString(total)} entries · ${CatalogContent.kinds
          ->Array.length
          ->Int.toString} kinds · ${HeroContent.worksTagline}`->React.string}
      </p>
    </div>

    <div className="works-tools">
      <Astryx.ToggleButtonGroup
        label=HeroContent.filterLabel
        size=#sm
        value={Nullable.make(
          switch active {
          | Some(b) => Int.toString(b)
          | None => "all"
          },
        )}
        onChange={v =>
          switch v->Nullable.toOption->Option.flatMap(s => Int.fromString(s)) {
          | Some(b) => onSelect(Some(b))
          | None => onSelect(None)
          }}>
        <Astryx.ToggleButton value="all" label={`${HeroContent.allKinds} ${pad2(total)}`} />
        {CatalogContent.kinds
        ->Array.map(k =>
          <Astryx.ToggleButton
            key={Int.toString(k.band)}
            value={Int.toString(k.band)}
            label={`${k.name} ${CatalogContent.countFor(k.band)->pad2}`}
            tooltip=k.note
          />
        )
        ->React.array}
      </Astryx.ToggleButtonGroup>
      <Astryx.ToggleButtonGroup
        label=HeroContent.viewLabel
        size=#sm
        value={Nullable.make(view == List ? "list" : "plates")}
        onChange={v => setView(_ => v->Nullable.toOption == Some("plates") ? Plates : List)}>
        <Astryx.ToggleButton value="list" label=HeroContent.viewList />
        <Astryx.ToggleButton value="plates" label=HeroContent.viewPlates />
      </Astryx.ToggleButtonGroup>
    </div>

    <div className="works-status" ariaLive=#polite>
      <p className="ix-label">
        {`Showing ${pad2(shown)} of ${pad2(total)}`->React.string}
        {switch active {
        | Some(b) =>
          let k = CatalogContent.kindFor(b)
          ` · ${k.name}: ${k.note}`->React.string
        | None => React.null
        }}
      </p>
      {active == None
        ? React.null
        : <Astryx.Button
            label=HeroContent.clearFilter variant=#ghost size=#sm onClick={_ => onSelect(None)}
          />}
    </div>

    {switch view {
    | List =>
      <ol id="catalogue-listing" className="ix-list">
        {visible
        ->Array.map(((e, i)) => <Entry.Row key=e.cat entry=e index=i />)
        ->React.array}
      </ol>
    | Plates =>
      <ul id="catalogue-listing" className="ix-plates">
        {visible
        ->Array.map(((e, i)) => <Entry.Plate key=e.cat entry=e index=i />)
        ->React.array}
      </ul>
    }}
  </section>
}
