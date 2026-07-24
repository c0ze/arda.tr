/** The maker's own record — the catalogue's front-matter entry for the person
    who made everything else in it. Set as a spec sheet rather than an "about
    me" section: label/value pairs on the left, the note on the right. */
@react.component
let make = () => {
  let row = (label: string, value: React.element) =>
    <div key=label className="cat-row grid grid-cols-[7rem_1fr] gap-4 px-5 py-2.5 sm:px-7">
      <div className="cat-label text-muted-foreground"> {label->React.string} </div>
      <div className="text-[0.85rem] leading-snug"> value </div>
    </div>

  <section id="record" className="rule-heavy-b">
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-foreground px-5 py-2.5 text-background sm:px-7">
      <h2 className="cat-label"> {"▤ Maker's record"->React.string} </h2>
      <span className="cat-label opacity-70"> {AboutContent.recordCat->React.string} </span>
    </div>

    <div className="grid lg:grid-cols-2">
      <div className="rule-r">
        {row("Name", AboutContent.recordName->React.string)}
        {row("Title", AboutContent.recordTitle->React.string)}
        {AboutContent.facts
        ->Array.map(f => row(f.label, f.value->React.string))
        ->React.array}
        {row("Languages", AboutContent.recordLanguages->React.string)}
        {row(
          "Stack",
          AboutContent.tech->Array.join(" · ")->React.string,
        )}
      </div>

      <div className="flex flex-col gap-3 px-5 py-5 sm:px-7">
        {AboutContent.bio
        ->Array.mapWithIndex((para, i) =>
          <p key={Int.toString(i)} className="max-w-[68ch] text-[0.9rem] leading-relaxed text-muted-foreground">
            {para
            ->Array.mapWithIndex((seg, j) =>
              seg.emphasis
                ? <span key={Int.toString(j)} className="font-medium text-foreground">
                    {seg.text->React.string}
                  </span>
                : <React.Fragment key={Int.toString(j)}> {seg.text->React.string} </React.Fragment>
            )
            ->React.array}
          </p>
        )
        ->React.array}
      </div>
    </div>
  </section>
}
