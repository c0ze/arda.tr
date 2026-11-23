/** Sparks that rise through a piece of artwork (brand.css, .ix-embers).
    Decoration: hidden from assistive technology, still under reduced motion. */
@react.component
let make = () =>
  <span className="ix-embers" ariaHidden=true>
    {Array.fromInitializer(~length=9, i => <i key={Int.toString(i)} />)->React.array}
  </span>
