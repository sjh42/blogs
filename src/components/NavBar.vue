<template>
  <header class="header z-40">
    <router-link class="w-10 h-10 absolute lg:fixed m-6 select-none outline-none" to="/" focusable="false">
      <i class="i-carbon-fish-multiple text-3xl" />
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/" title="Blog">
          <span class="lt-md:hidden">Blog</span>
        </router-link>
        <a icon-btn @click="toggleDark()">
          <div dark:i-carbon-moon i-carbon-sun />
        </a>

        <a icon-btn i-carbon-logo-github rel="noreferrer" href="https://github.com/sjh42/blogs" target="_blank" title="GitHub" />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
