// tailwind.config.js
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './nuxt.config.ts',
  ],
  theme: {
    extend: {}, // 不自定义颜色，使用默认
  },
  darkMode: 'class', // 支持 dark 模式，但默认使用浅色
  plugins: [],
}

