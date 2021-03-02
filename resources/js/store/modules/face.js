// import * as faceapi from 'face-api.js'
import * as faceapi from 'face-api.js/dist/face-api.min.js'
import axios from 'axios'
export const state = () => ({
  faces: [],
  facesApi: [],
  loading: false,
  loaded: false,
  faceMatcher: null,

  useTiny: false,

  detections: {
    scoreThreshold: 0.5,
    inputSize: 320,
    boxColor: 'blue',
    textColor: 'red',
    lineWidth: 1,
    fontSize: 20,
    fontStyle: 'Georgia'
  },
  expressions: {
    minConfidence: 0.2
  },
  landmarks: {
    drawLines: true,
    lineWidth: 1
  },
  descriptors: {
    withDistance: false
  }
})

export const mutations = {
  loading (state) {
    state.loading = true
  },

  load (state) {
    state.loading = false
    state.loaded = true
  },

  setFaces (state, faces) {
    state.faces = faces
  },

  setFaceMatcher (state, matcher) {
    state.faceMatcher = matcher
  },
  getFaceMatcher ({ commit, state }) {
    const labeledDescriptors = []
    console.log(state.faces)
    state.faces.forEach((face) => {
      const descriptors = face.descriptors.map((desc) => {
        if (desc.descriptor) {
          const descArray = []
          for (const i in desc.descriptor) {
            descArray.push(parseFloat(desc.descriptor[i]))
          }
          return new Float32Array(descArray)
        }
      })
      if (descriptors.length) {
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(
            face.user,
            descriptors
          ))
      }
    })
    const matcher = new faceapi.FaceMatcher(labeledDescriptors)
    state.faceMatcher = matcher // setFaceMatcher
    // commit('setFaceMatcher', matcher)
    return matcher
  },
  toTheTop ({ commit, state }, { table, idi }) { // this functions verifies if the employee exist and if so it place him in the front
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
  async afficher ({ commit, state }, { detected2, idDetected }) {
    const res = this.toTheTop(detected2, idDetected)
    // console.log(res)
    if (res < 0) {
      const res2 = this.ajouterDetected(idDetected)
      console.log(res2)
    }
  },
  transition ({ commit, state }, { detected2, idi }) {
    // c'est la fonction qui me permet de transferer les detections
    if (idi) {
      var removeIndex = detected2.map(function (item) { return item.id }).indexOf(idi)
      const res = this.toTheTop(this.detected, idi)
      if (res < 0) {
        this.detected.unshift(detected2[removeIndex])
      }
      this.detected2.splice(removeIndex, 1)
    }
    return -1 // l'objet qui a idi comme id n'existe pas
  }
}

export const actions = {
  load ({ commit, state }) {
    if (!state.loading && !state.loaded) {
      commit('loading')
      return Promise.all([
        faceapi.loadFaceRecognitionModel('/models'),
        faceapi.loadFaceLandmarkModel('/models'),
        faceapi.loadTinyFaceDetectorModel('/models'),
        faceapi.loadFaceExpressionModel('/models')
      ])
        .then(() => {
          commit('load')
        })
    }
  },
  async getAll ({ dispatch, commit }) {
    var data = []
    axios.get('/api/employe/faces') // or fetch
      .then(response => {
        data = response.data
        commit('setFaces', data)
        // dispatch('getFaceMatcher') // the data doesn't wait
      })
      .catch(error => console.log(error))
  },
  async save ({ commit }, faces) {
    const { data } = await this.$axios.$post('/api/face/save', { faces })
    commit('setFaces', data)
  },

  // in before mount
  async mainFunction ({ dispatch, commit }) {
    dispatch('getAll').then(() => {
      var userDesc = []
      this.state.faces.forEach(async (user) => {
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
        state.faceapi = userDesc
        this.setFacesVue(userDesc)
        if (userDesc.length === this.users.length) {
          commit('getFaceMatcher')
          // this.getFaceMatcher(userDesc, videoDiv, canvasDiv, canvasCtx, fps)
        } // to be asyn and in order
      })
      console.log('main function')
      console.log(state.faces)
    })
  },
  async getFaceDetections ({ commit, state }, { canvas, options }) {
    let detections = faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({
        scoreThreshold: state.detections.scoreThreshold,
        inputSize: state.detections.inputSize
      }))

    if (options && (options.landmarksEnabled || options.descriptorsEnabled)) {
      detections = detections.withFaceLandmarks(state.useTiny)
    }
    if (options && options.expressionsEnabled) {
      detections = detections.withFaceExpressions()
    }
    if (options && options.descriptorsEnabled) {
      detections = detections.withFaceDescriptors()
    }
    detections = await detections
    return detections
  },
  async recognize ({ commit, state }, { descriptor, options }) {
    if (options.descriptorsEnabled) {
      const bestMatch = await state.faceMatcher.findBestMatch(descriptor)
      return bestMatch
    }
    return null
  },

  draw ({ commit, state }, { canvasDiv, canvasCtx, detection, options, detected2, detected }) {
    let emotions = ''
    // filter only emontions above confidence treshold and exclude 'neutral'
    if (options.expressionsEnabled && detection.expressions) {
      for (const expr in detection.expressions) {
        if (detection.expressions[expr] > state.expressions.minConfidence && expr !== 'neutral') {
          emotions += ` ${expr} &`
        }
      }
      if (emotions.length) {
        emotions = emotions.substring(0, emotions.length - 2)
      }
    }
    let name = ''
    if (options.descriptorsEnabled && detection.recognition) {
      name = detection.recognition.toString(state.descriptors.withDistance)
    }

    // const text = `${name}${emotions ? (name ? ' is ' : '') : ''}${emotions}`

    const textHelper = `${name}${emotions ? (name ? ' is ' : '') : ''}${emotions}`
    // const textHelper = 'text'
    const text = textHelper.substr(textHelper.indexOf(' ') + 1)
    // detected = parseInt(textHelper.replace(/ .*/, ''))
    // selecting the id of the new detected face
    // commit('afficher', { 'detected2': detected2, 'idDetected': detected })
    const box = detection.box || detection.detection.box
    if (options.detectionsEnabled && box) {
      // draw box
      canvasCtx.strokeStyle = state.detections.boxColor
      canvasCtx.lineWidth = state.detections.lineWidth
      canvasCtx.strokeRect(box.x, box.y, box.width, box.height)
    }
    if (text && detection && box) {
      // draw text
      const padText = 2 + state.detections.lineWidth
      canvasCtx.fillStyle = state.detections.textColor
      canvasCtx.font = state.detections.fontSize + 'px ' + state.detections.fontStyle
      canvasCtx.fillText(text, box.x + padText, box.y + box.height + padText + (state.detections.fontSize * 0.6))
    }

    if (options.landmarksEnabled && detection.landmarks) {
      faceapi.draw.drawFaceLandmarks(canvasDiv, detection.landmarks, { lineWidth: state.landmarks.lineWidth, drawLines: state.landmarks.drawLines })
    }
  },

  async createCanvas ({ commit, state }, elementId) {
    const canvas = await faceapi.createCanvasFromMedia(document.getElementById(elementId))
    return canvas
  }
}
