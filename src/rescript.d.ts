declare module "*.res.mjs" {
  import type { ComponentType } from "react";

  export const make: ComponentType<unknown>;
}
