import store from '~/store'

export default (to, from, next) => {
  console.log(store.getters['auth/user'])
  if (store.getters['auth/user'].employe.isAdmin !== 'NotAdmin') {
    next({ name: 'home' })
  } else {
    next()
  }
}
