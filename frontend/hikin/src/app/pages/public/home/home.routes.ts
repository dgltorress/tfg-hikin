import { Routes } from '@angular/router';
import { TabsPage } from './home.page';

export const routes: Routes = [
  {
    path: 'home',
    component: TabsPage,
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
