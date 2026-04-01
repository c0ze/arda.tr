import content/portfolio as portfolio_content
import content/types.{type PortfolioItem, type PortfolioSection}
import gleam/list
import icons
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import site_config.{section_ids}
import ui_helpers
import ui_types.{ExternalLink, Gamepad2, Small, Solid}

pub fn render() -> Element(msg) {
  html.section(
    [
      attr.attribute("id", section_ids.portfolio),
      attr.class("bg-background px-6 py-24"),
    ],
    [
      html.div(
        [attr.class("mx-auto max-w-5xl space-y-16")],
        list.map(portfolio_content.sections, render_section),
      ),
    ],
  )
}

fn render_section(section: PortfolioSection) -> Element(msg) {
  html.div([attr.class("space-y-8")], [
    ui_helpers.section_heading(
      section.label,
      section.title,
      section.description,
    ),
    html.div(
      [attr.class("grid gap-6 md:grid-cols-2 lg:grid-cols-3")],
      list.map(section.items, render_item),
    ),
  ])
}

fn render_item(item: PortfolioItem) -> Element(msg) {
  html.div(
    [
      attr.class(
        "group overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)]",
      ),
    ],
    [
      render_image(item),
      html.div([attr.class("flex flex-col space-y-1.5 p-6 pb-2")], [
        html.div(
          [attr.class("mb-2 flex flex-wrap gap-2")],
          list.map(item.tags, render_tag),
        ),
        html.h3(
          [
            attr.class(
              "flex items-center justify-between text-base font-semibold leading-none tracking-tight",
            ),
          ],
          [
            html.text(item.title),
            html.a(
              [
                attr.attribute("href", item.link),
                attr.attribute("target", "_blank"),
                attr.attribute("rel", "noopener noreferrer"),
                attr.class(
                  "text-muted-foreground transition-colors hover:text-primary",
                ),
              ],
              [icons.render(ExternalLink, "h-4 w-4")],
            ),
          ],
        ),
      ]),
      html.div([attr.class("p-6 pt-0")], [
        html.p([attr.class("text-sm text-muted-foreground")], [
          html.text(item.description),
        ]),
      ]),
    ],
  )
}

fn render_image(item: PortfolioItem) -> Element(msg) {
  let image_class =
    "h-full w-full transition-transform duration-500 group-hover:scale-105"
    <> case item.contain_image {
      True -> " object-contain"
      False -> " object-cover"
    }

  let image_link =
    html.a(
      [
        attr.attribute("href", item.link),
        attr.attribute("target", "_blank"),
        attr.attribute("rel", "noopener noreferrer"),
        attr.class("block h-full w-full cursor-pointer"),
      ],
      [
        html.img([
          attr.attribute("src", item.image),
          attr.attribute("alt", item.title),
          attr.attribute("loading", "lazy"),
          attr.class(image_class),
        ]),
      ],
    )

  let children = case item.playable {
    True -> [
      image_link,
      html.div(
        [
          attr.class(
            "pointer-events-none absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          ),
        ],
        [
          ui_helpers.button_link(
            item.link,
            "Play Now",
            Gamepad2,
            Solid,
            Small,
            "pointer-events-auto",
          ),
        ],
      ),
    ]

    False -> [image_link]
  }

  html.div(
    [attr.class("relative aspect-video w-full overflow-hidden bg-muted")],
    children,
  )
}

fn render_tag(tag: String) -> Element(msg) {
  html.span(
    [
      attr.class(
        "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
      ),
    ],
    [html.text(tag)],
  )
}
