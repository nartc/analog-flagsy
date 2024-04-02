import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

import App from './app/app.analog';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig);
