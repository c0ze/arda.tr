import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/svg
import ui_types.{
  type Icon, Bluesky, BookOpen, Bot, ChevronDown, CodeXml, Disc, ExternalLink,
  Gamepad2, Github, Globe, Guitar, Lightbulb, Linkedin, Mail, Mastodon, Music,
  Palette, User,
}

pub fn render(icon: Icon, class_name: String) -> Element(msg) {
  case icon {
    User ->
      lucide(class_name, [
        svg.path([
          attr.attribute("d", "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"),
        ]),
        svg.circle([
          attr.attribute("cx", "12"),
          attr.attribute("cy", "7"),
          attr.attribute("r", "4"),
        ]),
      ])

    BookOpen ->
      lucide(class_name, [
        svg.path([attr.attribute("d", "M12 7v14")]),
        svg.path([
          attr.attribute(
            "d",
            "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
          ),
        ]),
      ])

    Bot ->
      lucide(class_name, [
        svg.path([attr.attribute("d", "M12 8V4H8")]),
        svg.rect([
          attr.attribute("width", "16"),
          attr.attribute("height", "12"),
          attr.attribute("x", "4"),
          attr.attribute("y", "8"),
          attr.attribute("rx", "2"),
        ]),
        svg.path([attr.attribute("d", "M2 14h2")]),
        svg.path([attr.attribute("d", "M20 14h2")]),
        svg.path([attr.attribute("d", "M15 13v2")]),
        svg.path([attr.attribute("d", "M9 13v2")]),
      ])

    ChevronDown ->
      lucide(class_name, [svg.path([attr.attribute("d", "m6 9 6 6 6-6")])])

    Palette ->
      lucide(class_name, [
        svg.circle([
          attr.attribute("cx", "13.5"),
          attr.attribute("cy", "6.5"),
          attr.attribute("r", ".5"),
          attr.attribute("fill", "currentColor"),
        ]),
        svg.circle([
          attr.attribute("cx", "17.5"),
          attr.attribute("cy", "10.5"),
          attr.attribute("r", ".5"),
          attr.attribute("fill", "currentColor"),
        ]),
        svg.circle([
          attr.attribute("cx", "8.5"),
          attr.attribute("cy", "7.5"),
          attr.attribute("r", ".5"),
          attr.attribute("fill", "currentColor"),
        ]),
        svg.circle([
          attr.attribute("cx", "6.5"),
          attr.attribute("cy", "12.5"),
          attr.attribute("r", ".5"),
          attr.attribute("fill", "currentColor"),
        ]),
        svg.path([
          attr.attribute(
            "d",
            "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
          ),
        ]),
      ])

    CodeXml ->
      lucide(class_name, [
        svg.path([attr.attribute("d", "m18 16 4-4-4-4")]),
        svg.path([attr.attribute("d", "m6 8-4 4 4 4")]),
        svg.path([attr.attribute("d", "m14.5 4-5 16")]),
      ])

    Globe ->
      lucide(class_name, [
        svg.circle([
          attr.attribute("cx", "12"),
          attr.attribute("cy", "12"),
          attr.attribute("r", "10"),
        ]),
        svg.path([
          attr.attribute("d", "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"),
        ]),
        svg.path([attr.attribute("d", "M2 12h20")]),
      ])

    Lightbulb ->
      lucide(class_name, [
        svg.path([
          attr.attribute(
            "d",
            "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
          ),
        ]),
        svg.path([attr.attribute("d", "M9 18h6")]),
        svg.path([attr.attribute("d", "M10 22h4")]),
      ])

    Gamepad2 ->
      lucide(class_name, [
        svg.line([
          attr.attribute("x1", "6"),
          attr.attribute("x2", "10"),
          attr.attribute("y1", "11"),
          attr.attribute("y2", "11"),
        ]),
        svg.line([
          attr.attribute("x1", "8"),
          attr.attribute("x2", "8"),
          attr.attribute("y1", "9"),
          attr.attribute("y2", "13"),
        ]),
        svg.line([
          attr.attribute("x1", "15"),
          attr.attribute("x2", "15.01"),
          attr.attribute("y1", "12"),
          attr.attribute("y2", "12"),
        ]),
        svg.line([
          attr.attribute("x1", "18"),
          attr.attribute("x2", "18.01"),
          attr.attribute("y1", "10"),
          attr.attribute("y2", "10"),
        ]),
        svg.path([
          attr.attribute(
            "d",
            "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
          ),
        ]),
      ])

    ExternalLink ->
      lucide(class_name, [
        svg.path([attr.attribute("d", "M15 3h6v6")]),
        svg.path([attr.attribute("d", "M10 14 21 3")]),
        svg.path([
          attr.attribute(
            "d",
            "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
          ),
        ]),
      ])

    Music ->
      lucide(class_name, [
        svg.circle([
          attr.attribute("cx", "8"),
          attr.attribute("cy", "18"),
          attr.attribute("r", "4"),
        ]),
        svg.path([attr.attribute("d", "M12 18V2l7 4")]),
      ])

    Disc ->
      lucide(class_name, [
        svg.circle([
          attr.attribute("cx", "12"),
          attr.attribute("cy", "12"),
          attr.attribute("r", "10"),
        ]),
        svg.path([attr.attribute("d", "M6 12c0-1.7.7-3.2 1.8-4.2")]),
        svg.circle([
          attr.attribute("cx", "12"),
          attr.attribute("cy", "12"),
          attr.attribute("r", "2"),
        ]),
        svg.path([attr.attribute("d", "M18 12c0 1.7-.7 3.2-1.8 4.2")]),
      ])

    Github ->
      lucide(class_name, [
        svg.path([
          attr.attribute(
            "d",
            "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
          ),
        ]),
        svg.path([attr.attribute("d", "M9 18c-4.51 2-5-2-7-2")]),
      ])

    Mail ->
      lucide(class_name, [
        svg.rect([
          attr.attribute("width", "20"),
          attr.attribute("height", "16"),
          attr.attribute("x", "2"),
          attr.attribute("y", "4"),
          attr.attribute("rx", "2"),
        ]),
        svg.path([
          attr.attribute("d", "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"),
        ]),
      ])

    Linkedin ->
      lucide(class_name, [
        svg.path([
          attr.attribute(
            "d",
            "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
          ),
        ]),
        svg.rect([
          attr.attribute("width", "4"),
          attr.attribute("height", "12"),
          attr.attribute("x", "2"),
          attr.attribute("y", "9"),
        ]),
        svg.circle([
          attr.attribute("cx", "4"),
          attr.attribute("cy", "4"),
          attr.attribute("r", "2"),
        ]),
      ])

    Guitar ->
      lucide(class_name, [
        svg.path([attr.attribute("d", "m11.9 12.1 4.514-4.514")]),
        svg.path([
          attr.attribute(
            "d",
            "M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z",
          ),
        ]),
        svg.path([attr.attribute("d", "m6 16 2 2")]),
        svg.path([
          attr.attribute(
            "d",
            "M8.2 9.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4 2 2 0 0 0 1.8-1.2z",
          ),
        ]),
        svg.circle([
          attr.attribute("cx", "11.5"),
          attr.attribute("cy", "12.5"),
          attr.attribute("r", ".5"),
          attr.attribute("fill", "currentColor"),
        ]),
      ])

    Mastodon ->
      lucide(class_name, [
        svg.path([
          attr.attribute(
            "d",
            "M21.36 8.52c-.12-3.15-2.58-4.75-5.91-5.18l-.13-.02C13.62 3.12 12.01 3 12 3s-1.62.12-3.32.32c-3.46.42-5.92 2.03-6.04 5.34C2.5 12.35 2.5 16.27 3.51 18c1.33 2.32 4.09 2.51 6.51 2.5.6 0 1.2-.05 1.77-.14 1.25-.19 2.1-.53 2.1-.53l-.15-1.93s-.84.28-1.92.35c-1.42.09-2.8-.07-3.08-1.46-.24-.46-.35-1.04-.37-1.68 1.45.36 3.06.49 4.71.49 1.76 0 3.39-.12 4.79-.42 2.82-.62 3.5-2.22 3.5-4.48 0-1.45 0-2.31 0-2.31Z",
          ),
        ]),
        svg.path([
          attr.attribute(
            "d",
            "M17.15 15.22V9.01C17.15 7.42 16.03 6.4 14.53 6.4c-1.35 0-2.25.96-2.25 2.6V11H11.7V9c0-1.64-.9-2.6-2.25-2.6-1.5 0-2.62 1.02-2.62 2.61v6.21h2.24V9.82c0-.66.28-1.12.81-1.12.55 0 .82.5.82 1.25v3.66h2.22V9.95c0-.75.27-1.25.82-1.25.53 0 .81.46.81 1.12v5.4h2.6Z",
          ),
        ]),
      ])

    Bluesky ->
      svg.svg(
        [
          attr.attribute("viewBox", "0 0 24 24"),
          attr.class(class_name),
          attr.attribute("fill", "currentColor"),
          attr.attribute("aria-hidden", "true"),
          attr.attribute("focusable", "false"),
        ],
        [
          svg.path([
            attr.attribute(
              "d",
              "M5.46 4.38c2.08 1.56 4.31 4.72 5.13 6.42.82-1.7 3.05-4.86 5.13-6.42 1.5-1.13 3.93-2 3.93.77 0 .55-.32 4.65-.5 5.31-.63 2.3-2.91 2.89-4.94 2.54 3.55.61 4.45 2.61 2.5 4.61-3.7 3.79-5.32-.95-5.73-2.16-.08-.22-.11-.32-.39-.32s-.31.1-.39.32c-.41 1.21-2.03 5.95-5.73 2.16-1.95-2-1.05-4 2.5-4.61-2.03.35-4.31-.24-4.94-2.54-.18-.66-.5-4.76-.5-5.31 0-2.77 2.43-1.9 3.93-.77Z",
            ),
          ]),
        ],
      )
  }
}

fn lucide(class_name: String, children: List(Element(msg))) -> Element(msg) {
  svg.svg(
    [
      attr.attribute("viewBox", "0 0 24 24"),
      attr.class(class_name),
      attr.attribute("fill", "none"),
      attr.attribute("stroke", "currentColor"),
      attr.attribute("stroke-width", "2"),
      attr.attribute("stroke-linecap", "round"),
      attr.attribute("stroke-linejoin", "round"),
      attr.attribute("aria-hidden", "true"),
      attr.attribute("focusable", "false"),
    ],
    children,
  )
}
