type revealProps = {
  children: React.element,
  className?: string,
  delay?: int,
}

@module("@/components/Reveal") @react.component(: revealProps)
external make: revealProps => React.element = "Reveal"
