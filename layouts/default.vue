<template>
  <div class="default_container">
    <header>
      <div class="logo">
        <router-link to="/">Logo</router-link>
      </div>
      <div class="cart">
        Корзина
      </div>
    </header>

    <main>
      <v-breadcrumbs :items="items">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <nuxt />
    </main>
    
  </div>
  
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ]
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

  .default_container {
    background: #eaeaea;
    font-family: 'Roboto', sans-serif;
  }

  main {
    padding: 80px 20px;
  }

  header {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    -webkit-flex-direction: row;
    -moz-flex-direction: row;
    -ms-flex-direction: row;
    -o-flex-direction: row;
    flex-direction: row;
    -ms-align-items: center;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    position: fixed;
    width: 100%;
    border-bottom: 1px solid #777;
    background: #fff;
    z-index: 20;
  }

  .logo {
    font-size: 24px;
  }

  .logo a {
    color: indigo;
    text-decoration: none;
  }
</style>