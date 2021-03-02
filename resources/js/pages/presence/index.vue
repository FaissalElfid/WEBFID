<template>
  <div class="content">
    <router-view />
  </div>
</template>
<script>
export default {
  // middleware: 'notAdmin',
  middleware: 'auth',
  layout: 'standard'
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
