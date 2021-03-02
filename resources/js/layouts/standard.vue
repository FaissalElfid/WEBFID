<template>
  <div>
    <Navbar />
    <div class="espaceDynamique">
      <Sidebar v-if="$route.matched[0].path == '/employee' " /><!-- the child is in here-->
      <SidebarPresence v-if="$route.matched[0].path == '/presence' " /><!-- the child is in here-->
      <div :class="{'container mt-4' : ($route.matched[0].path != '/presence' && $route.matched[0].path != '/employee')}">
        <child :class="{ 'child': ($route.matched[0].path != '/presence' && $route.matched[0].path != '/employee')}" />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import SidebarPresence from '~/components/SidebarPresence'
import Sidebar from '~/components/Sidebar'

export default {
  name: 'Standard',
  components: {
    Navbar, Sidebar, SidebarPresence
  }
}
</script>
<style>
.child {
  margin-top: 80px;
}

.espaceDynamique{
  margin-top: 57px;
}
</style>
