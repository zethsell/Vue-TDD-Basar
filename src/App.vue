<template>
  <div class="shadow-sm bg-light">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid">
        <a class="navbar-brand" @click.prevent="onClickLink" href="/" title="Home">
          <img src="./assets/hoaxify.png" width="60" alt="Home Logo"> Home
        </a>
        <ul class="navbar-nav ">
          <a class="nav-link" @click.prevent="onClickLink" href="/signup">{{ $t('signUp') }}</a>
          <a class="nav-link" @click.prevent="onClickLink" href="/login">Login</a>
        </ul>
      </div>
    </nav>
  </div>
  <div class="container">

    <HomePage v-if="path === '/'" />
    <SignUpPage v-else-if="path === '/signup'" />
    <LoginPage v-else-if="path === '/login'" />
    <UserPage v-else-if="path.startsWith('/user/')" />
    <LanguageSelector />
  </div>
</template>

<script>
import SignUpPage from './pages/SignUpPage.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import UserPage from './pages/UserPage.vue'
import LanguageSelector from './components/LanguageSelector.vue'

export default {
  name: 'App',
  components: {
    SignUpPage,
    LanguageSelector,
    HomePage,
    LoginPage,
    UserPage,
  },
  data() {
    return {
      path: window.location.pathname
    }
  },
  methods: {
    onClickLink(event) {
      this.path = event.currentTarget.attributes.href.value
      window.history.pushState({}, '', this.path)
    }
  }
}
</script >

 