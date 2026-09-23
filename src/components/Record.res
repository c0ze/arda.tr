/** The record: who made all of it, set as a terminal spec sheet — `key: value`
    rows on the left, the bio on the right. */
@react.component
let make = () => {
  let row = (label: string, value: string, ~mono=false) =>
    <div key=label>
      <dt> {label->String.toLowerCase->React.string} </dt>
      <dd className={mono ? "mono" : ""}> {value->React.string} </dd>
    </div>

  <section id="record" className="record" ariaLabelledby="record-heading">
    <p className="prompt">
      {`${HeroContent.shellPrompt} `->React.string}
      <b> {HeroContent.recordCommand->React.string} </b>
    </p>
    <div className="sec-head">
      <h2 id="record-heading"> {"Record"->React.string} </h2>
      <small> {AboutContent.recordCat->React.string} </small>
    </div>

    <div className="record-grid">
      <dl className="spec">
        {row("Name", AboutContent.recordName)}
        {AboutContent.facts->Array.map(f => row(f.label, f.value))->React.array}
        {row("Languages", AboutContent.recordLanguages)}
        {row("Stack", AboutContent.tech->Array.join(" · "), ~mono=true)}
      </dl>

      <div className="bio">
        {AboutContent.bio
        ->Array.mapWithIndex((para, i) =>
          <p key={Int.toString(i)}>
            {para
            ->Array.mapWithIndex((seg, j) =>
              seg.emphasis
                ? <strong key={Int.toString(j)}> {seg.text->React.string} </strong>
                : <React.Fragment key={Int.toString(j)}> {seg.text->React.string} </React.Fragment>
            )
            ->React.array}
          </p>
        )
        ->React.array}
      </div>
    </div>
  </section>
}
