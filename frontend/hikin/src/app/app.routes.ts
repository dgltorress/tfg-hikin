import { Routes } from '@angular/router';

import { loggedInGuard, loggedOutGuard } from 'src/app/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [ loggedInGuard ],
    loadChildren: () => import('./pages/public/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'explore',
    canActivate: [ loggedInGuard ],
    loadComponent: () => import('./components/explore-container/explore-container.component').then((m) => m.ExploreContainerComponent),
  },
  {
    path: 'ejemplo',
    canActivate: [ loggedInGuard ],
    loadComponent: () => import('./pages/public/ejemplo/ejemplo.page').then((m) => m.EjemploPage),
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
];
