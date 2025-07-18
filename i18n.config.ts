import en from '~/i18n/locales/en.json'
import zh from '~/i18n/locales/zh.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh',
  messages: {
    en,
    zh,
  },
}))

