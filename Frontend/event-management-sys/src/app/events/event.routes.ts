import { Routes } from '@angular/router';
import { EventListComponent } from './event-list.component';
import { EventDetailGuard } from './event-detail.guard';
import { EventDetailComponent } from './event-detail.component';

export const EVENT_ROUTES: Routes = [
  { path: '', component: EventListComponent },
  {
    path: ':id',
    canActivate: [EventDetailGuard],
    component: EventDetailComponent,
  },
];
