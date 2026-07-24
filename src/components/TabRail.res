/** The bleed tab rail — the printed catalogue's page-edge tabs, running the
    full height of the viewport. This is where band colour commits at page
    scale; everywhere else it is a small mark.

    Below md it collapses to a 28px band stripe: the colour survives, the
    lettering does not. */
@react.component
let make = (~active: option<int>, ~onSelect: option<int> => unit) => {
  <div
    className="fixed inset-y-0 left-0 z-40 flex w-7 flex-col bg-card rule-r md:w-10"
    role="group"
    ariaLabel="Filter catalogue by kind">
    {CatalogContent.kinds
    ->Array.map(k => {
      let isOn = active == Some(k.band)
      <button
        key={Int.toString(k.band)}
        onClick={_ => onSelect(isOn ? None : Some(k.band))}
        ariaPressed={isOn ? #"true" : #"false"}
        ariaControls="catalogue-listing"
        ariaLabel={`${Int.toString(k.band)} · ${k.name} — ${k.note}`}
        className={"group relative flex flex-1 items-center justify-center rule-b transition-colors duration-100 hover:bg-background " ++ (
          isOn ? "bg-background" : ""
        )}>
        <span
          className="absolute inset-y-0 left-0 w-1.5"
          style={{backgroundColor: `hsl(var(--band-${Int.toString(k.band)}))`}}
          ariaHidden=true
        />
        <span
          className={"writing-vertical cat-label whitespace-nowrap " ++ (
            isOn ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}
          ariaHidden=true>
          <span className="hidden md:inline"> {`${Int.toString(k.band)} · ${k.name}`->React.string} </span>
          <span className="md:hidden"> {Int.toString(k.band)->React.string} </span>
        </span>
      </button>
    })
    ->React.array}
  </div>
}
