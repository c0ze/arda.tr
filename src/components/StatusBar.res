/** The family status bar: site mark, nav, Tokyo time, rendition switch. Sits
    over the top of the hero behind a short scrim. Below 700px the path and
    the clock drop out so the bar never wraps or scrolls sideways. */
@react.component
let make = () =>
  <div className="bar">
    <a href="#top" className="bar-site">
      <i ariaHidden=true />
      {HeroContent.host->React.string}
      <span ariaHidden=true> {HeroContent.path->React.string} </span>
    </a>
    <nav ariaLabel="Site">
      {HeroContent.nav
      ->Array.map(l => <a key=l.label href=l.href> {l.label->React.string} </a>)
      ->React.array}
    </nav>
    <span className="bar-sp" />
    <TokyoClock className="bar-clock" />
    <ThemeToggleBridge />
  </div>
