<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="login-page">
    <form class="card mt-5">
      <div class="card-header">
        <h1 class="text-center">{{ $t('login') }}</h1>
      </div>
      <div class="card-body">
        <Input id="email" :label="$t('email')" v-model="email" />
        <Input id="password" :label="$t('password')" v-model="password" type="password" />
        <div class="alert alert-danger text-center" v-if="failMessage">
          {{ failMessage }}
        </div>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled" @click.prevent="submit">
            <Spinner v-if="apiProgress" />
            {{ $t('login') }}
          </button>
        </div>

      </div>
    </form>

  </div>
</template>
<script>
import Input from '../components/InputField.vue'
import Spinner from '../components/SpinnerComponent.vue'
import { login } from '../api/apiCalls'
export default {
  name: "SignUpPage",
  components: {
    Input,
    Spinner
  },
  data() {
    return {
      email: '',
      password: '',
      apiProgress: false,
      failMessage: undefined
    }
  },
  computed: {
    isDisabled() {
      return !(this.email && this.password)
    }
  },
  methods: {
    async submit() {
      if (this.apiProgress) return
      this.apiProgress = true
      try {
        await login({ email: this.email, password: this.password })
      } catch (error) {
        this.failMessage = error.response.data.message
      }
      this.apiProgress = false
    }
  },
  watch: {
    email() {
      this.failMessage = undefined
    },
    password() {
      this.failMessage = undefined
    }
  }
}
</script>

