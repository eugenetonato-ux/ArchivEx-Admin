import { bootstrapApplication } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding
} from '@angular/router';

import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons(allIcons);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient()
  ]
});