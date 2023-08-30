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
    extend: {
    }
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#FFCC00",
              50: "#FFFAF5",
              100: "#FFF3E0",
              200: "#FFE7B8",
              300: "#FFDA75",
              400: "#FFCC00",
              500: "#FAB700",
              600: "#F0A000",
              700: "#DB8400",
              800: "#C26700",
              900: "#994700",
              foreground: "#000000",
            },
            secondary: {
              DEFAULT: "#00E6A1",
              50: "#DBFFED",
              100: "#B8FFE0",
              200: "#00FFA2",
              300: "#00E6A1",
              400: "#00CF9E",
              500: "#00BD84",
              600: "#00AD6E",
              700: "#009957",
              800: "#008040",
              900: "#005C28",
              foreground: "#000000",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#FFCC00",
              50: "#FFF9F5",
              100: "#FFF2E5",
              200: "#FFE7C2",
              300: "#FFDA85",
              400: "#FFCC00",
              500: "#FFB405",
              600: "#FA9600",
              700: "#F07800",
              800: "#D65600",
              900: "#AD3400",
              foreground: "#000000",
            },
            secondary: {
              DEFAULT: "#00E6A1",
              50: "#DBFFED",
              100: "#B8FFE0",
              200: "#00FFA2",
              300: "#00E6A1",
              400: "#00CF9E",
              500: "#00BD84",
              600: "#00AD6E",
              700: "#009957",
              800: "#008040",
              900: "#005C28",
              foreground: "#000000",
            },
          },
        },
      },
    }),
  ],
}

export default config