/** The arda.tr wordmark: Archivo 800 outlined, its full stop in vermilion.
    The path data is brand/logo/wordmark.js, written by brand/logo/make-logo.cjs. */
type mark = {viewBox: string, transform: string, letters: string, dot: string}
@module("../../brand/logo/wordmark.js") external mark: mark = "default"

@react.component
let make = () =>
  <svg className="ix-wordmark" viewBox=mark.viewBox role="img" ariaLabel=HeroContent.host>
    <g transform=mark.transform>
      <path fill="currentColor" d=mark.letters />
      <path fill="var(--color-accent)" d=mark.dot />
    </g>
  </svg>
