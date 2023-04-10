import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/public/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/explore-container/explore-container.component').then((m) => m.ExploreContainerComponent),
  },
  {
    path: 'ejemplo',
    loadComponent: () => import('./pages/public/ejemplo/ejemplo.page').then((m) => m.EjemploPage),
  },
];
