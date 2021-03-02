<template>
  <div>
    <body>
      <div class="col-lg-10 m-auto">
        <card :title="'Caméra d\'entrée'" style="margin-top: 15px; text-align: center">
          <div >
            <label class="col-md-7">Veuillez saisir combien d'images vous voulez capturer en seconde ({{fps}})</label>
            <b-form-input class="col-md-3" id="range" style="padding-top: 35px" v-model="fps" type="range" min="5" max="25"></b-form-input>
            <video id="live-video" width="320" height="250" autoplay></video>
            <canvas
              id="live-canvas"
              width="330"
              height="247"
            />
          </div>
          <p>
            <v-chip label color="orange" text-color="white">
              <v-icon left>
                Video
              </v-icon> FPS détecter : {{ realFps }}
            </v-chip>
            <br>
            <v-chip label color="orange" text-color="white">
              <v-icon left>
                Timer
              </v-icon> Duration: {{ duration }} ms
            </v-chip>
          </p>
        </card>
        <card :title="'Les personnes détectées instantanément'" style="margin-top: 15px; text-align: center">
          <!-- la premiere table pour les employees qui viennent d'etre détectés -->
          <b-row>
            <div>
              <label  class="col-md-6">Le nombre de ligne que vous voulez réserver aux derniers personnes détécter ({{recentDetection}})</label>
              <b-form-input id="range" style="padding-bottom: 20px"  class="col-md-4" v-model="recentDetection" type="range" min="1" max="10"></b-form-input>
              <label class="col-md-6">Le nombre de captures avant d'afficher les informations de la personne détecter ({{detectionNumber}})</label>
              <b-form-input id="range" class="col-md-4" style="padding-bottom: 20px" v-model="detectionNumber" type="range" min="1" max="20"></b-form-input>
              <label class="col-md-6">La durée avant de déplacer les informations de ces détections aux tableau ({{dureeAvantTransition}})</label>
              <b-form-input id="range" class="col-md-4" style="padding-bottom: 20px" v-model="dureeAvantTransition" type="range" min="0" max="20"></b-form-input>
            </div>
          </b-row>
          <b-table
            show-empty
            small
            stacked="md"
            :items="detected2"
            :fields="fields"
            :current-page="currentPage2"
            :per-page="perPage2"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
          >
            <template v-slot:cell(name)="row">
              {{ row.value.first }} {{ row.value.last }}
            </template>
          </b-table>
          <b-row>
            <b-col sm="7" md="6" class="mx-auto">
              <b-pagination
                v-model="currentPage2"
                :total-rows="totalRows2"
                :per-page="perPage2"
                align="fill"
                size="sm"
                class="my-0"
              />
            </b-col>
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
                  v-model="perPage2"
                  size="sm"
                  :options="pageOptions"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </card>
        <card :title="'Les personnes déja détectées'" style="margin-top: 15px; text-align: center">
          <!-- here m going to add each new user face detected and add a detection counter to each object in this function to register the entry of the employees -->
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
            :items="detected"
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
          </b-table>
          <b-row>
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
          </b-row>
        </card>
      </div>
    </body>
  </div>
