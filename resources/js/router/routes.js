function page (path) {
  return () => import(/* webpackChunkName: '' */ `~/pages/${path}`).then(m => m.default || m)
}

export default [
  { path: '/welcome', name: 'welcome', component: page('welcome.vue') },
  { path: '/', name: 'acceuil', component: page('acceuil.vue') },

  { path: '/login', name: 'login', component: page('auth/login.vue') },
  { path: '/register', name: 'register', component: page('auth/register.vue') },
  { path: '/password/reset', name: 'password.request', component: page('auth/password/email.vue') },
  { path: '/password/reset/:token', name: 'password.reset', component: page('auth/password/reset.vue') },
  { path: '/email/verify/:id', name: 'verification.verify', component: page('auth/verification/verify.vue') },
  { path: '/email/resend', name: 'verification.resend', component: page('auth/verification/resend.vue') },

  { path: '/home', name: 'home', component: page('home.vue') },
  { path: '/settings',
    component: page('settings/index.vue'),
    children: [
      { path: '', redirect: { name: 'settings.profile' } },
      { path: 'profile', name: 'settings.profile', component: page('settings/profile.vue') },
      { path: 'password', name: 'settings.password', component: page('settings/password.vue') }
    ] },

  { path: '/employee',
    component: page('employee/index.vue'),
    children: [
      { path: '', redirect: { name: 'employee.add' } },
      { path: 'edit', name: 'employee.edit', component: page('employee/edit.vue') },
      { path: 'departement', name: 'employee.departement', component: page('employee/departement.vue') },
      { path: 'add', name: 'employee.add', component: page('employee/add.vue') },
      { path: 'show', name: 'employee.show', component: page('employee/show.vue') }
    ] },
  { path: '/presence',
    component: page('presence/index.vue'),
    children: [
      { path: '', redirect: { name: 'presence.all' } },
      { path: 'all', name: 'presence.all', component: page('presence/all.vue') },
      { path: 'entree', name: 'presence.entree', component: page('presence/entree.vue') },
      { path: 'sortie', name: 'presence.sortie', component: page('presence/sortie.vue') }
    ] },
  { path: '/test', name: 'test', component: page('employee/test.vue') },

  { path: '*', component: page('errors/404.vue') }
]
