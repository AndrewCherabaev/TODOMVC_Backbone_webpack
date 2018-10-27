import Backbone from 'backbone';
import {TodoRouter} from './routers/router.js';

import {AppView} from './views/app';

window.ENTER_KEY = 13;
window.ESC_KEY = 27;

new AppView(); 

new TodoRouter();
Backbone.history.start({ hashChange: false });