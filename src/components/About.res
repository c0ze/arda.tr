/** About: the surname and what it means, the bio in one column, the facts as
    the family's key-and-value table, a wisp of the plume in the margin. The
    section keeps the id `record`: llms.txt and older links point at it. */
@react.component
let make = () => {
  let row = (label: string, value: string) =>
    <div key=label>
      <dt> {label->React.string} </dt>
      <dd> {value->React.string} </dd>
    </div>

  <section id="record" className="ix-wrap" ariaLabelledby="record-heading">
    <div className="ix-section about">
      <div className="about__words ix-reveal">
        <p className="ix-label ix-label--ember"> {AboutContent.title->React.string} </p>
        <Astryx.Heading level=2 id="record-heading">
          {AboutContent.surname->React.string}
        </Astryx.Heading>
        <p className="ix-note"> {AboutContent.surnameNote->React.string} </p>
        <div className="ix-stack about__bio">
          {AboutContent.bio
          ->Array.mapWithIndex((para, i) =>
            <p key={Int.toString(i)}>
              {para
              ->Array.mapWithIndex((seg, j) =>
                seg.emphasis
                  ? <strong key={Int.toString(j)}> {seg.text->React.string} </strong>
                  : <React.Fragment key={Int.toString(j)}>
                      {seg.text->React.string}
                    </React.Fragment>
              )
              ->React.array}
            </p>
          )
          ->React.array}
        </div>
      </div>
      <dl className="ix-kv about__facts ix-reveal">
        {AboutContent.facts->Array.map(f => row(f.label, f.value))->React.array}
        {row(AboutContent.languagesLabel, AboutContent.recordLanguages)}
        {row(AboutContent.stackLabel, AboutContent.tech->Array.join(" · "))}
      </dl>
      <span className="about__wisp ix-smoke">
        // data-smoke-video names the film brand/smoke.js plays over the image.
        {React.cloneElement(
          <img
            className="ix-art ix-art--drift"
            src="/art/wisp.webp"
            alt=""
            width="400"
            height="840"
            loading=#lazy
          />,
          {"data-smoke-video": "/art/wisp-smoke.mp4"},
        )}
      </span>
    </div>
  </section>
}
