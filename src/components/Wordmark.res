/** The arda.tr wordmark: Grenze Gotisch 800 outlined, in the text colour.
    The path data is brand/logo/wordmark.js, written by brand/logo/make-logo.cjs. */
type mark = {viewBox: string, transform: string, letters: string}
@module("../../brand/logo/wordmark.js") external mark: mark = "default"

@react.component
let make = () =>
  <svg className="ix-wordmark" viewBox=mark.viewBox role="img" ariaLabel=HeroContent.host>
    <path fill="currentColor" transform=mark.transform d=mark.letters />
  </svg>
