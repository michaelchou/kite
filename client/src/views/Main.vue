<template>
  <div class="app-view">
    <box-header />
    <router-view />
    <global-alert />
  </div>
</template>

<script>
import header from '@views/Parts/Header'
import globalAlert from '@views/Parts/GlobalAlert'

export default {
  name: 'Main',
  asyncData ({ store, route, accessToken = '' }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch('PERSONAL_INFO', { accessToken }),
      store.dispatch('website/GET_WEBSITE_INFO'),
      store.dispatch('articleTag/GET_ARTICLE_TAG_ALL'),
      store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
    ])
  },
  created () {
    this.$store.dispatch('sign/LOGIN', this.formData)
      .then(res => {
        console.log(res, 'auto login');
        if (res.state === 'success') {
          this.$message.success(res.message)
          this.$refs.login.reset()
          cookie.set('accessToken', res.data.token, 7)
          this.$store.commit('SET_IS_LOGIN', false)
          window.location.reload()
        } else {
          this.$message.warning(res.message)
        }
      })
  },
  components: {
    'box-header': header,
    'global-alert': globalAlert
  }
}
</script>
