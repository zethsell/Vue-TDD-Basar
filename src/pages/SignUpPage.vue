<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
    <form class="card mt-5" data-testid="form-sign-up" v-if="!signUpSuccess">
      <div class="card-header">
        <h1 class="text-center">{{ $t('signUp') }}</h1>
      </div>
      <div class="card-body">
        <Input id="username" :label="$t('username')" :help="errors?.username" v-model="username" />
        <Input id="email" :label="$t('email')" :help="errors?.email" v-model="email" />
        <Input id="password" :label="$t('password')" :help="errors?.password" v-model="password" type="password" />
        <Input id="password-repeat" :label="$t('passwordRepeat')"
          :help="hasPasswordMismatch ? $t('passwordMismatchValidation') : ''" v-model="passwordRepeat"
          type="password" />
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress" @click.prevent="submit">
            <Spinner v-if="apiProgress" :show="signUpSuccess" />
            {{ $t('signUp') }}
          </button>
        </div>
      </div>
    </form>
    <div v-else class="alert alert-success mt-3">{{ $t('accountActivationNotification') }}</div>

  </div>
</template>
<script>
import Input from '../components/InputField.vue'
import Spinner from '../components/SpinnerComponent.vue'
import { signUp } from '../api/apiCalls'
export default {
  name: "SignUpPage",
  components: {
    Input,
    Spinner
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      apiProgress: false,
      signUpSuccess: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      this.apiProgress = true
      try {
        await signUp({
          username: this.username,
          email: this.email,
          password: this.password
        })
        this.signUpSuccess = true
      } catch (error) {
        if (error.response.status === 400) {
          this.errors = error.response.data.validationErrors
        }
      }
      this.apiProgress = false
    },
  },
  computed: {
    isDisabled() {
      return this.password && this.passwordRepeat
        ? this.password !== this.passwordRepeat
        : true
    },
    hasPasswordMismatch() {
      return this.password !== this.passwordRepeat
    }
  },
  watch: {
    username() {
      delete this.errors?.username
    },
    email() {
      delete this.errors?.email
    },
    password() {
      delete this.errors?.password
    },
  }
}
</script>

