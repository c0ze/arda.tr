type cardHeaderProps = {
  children: React.element,
  className?: string,
}

@module("@/components/ui/card") @react.component(: cardHeaderProps)
external make: cardHeaderProps => React.element = "CardHeader"
