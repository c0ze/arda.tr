type cardTitleProps = {
  children: React.element,
  className?: string,
}

@module("@/components/ui/card") @react.component(: cardTitleProps)
external make: cardTitleProps => React.element = "CardTitle"