</template>
<script>
import * as faceapi from 'face-api.js/dist/face-api.min.js'
import axios from 'axios'
export default {
  data () {
    return {
      users: [],
      faces: [],
      // table d'affichage des employees detectés
      items: this.detected,
      items2: this.detected2,
      fields: [
        { key: 'nom', label: 'Nom', sortable: true, sortDirection: 'desc' },
        { key: 'prenom', label: 'Prenom', sortable: true, class: 'text-center' },
        { key: 'departement.libelle', label: 'Departement', sortable: true, class: 'text-center' },
        { key: 'email', label: 'email', sortable: false, class: 'text-center' },
        { key: 'dateNaissance', label: 'date de naissance', sortable: true, class: 'text-center' }
      ],
      totalRows: 1,
      totalRows2: 1,
      currentPage: 1,
      currentPage2: 1,
      perPage: 5,
      perPage2: 5,
      pageOptions: [5, 10, 15],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      // faceapi
      faceMatcher: null,
      interval: null,
      fps: 20,
      realFps: 0,
      idDetected: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      recognition: '',
      withOptions: [0, 1, 2, 3],
      videoStream: null,
      detections: {
        scoreThreshold: 0.5,
        inputSize: 320,
        boxColor: 'grey',
        textColor: 'red',
        lineWidth: 1,
        fontSize: 20,
        fontStyle: 'Georgia'
      },
      descriptionUser: {},
      detectedUser: [],
      detectedUser2: [],
      useTiny: false,
      expressions: {
        minConfidence: 0.2
      },
      landmarks: {
        drawLines: true,
        lineWidth: 1
      },
      descriptors: {
        withDistance: false
      },
      // raisonnement
      capturesHelper: [],
      recentDetection: 4,
      detectionNumber: 5,
      detected2: [],
      dureeAvantTransition: 4
    }
  },
  computed: {
    models () {
      return this.$store.state.model.list
    },
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    },
    captures () {
      return this.capturesHelper
    },
    detected () {
      return this.detectedUser
    }/*,
detected2 () {
  return this.detectedUser2 // instantané
} */
  },
  watch: {
  },
  async beforeMount () {
    Promise.all([
      faceapi.loadFaceRecognitionModel('/models'),
      faceapi.loadFaceLandmarkModel('/models'),
      faceapi.loadTinyFaceDetectorModel('/models'),
      faceapi.loadFaceExpressionModel('/models')
    ]).then(this.setFaces)
  },
  async mounted () {
    await console.log('mountedd')
    // await console.log(this.faces)
    await this.recognize()
    this.totalRows = this.items.length
    this.totalRows2 = this.items2.length
  },
  beforeDestroy () {
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop())
      this.videoStream = null
    }
  },
  methods: {
    start: function (videoDiv, canvasDiv, canvasCtx, fps, theMatch) {
      const self = this
      if (self.interval) {
        clearInterval(self.interval)
      }
      self.interval = setInterval(async () => {
        const t0 = performance.now()
        canvasCtx.drawImage(videoDiv, 0, 0, 320, 247)
        const options = {
          detectionsEnabled: self.withOptions.find(o => o === 0) === 0,
          landmarksEnabled: self.withOptions.find(o => o === 1) === 1,
          descriptorsEnabled: self.withOptions.find(o => o === 2) === 2,
          expressionsEnabled: self.withOptions.find(o => o === 3) === 3
        }
        let detections = faceapi.detectAllFaces(canvasDiv, new faceapi.TinyFaceDetectorOptions({
          scoreThreshold: this.detections.scoreThreshold,
          inputSize: this.detections.inputSize
        }))

        if (options && (options.landmarksEnabled || options.descriptorsEnabled)) {
          detections = detections.withFaceLandmarks(this.useTiny)
        }
        if (options && options.expressionsEnabled) {
          detections = detections.withFaceExpressions()
        }
        if (options && options.descriptorsEnabled) {
          detections = detections.withFaceDescriptors()
        }
        detections = await detections
        // console.log(detections)
        if (detections.length) {
          if (self.isProgressActive) {
            self.increaseProgress()
            self.isProgressActive = false
          }
          detections.forEach(async (detection) => {
            detection.recognition = null
            if (options.descriptorsEnabled) {
              const bestMatch = await theMatch.findBestMatch(detection.descriptor)
              detection.recognition = bestMatch
              // console.log(detection.recognition)
              this.descriptionUser = detection.recognition
            }
            let emotions = ''
            // filter only emontions above confidence treshold and exclude 'neutral'
            if (options.expressionsEnabled && detection.expressions) {
              for (const expr in detection.expressions) {
                if (detection.expressions[expr] > this.expressions.minConfidence && expr !== 'neutral') {
                  emotions += ` ${expr} &`
                }
              }
              if (emotions.length) {
                emotions = emotions.substring(0, emotions.length - 2)
              }
            }
            let name = ''
            // the second one is undefined donc name reste vide
            if (options.descriptorsEnabled && detection.recognition) {
              name = detection.recognition.toString(this.descriptors.withDistance)
            }

            const textHelper = `${name}${emotions ? (name ? ' is ' : '') : ''}${emotions}`
            const text = textHelper.substr(textHelper.indexOf(' ') + 1)
            this.idDetected = parseInt(textHelper.replace(/ .*/, ''))
            // selecting the id of the new detected face
            // var ligne = this.verifier(this.idDetected)
            this.afficher()
            /*
            if (this.detected2.length === 0 && ligne < 1) {
              this.getDetectedUsers()
              // console.log(this.idDetected)
            } else {
              if (this.detected2[0].id !== this.idDetected && ligne >= 5) {
                this.getDetectedUsers()
              }
            } */
            const box = detection.box || detection.detection.box
            if (options.detectionsEnabled && box) {
              // draw box
              canvasCtx.strokeStyle = this.detections.boxColor
              canvasCtx.lineWidth = this.detections.lineWidth
              canvasCtx.strokeRect(box.x, box.y, box.width, box.height)
            }
            if (text && detection && box) {
              // draw text
              const padText = 2 + this.detections.lineWidth
              canvasCtx.fillStyle = this.detections.textColor
              canvasCtx.font = this.detections.fontSize + 'px ' + this.detections.fontStyle
              canvasCtx.fillText(text, box.x + padText, box.y + box.height + padText + (this.detections.fontSize * 0.6))
            }

            if (options.landmarksEnabled && detection.landmarks) {
              faceapi.draw.drawFaceLandmarks(canvasDiv, detection.landmarks, {
                lineWidth: this.landmarks.lineWidth,
                drawLines: this.landmarks.drawLines
              })
            }
          })
        }
        const t1 = performance.now()
        self.duration = (t1 - t0).toFixed(2)
        self.realFps = (1000 / (t1 - t0)).toFixed(2)
      }, 3000 / fps)
    },
    async recognize () {
      const self = this
      self.increaseProgress()
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            const videoDiv = document.getElementById('live-video')
            const canvasDiv = document.getElementById('live-canvas')
            const canvasCtx = canvasDiv.getContext('2d')
            videoDiv.srcObject = stream
            this.videoStream = stream
            self.increaseProgress()
            self.setFaces(videoDiv, canvasDiv, canvasCtx, self.fps)
          })
      }
    },
    increaseProgress () {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    },
    async setFacesVue (faces) {
      this.faces = faces
      // console.log(this.faces.length)
    },
    async setFaces (videoDiv, canvasDiv, canvasCtx, fps) {
      var userDesc = []
      axios.get('/api/employe/faces') // or fetch
        .then(response => {
          this.users = response.data
        })
        .catch(error => console.log(error)).then(async () => {
          this.users.forEach(async (user) => {
            const image = await faceapi.fetchImage('../' + user.face)
            // console.log(image)
            const options = {
              detectionsEnabled: true,
              landmarksEnabled: true,
              descriptorsEnabled: true,
              expressionsEnabled: false
            }
            // face/getfaceDetectetions
            let detections = faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({
              scoreThreshold: this.detections.scoreThreshold,
              inputSize: this.detections.inputSize
            }))
            if (options && (options.landmarksEnabled || options.descriptorsEnabled)) {
              detections = detections.withFaceLandmarks(this.useTiny)
            }
            if (options && options.expressionsEnabled) {
              detections = detections.withFaceExpressions()
            }
            if (options && options.descriptorsEnabled) {
              detections = detections.withFaceDescriptors()
            }
            detections = await detections
            // matching
            const descriptors = []
            detections.forEach((d) => {
              descriptors.push({
                path: '../' + user.face,
                descriptor: d.descriptor
              })
            })
            userDesc.push({
              user: user.nom,
              descriptors
            })
            this.setFacesVue(userDesc)
            if (userDesc.length === this.users.length) {
              this.getFaceMatcher(userDesc, videoDiv, canvasDiv, canvasCtx, fps)
            } // to be asyn and in order
          })
        })
    },
    async getFaceMatcher (userDesc, videoDiv, canvasDiv, canvasCtx, fps) {
      const labeledDescriptors = []
      this.faces.forEach((face) => {
        const descriptors = face.descriptors.map((desc) => {
          if (desc.descriptor) {
            const descArray = []
            for (const i in desc.descriptor) {
              descArray.push(parseFloat(desc.descriptor[i]))
            }
            return new Float32Array(descArray)
          }
        })
        // console.log(face)
        if (descriptors.length) {
          labeledDescriptors.push(
            new faceapi.LabeledFaceDescriptors(
              face.user,
              descriptors
            ))
        } // i got the face name from here
      })
      const matcher = new faceapi.FaceMatcher(labeledDescriptors) // probléme ici par ce que labeledDescriptors n'est pas remplis
      this.faceMatcher = matcher
      console.log(matcher)
      console.log(this.faceMatcher)
      this.start(videoDiv, canvasDiv, canvasCtx, fps, matcher)
      // this face matcher debloque et affiche les noms dans les canvas
    },
    getDetectedUsers () {
      return axios.get('/api/employe/' + this.idDetected + '/edit')
        .then(response => {
          if (response.data[0]) {
            this.detected2.unshift(response.data[0])
            setTimeout(
              this.transition.bind(null, this.idDetected)
              , 1000 * this.dureeAvantTransition)
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows2 = this.detected2.length
            console.log('succes response data push in the array')
            return 1
            // console.log(this.detected2)
          } else {
            console.log('response data is null')
            return 0
          }
        })
        .catch(error => console.log(error))
    },
    ajouterDetected (idi) {
      if (idi) {
        for (const iterator of this.captures) {
          if (iterator.id === idi) {
            if (iterator.captures > this.detectionNumber) {
              const res = this.getDetectedUsers()
              iterator.captures = 0
              return res
            }
            iterator.captures += 1
            return iterator.captures + 100
          }
        }
        var capture = { id: idi, captures: 1 }
        this.captures.push(capture)
        return 3 // not found and a new one
      }
    },
    toTheTop (table, idi) { // this functions verifies if the employee exist and if so it place him in the front
      if (table.length === 0) {
        return -2 // table est vide
      } else {
        console.log(table)
        if (idi) {
          var counter = 1
          for (const iterator of table) {
            if (iterator.id === idi) {
              if (counter > this.recentDetection) { // si l'employe il n'est pas afficher dans les 3 premiers on le déplace à la position premiere
                table.sort(function (x, y) { return x.id === idi ? -1 : y.id === idi ? 1 : 0 })
                return 2
              }
              return 1 // l'employe existe et il est dans le recent detection
            }
            counter++
          }
          return -1 // l'objet qui a idi comme id n'existe pas
        }
      }
    }, // add a new function toTheTop to add my pbject to the permanent table
    transition (idi) {
      // c'est la fonction qui me permet de transferer les detections
      if (idi) {
        var removeIndex = this.detected2.map(function (item) { return item.id }).indexOf(idi)
        const res = this.toTheTop(this.detected, idi)
        if (res < 0) {
          this.detected.unshift(this.detected2[removeIndex])
        }
        this.detected2.splice(removeIndex, 1)
      }
      return -1 // l'objet qui a idi comme id n'existe pas
    },
    async afficher () {
      const res = this.toTheTop(this.detected2, this.idDetected)
      // console.log(res)
      if (res < 0) {
        const res2 = this.ajouterDetected(this.idDetected)
        console.log(res2)
      }
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}

</script>
