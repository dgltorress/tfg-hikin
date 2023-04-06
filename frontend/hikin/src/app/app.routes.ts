import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layouts/tabs/tabs.routes').then((m) => m.routes),
  },
];
