import { Routes } from '@angular/router';

import { loggedInGuard, loggedOutGuard } from 'src/app/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [ loggedInGuard ],
    loadChildren: () => import('./pages/public/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    canActivate: [ loggedOutGuard ],
    loadComponent: () => import('./pages/public/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    canActivate: [ loggedOutGuard ],
    loadComponent: () => import('./pages/public/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'publicaciones/:id',
    canActivate: [ loggedInGuard ],
    loadComponent: () => import('./pages/public/publicacion/publicacion.page').then( m => m.PublicacionPage)
  },
  {
    path: 'salidas/:id',
    canActivate: [ loggedInGuard ],
    loadComponent: () => import('./pages/public/salida/salida.page').then( m => m.SalidaPage)
  },
  {
    path: 'itinerarios/:id',
    canActivate: [ loggedInGuard ],
    loadComponent: () => import('./pages/public/itinerario/itinerario.page').then( m => m.ItinerarioPage)
  },
  {
    path: 'clubes/:id',
    canActivate: [ loggedInGuard ],
    loadComponent: () => import('./pages/public/club/club.page').then( m => m.ClubPage)
  },
  {
    path: 'usuarios/:id',
    canActivate: [ loggedInGuard ],
    loadComponent: () => import('./pages/public/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/public/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/public/about/about.page').then( m => m.AboutPage)
  },
  { // Maneja rutas no reconocidas
    path: '**',
    redirectTo: ''
  },
];
