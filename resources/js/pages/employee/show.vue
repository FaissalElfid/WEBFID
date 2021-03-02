<template>
  <b-container fluid="lg">
    <!-- User Interface controls -->
    <h2 style="text-decoration: underline; text-align: center; margin-bottom: 20px;">
      Tous les employés
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
        <b-button size="sm" class="mr-1" @click="info(row.item, row.index, $event.target)">
          Modal
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Moins' : 'Plus' }} Détails
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <!-- <ul>
            <li v-for="(value, key) in row.item" :key="key">
              {{ key }}: {{ value }}
            </li>
          </ul> -->
          <div>
            <p><fa icon="user-circle" class="info" fixed-width />Sexe : {{row.item.sexe }}</p>
            <p><fa icon="calendar-day" class="info" fixed-width />Date de naissance : {{row.item.dateNaissance }}</p>

            <p><fa icon="envelope" class="info" fixed-width />Email : {{row.item.email }}</p><hr>
            <p><fa icon="user-tag" class="info" fixed-width />Role : {{row.item.isAdmin }}</p>

            <p><fa icon="address-book" class="info" fixed-width />Departement : {{ row.item.departement.libelle }}</p>
            <p><fa icon="user-plus" class="info" fixed-width />Compte créé le {{ row.item.created_at }}</p>
          </div>
        </b-card>
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
      <div  class="image-container">
        <img id="profile" :src="infoModal.image" alt="Photo de profile" style="width: 100%;border-radius: 15px">
        <div class="title">
          <h2>{{ infoModal.content.nom }} {{ infoModal.content.prenom }} </h2>
        </div>
        <p><fa icon="user-circle" class="info" fixed-width />Sexe : {{infoModal.content.sexe }}</p>
        <p><fa icon="calendar-day" class="info" fixed-width />Date de naissance : {{infoModal.content.dateNaissance }}</p>

        <p><fa icon="envelope" class="info" fixed-width />Email : {{infoModal.content.email }}</p><hr>
        <p><fa icon="user-tag" class="info" fixed-width />Role : {{infoModal.content.isAdmin }}</p>

        <p><fa icon="address-book" class="info" fixed-width />Departement : {{ departement }}</p>
        <p><fa icon="user-plus" class="info" fixed-width />Compte créé le {{ infoModal.content.created_at }}</p>
      </div>
      <!-- <pre>{{ infoModal.content }} {{ infoModal.content.photo }}</pre>
      {{ infoModal.image }} -->
    </b-modal>
  </b-container>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      employes: [],
      test: 'test',
      items: this.employes,
      fields: [
        { key: 'nom', label: 'Nom', sortable: true, sortDirection: 'desc' },
        { key: 'prenom', label: 'Prenom', sortable: true, class: 'text-center' },
        { key: 'departement.libelle', label: 'Departement', sortable: true, class: 'text-center' },
        { key: 'email', label: 'Email', sortable: false, class: 'text-center' },
        { key: 'dateNaissance', label: 'Date de naissance', sortable: true, class: 'text-center' },
        { key: 'actions', label: 'Afficher' }
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
        content: {},
        image: ''
      },
      departement: ''
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
    console.log(this.employes)
    this.totalRows = this.items.length
  },
  created () {
    axios.get('/api/employe')
      .then(response => {
        this.employes = response.data
      })
      .catch(error => console.log(error))
  },
  methods: {
    info (item, index, button) {
      this.infoModal.title = item.nom// `Row index: ${index}`
      if (item.sexe === 'F') {
        item.sexe = 'Femme'
      } else if (item.sexe === 'H') {
        item.sexe = 'Homme'
      }
      this.infoModal.content = item // JSON.stringify(item, null, 2)
      this.departement = item.departement.libelle
      this.infoModal.image = '../' + item.photo
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.infoModal.title = ''
      this.infoModal.content = {}
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
<style>
  template {
    font-family: "Roboto", sans-serif;
    width: 400px;
    background: #fff;
  }
  .image-container{
    position: relative;
    border-radius: 50%;
  }
  .info{
    color: #2f323a;
    margin-right: 16px;
  }
</style>
