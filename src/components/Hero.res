/** The first viewport: a night spruce valley dithered to one bit and scrolling
    in parallax, the name set huge in the dark sky, the intro on solid backing,
    a coordinates tag riding the radio mast, and Pagan's logo bottom-right.

    Every piece of text over the forest sits on a solid --bg backing; the name
    gets one too on narrow screens, where the ridge climbs behind it. */

/* Positions the mast tag from the forest's per-frame callback. Written to the
   DOM directly: a React state update 30 times a second would re-render the
   hero for nothing. Hidden while the mast is off-canvas, too close to the
   right edge, or back on the text side of the sky. */
let placeMastTag: (Nullable.t<Dom.element>, Nullable.t<float>, float) => unit = %raw(`
  function (el, x, y) {
    if (!el) return;
    var w = el.parentElement ? el.parentElement.clientWidth : window.innerWidth;
    if (x == null || x > w - 260 || x < w * 0.55) { el.style.opacity = "0"; return; }
    el.style.opacity = "1";
    el.style.transform = "translate(" + Math.round(x + 58) + "px," + Math.round(y - 12) + "px)";
  }
`)

@react.component
let make = () => {
  let geoRef = React.useRef(Nullable.null)
  let onMast = (x, y) => placeMastTag(geoRef.current, x, y)

  <header id="top" className="hero">
    <OneBit.Forest className="hero-forest" onMast />
    <StatusBar />
    <span className="tick tl" ariaHidden=true />
    <span className="tick tr" ariaHidden=true />
    <span className="tick bl" ariaHidden=true />
    <span className="tick br" ariaHidden=true />
    <div ref={ReactDOM.Ref.domRef(geoRef)} className="geo" ariaHidden=true>
      {HeroContent.mastCoords->React.string}
      <br />
      {HeroContent.mastPlace->React.string}
    </div>
    <div className="ident">
      <p className="kicker"> {HeroContent.kicker->React.string} </p>
      <h1>
        {HeroContent.nameLines
        ->Array.mapWithIndex((line, i) =>
          <React.Fragment key={Int.toString(i)}>
            {i > 0 ? " "->React.string : React.null}
            <span> {line->React.string} </span>
          </React.Fragment>
        )
        ->React.array}
      </h1>
      <div className="intro">
        <p>
          <b> {HeroContent.introLead->React.string} </b>
          {HeroContent.introRest->React.string}
        </p>
        <a className="cta" href="#catalogue"> {HeroContent.worksCta->React.string} </a>
        <button
          type_="button"
          className="cta ghost"
          ariaLabel=HeroContent.askLabel
          onClick={_ => ChatWidget.openChat()}>
          {HeroContent.askCta->React.string}
          <span ariaHidden=true> {" ▸"->React.string} </span>
        </button>
      </div>
    </div>
    <a className="pagan" href=HeroContent.paganHref rel="noopener noreferrer">
      <OneBit.Dithered src=HeroContent.paganImage px=1.5 invert=false contrast=1.6 lift={-0.05} />
      <p>
        <b> {HeroContent.paganName->React.string} </b>
        {` · ${HeroContent.paganNote} · ${HeroContent.paganHost} ↗`->React.string}
      </p>
    </a>
  </header>
}
