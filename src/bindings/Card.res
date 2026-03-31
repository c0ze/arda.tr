type cardProps = {
  children: React.element,
  className?: string,
}

@module("@/components/ui/card") @react.component(: cardProps)
external make: cardProps => React.element = "Card"
