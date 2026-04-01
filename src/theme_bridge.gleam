@external(javascript, "./theme_bridge_ffi.mjs", "applyTheme")
pub fn apply_theme(theme: String) -> Nil

@external(javascript, "./theme_bridge_ffi.mjs", "readTheme")
pub fn read_theme() -> String

@external(javascript, "./theme_bridge_ffi.mjs", "currentYear")
pub fn current_year() -> Int
