import app_types.{type Model, type Msg, Model, SelectTheme, ToggleThemeMenu}
import gleam/list
import icons
import lustre/attribute as attr
import lustre/effect
import lustre/element.{type Element}
import lustre/element/html
import lustre/event
import site_config.{type Theme, default_theme, themes}
import theme_bridge
import ui_types.{Palette}

pub fn initialize() -> #(Model, effect.Effect(Msg)) {
  let active_theme = resolve_theme(theme_bridge.read_theme())

  #(
    Model(
      current_theme: active_theme.id,
      is_theme_menu_open: False,
      current_year: theme_bridge.current_year(),
    ),
    apply_theme_effect(active_theme.id),
  )
}

pub fn update(model: Model, message: Msg) -> #(Model, effect.Effect(Msg)) {
  case message {
    ToggleThemeMenu -> #(
      Model(..model, is_theme_menu_open: toggle(model.is_theme_menu_open)),
      effect.none(),
    )

    SelectTheme(theme_id) -> select_theme(model, theme_id)
  }
}

pub fn render(model: Model) -> Element(Msg) {
  let active_theme = resolve_theme(model.current_theme)
  let trigger =
    html.button(
      [
        attr.attribute("type", "button"),
        attr.class(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/20 hover:text-primary",
        ),
        attr.attribute("aria-label", "Select theme"),
        attr.attribute("aria-expanded", bool_string(model.is_theme_menu_open)),
        attr.attribute("aria-haspopup", "menu"),
        attr.attribute("title", "Theme: " <> active_theme.name),
        event.on_click(ToggleThemeMenu),
      ],
      [
        html.span(
          [
            attr.class(
              "flex h-4 w-4 items-center justify-center rounded-full border border-current",
            ),
            attr.attribute(
              "style",
              "background-color: " <> active_theme.color <> ";",
            ),
          ],
          [icons.render(Palette, "h-3 w-3 opacity-0")],
        ),
      ],
    )

  let children = case model.is_theme_menu_open {
    True -> [
      trigger,
      html.div(
        [
          attr.class(
            "absolute right-0 z-30 mt-3 w-48 rounded-xl border border-border bg-card/95 p-2 shadow-medium backdrop-blur-sm",
          ),
          attr.attribute("role", "menu"),
        ],
        list.map(themes, fn(theme) { theme_option(theme, active_theme.id) }),
      ),
    ]

    False -> [trigger]
  }

  html.div([attr.class("relative")], children)
}

fn theme_option(theme: Theme, active_theme_id: String) -> Element(Msg) {
  let is_active = theme.id == active_theme_id
  let button_class =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primary/10 hover:text-primary"
    <> case is_active {
      True -> " bg-primary/10 text-primary"
      False -> ""
    }

  let content = case is_active {
    True -> [
      theme_swatch(theme.color),
      html.span([attr.class("flex-1")], [html.text(theme.name)]),
      html.span([attr.class("text-xs text-primary")], [html.text("Active")]),
    ]

    False -> [
      theme_swatch(theme.color),
      html.span([attr.class("flex-1")], [html.text(theme.name)]),
    ]
  }

  html.button(
    [
      attr.attribute("type", "button"),
      attr.class(button_class),
      attr.attribute("role", "menuitem"),
      event.on_click(SelectTheme(theme.id)),
    ],
    content,
  )
}

fn theme_swatch(color: String) -> Element(msg) {
  html.div(
    [
      attr.class("h-4 w-4 rounded-full border border-border"),
      attr.attribute("style", "background-color: " <> color <> ";"),
    ],
    [],
  )
}

fn resolve_theme(theme_id: String) -> Theme {
  case list.find(themes, fn(theme) { theme.id == theme_id }) {
    Ok(theme) -> theme
    Error(Nil) -> default_theme
  }
}

fn select_theme(model: Model, theme_id: String) -> #(Model, effect.Effect(Msg)) {
  let next_theme = resolve_theme(theme_id)

  #(
    Model(..model, current_theme: next_theme.id, is_theme_menu_open: False),
    apply_theme_effect(next_theme.id),
  )
}

fn apply_theme_effect(theme_id: String) -> effect.Effect(Msg) {
  effect.from(fn(_dispatch) { theme_bridge.apply_theme(theme_id) })
}

fn bool_string(value: Bool) -> String {
  case value {
    True -> "true"
    False -> "false"
  }
}

fn toggle(value: Bool) -> Bool {
  case value {
    True -> False
    False -> True
  }
}
