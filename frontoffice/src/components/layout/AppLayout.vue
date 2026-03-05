<template>
  <div class="app">
    <nav class="navbar">
      <RouterLink to="/" class="navbar__logo">Ads</RouterLink>
    </nav>

    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <span>© 2026 Ads — Node.js + Vue.js</span>
    </footer>
  </div>
</template>