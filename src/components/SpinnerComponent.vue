<template>
  <div>
    <span class="spinner-border" :class="{ 'spinner-border-sm': size === 'small' }" role="status"></span>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: "small"
    }
  }
}
</script>