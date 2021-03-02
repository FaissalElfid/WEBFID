<template>
  <div class="main-layout">
    <navbar />
    <div class="container mt-4">
      <child />
    </div>
    <!-- <Sidebar v-if="$route.matched[0].path == '/employee' " /> -->
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
/* import Sidebar from '~/components/Sidebar' */

export default {
  name: 'MainLayout',

  components: {
    Navbar/* , Sidebar */
  }
}
</script>
