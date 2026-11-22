/** About: who made all of it. The bio in one column, then the facts as the
    family's key-and-value table. The section keeps the id `record`: llms.txt
    and older links point at it. */
@react.component
let make = () => {
  let row = (label: string, value: string) =>
    <div key=label>
      <dt> {label->React.string} </dt>
      <dd> {value->React.string} </dd>
    </div>

  <section id="record" className="ix-wrap ix-section" ariaLabelledby="record-heading">
    <div className="ix-section__head">
      <Astryx.Heading level=2 id="record-heading">
        {AboutContent.title->React.string}
      </Astryx.Heading>
    </div>

    <div className="about">
      <div className="ix-stack ix-prose">
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

      <dl className="ix-kv">
        {AboutContent.facts->Array.map(f => row(f.label, f.value))->React.array}
        {row(AboutContent.languagesLabel, AboutContent.recordLanguages)}
        {row(AboutContent.stackLabel, AboutContent.tech->Array.join(" · "))}
      </dl>
    </div>
  </section>
}
