import 'bootstrap/dist/css/bootstrap.min.css';
import resources from './locale/index.js';
import i18n from 'i18next';
import app from '../app.js';
 
document.addEventListener('DOMContentLoaded', () => {
  const i18next = i18n.createInstance();
  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  })
    .then(() => app(i18next))
    .catch((e) => e.message);
});