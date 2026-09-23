/* Bindings to src/components/OneBit.tsx — React mounts for the 1-bit engine. */

module Forest = {
  type forestProps = {
    className?: string,
    onMast?: (Nullable.t<float>, float) => unit,
  }

  @module("@/components/OneBit") @react.component(: forestProps)
  external make: forestProps => React.element = "Forest"
}

module Treeline = {
  type treelineProps = {
    className?: string,
    seed?: int,
    px?: float,
    speed?: float,
  }

  @module("@/components/OneBit") @react.component(: treelineProps)
  external make: treelineProps => React.element = "Treeline"
}

module Dithered = {
  type ditheredProps = {
    className?: string,
    src: string,
    fallbackSeed?: int,
    px?: float,
    contrast?: float,
    lift?: float,
    invert?: bool,
    hot?: bool,
  }

  @module("@/components/OneBit") @react.component(: ditheredProps)
  external make: ditheredProps => React.element = "Dithered"
}

module Orb = {
  type orbProps = {
    className?: string,
    size?: int,
    speed?: float,
    pulse?: int,
    level?: float,
  }

  @module("@/components/OneBit") @react.component(: orbProps)
  external make: orbProps => React.element = "Orb"
}

module Crackle = {
  type crackleProps = {className?: string}

  @module("@/components/OneBit") @react.component(: crackleProps)
  external make: crackleProps => React.element = "Crackle"
}
