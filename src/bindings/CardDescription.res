type cardDescriptionProps = {
  children: React.element,
  className?: string,
}

@module("@/components/ui/card") @react.component(: cardDescriptionProps)
external make: cardDescriptionProps => React.element = "CardDescription"
