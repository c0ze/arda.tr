/** The family bar: the emblem and the wordmark, the nav, the scheme switch.

    arda.tr is dark unless the visitor pins light. The switch shows the scheme
    it would switch to: both labels are in the markup and brand.css shows one
    of them, so the prerendered page is right before this component mounts. */

@module("../../brand/scheme.js")
external toggleScheme: (string, string) => string = "toggleScheme"
@module("../../brand/scheme.js")
external watchScheme: (string, string) => unit => unit = "watchScheme"

// The localStorage key the pinned scheme is stored under, and the scheme
// shown without a pin (both as in index.html's head script and App.tsx).
let schemeKey = "theme"
let schemeDefault = "dark"

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
  React.useEffect0(() => Some(watchScheme(schemeKey, schemeDefault)))

  <header id="top">
    <div className="ix-wrap ix-bar__in">
      <a className="ix-bar__brand" href="#top">
        <img className="ix-emblem" src="/art/emblem.webp" alt="" width="40" height="40" />
        <Wordmark />
      </a>
      <nav className="ix-bar__nav" ariaLabel="Site">
        {HeroContent.nav
        ->Array.map(l =>
          React.cloneElement(
            <a key=l.label href=l.href rel=?{l.rel == "" ? None : Some(l.rel)}>
              {l.label->React.string}
            </a>,
            l.accent ? {"data-accent": ""} : Object.make(),
          )
        )
        ->React.array}
        <button
          type_="button"
          className="ix-navlink ix-scheme"
          onClick={_ => toggleScheme(schemeKey, schemeDefault)->ignore}>
          {schemeOption(~shownWhen="light", ~target=HeroContent.schemeDark)}
          {schemeOption(~shownWhen="dark", ~target=HeroContent.schemeLight)}
        </button>
      </nav>
    </div>
  </header>
}
