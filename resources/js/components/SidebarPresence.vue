<template>
  <div>
    <div id="dody">
      <input id="check" type="checkbox">
      <div class="sidebar">
        <center>
          <img :src="'../storage/img/computer.jpg'" class="profile_image" alt="">
          <h5>
            Vérification<br> de présence
          </h5>
        </center>
        <router-link :to="{ name: 'presence.all' }" :class="{ 'active': $route.fullPath == '/presence/all'}">
          <fa icon="info-circle" fixed-width />   <span>Mode d'emploi</span>
        </router-link>
        <router-link :to="{ name: 'presence.entree' }" :class="{ 'active': $route.fullPath == '/presence/entree'}">
          <fa icon="sign-in-alt" />   <span>Entrée</span>
        </router-link>
        <router-link :to="{ name: 'presence.sortie' }" :class="{ 'active': $route.fullPath == '/presence/sortie'}">
          <fa icon="sign-out-alt" />   <span>Sortie</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
// import Navbar from '~/components/Navbar' v-if="$route.fullPath == '/test'"
export default {
  name: 'LayoutTest'
  /* components: {
    Navbar
  } */
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500');
template{
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
}

.sidebar {
  background: #2f323a;
  padding-top: 30px;
  position: fixed;
  left: 0;
  width: 250px;
  height: 100%;
  transition: 0.5s;
  transition-property: left;
}

.sidebar .profile_image{
  width: 100px;
  height: 100px;
  border-radius: 100px;
  margin-bottom: 10px;
}

.sidebar h5{
  color: #ccc;
  margin-top: 5px;
  margin-bottom: 25px;
}

.sidebar a{
  color: #fff;
  display: block;
  width: 100%;
  line-height: 60px;
  text-decoration: none;
  padding-left: 40px;
  box-sizing: border-box;
  transition: 0.5s;
  transition-property: background;
}

.sidebar a:hover{
  background: #19B3D3;
}

.sidebar i{
  padding-right: 10px;
}

label #sidebar_btn{
  z-index: 1;
  color: #fff;
  position: fixed;
  cursor: pointer;
  left: 300px;
  font-size: 20px;
  margin: 5px 0;
  transition: 0.5s;
  transition-property: color;
}

label #sidebar_btn:hover{
  color: #19B3D3;
}

#check:checked ~ .sidebar{
  left: -190px;
}

#check:checked ~ .sidebar a span{
  display: none;
}

#check:checked ~ .sidebar a{
  font-size: 20px;
  margin-left: 170px;
  width: 80px;
}

#check{
  display: none;
}
.active{
  background-color: #0F1013;
}
</style>
