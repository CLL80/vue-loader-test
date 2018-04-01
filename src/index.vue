<script>
  import Vue from 'vue'
  import VueRouter from 'vue-router'

  Vue.use(VueRouter)

  import App from 'components/App.vue'
  import Home from 'components/Home.vue'

  const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
      { path: '', name: 'home', component: Home }
    ]
  })

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })
</script>

<style lang="sass">
  *
    margin: 0
    padding: 0
    box-sizing: border-box

  .body
    background:
      color: #cccccc
    margin: 0 auto
    color: #333333
    min-height: 100%
    max-width: 600px
    padding: 20px
</style>
