/** The listing. One flat table absorbing every kind of work, with the band
    facets above it and the bleed tab rail down the page edge — both driving the
    same filter state.

    No section headers per kind: splitting the table into per-kind territories
    is exactly what this design refuses. The key is printed beneath the table,
    where a catalogue prints it — without it the band code is a private joke. */
@react.component
let make = (~active: option<int>, ~onSelect: option<int> => unit) => {
  let rows = switch active {
  | None => CatalogContent.entries
  | Some(b) => CatalogContent.entries->Array.filter(e => e.band == b)
  }

  let total = CatalogContent.entries->Array.length
  let shown = rows->Array.length

  <section id="catalogue" ariaLabelledby="catalogue-heading">
    <TabRail active onSelect />

    /* The annex bar. The featured plates have just shown three wildly different
       artifacts at scale; this drops the visitor into the flat table where all
       three are simply rows. The demotion is the argument. */
    <div
      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-foreground px-5 py-2.5 text-background sm:px-7">
      <h2 id="catalogue-heading" className="cat-label"> {"▤ Full catalogue"->React.string} </h2>
      <span className="cat-label opacity-70">
        {`all ${Int.toString(total)} entries, every kind, one table`->React.string}
      </span>
    </div>

    /* Facet row — the distributor's parametric selector, stating the taxonomy
       and its counts outright. The band shows as a swatch, not a full-bleed
       stripe: the rail is where colour commits at page scale, and seven
       contiguous stripes here would read as a decorative spectrum. */
    <div className="grid grid-cols-2 rule-heavy-b sm:grid-cols-4 lg:grid-cols-7" role="group" ariaLabel="Filter by kind">
      {CatalogContent.kinds
      ->Array.map(k => {
        let isOn = active == Some(k.band)
        <button
          key={Int.toString(k.band)}
          onClick={_ => onSelect(isOn ? None : Some(k.band))}
          ariaPressed={isOn ? #"true" : #"false"}
          ariaControls="catalogue-listing"
          className={"rule-r rule-b px-3 pb-3 pt-2.5 text-left transition-colors duration-100 last:border-r-0 hover:bg-card lg:border-b-0 " ++ (
            isOn ? "bg-card" : ""
          )}>
          <span className="flex items-center gap-1.5">
            <span
              className="band-mark !h-2.5 !w-2.5"
              style={{backgroundColor: `hsl(var(--band-${Int.toString(k.band)}))`}}
              ariaHidden=true
            />
            <span className="cat-label text-muted-foreground">
              {`Band ${Int.toString(k.band)}`->React.string}
            </span>
          </span>
          <span className="mt-0.5 block font-display text-base font-semibold">
            {k.name->React.string}
          </span>
          <span className="mt-1 block font-mono text-xl leading-none">
            {CatalogContent.countFor(k.band)->Int.toString->String.padStart(2, "0")->React.string}
          </span>
          <span className="mt-1 block font-mono text-[0.6rem] leading-tight text-muted-foreground">
            {k.note->React.string}
          </span>
        </button>
      })
      ->React.array}
    </div>

    /* Status line — what the table is currently showing. */
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-card px-5 py-2 rule-b sm:px-7"
      ariaLive=#polite>
      <span className="cat-label text-muted-foreground">
        {"Showing "->React.string}
        <span className="text-foreground"> {Int.toString(shown)->React.string} </span>
        {" of "->React.string}
        <span className="text-foreground"> {Int.toString(total)->React.string} </span>
      </span>
      {switch active {
      | Some(b) =>
        <>
          <span className="cat-label text-muted-foreground">
            {"Band "->React.string}
            <span className="text-foreground">
              {`${Int.toString(b)} · ${CatalogContent.kindFor(b).name}`->React.string}
            </span>
          </span>
          <button onClick={_ => onSelect(None)} className="cat-label underline">
            {"Clear filter ×"->React.string}
          </button>
        </>
      | None => <span className="cat-label text-muted-foreground"> {"All kinds"->React.string} </span>
      }}
      <span className="cat-label ml-auto text-muted-foreground">
        {"Sorted by band, then newest"->React.string}
      </span>
    </div>

    <div className="cat-head cat-cols px-5 sm:px-7" ariaHidden=true>
      <div> {"Cat. No."->React.string} </div>
      <div />
      <div> {"Entry"->React.string} </div>
      <div> {"Description"->React.string} </div>
      <div> {"Spec"->React.string} </div>
      <div> {"Yr"->React.string} </div>
      <div className="text-right"> {"Status"->React.string} </div>
    </div>

    <div id="catalogue-listing">
      {rows->Array.map(e => <CatalogRow key={e.cat} entry=e />)->React.array}
    </div>

    /* The key. IEC 60062 is the reason the colours are these colours; printed
       here so the code is legible to someone who has never read a resistor. */
    <div className="rule-heavy-b bg-card px-5 py-4 sm:px-7">
      <h3 className="cat-label mb-2.5 text-muted-foreground">
        {"Key — band code (IEC 60062)"->React.string}
      </h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-4">
        {CatalogContent.kinds
        ->Array.map(k =>
          <div key={Int.toString(k.band)} className="flex items-baseline gap-2">
            <span
              className="band-mark !h-2.5 !w-2.5 translate-y-px"
              style={{backgroundColor: `hsl(var(--band-${Int.toString(k.band)}))`}}
              ariaHidden=true
            />
            <dt className="font-mono text-[0.68rem] text-muted-foreground">
              {Int.toString(k.band)->React.string}
            </dt>
            <dd className="font-mono text-[0.68rem]">
              {k.name->React.string}
              <span className="text-muted-foreground"> {` — ${k.note}`->React.string} </span>
            </dd>
          </div>
        )
        ->React.array}
      </dl>
      <p className="mt-3 font-mono text-[0.62rem] leading-relaxed text-muted-foreground">
        {"Catalogue numbers read AK · band · serial. A dashed status chip means the entry has no public link."->React.string}
      </p>
    </div>
  </section>
}
