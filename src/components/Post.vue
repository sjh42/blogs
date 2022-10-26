<script setup lang="ts">
const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})
const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()
const tags = ref<Array<HTMLDivElement>>()

function getTagsId(e: HTMLDivElement | undefined) {
  tags.value = Array.from(e!.querySelectorAll('h1, h2, h3, h4, h5'))
}

onMounted(() => {
  const navigate = () => {
    if (location.hash)
      document.querySelector(decodeURIComponent(location.hash))?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAnchors = (event: MouseEvent & { target: HTMLElement }) => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
			&& link
			&& event.button === 0
			&& link.target !== '_blank'
			&& link.rel !== 'external'
			&& !link.download
			&& !event.metaKey
			&& !event.ctrlKey
			&& !event.shiftKey
			&& !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })
  navigate()
  getTagsId(content.value)
  setTimeout(navigate, 500)
})
</script>

<template>
  <div v-if="frontmatter.display ?? frontmatter.title" class="prose m-auto mb-8">
    <div class="mb-0 text-xl sm:text-3xl" flex="~ gap2 sm:gap3 wrap">
      <a aria-current="page" href="/" class="router-link-active router-link-exact-active !border-none !font-400">
        {{ frontmatter.display ?? frontmatter.title }}
      </a>
    </div>
    <p v-if="frontmatter.date" class="opacity-50">
      {{ formatDate(frontmatter.date) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p v-if="frontmatter.subtitle" class="opacity-50 !-mt-6 italic">
      {{ frontmatter.subtitle }}
    </p>
  </div>
  <div v-if="route.meta.frontmatter.tags && !getDeviceUa()" mr-40 float="right" position="sticky" top-20 w-80>
    <span text-xl sm:text-2xl>导航</span>
    <nav>
      <ul>
        <li v-for="nav in tags" p-1 hover="color-#54b1bf">
          <div v-if="nav.nodeName === 'H2'" pl-4>
            <a :href="`#${nav.id}`">{{ nav.textContent?.replace('#', '') }}</a>
          </div>
          <div v-else pl-8>
            <a :href="`#${nav.id}`">{{ nav.textContent?.replace('#', '') }}</a>
          </div>
        </li>
      </ul>
    </nav>
  </div>
  <article ref="content">
    <slot />
  </article>
  <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8">
    <br>
    <!-- <router-link :to="route.path.split('/').slice(0, -1).join('/') || '/'" class="font-mono no-underline opacity-50 hover:opacity-75"> cd .. </router-link> -->
    <router-link to="/" class="font-mono no-underline opacity-50 hover:opacity-75">
      cd ..
    </router-link>
  </div>
</template>
