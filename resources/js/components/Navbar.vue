<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-white">
    <label v-if="$route.matched[0].path == '/employee' || $route.matched[0].path == '/presence' ">
      <fa id="sidebar_btn" icon="bars" style="cursor: pointer" />
    </label>
    <div class="container">
      <router-link :to="{ name: user ? 'home' : 'acceuil' }" class="navbar-brand">
        {{ appName }}
      </router-link>
      <!--WEBFID Surveillance-->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false">
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarToggler" class="collapse navbar-collapse">
        <!--
        <ul class="navbar-nav">
          <locale-dropdown />
        </ul> -->
        <div v-if="user" class="nav-item dropdown row">
          <router-link :to="{ name: 'employee.show' }" style="color: #2F323A" class="nav-link nav-item" active-class="active">
            Employees
          </router-link>
          <router-link :to="{ name: 'presence.all' }" style="color: #2F323A" class="nav-link nav-item" active-class="active">
            Présence
          </router-link>
        </div>
        <ul class="navbar-nav ml-auto">
          <!-- Authenticated -->
          <li v-if="user" class="nav-item dropdown row">
            <div style="padding-top: 10px;font-size: 0.8em">
              {{user.employe.isAdmin}}
            </div>
            <a class="nav-link dropdown-toggle text-dark"
               href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
            >
              <img :src="'../'+user.employe.photo" class="rounded-circle profile-photo mr-1">
              {{ user.name }}
            </a>
            <div class="dropdown-menu">
              <router-link :to="{ name: 'settings.profile' }" class="dropdown-item pl-3">
                <fa icon="cog" fixed-width />
                Paramètres
              </router-link>

              <div class="dropdown-divider" />
              <a href="#" class="dropdown-item pl-3" @click.prevent="logout">
                <fa icon="sign-out-alt" fixed-width />
                Se déconnecter
              </a>
            </div>
          </li>
          <!-- Guest -->
          <template v-else>
            <li class="nav-item">
              <router-link :to="{ name: 'login' }" class="nav-link" active-class="active">
                S'identifier
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import LocaleDropdown from './LocaleDropdown'

export default {
  /* components: {
    LocaleDropdown
  }, */

  data: () => ({
    appName: window.config.appName
  }),

  computed: mapGetters({
    user: 'auth/user'
  }),
  methods: {
    async logout () {
      // Log out the user.
      await this.$store.dispatch('auth/logout')

      // Redirect to login.
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>

.profile-photo {
  width: 2rem;
  height: 2rem;
  margin: -.375rem 0;
}
</style>
