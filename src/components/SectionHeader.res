@react.component
let make = (~eyebrow, ~title, ~description) => {
  <div className="text-center space-y-3">
    <span className="font-mono text-xs text-primary/70 tracking-[0.2em] uppercase">
      {eyebrow->React.string}
    </span>
    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
      {title->React.string}
    </h2>
    <p className="text-muted-foreground max-w-xl mx-auto">
      {description->React.string}
    </p>
  </div>
}
