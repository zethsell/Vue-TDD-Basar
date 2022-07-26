<template>
  <span class="spinner-border" :class="{ 'spinner-border-sm': size === 'small', 'd-none': !show }" role="status"></span>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: "small"
    },
    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>