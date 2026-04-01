import app_types.{type Model, type Msg}
import content/hero as hero_content
import content/types.{type CallToAction}
import gleam/list
import icons
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import theme_selector
import ui_helpers
import ui_types.{ChevronDown, Large}

pub fn render(model: Model) -> Element(Msg) {
  html.section(
    [
      attr.class(
        "relative flex min-h-screen flex-col overflow-hidden bg-background",
      ),
    ],
    [
      html.div(
        [
          attr.class(
            "absolute inset-0 hero-grid pointer-events-none opacity-25",
          ),
        ],
        [],
      ),
      html.div(
        [
          attr.class("absolute inset-0 pointer-events-none"),
          attr.attribute("aria-hidden", "true"),
        ],
        [
          html.div(
            [
              attr.class(
                "absolute top-1/4 left-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/5 blur-3xl",
              ),
            ],
            [],
          ),
          html.div(
            [
              attr.class(
                "absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-accent/5 blur-3xl",
              ),
            ],
            [],
          ),
        ],
      ),
      html.header(
        [attr.class("relative z-20 flex w-full justify-end px-6 py-4")],
        [theme_selector.render(model)],
      ),
      html.div(
        [
          attr.class(
            "relative z-10 flex flex-1 items-center justify-center px-6 py-12",
          ),
        ],
        [
          html.div([attr.class("mx-auto max-w-2xl space-y-8 text-center")], [
            html.div([attr.class("animate-fade-in-1")], [
              html.span(
                [
                  attr.class(
                    "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-sm text-primary",
                  ),
                ],
                [
                  html.span(
                    [
                      attr.class(
                        "h-1.5 w-1.5 rounded-full bg-primary animate-pulse",
                      ),
                      attr.attribute("aria-hidden", "true"),
                    ],
                    [],
                  ),
                  html.text(hero_content.location),
                ],
              ),
            ]),
            html.h1(
              [
                attr.class(
                  "animate-fade-in-2 text-5xl font-bold tracking-tight text-foreground md:text-7xl",
                ),
              ],
              [html.text(hero_content.title)],
            ),
            html.p(
              [
                attr.class(
                  "animate-fade-in-3 text-lg font-medium text-muted-foreground md:text-xl",
                ),
              ],
              [html.text(hero_content.subtitle)],
            ),
            html.p(
              [
                attr.class(
                  "animate-fade-in-4 mx-auto max-w-lg text-base leading-relaxed text-foreground/60 md:text-lg",
                ),
              ],
              [html.text(hero_content.description)],
            ),
            html.div(
              [
                attr.class(
                  "animate-fade-in-5 flex flex-col items-center justify-center gap-3 sm:flex-row",
                ),
              ],
              list.map(hero_content.call_to_actions, render_call_to_action),
            ),
          ]),
        ],
      ),
      html.div(
        [attr.class("relative z-10 flex justify-center pb-8 animate-fade-in-6")],
        [icons.render(ChevronDown, "h-5 w-5 animate-bounce-slow")],
      ),
    ],
  )
}

fn render_call_to_action(action: CallToAction) -> Element(msg) {
  ui_helpers.button_link(
    action.url,
    action.label,
    action.icon,
    action.variant,
    Large,
    "px-6",
  )
}
