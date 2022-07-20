<template>
  <div data-testid="activation-page">
    <div class="alert alert-success mt-3" v-if="success">
      Account is activated
    </div>
    <div class="alert alert-danger mt-3" v-if="fail">
      Activation failure
    </div>
    <Spinner v-if="apiProgress" size="normal" />
  </div>
</template>
<script>
import { activate } from '../api/apiCalls'
import Spinner from '../components/SpinnerComponent.vue'
export default {
  components: {
    Spinner
  },
  data() {
    return {
      success: false,
      fail: false,
      apiProgress: false
    }
  },
  async mounted() {
    this.apiProgress = true
    try {
      await activate(this.$route.params.token)
      this.success = true
    } catch (error) {
      this.fail = true
    } finally {
      this.apiProgress = false
    }
  }
}
</script>