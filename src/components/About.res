let renderHighlightIcon = (icon: AboutContent.highlightIcon) =>
  switch icon {
  | Code2 => Icons.code2(~className="w-5 h-5 text-primary", ())
  | Globe => Icons.globe(~className="w-5 h-5 text-primary", ())
  | Lightbulb => Icons.lightbulb(~className="w-5 h-5 text-primary", ())
  }

let renderSegment = (index, segment: AboutContent.segment) =>
  if segment.emphasis {
    <span key={Int.toString(index)} className="text-primary font-medium">
      {segment.text->React.string}
    </span>
  } else {
    <React.Fragment key={Int.toString(index)}> {segment.text->React.string} </React.Fragment>
  }

let renderParagraph = (index, paragraph: array<AboutContent.segment>) =>
  <p key={Int.toString(index)} className="text-foreground/90 leading-relaxed">
    {paragraph->Array.mapWithIndex((segment, i) => renderSegment(i, segment))->React.array}
  </p>

@react.component
let make = () => {
  <section id={SiteConfig.about} className="py-24 px-6 bg-card/30">
    <div className="max-w-4xl mx-auto space-y-16">
      <SectionHeader
        eyebrow={AboutContent.eyebrow}
        title={AboutContent.title}
        description={AboutContent.description}
      />

      <div className="bg-card border border-border border-l-[3px] border-l-primary/40 rounded-xl p-8 space-y-4">
        {AboutContent.bio
        ->Array.mapWithIndex((paragraph, index) => renderParagraph(index, paragraph))
        ->React.array}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {AboutContent.highlights
        ->Array.map((item: AboutContent.highlight) =>
          <Card
            key={item.title}
            className="p-6 space-y-4 bg-card border-border hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)] transition-all">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {renderHighlightIcon(item.icon)}
            </div>
            <h3 className="text-lg font-medium text-card-foreground">
              {item.title->React.string}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description->React.string}
            </p>
          </Card>
        )
        ->React.array}
      </div>
    </div>
  </section>
}
