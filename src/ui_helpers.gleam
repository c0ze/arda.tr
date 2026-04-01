import icons
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import ui_types.{
  type ButtonSize, type ButtonVariant, type Icon, Large, Outline, Small, Solid,
}

pub fn button_link(
  url: String,
  label: String,
  icon: Icon,
  variant: ButtonVariant,
  size: ButtonSize,
  extra_class: String,
) -> Element(msg) {
  html.a(
    [
      attr.attribute("href", url),
      attr.attribute("target", "_blank"),
      attr.attribute("rel", "noopener noreferrer"),
      attr.class(button_classes(variant, size, extra_class)),
    ],
    [
      icons.render(icon, "h-4 w-4"),
      html.text(label),
    ],
  )
}

pub fn section_heading(
  label: String,
  title: String,
  description: String,
) -> Element(msg) {
  html.div([attr.class("space-y-3 text-center")], [
    html.span(
      [
        attr.class(
          "font-mono text-xs uppercase tracking-[0.2em] text-primary/70",
        ),
      ],
      [html.text(label)],
    ),
    html.h2([attr.class("text-2xl font-bold text-foreground md:text-3xl")], [
      html.text(title),
    ]),
    html.p([attr.class("mx-auto max-w-xl text-muted-foreground")], [
      html.text(description),
    ]),
  ])
}

fn button_classes(
  variant: ButtonVariant,
  size: ButtonSize,
  extra_class: String,
) -> String {
  let base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  let variant_class = case variant {
    Solid -> " bg-primary text-primary-foreground hover:bg-primary/90"
    Outline ->
      " border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  }
  let size_class = case size {
    Small -> " h-9 px-3"
    Large -> " h-11 px-8"
  }
  let extra = case extra_class {
    "" -> ""
    _ -> " " <> extra_class
  }

  base <> variant_class <> size_class <> extra
}
