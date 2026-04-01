import content/music as music_content
import content/types.{type MusicProject, type SocialLink}
import gleam/list
import icons
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import site_config.{section_ids}
import ui_helpers
import ui_types.{ExternalLink, Outline, Small}

pub fn render() -> Element(msg) {
  html.section(
    [
      attr.attribute("id", section_ids.music),
      attr.class("relative overflow-hidden bg-background px-6 py-24"),
    ],
    [
      html.div(
        [
          attr.class(
            "absolute inset-0 bg-gradient-subtle opacity-40 pointer-events-none",
          ),
          attr.attribute("aria-hidden", "true"),
        ],
        [],
      ),
      html.div([attr.class("relative z-10 mx-auto max-w-5xl space-y-16")], [
        ui_helpers.section_heading(
          "05 — Music",
          "Music Projects",
          "My musical endeavors and contributions to the metal scene.",
        ),
        html.div(
          [attr.class("grid gap-8 md:grid-cols-2")],
          list.map(music_content.projects, render_project),
        ),
        html.div(
          [attr.class("flex flex-wrap justify-center gap-4")],
          list.map(music_content.links, render_link),
        ),
      ]),
    ],
  )
}

fn render_project(project: MusicProject) -> Element(msg) {
  html.div(
    [
      attr.class(
        "group overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)]",
      ),
    ],
    [
      html.div(
        [attr.class("relative aspect-video w-full overflow-hidden bg-muted")],
        [
          html.a(
            [
              attr.attribute("href", project.link),
              attr.attribute("target", "_blank"),
              attr.attribute("rel", "noopener noreferrer"),
              attr.class("block h-full w-full cursor-pointer"),
            ],
            [
              html.img([
                attr.attribute("src", project.image),
                attr.attribute("alt", project.title),
                attr.attribute("loading", "lazy"),
                attr.class(
                  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                ),
              ]),
              html.div(
                [
                  attr.class(
                    "absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10",
                  ),
                  attr.attribute("aria-hidden", "true"),
                ],
                [],
              ),
            ],
          ),
        ],
      ),
      html.div([attr.class("flex flex-col space-y-1.5 p-6 pb-2")], [
        html.div(
          [attr.class("mb-2 flex flex-wrap gap-2")],
          list.append(
            [render_kind(project.kind)],
            list.map(project.tags, render_tag),
          ),
        ),
        html.h3(
          [
            attr.class(
              "flex items-center justify-between text-xl font-semibold leading-none tracking-tight",
            ),
          ],
          [
            html.text(project.title),
            html.a(
              [
                attr.attribute("href", project.link),
                attr.attribute("target", "_blank"),
                attr.attribute("rel", "noopener noreferrer"),
                attr.attribute("aria-label", "Visit " <> project.title),
                attr.class(
                  "text-muted-foreground transition-colors hover:text-primary",
                ),
              ],
              [icons.render(ExternalLink, "h-5 w-5")],
            ),
          ],
        ),
      ]),
      html.div([attr.class("p-6 pt-0")], [
        html.p([attr.class("text-base text-muted-foreground")], [
          html.text(project.description),
        ]),
      ]),
    ],
  )
}

fn render_link(link: SocialLink) -> Element(msg) {
  ui_helpers.button_link(link.url, link.label, link.icon, Outline, Small, "")
}

fn render_kind(kind: String) -> Element(msg) {
  html.span(
    [
      attr.class(
        "rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent",
      ),
    ],
    [html.text(kind)],
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
