<template>
  <div class="content">
    <router-view />
  </div>
</template>

<script>
import Form from 'vform'
export default {
  // middleware: 'auth',
  // middleware: 'admin',
  layout: 'standard',
  metaInfo () {
    return { title: this.$t('login') }
  },

  data: () => ({
    form: new Form({
      nom: '',
      prenom: '',
      email: '',
      date: ''
    })
  }),

  methods: {
    // Submit the form.
    async save () {
      await this.form.post('/api/employe')
    }
    // const { data } = await this.form.post('/api/login')

    // Redirect home.
    // this.$router.push({ name: 'home' }
  }
}
</script>
<style scoped>
.content{
  padding-top: 30px;
  margin-left: 250px;
  height: 100vh;
  transition: 0.5s;
}

#check:checked ~ .content{
  margin-left: 60px;
}
</style>
