import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import { } from '@fortawesome/free-regular-svg-icons'

import {
  faUser, faUsers, faLock, faSignInAlt, faSignOutAlt, faCog, faBars, faTimes, faUserTimes, faUserPlus, faLink, faList, faPen, faUserAltSlash, faAddressBook, faInfoCircle, faEnvelope, faCalendarDay, faUserTag, faUserCircle, faQuoteLeft, faQuoteRight
} from '@fortawesome/free-solid-svg-icons'

import {
  faGithub
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faUser, faLock, faSignInAlt, faSignOutAlt, faCog, faGithub, faBars, faUserTimes, faTimes, faUserPlus, faLink, faList, faPen, faUserAltSlash, faAddressBook, faUsers, faInfoCircle, faEnvelope, faCalendarDay, faUserTag, faUserCircle, faQuoteLeft, faQuoteRight
)

Vue.component('fa', FontAwesomeIcon)
