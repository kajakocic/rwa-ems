import { Routes } from '@angular/router';
import { WelcomeComponent } from './home/welcome.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/event.routes').then((r) => r.EVENT_ROUTES),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((c) => c.AboutComponent),
  },
  {
    path: 'addEvent',
    loadComponent: () =>
      import('./addEvent/add-event.component').then((c) => c.AddEventComponent),
  },
  // {
  //   path: 'editEvent/:id',
  //   loadComponent: () =>
  //     import('./editEvent/edit-event.component').then(
  //       (c) => c.EditEventComponent
  //     ),
  // },
  {
    path: 'editEvent/:id',
    loadComponent: () =>
      import('./addEvent/add-event.component').then((c) => c.AddEventComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/user-profile.component').then(
        (c) => c.UserProfileComponent
      ),
  },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
];
