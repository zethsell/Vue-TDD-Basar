<template>
  <div class="shadow-sm bg-light mb-3">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/" title="Home">
          <img src="./assets/hoaxify.png" width="60" alt="Home Logo"> Home
        </router-link>
        <ul class="navbar-nav ">
          <router-link class="nav-link" to="/signup">{{ $t('signUp') }}</router-link>
          <router-link class="nav-link" to="/login">Login</router-link>
        </ul>
      </div>
    </nav>
  </div>
  <div class="container">
    <router-view />
    <LanguageSelector />
  </div>
</template>

<script>
import LanguageSelector from './components/LanguageSelector.vue'

export default {
  name: 'App',
  components: {
    LanguageSelector,

  },
  data() {
    return {
      path: window.location.pathname
    }
  },
}
</script >

 