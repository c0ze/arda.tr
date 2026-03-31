type buttonProps = {
  children: React.element,
  className?: string,
  variant?: string,
  size?: string,
  asChild?: bool,
}

@module("@/components/ui/button") @react.component(: buttonProps)
external make: buttonProps => React.element = "Button"
