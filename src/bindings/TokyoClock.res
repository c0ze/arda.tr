type tokyoClockProps = {className?: string}

@module("@/components/TokyoClock") @react.component(: tokyoClockProps)
external make: tokyoClockProps => React.element = "TokyoClock"
