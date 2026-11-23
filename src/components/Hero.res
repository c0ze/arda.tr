/** The first screen's words: the name in blackletter (the page's only h1),
    what he does, and one paragraph. The plume beside them is App.res's. */
@react.component
let make = () =>
  <section className="hero" ariaLabelledby="who">
    <h1 id="who" className="ix-display ix-emerge">
      {HeroContent.nameLines
      ->Array.mapWithIndex((line, i) =>
        <React.Fragment key={Int.toString(i)}>
          {i > 0 ? <br /> : React.null}
          {line->React.string}
        </React.Fragment>
      )
      ->React.array}
    </h1>
    <p className="ix-label hero__kicker"> {HeroContent.kicker->React.string} </p>
    <p className="ix-lede">
      {HeroContent.introLead->React.string}
      {HeroContent.introRest->React.string}
    </p>
  </section>
