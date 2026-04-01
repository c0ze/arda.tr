pub type Model {
  Model(current_theme: String, is_theme_menu_open: Bool, current_year: Int)
}

pub type Msg {
  ToggleThemeMenu
  SelectTheme(String)
}
