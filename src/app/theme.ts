import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'smilehaos',

  colors: {
    smilehaos: [
      '#F8F4EE',
      '#F1E8DC',
      '#E8D9C7',
      '#DDC8AF',
      '#D2B897',
      '#C3A17B',
      '#B28E68',
      '#9E7B58',
      '#876747',
      '#705438',
    ],
  },

  defaultRadius: 'md',

  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  headings: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    fontWeight: '700',
  },

  other: {
    smilehaos: {
      background: '#FAF8F5',
      surface: '#FFFFFF',
      gold: '#C3A17B',
      charcoal: '#3E3A39',
      border: '#E3DED8',
    },
  },
})