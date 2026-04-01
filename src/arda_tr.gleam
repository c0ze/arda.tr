import app_types.{type Model, type Msg}
import lustre
import lustre/attribute as attr
import lustre/effect
import lustre/element.{type Element}
import lustre/element/html
import sections/about as about_section
import sections/footer as footer_section
import sections/hero as hero_section
import sections/music as music_section
import sections/portfolio as portfolio_section
import theme_selector

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#root", Nil)
  Nil
}

fn init(_flags) -> #(Model, effect.Effect(Msg)) {
  theme_selector.initialize()
}

fn update(model: Model, message: Msg) -> #(Model, effect.Effect(Msg)) {
  theme_selector.update(model, message)
}

fn view(model: Model) -> Element(Msg) {
  html.main([attr.class("min-h-screen")], [
    hero_section.render(model),
    about_section.render(),
    portfolio_section.render(),
    music_section.render(),
    footer_section.render(model.current_year),
  ])
}
