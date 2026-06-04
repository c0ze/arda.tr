@react.component
let make = (~eyebrow, ~title, ~description, ~align="left") => {
  let centered = align == "center"
  let containerClass =
    "flex flex-col gap-4 " ++ (centered ? "items-center text-center" : "items-start text-left")
  let descriptionClass =
    "max-w-xl text-base leading-relaxed text-muted-foreground" ++ (centered ? " mx-auto" : "")

  <div className={containerClass}>
    <span
      className="inline-flex items-center gap-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.32em] text-primary/85">
      <span className="h-px w-8 bg-gradient-aurora" ariaHidden=true />
      {eyebrow->React.string}
    </span>
    <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
      {title->React.string}
    </h2>
    <p className={descriptionClass}> {description->React.string} </p>
  </div>
}
