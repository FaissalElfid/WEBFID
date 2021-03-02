<template>
  <div>
    <div class="col-lg-10 m-auto">
      <card :title="'Ajouter employé'">
        <form enctype="multipart/form-data" @submit.prevent="save" @keydown="form.onKeydown($event)">
          <!-- nom -->
          <div class="form-group row">
            <label class="col-md-3 col-form-label text-md-right" for="nom">Nom</label>
            <div class="col-md-7">
              <input v-model="form.nom" data-vv-delay="100" v-validate="'required|alpha_spaces'" :class="{ 'is-invalid': errors.has('nom') }" class="form-control" type="text" id="nom" name="nom" placeholder="nom" required>
              <span v-show="errors.has('nom')" class="invalid-feedback">
                {{ errors.first('nom') }}
              </span>
            </div>
          </div>
          <!-- prenom -->
          <div class="form-group row">
            <label class="col-md-3 col-form-label text-md-right">Prenom</label>
            <div class="col-md-7">
              <input v-model="form.prenom" v-validate="'required|alpha_spaces'" :class="{ 'is-invalid': errors.has('prenom') }" class="form-control" type="text" name="prenom" placeholder="prenom" required>
              <span v-show="errors.has('prenom')" class="invalid-feedback"> {{ errors.first('prenom') }}</span>
            </div>
          </div>
          <!-- sexe -->
          <div class="form-group row">
            <label class="col-md-3 col-form-label text-md-right">Sexe</label>
            <div class="col-md-7 row">
              <b-form-radio  style="margin-top: 8px;margin-left: 16px" v-model="form.sexe" v-validate="'required'" name="sexe" value="H">Homme</b-form-radio>
              <b-form-radio style="margin-top: 8px; margin-left: 50px;" v-model="form.sexe" v-validate="'required'" name="sexe" value="F">Femme</b-form-radio>
              <span v-show="errors.has('email')" class="invalid-feedback"> {{ errors.first('email') }}</span>
            </div>
          </div>
          <!-- département -->
          <div class="form-group row">
            <label class="col-md-3 col-form-label text-md-right">Département</label>
            <div class="col-md-7">
              <b-form-select v-model="form.departement" :options="optionsDepartement" v-validate="'required'" name="departement">
                <template #first>
                  <b-form-select-option value="" disabled>--- Départements ---</b-form-select-option>
                </template>
              </b-form-select>
              <span v-show="errors.has('departement')" class="invalid-feedback"> {{ errors.first('departement') }}</span>
            </div>
          </div>
          <!-- date -->
          <div class="form-group row">
            <label class="col-md-3 col-form-label text-md-right">Date de naissance</label>
            <div class="col-md-7">
              <input v-model="form.date" v-validate="'required'" :class="{ 'is-invalid': errors.has('dateNaissance') }" class="form-control" type="date" name="dateNaissance" placeholder="dateNaissance" required>
              <span v-show="errors.has('dateNaissance')" class="invalid-feedback"> {{ errors.first('dateNaissance') }}</span>
            </div>
          </div>
          <!-- Email -->
          <div class="form-group row">
            <label class="col-md-3 col-form-label text-md-right">{{ $t('email') }}</label>
            <div class="col-md-7">
              <input v-model="form.email" v-validate="'required|email'" :class="{ 'is-invalid': errors.has('email') }" class="form-control" type="email" name="email" placeholder="email" required>
              <span v-show="errors.has('email')" class="invalid-feedback"> {{ errors.first('email') }}</span>
            </div>
          </div>
          <!-- Image -->
          <div class="form-group row">
            <label class="col-md-3 col-form-label text-md-right">Image de profil</label>
            <div v-if="!form.photo" class="col-md-7">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span id="inputGroupFileAddon01" class="input-group-text">Upload</span>
                </div>
                <div class="custom-file">
                  <input id="inputGroupFile01" type="file" class="custom-file-input" aria-describedby="inputGroupFileAddon01" name="photo" @change="onFileChange" required>
                  <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                </div>
              </div>
            </div>
            <div v-else>
              <img :src="form.photo" />
              <button class="btn btn-light" @click="removeImage">Remove image</button>
            </div>
          </div>
          <!-- isAdmin -->
          <div class="form-group col-md-7 offset-md-3">
            <b-button
              :class="visible ? null : 'collapsed'"
              :aria-expanded="visible ? 'true' : 'false'"
              aria-controls="my-collapse"
              @click="adminGestion"
            >
              {{visible ?  'Ne pas créer' : 'Créer'}} un compte pour cet employe
            </b-button>
            <b-collapse id="my-collapse" v-model="visible" class="mt-2 row">
              <b-card>
                <b-form-checkbox v-model="form.isAdmin" name="check-button" switch>
                  {{form.isAdmin ? 'Créer un compte d\'admininistrateur' : ' Créer un compte utilisateur d\'interface de reconnaissance facial'}}
                </b-form-checkbox>
              </b-card>
            </b-collapse>
          </div>
          <div class="form-group row">
            <div class="col-md-7 offset-md-3 d-flex">
              <v-button :loading="form.busy">
                Ajouter
              </v-button>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import Form from 'vform'
import axios from 'axios'
export default {
  // middleware: 'admin',
  metaInfo () {
    return { title: this.$t('login') }
  },

  data: () => ({
    form: new Form({
      nom: '',
      prenom: '',
      email: '',
      sexe: '',
      departement: 0,
      date: '',
      isAdmin: null,
      photo: null
    }),
    departements: [],
    visible: false
  }),
  computed: {
    optionsDepartement: function () {
      return this.departements
    }
  },
  beforeMount () {
    axios.get('/api/departement') // or fetch
      .then(response => {
        let tab = []
        tab = response.data
        tab.forEach(async (dep) => {
          this.departements.push({
            value: dep.id,
            text: dep.libelle
          })
        })
      })
      .catch(error => console.log(error))
  },
  mounted () {
    console.log(this.optionsDepartement)
  },
  methods: {
    // Submit the form.
    async save () {
      console.log(this.form)
      await this.form.post('/api/employe')
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
    },
    createImage (file) {
      var reader = new FileReader()

      reader.onload = (e) => {
        this.form.photo = e.target.result
      }
      reader.readAsDataURL(file)
    },
    adminGestion () {
      this.visible = !this.visible
      if (this.visible === false) {
        this.form.isAdmin = null
      } else {
        this.form.isAdmin = false
      }
    },
    removeImage: function (e) {
      this.form.photo = ''
    }
  }
}
</script>
<style scoped>
img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
#check:checked ~ .content{
  margin-left: 60px;
}
</style>
