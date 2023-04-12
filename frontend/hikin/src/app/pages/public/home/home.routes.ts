import { Routes } from '@angular/router';
import { HomePage } from './home.page';

import { loggedInGuard, loggedOutGuard } from 'src/app/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./feed/feed.page').then((m) => m.FeedPage),
      },
      {
        path: 'salidas',
        loadComponent: () =>
          import('./salidas/salidas.page').then((m) => m.SalidasPage),
      },
      {
        path: 'comunidad',
        loadComponent: () =>
          import('./comunidad/comunidad.page').then((m) => m.ComunidadPage),
      },
      {
        path: 'itinerarios',
        loadComponent: () =>
          import('./itinerarios/itinerarios.page').then((m) => m.ItinerariosPage),
      },
      {
        path: '',
        redirectTo: '/home/feed',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/feed',
    pathMatch: 'full',
  },
];
