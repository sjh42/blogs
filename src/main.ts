import { ViteSSG } from 'vite-ssg'
import autoRoutes from 'pages-generated'
import NProgress from 'nprogress'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}

export const createApp = ViteSSG(App, { routes, scrollBehavior },  ({ router, isClient }) => {
	dayjs.extend(LocalizedFormat)

	if (isClient) {
		router.beforeEach(() => { NProgress.start() })
		router.afterEach(() => { NProgress.done() })
	}
},)
