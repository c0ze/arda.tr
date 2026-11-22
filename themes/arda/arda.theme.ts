// The arda theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in arda.settings.json and the generated arda.settings.ts;
// change them with `astryx experimental theme editor set arda ...`. Add your own changes below: they win over the settings.
//
// Kara Duman (Moda, 2026-11-23; see DESIGN.md). The colours are the brand guide's
// AA-checked pairs, as [light, dark]: bone paper for reading and the résumé, soot
// for everything else. The type scale is the guide's: Display 132/1, H1 64/1.05,
// H2 40/1.1, H3 26/1.3, Body 20/1.6, Reading 21/1.7, Small 18/1.5, Label 18/1.2.
// Nothing is set below 18px.
import {defineTheme} from '@astryxdesign/core/theme';
import {ardaSettings} from './arda.settings';

const soot = '#0D0C0A';
const bone = '#E8E0CE';

export const ardaTheme = defineTheme({
  extends: ardaSettings,
  name: 'arda',
  tokens: {
    '--color-background-body': [bone, soot],
    '--color-background-surface': ['#F3EDDF', '#1A1815'],
    '--color-background-card': ['#F3EDDF', '#1A1815'],
    '--color-background-popover': ['#F3EDDF', '#1A1815'],
    '--color-background-muted': ['#F3EDDF', '#1A1815'],
    '--color-background-inverted': [soot, bone],
    '--color-border': ['#BDB5A2', '#3A3832'],
    '--color-border-emphasized': ['#5C574C', '#9A9384'],
    '--color-text-primary': [soot, bone],
    '--color-text-secondary': ['#5C574C', '#9A9384'],
    '--color-icon-primary': [soot, bone],
    '--color-icon-secondary': ['#5C574C', '#9A9384'],
    // The primary button: bone on soot on paper, soot on ember on soot.
    '--color-accent': [soot, '#E2502A'],
    '--color-on-accent': [bone, soot],
    // Links and numerals: ember, and a deeper ember on paper.
    '--color-text-accent': ['#A33312', '#E2502A'],
    '--color-icon-accent': ['#A33312', '#E2502A'],
    '--focus-outline-color': [soot, '#E2502A'],
    '--focus-outline-offset': '3px',

    '--font-family-body': 'Spectral, Georgia, serif',
    '--font-family-heading': "'Grenze Gotisch', Spectral, Georgia, serif",
    '--font-family-code': "'JetBrains Mono', ui-monospace, monospace",
    '--font-weight-semibold': '600',
    '--font-weight-bold': '600',
    '--text-display-1-size': '8.25rem',
    '--text-display-1-weight': '900',
    '--text-display-1-leading': '1',
    '--text-display-2-size': '4rem',
    '--text-display-2-weight': '800',
    '--text-display-2-leading': '1.05',
    '--text-display-3-size': '2.5rem',
    '--text-display-3-weight': '700',
    '--text-display-3-leading': '1.1',
    '--text-heading-1-size': '4rem',
    '--text-heading-1-weight': '800',
    '--text-heading-1-leading': '1.05',
    '--text-heading-2-size': '2.5rem',
    '--text-heading-2-weight': '700',
    '--text-heading-2-leading': '1.1',
    '--text-heading-3-size': '1.625rem',
    '--text-heading-3-weight': '600',
    '--text-heading-3-leading': '1.3',
    '--text-heading-4-size': '1.25rem',
    '--text-heading-4-weight': '600',
    '--text-heading-4-leading': '1.6',
    '--text-body-size': '1.25rem',
    '--text-body-leading': '1.6',
    '--text-large-size': '1.3125rem',
    '--text-large-weight': '400',
    '--text-large-leading': '1.7',
    '--text-supporting-size': '1.125rem',
    '--text-supporting-leading': '1.5',
    '--text-label-size': '1.125rem',
    '--text-label-weight': '600',
    '--text-label-leading': '1.2',
    '--text-code-size': '1.125rem',
    '--text-code-leading': '1.6',
    // Controls are 48px tall.
    '--size-element-sm': '2.75rem',
    '--size-element-md': '3rem',
    '--size-element-lg': '3rem',
  },
  // On phones the base theme sets its own type again; keep the guide's (H1 44, H2 32).
  adaptations: {
    rules: [
      {
        when: {pointer: 'coarse', width: {below: 'lg'}},
        value: {
          tokens: {
            '--font-family-body': 'Spectral, Georgia, serif',
            '--font-family-heading': "'Grenze Gotisch', Spectral, Georgia, serif",
            '--font-family-code': "'JetBrains Mono', ui-monospace, monospace",
            '--font-weight-bold': '600',
            '--text-heading-1-size': '2.75rem',
            '--text-heading-1-weight': '800',
            '--text-heading-2-size': '2rem',
            '--text-heading-2-weight': '700',
            '--text-heading-3-weight': '600',
            '--text-heading-4-weight': '600',
            '--text-body-size': '1.25rem',
            '--text-large-size': '1.3125rem',
            '--text-large-weight': '400',
            '--text-supporting-size': '1.125rem',
            '--text-label-size': '1.125rem',
            '--text-label-weight': '600',
            '--text-code-size': '1.125rem',
            '--text-code-leading': '1.6',
          },
        },
      },
    ],
  },
});
