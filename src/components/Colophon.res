/** Contact, then the colophon: two ways on (the assistant, the résumé), the
    address and the profiles, the forest the plume rose from, and the closing
    line under a rule. */
@react.component
let make = () =>
  <footer id="contact" ariaLabelledby="contact-heading">
    <div className="ix-wrap">
      <div className="ix-section contact">
        <div className="contact__words ix-reveal">
          <p className="ix-label ix-label--ember"> {FooterContent.ctaTitle->React.string} </p>
          <Astryx.Heading level=2 id="contact-heading">
            {FooterContent.ctaHeading->React.string}
          </Astryx.Heading>
          <p> {FooterContent.ctaText->React.string} </p>
        </div>
        <div className="contact__ways ix-reveal">
          <Astryx.HStack gap=3. wrap=#wrap>
            <Astryx.Button
              label=FooterContent.askCta
              variant=#primary
              onClick={e =>
                ChatWidget.openChat(Nullable.make(ReactEvent.Mouse.currentTarget(e)->Obj.magic))}
            />
            <Astryx.Button label=FooterContent.resumeCta href=FooterContent.resumeHref />
          </Astryx.HStack>
          <ul className="contact__links">
            {FooterContent.socialLinks
            ->Array.map(l =>
              <li key=l.name>
                <a href=l.href rel=?{l.rel == "" ? None : Some(l.rel)}>
                  {(l.icon == #Mail ? l.href->String.replace("mailto:", "") : l.name)->React.string}
                </a>
              </li>
            )
            ->React.array}
          </ul>
        </div>
      </div>
      <img
        className="ix-art contact__forest"
        src="/art/forest.webp"
        alt=""
        width="1320"
        height="300"
        loading=#lazy
      />
      <div className="ix-foot">
        <div className="ix-foot__in">
          <span className="foot__mark">
            <img className="ix-emblem" src="/art/emblem.webp" alt="" width="40" height="40" loading=#lazy />
            {HeroContent.host->React.string}
          </span>
          <span> {FooterContent.builtNote->React.string} </span>
        </div>
      </div>
    </div>
  </footer>
