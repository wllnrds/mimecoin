import type { Config } from 'tailwindcss'
import { nextui, colors } from '@nextui-org/react'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {}
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#FFCC00",
              50: '#fffada',
              100: '#fff0ad',
              200: '#ffe67d',
              300: '#ffdb4b',
              400: '#ffd11a',
              500: '#e6b800',
              600: '#b38f00',
              700: '#806600',
              800: '#4e3d00',
              900: '#1d1400',
              foreground: "#000000",
            },
            secondary: {
              DEFAULT: "#00CF9E",
              50: '#d8fff2',
              100: '#abffe2',
              200: '#7bffd4',
              300: '#49ffc9',
              400: '#1affc1',
              500: '#00e6af',
              600: '#00b37c',
              700: '#00804f',
              800: '#004e29',
              900: '#001c0a',
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#FFCC00",
              50: '#fffada',
              100: '#fff0ad',
              200: '#ffe67d',
              300: '#ffdb4b',
              400: '#ffd11a',
              500: '#e6b800',
              600: '#b38f00',
              700: '#806600',
              800: '#4e3d00',
              900: '#1d1400',
              foreground: "#000000",
            },
            secondary: {
              DEFAULT: "#00CF9E",
              50: '#d8fff2',
              100: '#abffe2',
              200: '#7bffd4',
              300: '#49ffc9',
              400: '#1affc1',
              500: '#00e6af',
              600: '#00b37c',
              700: '#00804f',
              800: '#004e29',
              900: '#001c0a',
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
}

export default config