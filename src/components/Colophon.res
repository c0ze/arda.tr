/** Contact: the family treeline drifting slowly, then a bone bar with the
    address, the profiles and the colophon line. */
@react.component
let make = () => {
  let email = FooterContent.socialLinks->Array.find(l => l.icon == #Mail)
  let others = FooterContent.socialLinks->Array.filter(l => l.icon != #Mail)
  let link = (l: FooterContent.socialLink, text: string) =>
    <li key=l.name>
      <a href=l.href rel=?{l.rel == "" ? None : Some(l.rel)}> {text->React.string} </a>
    </li>

  <footer id="contact" className="foot" ariaLabelledby="contact-heading">
    <OneBit.Treeline className="foot-tl" seed=1 px=2. speed=6. />
    <div className="foot-bar">
      <div>
        <h2 id="contact-heading"> {FooterContent.ctaTitle->React.string} </h2>
        <ul>
          {switch email {
          | Some(l) => link(l, l.href->String.replace("mailto:", ""))
          | None => React.null
          }}
          {others->Array.map(l => link(l, l.name->String.toLowerCase))->React.array}
        </ul>
      </div>
      <p className="colophon">
        {FooterContent.ctaText->React.string}
        <br />
        {FooterContent.builtNote->React.string}
      </p>
    </div>
  </footer>
}
