import { createI18n } from 'vue-i18n'
import en from './en.json'
import pt from './pt.json'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    pt
  }
})

export default i18n