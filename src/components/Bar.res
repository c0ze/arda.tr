/** The family bar: the wordmark, the nav, the scheme switch, a rule beneath.

    The scheme switch shows the scheme it would switch to. Both labels are in
    the markup and brand.css shows one of them, so the prerendered page is
    right before this component mounts. */

@module("../../brand/scheme.js") external toggleScheme: string => string = "toggleScheme"
@module("../../brand/scheme.js") external watchScheme: string => unit => unit = "watchScheme"

// The localStorage key the pinned scheme is stored under (as index.html's head script).
let schemeKey = "theme"

let schemeOption = (~shownWhen: string, ~target: string) =>
  React.cloneElement(
    <span>
      <span className="ix-sr"> {HeroContent.schemeBefore->React.string} </span>
      {target->React.string}
      <span className="ix-sr"> {HeroContent.schemeAfter->React.string} </span>
    </span>,
    {"data-when": shownWhen},
  )

@react.component
let make = () => {
  // A pin set in another tab reaches this one.
  React.useEffect0(() => Some(watchScheme(schemeKey)))

  <header id="top" className="ix-bar">
    <div className="ix-wrap ix-bar__in">
      <a className="ix-bar__brand" href="#top">
        <Wordmark />
      </a>
      <nav className="ix-bar__nav" ariaLabel="Site">
        {HeroContent.nav
        ->Array.map(l =>
          <a key=l.label href=l.href rel=?{l.rel == "" ? None : Some(l.rel)}>
            {l.label->React.string}
          </a>
        )
        ->React.array}
        <button
          type_="button"
          className="ix-navlink ix-scheme"
          onClick={_ => toggleScheme(schemeKey)->ignore}>
          {schemeOption(~shownWhen="light", ~target=HeroContent.schemeDark)}
          {schemeOption(~shownWhen="dark", ~target=HeroContent.schemeLight)}
        </button>
      </nav>
    </div>
  </header>
}
