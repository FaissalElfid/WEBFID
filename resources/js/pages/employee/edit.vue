<template>
  <b-container fluid="lg">
    <!-- User Interface controls -->
    <h2 style="text-decoration: underline; text-align: center; margin-bottom: 20px;">
      Modifier ou supprimer les employés
    </h2>
    <b-row>
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

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter On"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          description="Leave all unchecked to filter on all data"
          class="mb-0"
        >
          <b-form-checkbox-group v-model="filterOn" class="mt-1">
            <b-form-checkbox value="nom">
              Nom
            </b-form-checkbox>
            <b-form-checkbox value="prenom">
              Prenom
            </b-form-checkbox>
            <b-form-checkbox value="dateNaissance">
              Date de naissance
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      show-empty
      small
      stacked="md"
      :items="employes"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @filtered="onFiltered"
    >
      <template v-slot:cell(actions)="row">
        <b-button size="sm" class="btn btn-danger mr-1" @click="deleteEmploye(row.item)">
          <fa icon="user-times" fixed-width />
        </b-button>
        <b-button size="sm" class="btn btn-primary mr-1" @click="info(row.item, row.index, $event.target)">
          <fa icon="pen" fixed-width />
        </b-button>
      </template>
    </b-table>
    <b-row>
      <br>
      <b-col sm="2" md="3" class="my-0">
        <b-form-group
          label="Per page"
          label-cols-sm="6"
          label-cols-md="4"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            id="perPageSelect"
            v-model="perPage"
            size="sm"
            :options="pageOptions"
          />
        </b-form-group>
      </b-col>
      <b-col sm="7" md="6" class="mx-auto">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        />
      </b-col>
    </b-row>
    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <form @submit.prevent="updateEmploye(infoModal.content)">
        <!-- nom -->
        <div class="form-group row">
          <label class="col-md-3 col-form-label text-md-right" for="nom">Nom</label>
          <div class="col-md-7">
            <input v-model="infoModal.content.nom" v-validate="'required|alpha_spaces'" :class="{ 'is-invalid': errors.has('nom') }" class="form-control" type="text" id="nom" name="nom" placeholder="nom">
            <span v-show="errors.has('nom')" class="invalid-feedback">
              {{ errors.first('nom') }}
            </span>
          </div>
        </div>
        <!-- prenom -->
        <div class="form-group row">
          <label class="col-md-3 col-form-label text-md-right">Prenom</label>
          <div class="col-md-7">
            <input v-model="infoModal.content.prenom" v-validate="'required|alpha_spaces'" :class="{ 'is-invalid': errors.has('prenom') }" class="form-control" type="text" name="prenom" placeholder="prenom">
            <span v-show="errors.has('prenom')" class="invalid-feedback"> {{ errors.first('prenom') }}</span>
          </div>
        </div>
        <!-- date -->
        <div class="form-group row">
          <label class="col-md-3 col-form-label text-md-right">Date de naissance</label>
          <div class="col-md-7">
            <input v-model="infoModal.content.dateNaissance" v-validate="'required'" :class="{ 'is-invalid': errors.has('dateNaissance') }" class="form-control" type="date" name="dateNaissance" placeholder="dateNaissance">
            <span v-show="errors.has('dateNaissance')" class="invalid-feedback"> {{ errors.first('dateNaissance') }}</span>
          </div>
        </div>
        <!-- Email -->
        <div class="form-group row">
          <label class="col-md-3 col-form-label text-md-right">{{ $t('email') }}</label>
          <div class="col-md-7">
            <input v-model="infoModal.content.email" v-validate="'required|email'" :class="{ 'is-invalid': errors.has('email') }" class="form-control" type="email" name="email">
            <span v-show="errors.has('email')" class="invalid-feedback"> {{ errors.first('email') }}</span>
          </div>
        </div>
      </form>
      <!-- <pre>{{ infoModal.content }}</pre> -->
    </b-modal>
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'admin',
  data () {
    return {
      employes: [],
      employeEdit: [],
      test: 'test',
      items: this.employes,
      fields: [
        { key: 'nom', label: 'Nom', sortable: true, sortDirection: 'desc' },
        { key: 'prenom', label: 'Prenom', sortable: true, class: 'text-center' },
        { key: 'email', label: 'email', sortable: false, class: 'text-center' },
        { key: 'dateNaissance', label: 'date de naissance', sortable: true, class: 'text-center' },
        { key: 'actions', label: 'Actions' }
      ],
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
        content: ''
      }
    }
  },
  computed: {
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
    this.totalRows = this.items.length
  },
  created () {
    axios.get('/api/employe') // or fetch
      .then(response => { this.employes = response.data })
      .catch(error => console.log(error))
  },
  methods: {

    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    info (item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = item
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    deleteEmploye (employe) {
      console.log(employe.id)
      axios.delete('/api/employe/' + employe.id) // or fetch
        .then(response => { this.employes = response.data })
        .catch(error => console.log(error))
    },
    updateEmploye (content) {
      axios.patch('/api/employe/' + content.id, content) // or fetch
        .then(response => { console.log(response.data) })
        .catch(error => console.log(error))
    }
  }
}
</script>
