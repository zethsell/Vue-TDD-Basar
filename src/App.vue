<template>
  <div class="container">
    <a @click.prevent="onClickLink" href="/" title="Home">Home</a>
    <a @click.prevent="onClickLink" href="/signup">{{ $t('signUp') }}</a>
    <a @click.prevent="onClickLink" href="/login">Login</a>
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
      this.path = event.target.attributes.href.value
      window.history.pushState({}, '', this.path)
    }
  }
}
</script >

 