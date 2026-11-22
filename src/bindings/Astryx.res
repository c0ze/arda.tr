/* Bindings for the Astryx components this page uses (@astryxdesign/core 0.7).
   Props follow `npx astryx component <Name>`; add one here when a section
   needs it. Text goes in `label` for buttons; booleans start with is/has. */

// Steps of the spacing scale: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.
type step = float

type size = [#sm | #md | #lg]

module Button = {
  @module("@astryxdesign/core/Button") @react.component
  external make: (
    ~label: string,
    ~variant: [#primary | #secondary | #ghost | #destructive]=?,
    ~size: size=?,
    ~href: string=?,
    ~onClick: ReactEvent.Mouse.t => unit=?,
  ) => React.element = "Button"
}

module ToggleButtonGroup = {
  // Single selection: the value is the pressed button's `value`, or null.
  @module("@astryxdesign/core/ToggleButton") @react.component
  external make: (
    ~label: string,
    ~value: Nullable.t<string>,
    ~onChange: Nullable.t<string> => unit,
    ~size: size=?,
    ~children: React.element,
  ) => React.element = "ToggleButtonGroup"
}

module ToggleButton = {
  @module("@astryxdesign/core/ToggleButton") @react.component
  external make: (
    ~label: string,
    ~value: string,
    ~tooltip: string=?,
    ~children: React.element=?,
  ) => React.element = "ToggleButton"
}

module VStack = {
  @module("@astryxdesign/core/VStack") @react.component
  external make: (
    ~gap: step=?,
    ~hAlign: [#start | #center | #end | #stretch]=?,
    ~className: string=?,
    ~children: React.element,
  ) => React.element = "VStack"
}

module HStack = {
  @module("@astryxdesign/core/HStack") @react.component
  external make: (
    ~gap: step=?,
    ~vAlign: [#start | #center | #end | #stretch]=?,
    ~hAlign: [#start | #center | #end | #between | #around | #evenly]=?,
    ~wrap: [#nowrap | #wrap]=?,
    ~className: string=?,
    ~children: React.element,
  ) => React.element = "HStack"
}

module Heading = {
  @module("@astryxdesign/core/Heading") @react.component
  external make: (
    ~level: int,
    ~id: string=?,
    ~className: string=?,
    ~children: React.element,
  ) => React.element = "Heading"
}

module Text = {
  @module("@astryxdesign/core/Text") @react.component
  external make: (
    @as("type") ~type_: [#body | #large | #label | #supporting | #code]=?,
    ~color: [#primary | #secondary | #accent]=?,
    @as("as") ~as_: [#span | #p | #div]=?,
    ~display: [#inline | #block]=?,
    ~children: React.element,
  ) => React.element = "Text"
}
