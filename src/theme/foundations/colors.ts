import tailwindColors from './tailwindColors';

export const colors = {
  // Update me with other Tailwind colors or with https://smart-swatch.netlify.app/
  brand: {
    50: '#e2fbed',
    100: '#c2ebd4',
    200: '#9fddb9',
    300: '#7ccf9e',
    400: '#58c184',
    500: '#3ea76a',
    600: '#2e8251',
    700: '#1f5d3a',
    800: '#0f3921',
    900: '#001506',
  },
  gray: tailwindColors.blueGray,

  success: tailwindColors.green,
  green: tailwindColors.green,

  error: tailwindColors.red,
  red: tailwindColors.rose,

  warning: tailwindColors.amber,
  orange: tailwindColors.amber,

  info: tailwindColors.sky,
  blue: tailwindColors.sky,
};
