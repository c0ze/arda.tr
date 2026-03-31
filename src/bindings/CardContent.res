type cardContentProps = {
  children: React.element,
  className?: string,
}

@module("@/components/ui/card") @react.component(: cardContentProps)
external make: cardContentProps => React.element = "CardContent"
