<template>
  <div :style="image" class="image">
    <!--<img :src="'storage/img/computer.jpg'" alt="bla bla">-->
    <div class="wrapper">
      <ul class="nav-area">
        <router-link :to="{ name: 'presence.all' }">
          <li><a href="#">Mode d'emploie</a></li>
        </router-link>
        <template v-if="authenticated">
          <router-link :to="{ name: 'employee.show' }">
            <li><a href="#">Employés</a></li>
          </router-link>
        </template>
        <template v-else>
          <router-link :to="{ name: 'login' }">
            <li><a href="#">Se connecter</a></li>
          </router-link>
          <!--
          <router-link :to="{ name: 'register' }">
            <li><a href="#">S'inscrire</a></li>
          </router-link> -->
        </template>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    <div class="welcome-text">
      <h1>webfid surveillance</h1>
      <a class="sousligner" href="#">Learn more</a>
    </div>
    <a href="http://trakterm.com/"><img id="trakterm" :src="'storage/img/logo-trakterm.png'" alt="Logo trakterm"></a>
    <!--<img id="irisi" :src="'storage/img/logo-irisi.png'" alt="Logo IRISI">-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// the midlware truc ne te laisse pas accéder a une page si t'es pas connéter et te rederige vers Login
export default {
  layout: 'blank',
  data () {
    return {
      image: { backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0)),url(storage/img/computer.jpg)' }
    }
  },
  computed: mapGetters({
    authenticated: 'auth/check'
  })
}
</script>
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .wrapper{
    width: 100%;
    margin: auto;
  }
  .image{
    background-blend-mode: saturation;
    background-position: center center;
    -webkit-background-size: cover;
    background-size: cover;
    position: relative;
    height: 100vh;
    opacity: 1;
  }
  .welcome-text{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  #trakterm{
    position: absolute;
    height: 20px;
    bottom: 5%;
    left: 10%;
    transform: translate(-95%,-10%);
  }
  #irisi{
    position: absolute;
    height: 55px;
    bottom: 1.8%;
    left: 19%;
    transform: translate(-98%,-19%);
  }
  .welcome-text h1{
    font-size: 60px;
    color: #fff;
    text-transform: uppercase;
    text-align: center;
  }
  .welcome-text a{
    font-size: 14px;
    padding: 10px 30px;
    margin-left: 35%;
    text-decoration: none;
    display: inline-block;
    margin-top: 20px;
    text-transform: uppercase;
    text-align: center;
  }
  .nav-area{
    float: right;
    list-style: none;
    margin-top: 30px;
    margin-right: 20px;
  }
  .nav-area li{
    display: inline-block;
  }
  .nav-area li a{
    color: black;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 0.10em;
    text-decoration: none;
    padding: 5px 20px;
    font-family: poppins;
    font-size: 16px;
  }
  .nav-area li a:hover{
    background: #333;
    color: #fff;
  }
    .sousligner {
    color: black;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 0.10em;
    display: inline-block;
    padding: 15px 20px;
    position: relative;
  }
  .sousligner:after {
    background: none repeat scroll 0 0 transparent;
    bottom: 0;
    content: "";
    display: block;
    height: 2px;
    left: 50%;
    position: absolute;
    background: black;
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
    width: 0;
  }
  .sousligner:hover:after{
    width: 100%;
    left: 0;
  }
</style>
