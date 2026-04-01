import ui_types.{type ButtonVariant, type Icon}

pub type CallToAction {
  CallToAction(label: String, url: String, icon: Icon, variant: ButtonVariant)
}

pub type Highlight {
  Highlight(icon: Icon, title: String, description: String)
}

pub type PortfolioItem {
  PortfolioItem(
    title: String,
    description: String,
    image: String,
    link: String,
    tags: List(String),
    playable: Bool,
    contain_image: Bool,
  )
}

pub type PortfolioSection {
  PortfolioSection(
    label: String,
    title: String,
    description: String,
    items: List(PortfolioItem),
  )
}

pub type MusicProject {
  MusicProject(
    title: String,
    description: String,
    image: String,
    link: String,
    tags: List(String),
    kind: String,
  )
}

pub type LinkKind {
  ExternalLink
  EmailLink
  FediverseLink
}

pub type SocialLink {
  SocialLink(label: String, url: String, icon: Icon, kind: LinkKind)
}
