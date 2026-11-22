/** Contact, then the colophon: the address and the profiles as the family's
    key-and-value table, and the closing line under a rule. */
@react.component
let make = () =>
  <footer id="contact" ariaLabelledby="contact-heading">
    <div className="ix-wrap ix-section">
      <div className="ix-section__head">
        <Astryx.Heading level=2 id="contact-heading">
          {FooterContent.ctaTitle->React.string}
        </Astryx.Heading>
        <p className="ix-muted"> {FooterContent.ctaText->React.string} </p>
      </div>
      <dl className="ix-kv">
        {FooterContent.socialLinks
        ->Array.map(l =>
          <div key=l.name>
            <dt> {l.name->React.string} </dt>
            <dd>
              <a href=l.href rel=?{l.rel == "" ? None : Some(l.rel)}>
                {l.href
                ->String.replace("mailto:", "")
                ->String.replace("https://", "")
                ->React.string}
              </a>
            </dd>
          </div>
        )
        ->React.array}
      </dl>
    </div>
    <div className="ix-foot">
      <div className="ix-wrap ix-foot__in">
        <p className="ix-label"> {HeroContent.host->React.string} </p>
        <p className="ix-small ix-muted"> {FooterContent.builtNote->React.string} </p>
      </div>
    </div>
  </footer>
