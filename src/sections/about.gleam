import content/about as about_content
import content/types.{type Highlight}
import gleam/list
import icons
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import site_config.{section_ids}
import ui_helpers

pub fn render() -> Element(msg) {
  html.section(
    [
      attr.attribute("id", section_ids.about),
      attr.class("bg-card/30 px-6 py-24"),
    ],
    [
      html.div([attr.class("mx-auto max-w-4xl space-y-16")], [
        ui_helpers.section_heading("01 — About", "About", about_content.summary),
        bio_panel(),
        html.div(
          [attr.class("grid gap-6 md:grid-cols-3")],
          list.map(about_content.highlights, render_highlight),
        ),
      ]),
    ],
  )
}

fn bio_panel() -> Element(msg) {
  html.div(
    [
      attr.class(
        "space-y-4 rounded-xl border border-border border-l-[3px] border-l-primary/40 bg-card p-8",
      ),
    ],
    [
      html.p([attr.class("leading-relaxed text-foreground/90")], [
        html.text("I've been living in "),
        html.span([attr.class("font-medium text-primary")], [
          html.text("Japan since 2004"),
        ]),
        html.text(
          ", where I earned my Master's degree in Computer Science from Keio University (2006-2008). I also pursued PhD studies in Embedded Processor Design and Optimization from 2008-2011.",
        ),
      ]),
      html.p([attr.class("leading-relaxed text-foreground/90")], [
        html.text("With over "),
        html.span([attr.class("font-medium text-primary")], [
          html.text("15 years of professional experience"),
        ]),
        html.text(
          ", I've worked across the full technology stack - from embedded systems to cloud architecture. Currently serving as a Systems Architect at Veltra since 2024, I specialize in integrating legacy applications with AI using MCP and building scalable infrastructure solutions.",
        ),
      ]),
      html.p([attr.class("leading-relaxed text-foreground/90")], [
        html.text(
          "My journey has taken me through various roles at companies like Gaussy, Robotfund, and Mobilous, always focusing on pragmatic solutions and continuous learning.",
        ),
      ]),
    ],
  )
}

fn render_highlight(highlight: Highlight) -> Element(msg) {
  html.div(
    [
      attr.class(
        "space-y-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)]",
      ),
    ],
    [
      html.div(
        [
          attr.class(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10",
          ),
        ],
        [icons.render(highlight.icon, "h-5 w-5 text-primary")],
      ),
      html.h3([attr.class("text-lg font-medium text-card-foreground")], [
        html.text(highlight.title),
      ]),
      html.p([attr.class("text-sm leading-relaxed text-muted-foreground")], [
        html.text(highlight.description),
      ]),
    ],
  )
}
