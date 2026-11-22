// The arda theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in arda.settings.json and the generated arda.settings.ts;
// change them with `astryx experimental theme editor set arda ...`. Add your own changes below: they win over the settings.
//
// The values come from the arda.tr brand guide (Moda, 2026-11-22; see DESIGN.md).
// The type scale below is the guide's seven steps: Display 72/76, Heading 1 48/52,
// Heading 2 32/38, Heading 3 22/28, Body 17/28, Small 14/22, Label 13/20.
import {defineTheme} from '@astryxdesign/core/theme';
import {ardaSettings} from './arda.settings';

export const ardaTheme = defineTheme({
  extends: ardaSettings,
  name: 'arda',
  tokens: {
    // Japanese text gets Noto Sans JP from brand.css (:lang(ja)), on the sites that load it.
    '--font-family-body': "'IBM Plex Sans', system-ui, sans-serif",
    '--font-family-heading': "Archivo, 'IBM Plex Sans', system-ui, sans-serif",
    '--font-family-code': "'IBM Plex Mono', ui-monospace, monospace",
    '--font-weight-bold': '800',
    '--text-display-1-size': '4.5rem',
    '--text-display-1-weight': '800',
    '--text-display-1-leading': '1.0556',
    '--text-display-2-size': '3.75rem',
    '--text-display-2-weight': '800',
    '--text-display-2-leading': '1.0667',
    '--text-display-3-size': '3rem',
    '--text-display-3-weight': '800',
    '--text-display-3-leading': '1.0833',
    '--text-heading-1-size': '3rem',
    '--text-heading-1-weight': '800',
    '--text-heading-1-leading': '1.0833',
    '--text-heading-2-size': '2rem',
    '--text-heading-2-weight': '700',
    '--text-heading-2-leading': '1.1875',
    '--text-heading-3-size': '1.375rem',
    '--text-heading-3-weight': '600',
    '--text-heading-3-leading': '1.2727',
    '--text-heading-4-size': '1.0625rem',
    '--text-heading-4-weight': '600',
    '--text-heading-4-leading': '1.6471',
    '--text-body-size': '1.0625rem',
    '--text-body-leading': '1.6471',
    '--text-large-size': '1.375rem',
    '--text-large-weight': '400',
    '--text-large-leading': '1.4545',
    '--text-supporting-size': '0.875rem',
    '--text-supporting-leading': '1.5714',
    '--text-label-size': '0.8125rem',
    '--text-label-weight': '500',
    '--text-label-leading': '1.5385',
    '--text-code-size': '0.8125rem',
    '--text-code-leading': '1.5385',
  },
  // The base theme sets its own heading weights again on phones; keep the guide's.
  adaptations: {
    rules: [
      {
        when: {pointer: 'coarse', width: {below: 'lg'}},
        value: {
          tokens: {
            '--font-weight-bold': '800',
            '--text-heading-1-weight': '800',
            '--text-heading-2-weight': '700',
            '--text-heading-3-weight': '600',
            '--text-heading-4-weight': '600',
            '--text-label-weight': '500',
          },
        },
      },
    ],
  },
});
