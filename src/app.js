import {history} from 'backbone';
import {AppView} from './views/app';

window.ENTER_KEY = 13;
window.ESC_KEY = 27;

new AppView();
history.start();