import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'browse',
        loadComponent: () => import('./pages/browse.component').then(m => m.BrowseComponent)
    },
    {
        path: 'library',
        loadComponent: () => import('./pages/library.component').then(m => m.LibraryComponent)
    },
    {
        path: 'playlist/:id',
        loadComponent: () => import('./pages/playlist-detail.component').then(m => m.PlaylistDetailComponent)
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
