import content/footer as footer_content
import content/types.{type SocialLink, EmailLink, FediverseLink}
import gleam/int
import gleam/list
import icons
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html

pub fn render(current_year: Int) -> Element(msg) {
  html.footer([attr.class("border-t border-border bg-card/50 px-6 py-12")], [
    html.div([attr.class("mx-auto max-w-4xl")], [
      html.div(
        [
          attr.class(
            "flex flex-col items-center justify-between gap-6 md:flex-row",
          ),
        ],
        [
          html.div([attr.class("space-y-2 text-center md:text-left")], [
            html.p([attr.class("text-sm text-muted-foreground")], [
              html.text(
                "© " <> int.to_string(current_year) <> " Arda Karaduman",
              ),
            ]),
            html.p([attr.class("text-xs text-muted-foreground/60")], [
              html.text("Themes by "),
              html.a(
                [
                  attr.attribute("href", "https://draculatheme.com/pro"),
                  attr.attribute("target", "_blank"),
                  attr.attribute("rel", "noopener noreferrer"),
                  attr.class(
                    "underline underline-offset-2 transition-colors hover:text-primary",
                  ),
                ],
                [html.text("Dracula Pro")],
              ),
            ]),
          ]),
          html.div(
            [attr.class("flex gap-3")],
            list.map(footer_content.links, render_link),
          ),
        ],
      ),
    ]),
  ])
}

fn render_link(link: SocialLink) -> Element(msg) {
  let attrs = case link.kind {
    EmailLink -> [
      attr.attribute("href", link.url),
      attr.class(
        "flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-primary hover:text-primary-foreground",
      ),
      attr.attribute("aria-label", link.label),
    ]

    FediverseLink -> [
      attr.attribute("href", link.url),
      attr.attribute("target", "_blank"),
      attr.attribute("rel", "me noopener noreferrer"),
      attr.class(
        "flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-primary hover:text-primary-foreground",
      ),
      attr.attribute("aria-label", link.label),
    ]

    _ -> [
      attr.attribute("href", link.url),
      attr.attribute("target", "_blank"),
      attr.attribute("rel", "noopener noreferrer"),
      attr.class(
        "flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-primary hover:text-primary-foreground",
      ),
      attr.attribute("aria-label", link.label),
    ]
  }

  html.a(attrs, [icons.render(link.icon, "h-4 w-4")])
}
