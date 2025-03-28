import { defineConfig, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetAttributify(), presetIcons()],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    spacing: {
      1: '5px',
      2: '10px',
      3: '20px',
      4: '30px',
      5: '40px',
    },
    fontSize: {
      mini: '12px',
      small: '14px',
      base: '16px',
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      21: '21px',
      22: '22px',
      24: '24px',
      30: '30px',
      64: '64px',
    },
    textColor: {
      white: '#FFF',
      red: '#F93936',
      black: '#1f2329',
      blue: '#0151dc',
      yellow: '#F7E252',
      green: '#00F6FF',
      'light-green': '#49FF11',
      default: '#646a73',
      grey: '#8f959e',
      orange: '#FF9D45',
    },
    backgroundColor: {
      white: '#fff',
      orange: '#FF9D45',
    },
    borderRadius: {
      DEFAULT: '50%',
      8: '8px',
      16: '16px',
    },
  },
})
