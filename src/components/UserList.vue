<template>
  <div class="card">
    <div class="card-header text-center">
      <h3>{{ $t('users') }}</h3>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item list-group-item-action" v-for="user in page.content"
        @click="$router.push(`/user/${user.id}`)" :key="user.id">
        <UserListItem :user="user" />
      </li>
    </ul>
    <div class="card-footer text-center">
      <button class="btn btn-outline-secondary btn-sm float-start" @click="loadData(page.page - 1)"
        v-show="page.page !== 0 && !pendingApiCall">
        {{ $t('previousPage') }}
      </button>
      <button class="btn btn-outline-secondary btn-sm float-end" @click="loadData(page.page + 1)"
        v-show="page.totalPages > page.page + 1 && !pendingApiCall">
        {{ $t('nextPage') }}
      </button>
      <Spinner size="normal" :show="pendingApiCall" />
    </div>
  </div>
</template>
<script>
import { loadUsers } from '../api/apiCalls'
import UserListItem from './UserListItem.vue'
import Spinner from './SpinnerComponent.vue'

export default {
  components: {
    UserListItem,
    Spinner
  },
  data() {
    return {
      page: {
        content: [],
        page: 0,
        size: 0,
        totalPages: 0,
      },
      pendingApiCall: true
    }
  },
  created() {
    this.pendingApiCall = true
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData(pageIndex) {
      this.pendingApiCall = true
      const { data } = await loadUsers(pageIndex)
      this.page = data
      this.pendingApiCall = false
    },
  }
}
</script>
<style scoped>
li {
  cursor: pointer;
}
</style>