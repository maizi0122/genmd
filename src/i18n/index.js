import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getLanguage } from '@/utils/utils'
import customZhCn from './lang/zh-CN'
import customZhTw from './lang/zh-TW'
import customEnUs from './lang/en-US'
import customjaJP from './lang/ja-JP'
import zhCnLocale from 'iview/src/locale/lang/zh-CN'
import enUsLocale from 'iview/src/locale/lang/en-US'
import zhTwLocale from 'iview/src/locale/lang/zh-TW'
import jaJPLocale from 'iview/src/locale/lang/ja-JP'

Vue.use(VueI18n)

let lang = 'zh-CN'
let local = getLanguage();
if (local) {
  lang = local
} else {
  // 自动根据浏览器系统语言设置语言
  const navLang = navigator.language
  lang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
}

Vue.config.lang = lang
Vue.locale = () => {}

const messages = {
  'zh-CN': Object.assign(zhCnLocale, customZhCn),
  'zh-TW': Object.assign(zhTwLocale, customZhTw),
  'en-US': Object.assign(enUsLocale, customEnUs),
  'ja-JP': Object.assign(jaJPLocale, customjaJP)
}

Vue.prototype.$supportLang = [
  {
    key: 'zh-CN',
    value:'简体中文'
  },
  {
    key: 'zh-TW',
    value:'繁体中文'
  },
  {
    key: 'en-US',
    value:'English'
  },{
    key: 'ja-JP',
    value: 'Japanese'
  }
]

const i18n = new VueI18n({
  locale: lang,
  messages
})

export default i18n