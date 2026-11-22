/** The first screen: who this is, set small; the brand line, set large and
    closed by the vermilion full stop; one paragraph; two ways on. The name is
    the page's only h1. */
@react.component
let make = () =>
  <section className="ix-wrap hero" ariaLabelledby="who">
    <div className="hero__who">
      <h1 id="who" className="ix-label hero__name"> {HeroContent.name->React.string} </h1>
      <span className="ix-label"> {HeroContent.kicker->React.string} </span>
    </div>
    <p className="ix-display hero__line">
      {HeroContent.headlineLines
      ->Array.mapWithIndex((line, i) =>
        <React.Fragment key={Int.toString(i)}>
          {i > 0 ? <br /> : React.null}
          {line->React.string}
        </React.Fragment>
      )
      ->React.array}
      <span className="ix-dot"> {"."->React.string} </span>
    </p>
    <p className="ix-lede">
      <strong> {HeroContent.introLead->React.string} </strong>
      {HeroContent.introRest->React.string}
    </p>
    <Astryx.HStack gap=3. wrap=#wrap className="hero__ways">
      <Astryx.Button label=HeroContent.worksCta variant=#primary size=#lg href="#catalogue" />
      <Astryx.Button
        label=HeroContent.askLabel
        size=#lg
        onClick={e => ChatWidget.openChat(Nullable.make(ReactEvent.Mouse.currentTarget(e)->Obj.magic))}
      />
    </Astryx.HStack>
  </section>
