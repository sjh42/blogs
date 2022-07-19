import { ViteSSG } from 'vite-ssg'
import autoRoutes from 'pages-generated'
import NProgress from 'nprogress'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'

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

export const createApp = ViteSSG(App, { routes, scrollBehavior },  ({ app, router, routes, isClient, initialState  }) => {

	if (isClient) {
		router.beforeEach(() => { NProgress.start() })
		router.afterEach(() => { NProgress.done() })
	}
},)
