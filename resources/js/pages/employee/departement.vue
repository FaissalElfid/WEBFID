<template>
  <b-container fluid="lg">
    <div class="col-lg-10 m-auto">
      <div v-if="user.employe.isAdmin == 'Admin'">
        <card :title="'Ajouter des départements'">
          <div style="text-align: center">
            <b-button variant="outline-success" v-b-modal.ajouter-departement>Ajouter un département</b-button>
          </div>
        </card>
      </div>
      <card :title="'La gestion des départements crées'" style="margin-top: 15px">

        <b-row style="margin-top: 10px;margin-bottom: 20px">
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Filter"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filterInput"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                />
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">
                    Clear
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-select id="sortBySelect" v-model="sortBy" :options="sortOptions" class="w-75">
                  <template v-slot:first>
                    <option value="">
                      -- none --
                    </option>
                  </template>
                </b-form-select>
                <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                  <option :value="false">
                    Asc
                  </option>
                  <option :value="true">
                    Desc
                  </option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-table
          show-empty
          small
          stacked="md"
          :items="deps"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @filtered="onFiltered"
        >
          <template v-slot:cell(name)="row">
            {{ row.value.first }} {{ row.value.last }}
          </template>

          <template v-slot:cell(actions)="row">
            <b-button size="sm" class="mr-1" @click="info(row.item, row.index, $event.target)">
              Info modal
            </b-button>
            <b-button size="sm" @click="row.toggleDetails">
              {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
            </b-button>
          </template>

          <template v-slot:row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">
                  {{ key }}: {{ value }}
                </li>
              </ul>
            </b-card>
          </template>
          <template v-slot:cell(name)="row">
            {{ row.value.first }} {{ row.value.last }}
          </template>

          <template v-slot:cell(actions)="row">
            <b-button size="sm" class="btn btn-danger mr-1" @click="deleteEmploye(row.item)">
              <fa icon="user-times" fixed-width />
            </b-button>
            <b-button size="sm" class="btn btn-primary mr-1" @click="info(row.item, row.index, $event.target)">
              <fa icon="pen" fixed-width />
            </b-button>
            <b-button size="sm" class="btn mr-1" @click="membresModal(row.item, row.index, $event.target)">
              <fa icon="users" fixed-width />
            </b-button>
          </template>

          <template v-slot:row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">
                  {{ key }}: {{ value }}
                </li>
              </ul>
            </b-card>
          </template>
        </b-table>
      </card>
    </div>
    <!--Ajouter département modal-->
    <b-modal id="ajouter-departement" ref="ajouter-departement" title="Ajouter un département"  hide-footer>
      <form enctype="multipart/form-data" @submit.prevent="save" @keydown="form.onKeydown($event)">
        <!-- libelle -->
        <div class="form-group row">
          <label class="col-md-3 col-form-label text-md-right">Libelle</label>
          <div class="col-md-7">
            <input v-model="form.libelleAdd" data-vv-delay="100" v-validate="'required|alpha_spaces'" :class="{ 'is-invalid': errors.has('libelleAdd') }" class="form-control" type="text" name="libelleAdd" placeholder="libelle" required>
            <span v-show="errors.has('libelleAdd')" class="invalid-feedback">
              {{ errors.first('libelleAdd') }}
            </span>
          </div>
        </div>
        <!-- chef du département -->
        <div class="form-group row">
          <label class="col-md-3 col-form-label text-md-right">chef du département</label>
          <div class="col-md-7">
            <b-form-select v-model="form.chefIdAdd" :options="options" v-validate="'required'" name="chefIdAdd" required>
              <template #first>
                <b-form-select-option value="" disabled>--- Veuillez sélectionner le chef du département ---</b-form-select-option>
              </template>
            </b-form-select>
            <span v-show="errors.has('chefIdAdd')" class="invalid-feedback"> {{ errors.first('chefIdAdd') }}</span>
          </div>
        </div>
        <!-- interne_add -->
        <div class="form-group row" style="padding-left: 60px">
            <b-form-checkbox name="interneAdd" v-model="form.interneAdd" value=1 unchecked-value=0>Ce département est localisé dans le batiment</b-form-checkbox>
        </div>
        <div class="form-group row">
          <div class="col-md-7 offset-md-3 d-flex">
            <v-button :loading="form.busy" variant="outline-secondary" >
              Ajouter
            </v-button>
            <b-button class="offset-md-3" variant="outline-secondary" @click="hideModal">Annuler</b-button>
          </div>
        </div>
      </form>
    </b-modal>
    <!-- tous les membres modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content.libelle }}</pre>
      <!-- {{ modalsEmp }} -->
      <div>
        <b-table striped hover :items="modalsEmp" :fields="fields2"></b-table>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Form from 'vform'
export default {
  data () {
    return {
      form: new Form({
        libelleAdd: '',
        chefIdAdd: 0,
        interneAdd: false
      }),
      departements: [],
      deps: [],
      employes: [],
      test: 'test',
      fields2: [
        { key: 'nom', label: 'Nom', sortable: true, sortDirection: 'desc' },
        { key: 'prenom', label: 'Prenom', sortable: true, class: 'text-center' },
        { key: 'email', label: 'Email', sortable: false, class: 'text-center' },
        { key: 'isAdmin', label: 'Admin' }
      ],
      fields: [
        { key: 'libelle', label: 'libelle', sortable: true, sortDirection: 'desc' },
        { key: 'chef', label: 'chef', sortable: true, class: 'text-center' },
        { key: 'interne', label: 'interne', sortable: false, class: 'text-center' },
        { key: 'actions', label: 'actions' }
      ],
      chefs: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
        employes: []
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    items: function () {
      return this.deps
    },
    options: function () {
      return this.chefs
    },
    modalsEmp: function () {
      return this.infoModal.employes
    },
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted () {
    // Set the initial number of items
    console.log(this.deps)
    this.totalRows = this.items.length
  },
  beforeMount () {
    axios.get('/api/employe') // or fetch
      .then(response => {
        this.employes = response.data
        this.employes.forEach(async (employe) => {
          this.chefs.push({
            value: employe.id,
            text: employe.nom + ' ' + employe.prenom
          })
        })
      })
      .catch(error => console.log(error))
    axios.get('/api/departement/affichage') // or fetch
      .then(response => {
        this.departements = response.data
        this.departements.forEach(async (departement) => {
          var bool = false
          if (departement.interne === 1) {
            bool = true
          }
          this.deps.push({
            libelle: departement.libelle,
            chef: departement.chef.nom + ' ' + departement.chef.prenom,
            interne: bool
          })
        })
      })
      .catch(error => console.log(error))
  },
  methods: {
    async save () {
      console.log(this.form)
      await this.form.post('/api/departement')
    },
    membresModal (item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = item
      console.log(this.infoModal.content.libelle)
      axios.get('/api/departement/' + this.infoModal.content.libelle.toString() + '/employes')
        .then(response => { this.infoModal.employes = response.data })
        .catch(error => console.log(error))
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    hideModal () {
      this.$refs['ajouter-departement'].hide()
    }
  }
}
</script>
<style scoped>
</style>
