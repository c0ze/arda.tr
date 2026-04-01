import content/types.{CallToAction}
import ui_types.{BookOpen, Bot, Outline, Solid, User}

pub const location = "Tokyo, Japan"

pub const title = "Arda Karaduman"

pub const subtitle = "Systems Architect & Pragmatic Programmer"

pub const description = "Building scalable systems and exploring new technologies. Living in Japan since 2004."

pub const call_to_actions = [
  CallToAction(
    label: "Resume",
    url: "https://resume.arda.tr",
    icon: User,
    variant: Solid,
  ),
  CallToAction(
    label: "Blog",
    url: "https://blog.arda.tr",
    icon: BookOpen,
    variant: Outline,
  ),
  CallToAction(
    label: "AI Chat",
    url: "https://ai.arda.tr",
    icon: Bot,
    variant: Outline,
  ),
]
